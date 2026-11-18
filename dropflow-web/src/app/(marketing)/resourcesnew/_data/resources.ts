/**
 * Local, CMS-shaped content for the Resources pages.
 *
 * This module deliberately keeps content separate from presentation so it can
 * be swapped for a headless CMS or content layer later without touching the
 * routes. Every record carries a stable `slug` used by `/resourcesnew/[slug]`.
 */

export type ResourceType = "Report" | "News" | "Announcement" | "Guide";

export type ResourceBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

export interface Resource {
  slug: string;
  type: ResourceType;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  body: ResourceBlock[];
  featured?: boolean;
}

export const resources: Resource[] = [
  {
    slug: "state-of-upload-infrastructure-2026",
    type: "Report",
    title: "The 2026 state of upload infrastructure",
    excerpt:
      "A field report on how modern teams move files: regional ingress, resumable sessions and the rising cost of doing nothing.",
    date: "2026-11-04",
    readTime: "9 min read",
    author: "Mira Chen",
    category: "Research",
    featured: true,
    body: [
      {
        kind: "paragraph",
        text: "Uploads are still the least examined part of most product stacks. They sit at the edge of the application, cross network boundaries we do not control, and fail in ways that ordinary request/response code is not built to handle. We spent the last twelve months looking at how teams ship files into AI products, and the pattern is consistent: the happy path is easy, the edges are where engineering time disappears.",
      },
      { kind: "heading", text: "What changed this year" },
      {
        kind: "paragraph",
        text: "Three shifts defined 2026. First, files got bigger as multimodal models made video and high-resolution documents routine inputs. Second, users got more mobile — the majority of uploads we observed now begin on a cellular connection. Third, teams stopped treating validation as a UI concern and started enforcing it at the ingestion boundary, where a bad file is cheap to reject.",
      },
      {
        kind: "list",
        items: [
          "Median asset size grew 2.4× year over year, driven by image and video inputs.",
          "61% of uploads start on mobile networks that drop or change connection mid-transfer.",
          "Teams with server-side validation reported 38% fewer support tickets about 'broken' files.",
        ],
      },
      { kind: "heading", text: "Where teams lose time" },
      {
        kind: "paragraph",
        text: "The expensive failures are rarely dramatic. A single large upload that restarts from zero on a network switch costs more engineering attention than a thousand clean transfers. Re-encoding the same document three times across three services quietly inflates compute bills. And a validation rule that lives only in the browser gives attackers — and confused integrations — a way around it.",
      },
      {
        kind: "paragraph",
        text: "The teams that moved fastest treated the upload path as a product surface: observable, testable and versioned. They could answer, in minutes, whether a failure was client-side, regional, or caused by their own processing pipeline. That visibility mattered more than any single optimization.",
      },
      { kind: "heading", text: "What we expect next" },
      {
        kind: "paragraph",
        text: "In 2027 we expect resumability to become a baseline expectation rather than a differentiator, and for policy — allowed types, size limits, retention — to be expressed as configuration instead of bespoke handlers. The goal is not a cleverer upload endpoint. It is a boring, dependable one that teams can forget about.",
      },
    ],
  },
  {
    slug: "series-a-funding-announcement",
    type: "News",
    title: "Dropflow raises $12M to build the asset layer for AI products",
    excerpt:
      "The round will fund regional ingress, deeper validation and a broader SDK surface for teams shipping file-heavy features.",
    date: "2026-10-21",
    readTime: "4 min read",
    author: "Daniel Okafor",
    category: "Company",
    body: [
      {
        kind: "paragraph",
        text: "Today we are announcing a $12M Series A led by Northstar Ventures, with participation from a group of founders and operators who have built file infrastructure at scale. The round closes a chapter that started with a simple observation: every AI product eventually needs a reliable way to accept, validate and store user files, and almost none of them want to build that themselves.",
      },
      { kind: "heading", text: "Why now" },
      {
        kind: "paragraph",
        text: "Multimodal products turned uploads from a utility into a core dependency. When a file is the input to a model, the quality and provenance of that file shape the output. Teams need more than a signed URL and a bucket; they need validation, lifecycle rules and a clear audit trail that survives contact with production traffic.",
      },
      {
        kind: "list",
        items: [
          "Expand regional ingress so files land close to the people uploading them.",
          "Invest in validation that runs before an asset enters a pipeline.",
          "Grow the SDK and documentation teams around real integration patterns.",
        ],
      },
      { kind: "heading", text: "What this funds" },
      {
        kind: "paragraph",
        text: "Practically, this means more regions, lower latency for large files and a steadier release cadence for the client libraries. It also means we can keep the developer experience honest: clear errors, predictable limits and pricing that teams can reason about before they commit. We are grateful to the customers who pressure-tested early versions, and we are just getting started.",
      },
    ],
  },
  {
    slug: "introducing-ai-validation",
    type: "Announcement",
    title: "Introducing AI validation: catch bad files before they land",
    excerpt:
      "A new validation layer checks type, structure and content policy at ingestion — with decisions you can inspect and override.",
    date: "2026-09-30",
    readTime: "5 min read",
    author: "Priya Raman",
    category: "Product",
    body: [
      {
        kind: "paragraph",
        text: "Starting today, Dropflow can validate an asset before it becomes part of your project. The new validation layer runs at the ingestion boundary, where rejecting a malformed or disallowed file is cheapest, and returns a structured decision your application can act on directly.",
      },
      { kind: "heading", text: "What it checks" },
      {
        kind: "paragraph",
        text: "Validation covers three layers. Declared type is compared with detected type so a renamed executable cannot masquerade as an image. Document structure is checked for corruption and truncation. A content-policy pass flags material your team has chosen to disallow, using rules configured per project rather than a global default.",
      },
      {
        kind: "list",
        items: [
          "MIME allowlists with detected-type verification.",
          "Structural checks for PDFs, images and common document formats.",
          "Per-project policy rules with a recorded decision for every asset.",
        ],
      },
      { kind: "heading", text: "Decisions you can inspect" },
      {
        kind: "paragraph",
        text: "Every decision is stored with the asset and visible in the dashboard and API. If a rule is too strict, you can review the exact reason and adjust policy without redeploying application code. Validation is opt-in during this preview, so existing projects keep their current behavior until a rule is enabled.",
      },
    ],
  },
  {
    slug: "estimating-storage-costs-guide",
    type: "Guide",
    title: "A practical guide to estimating storage costs at scale",
    excerpt:
      "A working model for forecasting storage spend from upload volume, retention and access patterns — without guesswork.",
    date: "2026-09-12",
    readTime: "8 min read",
    author: "Elena Fischer",
    category: "Engineering",
    body: [
      {
        kind: "paragraph",
        text: "Storage bills are surprising because they are the product of several variables that change independently: how much arrives, how long it stays, how often it is read and how many copies your pipeline creates. A useful estimate does not require perfect numbers. It requires a model you can update as each variable becomes real.",
      },
      { kind: "heading", text: "Start with gross bytes, then subtract" },
      {
        kind: "paragraph",
        text: "Begin with average asset size multiplied by monthly upload count. Then account for duplication: thumbnails, derived formats and intermediate files often outweigh the originals. Finally apply a retention curve — not every asset survives to the end of its configured window. The result is a rough but honest upper bound.",
      },
      {
        kind: "list",
        items: [
          "Originals: average file size × successful uploads per month.",
          "Derivatives: count every rendition you actually keep, not every one you generate.",
          "Retention: model the share of assets still present after 30, 90 and 365 days.",
        ],
      },
      { kind: "heading", text: "Price the access pattern, not just the bytes" },
      {
        kind: "paragraph",
        text: "Two projects with identical byte counts can have very different bills. A catalogue that is read constantly belongs in a warmer tier than an archive touched once a quarter. Measure reads per asset per month, then place each class of asset in the cheapest tier that meets its latency needs.",
      },
      { kind: "heading", text: "Revisit the model monthly" },
      {
        kind: "paragraph",
        text: "Treat the estimate as a living spreadsheet. Compare it against actual usage from the dashboard, note the largest variance and adjust one assumption at a time. After two or three cycles the forecast usually lands within a few percent — close enough to make architectural decisions with confidence.",
      },
    ],
  },
  {
    slug: "hidden-cost-of-re-encoding",
    type: "Report",
    title: "The hidden cost of re-encoding: 90 days of production traffic",
    excerpt:
      "We traced every transformation in a real asset pipeline and found that most compute spend came from work repeated across services.",
    date: "2026-08-18",
    readTime: "7 min read",
    author: "Mira Chen",
    category: "Engineering",
    body: [
      {
        kind: "paragraph",
        text: "Across a 90-day window we instrumented every transformation applied to uploaded assets in a mid-size production project. The headline finding was not the total cost but its distribution: a small number of repeated transformations accounted for most of the compute time, and almost none of them were necessary on every upload.",
      },
      { kind: "heading", text: "What the trace showed" },
      {
        kind: "paragraph",
        text: "The same document was being normalized by the upload service, again by a search indexer and once more by a preview generator. Each step produced a slightly different artifact, so downstream services could not share results. The pipeline was correct, but it was doing the same work three times because each team owned only its own stage.",
      },
      {
        kind: "list",
        items: [
          "68% of transform time came from repeated normalization of identical inputs.",
          "Derived artifacts were retained even when no consumer existed.",
          "Failures were concentrated in the largest files, which retried whole pipelines.",
        ],
      },
      { kind: "heading", text: "The fix was organizational" },
      {
        kind: "paragraph",
        text: "We moved transformation results into a shared, content-addressed store and made each step idempotent. A retry after failure resumed from the last successful stage rather than restarting. Compute spend for the project fell by roughly a third, and — more importantly — the team could explain where the remaining time went.",
      },
    ],
  },
  {
    slug: "open-asset-interoperability-working-group",
    type: "News",
    title: "Dropflow joins the open asset interoperability working group",
    excerpt:
      "The effort aims to make asset metadata, policies and transfer sessions portable between providers.",
    date: "2026-07-27",
    readTime: "3 min read",
    author: "Daniel Okafor",
    category: "Company",
    body: [
      {
        kind: "paragraph",
        text: "Dropflow has joined the open asset interoperability working group, alongside providers, framework authors and independent developers. The group is defining a small set of portable primitives for asset metadata, policy declarations and resumable transfer sessions.",
      },
      { kind: "heading", text: "Why interoperability matters" },
      {
        kind: "paragraph",
        text: "Teams change storage providers more often than they change their application code. Today that migration usually means rewriting the upload layer and losing the policy decisions that were encoded in it. A shared vocabulary lowers that cost and makes it possible to build tooling that works across providers.",
      },
      {
        kind: "paragraph",
        text: "We will publish our notes from the group and bring early drafts into the documentation as they stabilize. Nothing in the product changes as a result of joining — this is a long-term bet on making the category more open, not a rearchitecture.",
      },
    ],
  },
  {
    slug: "lifecycle-rules-and-storage-tiers",
    type: "Announcement",
    title: "Lifecycle rules and smarter storage tiers are here",
    excerpt:
      "Define retention once per project and let assets move to the right tier automatically as they age.",
    date: "2026-06-11",
    readTime: "6 min read",
    author: "Priya Raman",
    category: "Product",
    body: [
      {
        kind: "paragraph",
        text: "Lifecycle rules are now available on every Dropflow project. A rule describes how long an asset should stay in a warm tier, when it should move to cheaper storage and when it should be removed entirely. Policies live with the project, so application code does not need to change when retention requirements do.",
      },
      { kind: "heading", text: "How rules are evaluated" },
      {
        kind: "paragraph",
        text: "Rules run on asset age and, optionally, on tags applied at upload time. A preview campaign, for example, can keep its images warm for two weeks and then archive them automatically, while source documents follow a longer retention policy. Every transition is recorded so you can audit what happened and why.",
      },
      {
        kind: "list",
        items: [
          "Age-based transitions between warm, cool and archive tiers.",
          "Tag-based overrides for special asset classes.",
          "A transition log visible in the dashboard and through the API.",
        ],
      },
      { kind: "heading", text: "Safety by default" },
      {
        kind: "paragraph",
        text: "Deletion is never immediate. Rules enter a preview state first, showing how many assets would be affected, and require confirmation before they go live. Existing projects are unchanged until a rule is explicitly enabled.",
      },
    ],
  },
  {
    slug: "resumable-uploads-flaky-networks",
    type: "Guide",
    title: "A field guide to resumable uploads on flaky networks",
    excerpt:
      "Chunking, retry budgets and sane timeouts — a practical pattern for uploads that survive real-world connections.",
    date: "2026-05-19",
    readTime: "10 min read",
    author: "Elena Fischer",
    category: "Engineering",
    body: [
      {
        kind: "paragraph",
        text: "A mobile user rarely has a stable connection for the entire duration of a large upload. The network can drop, switch from Wi-Fi to cellular, or pause when the screen turns off. A resumable upload treats those events as normal rather than exceptional, and picks up from the last confirmed chunk instead of starting over.",
      },
      { kind: "heading", text: "Chunk deliberately" },
      {
        kind: "paragraph",
        text: "Choose a chunk size that balances progress granularity against request overhead. Very small chunks mean thousands of round trips; very large ones mean a dropped connection loses substantial work. For most browser uploads, a few megabytes per chunk is a reasonable starting point, adjusted to the typical file size in your product.",
      },
      {
        kind: "list",
        items: [
          "Track acknowledged chunk ranges, not just a single progress counter.",
          "Use exponential backoff with jitter for retries after a network failure.",
          "Give the user a visible pause and resume control for long transfers.",
        ],
      },
      { kind: "heading", text: "Make retries idempotent" },
      {
        kind: "paragraph",
        text: "A chunk request may succeed on the server while the response is lost on the way back. If the client blindly resends it, the server should recognize the duplicate and return success. Content-addressed chunk identifiers make this straightforward and remove an entire class of duplicates.",
      },
      { kind: "heading", text: "Know when to stop" },
      {
        kind: "paragraph",
        text: "Not every failure should be retried forever. A rejected file type will never succeed on a second attempt, and an auth error needs a human action. Separate permanent from transient failures, surface a clear message for the former and reserve retry budgets for the latter.",
      },
    ],
  },
];

export const resourceTypes: ResourceType[] = [
  "Report",
  "News",
  "Announcement",
  "Guide",
];

export const resourceCategories: string[] = Array.from(
  new Set(resources.map((resource) => resource.category)),
).sort();

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((resource) => resource.slug === slug);
}

/** Same-category and same-type matches first, then newest. */
export function getRelatedResources(slug: string, limit = 3): Resource[] {
  const current = getResourceBySlug(slug);
  if (!current) return [];

  return resources
    .filter((resource) => resource.slug !== slug)
    .map((resource) => ({
      resource,
      score:
        (resource.category === current.category ? 2 : 0) +
        (resource.type === current.type ? 1 : 0),
    }))
    .sort(
      (a, b) =>
        b.score - a.score || b.resource.date.localeCompare(a.resource.date),
    )
    .slice(0, limit)
    .map(({ resource }) => resource);
}

/** Deterministic across server and client: dates are stored as calendar days. */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
