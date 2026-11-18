import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  BarChart3,
  Check,
  CloudUpload,
  Code2,
  Filter,
  FolderOpen,
  Gauge,
  KeyRound,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { CodeBlock } from "@/components/marketing/code-block";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Direct-to-storage uploads, real progress, cancellation, retries, restrictions, asset management and usage tracking — all in one SDK.",
};

const progressCode = `const asset = await dropflow.upload(file, {
  onProgress: (percent) => setProgress(percent),
});

// percent: 0 → 100
// asset.url: a stable, revocable delivery URL`;

const restrictionsCode = `const project = await dropflow.projects.update("web-app", {
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  allowedMimeTypes: ["image/png", "image/webp", "application/pdf"],
});

// Invalid files are rejected before an asset is created.`;

const assetCode = `const { items, nextCursor } = await dropflow.assets.list({
  status: "completed",
  mimeType: "image/*",
  limit: 50,
});

await dropflow.assets.remove(items[0].id);

console.log(await dropflow.usage.summary());
// { storageBytes, uploadCount, requestCount, ... }`;

const featureSections: {
  id: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  code?: { filename: string; language: string; value: string };
  diagram?: boolean;
}[] = [
  {
    id: "direct-to-storage",
    icon: CloudUpload,
    eyebrow: "Transfers",
    title: "Straight from the browser to storage",
    description:
      "Dropflow issues a short-lived signed URL and your file goes directly to object storage. Your server never handles the bytes, so it never becomes the bottleneck.",
    bullets: [
      "No multipart upload endpoint to maintain",
      "Works with File, Blob and React Native file objects",
      "Uploads survive page reloads via resumable sessions",
    ],
    diagram: true,
  },
  {
    id: "progress",
    icon: Gauge,
    eyebrow: "Feedback",
    title: "Progress your UI can actually use",
    description:
      "A per-file callback gives you a number between 0 and 100. Render a bar, a ring or a label — Dropflow does not dictate the interface.",
    bullets: [
      "Granular onProgress callbacks",
      "Combined progress for multi-file batches",
      "No polling or custom event bus required",
    ],
    code: { filename: "upload.ts", language: "typescript", value: progressCode },
  },
  {
    id: "reliability",
    icon: RotateCcw,
    eyebrow: "Reliability",
    title: "Cancellation and retries are built in",
    description:
      "Network conditions are messy. Abort an upload when a user navigates away, and let transient failures retry with backoff before anything is marked failed.",
    bullets: [
      "AbortSignal support on every upload",
      "Exponential backoff for retryable errors",
      "Failed attempts never leave orphaned assets",
    ],
  },
  {
    id: "restrictions",
    icon: Filter,
    eyebrow: "Validation",
    title: "Rules enforced before storage",
    description:
      "Configure limits per project. Dropflow validates size and MIME type at the edge, so bad files never consume storage or reach your application code.",
    bullets: [
      "Max file size per project",
      "Allowlists for MIME types",
      "Clear, typed errors you can show to users",
    ],
    code: {
      filename: "project.ts",
      language: "typescript",
      value: restrictionsCode,
    },
  },
  {
    id: "assets",
    icon: FolderOpen,
    eyebrow: "Management",
    title: "Assets with metadata, not mystery files",
    description:
      "Each completed upload becomes a queryable asset with a checksum, MIME type, size and lifecycle state. Inspect and remove them from the API or the dashboard.",
    bullets: [
      "Cursor-based listing and filtering",
      "Soft delete with recoverable state",
      "Stable delivery URLs that can be revoked",
    ],
    code: { filename: "assets.ts", language: "typescript", value: assetCode },
  },
  {
    id: "usage",
    icon: BarChart3,
    eyebrow: "Visibility",
    title: "Usage you can plan around",
    description:
      "Storage, uploads and requests are counted and surfaced by month. No separate analytics pipeline and no guessing at your bill.",
    bullets: [
      "Monthly upload and bandwidth totals",
      "Per-project breakdowns",
      "Limits visible alongside current usage",
    ],
  },
];

const smallFeatures = [
  {
    icon: KeyRound,
    title: "Scoped upload keys",
    description: "Short-lived credentials limited to a single upload.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "Buckets are never publicly listed or browsable.",
  },
  {
    icon: Ban,
    title: "Clean failures",
    description: "Cancelled uploads leave no dangling state behind.",
  },
  {
    icon: Code2,
    title: "Typed client",
    description: "Generated types for every request and response.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Platform features</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              The upload stack, packaged.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dropflow is deliberately narrow: it does file uploads and the
              bookkeeping around them. Everything here exists to remove code
              from your application.
            </p>
          </div>
        </div>
      </section>

      {featureSections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Section
            key={section.id}
            id={section.id}
            className={cn(index % 2 === 1 && "border-y bg-muted/20")}
          >
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="flex size-10 items-center justify-center rounded-lg border bg-card text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-6 text-[11px] font-semibold tracking-wider text-primary uppercase">
                  {section.eyebrow}
                </p>
                <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
                <ul className="mt-6 flex flex-col gap-3 text-sm">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
                {section.diagram && (
                  <div className="mt-8 rounded-lg border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {["Your app", "Dropflow edge", "Object storage"].map(
                        (label, i) => (
                          <div key={label} className="flex items-center gap-2">
                            <div
                              className={cn(
                                "rounded-md border px-3 py-2 text-xs font-medium",
                                i === 1
                                  ? "border-primary/30 bg-primary/10 text-primary"
                                  : "bg-muted/40",
                              )}
                            >
                              {label}
                            </div>
                            {i < 2 && (
                              <ArrowRight
                                className="size-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ),
                      )}
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      Bytes bypass your server; only metadata returns to it.
                    </p>
                  </div>
                )}
              </div>
              {section.code && (
                <CodeBlock
                  code={section.code.value}
                  filename={section.code.filename}
                  language={section.code.language}
                />
              )}
            </div>
          </Section>
        );
      })}

      <Section className="border-t bg-muted/20">
        <SectionHeading
          eyebrow="The small things"
          title="Details that save you time"
          align="center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {smallFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border bg-card p-5">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="pt-0">
        <CtaBand
          title="Try the SDK in your own project"
          description="Create a project and make your first upload in a few minutes."
          primaryHref="/signup"
          primaryLabel="Start building free"
          secondaryHref="/docs"
          secondaryLabel="Read the docs"
        />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Want the deeper integration path?{" "}
          <Link
            href="/how-it-works"
            className="rounded text-primary underline-offset-4 hover:underline"
          >
            See how it works <ArrowRight className="inline size-3" aria-hidden="true" />
          </Link>
        </p>
      </Section>
    </>
  );
}
