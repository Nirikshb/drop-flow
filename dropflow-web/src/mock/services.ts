/**
 * ISOLATED MOCK SERVICES — Phase 1 only.
 *
 * These return demo data with artificial latency so loading/empty/error states
 * can be developed. They are intentionally separate from `src/services/*`.
 * Replace imports with the real services in Phase 6 — do not add real calls here.
 */
import {
  demoActivity, demoApiKeys, demoAssets, demoOrganizations, demoProjects, demoUsage,
} from "./data";
import type {
  ActivityEvent, ApiKey, Asset, Organization, Project, UsageSummary,
} from "@/types";

const wait = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mock = {
  async listOrganizations(): Promise<Organization[]> {
    await wait();
    return demoOrganizations;
  },
  async listProjects(_organizationId?: string): Promise<Project[]> {
    await wait();
    return _organizationId
      ? demoProjects.filter((project) => project.organizationId === _organizationId)
      : demoProjects;
  },
  async createProject(input: { name: string; organizationId: string }): Promise<Project> {
    await wait(500);
    return {
      id: `prj_demo_${Date.now()}`,
      organizationId: input.organizationId,
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      publicKey: `df_public_demo_${Math.random().toString(16).slice(2, 10)}`,
      status: "active",
      maxFileSize: 52_428_800,
      allowedMimeTypes: ["image/*", "application/pdf"],
      allowedOrigins: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  async listApiKeys(_projectId: string): Promise<ApiKey[]> {
    await wait();
    return demoApiKeys;
  },
  async createApiKey(projectId: string, name: string): Promise<{ key: ApiKey; secret: string }> {
    await wait(500);
    return {
      key: {
        id: `key_demo_${Date.now()}`, projectId, name,
        keyPrefix: `df_secret_${Math.random().toString(16).slice(2, 6)}`,
        lastUsedAt: null, revokedAt: null, createdAt: new Date().toISOString(),
      },
      secret: `df_secret_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
    };
  },
  async listAssets(_projectId?: string): Promise<Asset[]> {
    await wait(350);
    return demoAssets;
  },
  async deleteAsset(_id: string): Promise<void> {
    await wait(400);
  },
  async getUsage(): Promise<UsageSummary> {
    await wait();
    return demoUsage;
  },
  async getActivity(): Promise<ActivityEvent[]> {
    await wait();
    return demoActivity;
  },
};
