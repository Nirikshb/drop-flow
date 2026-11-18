/**
 * Real API-backed implementation of the dashboard service boundary.
 *
 * Every mutation hits a real endpoint. If a request fails, the promise rejects
 * and the UI must surface the error — never a local-only "success".
 */
import type {
  ActivityEvent, ApiKey, Asset, Organization, Project, UsageSummary, User,
} from "@/types";
import { ApiError } from "./auth";
import type { DashboardService, UpdateProjectInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Cannot reach the Dropflow API. Is it running?", 0, "network_error");
  }

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.assign("/login?expired=1");
      }
      throw new ApiError("Your session expired. Please sign in again.", 401, "unauthorized");
    }
    throw new ApiError(
      typeof body.message === "string" ? body.message : "Request failed",
      response.status,
      typeof body.code === "string" ? body.code : "unknown_error",
    );
  }
  return body as T;
}

/** Dashboards without an explicit project selection use the first project. */
let cachedProjectId: string | null = null;
async function resolveProjectId(explicit?: string): Promise<string> {
  if (explicit) return explicit;
  if (cachedProjectId) return cachedProjectId;
  const projects = await request<Project[]>("/projects");
  if (projects.length === 0) {
    throw new ApiError("Create a project first to see assets and usage", 404, "no_project");
  }
  cachedProjectId = projects[0]!.id;
  return cachedProjectId;
}

export const dashboardService: DashboardService = {
  getCurrentUser: () => request<User>("/auth/me"),

  updateProfile(input) {
    return request<User>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  updateOrganization(id, input) {
    return request<Organization>(`/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  listOrganizations: () => request<Organization[]>("/organizations"),

  async listProjects(organizationId?: string) {
    const projects = await request<Project[]>("/projects");
    return organizationId ? projects.filter((project) => project.organizationId === organizationId) : projects;
  },

  async createProject(input) {
    const project = await request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
    cachedProjectId = null;
    return project;
  },

  updateProject(id, input: UpdateProjectInput) {
    return request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  async deleteProject(id) {
    await request<{ success: boolean }>(`/projects/${id}`, { method: "DELETE" });
    if (cachedProjectId === id) cachedProjectId = null;
  },

  listApiKeys(projectId: string) {
    return request<ApiKey[]>(`/projects/${projectId}/keys`);
  },

  async createApiKey(projectId: string, name: string) {
    const result = await request<{ key: ApiKey; secret: string }>(`/projects/${projectId}/keys`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    return result;
  },

  async revokeApiKey(projectId: string, keyId: string) {
    await request<{ success: boolean }>(`/projects/${projectId}/keys/${keyId}`, {
      method: "DELETE",
    });
  },

  async listAssets(projectId?: string) {
    const id = await resolveProjectId(projectId);
    const result = await request<{ data: Asset[] }>(`/v1/assets?projectId=${id}&limit=100`);
    return result.data;
  },

  async deleteAsset(assetId: string) {
    const id = await resolveProjectId();
    await request(`/v1/assets/${assetId}?projectId=${id}`, { method: "DELETE" });
  },

  async getUsage() {
    const id = await resolveProjectId();
    return request<UsageSummary>(`/projects/${id}/usage`);
  },

  async getActivity() {
    const id = await resolveProjectId();
    return request<ActivityEvent[]>(`/projects/${id}/activity`);
  },
};

export type { DashboardService } from "./types";
