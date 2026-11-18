/** Shared frontend domain types. Mirrors the backend API contract. */

export type OrganizationRole = "owner" | "admin" | "member";
export type ProjectStatus = "active" | "disabled" | "suspended";
export type AssetStatus = "pending" | "uploading" | "completed" | "failed" | "expired" | "deleted";

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "business";
  role: OrganizationRole;
  createdAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  publicKey: string;
  status: ProjectStatus;
  maxFileSize: number;
  allowedMimeTypes: string[];
  allowedOrigins: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  projectId: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface Asset {
  id: string;
  projectId: string;
  objectKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  status: AssetStatus;
  checksum: string | null;
  url: string;
  createdAt: string;
}

export type UploadStatus = "queued" | "uploading" | "completed" | "failed" | "cancelled";

export interface UploadItem {
  id: string;
  fileName: string;
  size: number;
  progress: number;
  status: UploadStatus;
  error?: string;
  assetId?: string;
}

export interface UsageSummary {
  storageBytes: number;
  assetCount: number;
  uploadCount: number;
  uploadBytes: number;
  requestCount: number;
  plan: "free" | "pro" | "business";
  limits: {
    storageBytes: number;
    monthlyUploads: number;
    maxFileSize: number;
    projects: number;
  };
  monthly: { month: string; uploads: number; bytes: number }[];
}

export interface ActivityEvent {
  id: string;
  type: "upload.completed" | "asset.deleted" | "key.created" | "project.created" | "member.invited";
  description: string;
  createdAt: string;
}
