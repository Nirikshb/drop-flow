import type {
  ActivityEvent, ApiKey, Asset, Organization, Project, ProjectStatus, UsageSummary, User,
} from "@/types";

export interface UpdateProjectInput {
  name?: string;
  status?: ProjectStatus;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  allowedOrigins?: string[];
}

export interface DashboardService {
  getCurrentUser(): Promise<User>;
  updateProfile(input: { name?: string; email?: string }): Promise<User>;
  updateOrganization(id: string, input: { name: string }): Promise<Organization>;
  listOrganizations(): Promise<Organization[]>;
  listProjects(organizationId?: string): Promise<Project[]>;
  createProject(input: { name: string; organizationId: string }): Promise<Project>;
  updateProject(id: string, input: UpdateProjectInput): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  listApiKeys(projectId: string): Promise<ApiKey[]>;
  createApiKey(projectId: string, name: string): Promise<{ key: ApiKey; secret: string }>;
  revokeApiKey(projectId: string, keyId: string): Promise<void>;
  listAssets(projectId?: string): Promise<Asset[]>;
  deleteAsset(id: string): Promise<void>;
  getUsage(): Promise<UsageSummary>;
  getActivity(): Promise<ActivityEvent[]>;
}
