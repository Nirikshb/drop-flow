/**
 * Local, CMS-shaped release history for the Changelog page.
 * Replace this module with a content source when the product ships.
 */

export type ChangeKind = "added" | "changed" | "fixed";

export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  summary: string;
  added: string[];
  changed: string[];
  fixed: string[];
}

export const releases: ChangelogRelease[] = [
  {
    version: "v2.4.0",
    date: "2026-11-10",
    title: "Validation decisions and audit trails",
    summary:
      "Every asset now carries a structured validation decision, and project policy can be tuned without a redeploy.",
    added: [
      "Per-project MIME allowlists with detected-type verification.",
      "A decision record for each asset, readable in the dashboard and API.",
      "Bulk policy preview before a new rule goes live.",
    ],
    changed: [
      "Validation results are included in upload responses by default.",
      "Rejected uploads now report a machine-readable reason code.",
    ],
    fixed: [
      "Large documents no longer time out during structural checks.",
      "Policy edits were occasionally applied to the wrong project.",
    ],
  },
  {
    version: "v2.3.0",
    date: "2026-10-14",
    title: "Regional ingress for large files",
    summary:
      "Uploads now land in the region closest to the client, with automatic failover when a region degrades.",
    added: [
      "Four new ingress regions for uploads above 25 MB.",
      "Automatic region failover during provider incidents.",
    ],
    changed: [
      "Asset URLs now include the storage region for easier debugging.",
      "Progress callbacks report transferred bytes instead of a rounded estimate.",
    ],
    fixed: [
      "A stalled connection could leave a session marked active indefinitely.",
      "Duplicate assets appeared when a retry crossed a region boundary.",
    ],
  },
  {
    version: "v2.2.1",
    date: "2026-09-22",
    title: "SDK stability release",
    summary:
      "A focused patch release for resumable sessions, TypeScript types and clearer errors.",
    added: [
      "Typed error variants for validation, network and quota failures.",
    ],
    changed: [
      "Resumable sessions now reuse the same chunk size after a reconnect.",
    ],
    fixed: [
      "Cancelled uploads continued to occupy a session slot.",
      "The browser bundle exposed an internal server-only type.",
      "Progress could report more than 100% after a duplicate chunk.",
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-08-28",
    title: "Lifecycle rules and storage tiers",
    summary:
      "Retention is now configuration: move assets between tiers automatically and preview deletions before they apply.",
    added: [
      "Age-based transitions between warm, cool and archive tiers.",
      "Tag-based overrides for individual asset classes.",
      "A transition log for every automated change.",
    ],
    changed: [
      "Storage estimates in the dashboard now reflect tier pricing.",
      "Retention settings moved from project settings into a dedicated page.",
    ],
    fixed: [
      "Archived assets were missing from certain list filters.",
    ],
  },
  {
    version: "v2.1.0",
    date: "2026-07-16",
    title: "Usage, limits and observability",
    summary:
      "New usage summaries and request traces make it possible to understand a spike before it becomes an incident.",
    added: [
      "A usage summary endpoint for storage, uploads and requests.",
      "Request traces with latency breakdowns by stage.",
    ],
    changed: [
      "Rate-limit headers are now consistent across all endpoints.",
      "The dashboard shows remaining quota next to each project.",
    ],
    fixed: [
      "Cancelled uploads were counted against monthly quotas.",
      "Usage totals lagged by a full billing day in some projects.",
    ],
  },
  {
    version: "v2.0.0",
    date: "2026-06-03",
    title: "Dropflow SDK v2",
    summary:
      "A rebuilt typed client with resumable uploads, cancellation and a smaller browser bundle.",
    added: [
      "A typed client with first-class cancellation via AbortSignal.",
      "Resumable uploads with acknowledged chunk ranges.",
      "A unified assets API for listing, filtering and removal.",
    ],
    changed: [
      "Configuration is now a single constructor object.",
      "The browser bundle is roughly 40% smaller than v1.",
    ],
    fixed: [
      "Uploads from Blob inputs lost their filename in v1.",
      "Pagination cursors were unstable when assets were deleted mid-list.",
    ],
  },
];
