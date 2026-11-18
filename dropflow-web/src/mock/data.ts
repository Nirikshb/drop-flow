/**
 * ISOLATED DEMO DATA — Phase 1 visual development only.
 *
 * Nothing in this file talks to a backend and none of it represents real
 * customer activity. `src/services/*` replaces these functions with real API
 * calls during Phase 6. Never import this module from production service code.
 */
import type {
  ActivityEvent,
  ApiKey,
  Asset,
  Organization,
  Project,
  UsageSummary,
} from "@/types";

export const demoOrganizations: Organization[] = [
  { id: "org_demo_1", name: "Acme Labs", slug: "acme-labs", plan: "pro", role: "owner", createdAt: "2026-06-02T10:00:00Z" },
  { id: "org_demo_2", name: "Side Projects", slug: "side-projects", plan: "free", role: "admin", createdAt: "2026-08-14T09:30:00Z" },
];

export const demoProjects: Project[] = [
  {
    id: "prj_demo_1", organizationId: "org_demo_1", name: "Production", slug: "production",
    publicKey: "df_public_demo_prod_8f21c4a9", status: "active", maxFileSize: 52_428_800,
    allowedMimeTypes: ["image/*", "application/pdf", "text/*"],
    allowedOrigins: ["https://acme.example"],
    createdAt: "2026-06-03T12:00:00Z", updatedAt: "2026-10-28T08:15:00Z",
  },
  {
    id: "prj_demo_2", organizationId: "org_demo_1", name: "Staging", slug: "staging",
    publicKey: "df_public_demo_stage_2b77e1d3", status: "active", maxFileSize: 10_485_760,
    allowedMimeTypes: ["image/*"],
    allowedOrigins: [],
    createdAt: "2026-07-11T15:20:00Z", updatedAt: "2026-09-02T11:00:00Z",
  },
  {
    id: "prj_demo_3", organizationId: "org_demo_2", name: "Experiments", slug: "experiments",
    publicKey: "df_public_demo_exp_91aa0f62", status: "disabled", maxFileSize: 5_242_880,
    allowedMimeTypes: ["image/png", "image/jpeg"],
    allowedOrigins: [],
    createdAt: "2026-08-15T10:00:00Z", updatedAt: "2026-08-20T10:00:00Z",
  },
];

export const demoApiKeys: ApiKey[] = [
  { id: "key_demo_1", projectId: "prj_demo_1", name: "Server — web app", keyPrefix: "df_secret_a1b2", lastUsedAt: "2026-11-17T22:41:00Z", revokedAt: null, createdAt: "2026-06-03T12:05:00Z" },
  { id: "key_demo_2", projectId: "prj_demo_1", name: "CI pipeline", keyPrefix: "df_secret_c9d8", lastUsedAt: "2026-11-10T06:12:00Z", revokedAt: null, createdAt: "2026-08-01T09:00:00Z" },
  { id: "key_demo_3", projectId: "prj_demo_2", name: "Old worker", keyPrefix: "df_secret_e4f5", lastUsedAt: null, revokedAt: "2026-09-10T10:00:00Z", createdAt: "2026-07-12T10:00:00Z" },
];

const fileNames = [
  "hero-banner.png", "product-shot-01.jpg", "invoice-october.pdf", "avatar-alex.png",
  "brand-assets.zip", "onboarding-flow.webm", "report-q3.csv", "landing-hero.webp",
  "customer-logo.svg", "pitch-deck.pdf", "screenshot-dark.png", "favicon-32.png",
];
const mimeTypes = [
  "image/png", "image/jpeg", "application/pdf", "image/png", "application/zip",
  "video/webm", "text/csv", "image/webp", "image/svg+xml", "application/pdf",
  "image/png", "image/png",
];
const sizes = [2_400_000, 1_180_000, 340_000, 88_000, 8_900_000, 22_400_000, 45_000, 640_000, 12_000, 3_200_000, 920_000, 4_000];

export const demoAssets: Asset[] = fileNames.map((name, index) => ({
  id: `ast_demo_${String(index + 1).padStart(3, "0")}`,
  projectId: index % 4 === 0 ? "prj_demo_2" : "prj_demo_1",
  objectKey: `prj/${index % 4 === 0 ? "prj_demo_2" : "prj_demo_1"}/obj_${index + 1}_a73f9c`,
  originalFilename: name,
  mimeType: mimeTypes[index] ?? "application/octet-stream",
  sizeBytes: sizes[index] ?? 100_000,
  status: "completed",
  checksum: `sha256:${(index + 1).toString(16).padStart(4, "0")}e91b7c2f8a4d`,
  url: `https://assets.dropflow.dev/demo/${encodeURIComponent(name)}`,
  createdAt: new Date(Date.UTC(2026, 10, 18 - index, 9, (index * 17) % 60)).toISOString(),
}));

export const demoActivity: ActivityEvent[] = [
  { id: "act_1", type: "upload.completed", description: "hero-banner.png uploaded to Production", createdAt: "2026-11-18T09:24:00Z" },
  { id: "act_2", type: "upload.completed", description: "product-shot-01.jpg uploaded to Production", createdAt: "2026-11-18T08:57:00Z" },
  { id: "act_3", type: "key.created", description: "API key “Server — web app” created", createdAt: "2026-11-17T14:12:00Z" },
  { id: "act_4", type: "upload.completed", description: "invoice-october.pdf uploaded to Production", createdAt: "2026-11-16T16:40:00Z" },
  { id: "act_5", type: "asset.deleted", description: "old-logo.png deleted from Staging", createdAt: "2026-11-15T11:05:00Z" },
  { id: "act_6", type: "project.created", description: "Project Experiments created", createdAt: "2026-11-14T10:30:00Z" },
];

export const demoUsage: UsageSummary = {
  storageBytes: demoAssets.reduce((sum, asset) => sum + asset.sizeBytes, 0),
  assetCount: demoAssets.length,
  uploadCount: 1482,
  uploadBytes: 3_820_000_000,
  requestCount: 18_940,
  plan: "free",
  limits: {
    storageBytes: 5_000_000_000,
    monthlyUploads: 5_000,
    maxFileSize: 52_428_800,
    projects: 3,
  },
  monthly: [
    { month: "Jun", uploads: 84, bytes: 120_000_000 },
    { month: "Jul", uploads: 142, bytes: 240_000_000 },
    { month: "Aug", uploads: 198, bytes: 390_000_000 },
    { month: "Sep", uploads: 254, bytes: 510_000_000 },
    { month: "Oct", uploads: 341, bytes: 780_000_000 },
    { month: "Nov", uploads: 463, bytes: 1_180_000_000 },
  ],
};
