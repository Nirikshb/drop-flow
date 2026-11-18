import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Server, Terminal } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { CodeBlock } from "@/components/marketing/code-block";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "A step-by-step integration guide: create a project, install the SDK, upload files and manage assets — plus the architecture behind each upload.",
};

const createCode = `// Dashboard → Projects → New project
// {
//   name: "web-app",
//   allowedMimeTypes: ["image/*", "application/pdf"],
//   maxFileSize: 10485760, // 10 MB
// }
//
// A publicKey and a private API key are generated for you.`;

const installCode = `pnpm add @dropflow/sdk
# or: npm install @dropflow/sdk`;

const uploadCode = `import { Dropflow } from "@dropflow/sdk";

const dropflow = new Dropflow({
  publicKey: process.env.NEXT_PUBLIC_DROPFLOW_KEY!,
});

const controller = new AbortController();

const asset = await dropflow.upload(file, {
  signal: controller.signal,
  onProgress: (percent) => setProgress(percent),
});

console.log(asset.url); // ready to render or store`;

const manageCode = `// List what has been uploaded
const { items } = await dropflow.assets.list({ limit: 20 });

// Read storage + request totals
const usage = await dropflow.usage.summary();

// Remove an asset when it is no longer needed
await dropflow.assets.remove(items[0].id);`;

const steps = [
  {
    number: "01",
    title: "Create a project",
    description:
      "A project is the unit of isolation. It owns its keys, allowed file types, size limit and asset namespace. Create one from the dashboard before touching code.",
    detail: "This takes about a minute and needs no infrastructure on your side.",
    code: createCode,
    filename: "project.config.txt",
    language: "text",
  },
  {
    number: "02",
    title: "Install the SDK",
    description:
      "Add a single dependency. The client is typed, promise-based and works in any modern browser environment.",
    detail: "The public key is safe to ship to the browser; the private key stays on your server.",
    code: installCode,
    filename: "terminal",
    language: "bash",
  },
  {
    number: "03",
    title: "Upload files",
    description:
      "Pass a File or Blob and an optional progress callback. The SDK requests a short-lived signed URL, sends the bytes, and resolves with a completed asset.",
    detail: "Pass an AbortSignal to cancel, or let built-in retries handle transient failures.",
    code: uploadCode,
    filename: "upload.ts",
    language: "typescript",
  },
  {
    number: "04",
    title: "Manage assets",
    description:
      "List, filter and delete assets from the client or the dashboard. Usage totals are available from the same API, so reporting stays consistent.",
    detail: "Delivery URLs can be revoked without deleting the underlying asset.",
    code: manageCode,
    filename: "assets.ts",
    language: "typescript",
  },
];

function ArchitectureDiagram() {
  const row = [
    { label: "Browser", sub: "File + SDK", tone: "plain" },
    { label: "Dropflow API", sub: "Validate + sign", tone: "primary" },
    { label: "Object storage", sub: "Bytes land here", tone: "plain" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 sm:p-7">
      <div className="flex items-center gap-2">
        <Server className="size-4 text-primary" aria-hidden="true" />
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Architecture of one upload
        </p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {row.map((box, index) => (
          <div key={box.label} className="flex items-center gap-2">
            <div
              className={cn(
                "min-w-28 rounded-lg border px-4 py-3 text-center",
                box.tone === "primary" && "border-primary/30 bg-primary/10",
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  box.tone === "primary" && "text-primary",
                )}
              >
                {box.label}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{box.sub}</p>
            </div>
            {index < row.length - 1 && (
              <ArrowRight
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowDown className="size-4" aria-hidden="true" />
        Asset record + metadata written back to your project
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Dashboard", "Assets API", "Usage API"].map((label) => (
          <span
            key={label}
            className="rounded-md border bg-muted/30 px-3 py-1.5 text-xs"
          >
            {label}
          </span>
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
        Only metadata returns to your application. File bytes go straight from
        the browser to storage via a short-lived signed URL.
      </p>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Integration guide</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Four steps to your first upload.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Follow the path most teams take, then dig into the architecture if
              you want to know what happens under the hood.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="The path"
          title="Step by step"
          description="Each step is independent — you can stop after the third and still have a working upload flow."
        />
        <div className="mt-12 flex flex-col gap-14">
          {steps.map((step) => (
            <div
              key={step.number}
              id={`step-${step.number}`}
              className="grid scroll-mt-24 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14"
            >
              <div>
                <span className="inline-flex size-11 items-center justify-center rounded-lg border bg-card text-sm font-semibold text-primary">
                  {step.number}
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  {step.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {step.detail}
                </p>
                <Button
                  variant="link"
                  className="mt-4 px-0"
                  render={<Link href="/docs" />}
                >
                  <Terminal aria-hidden="true" />
                  Open the docs
                </Button>
              </div>
              <CodeBlock
                code={step.code}
                filename={step.filename}
                language={step.language}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="Under the hood"
          title="What happens during an upload"
          description="A short request to Dropflow, a direct transfer to storage, and a metadata record you can query later."
          align="center"
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <ArchitectureDiagram />
        </div>
      </Section>

      <Section>
        <CtaBand
          title="Ready to wire it up?"
          description="Create a project and follow the quickstart in the docs."
          primaryHref="/signup"
          primaryLabel="Create a project"
          secondaryHref="/docs"
          secondaryLabel="Read the quickstart"
        />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prefer a feature overview?{" "}
          <Link
            href="/features"
            className="rounded text-primary underline-offset-4 hover:underline"
          >
            Browse features <ArrowRight className="inline size-3" aria-hidden="true" />
          </Link>
        </p>
      </Section>
    </>
  );
}
