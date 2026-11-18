import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Braces, Terminal } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { CodeBlock } from "@/components/marketing/code-block";
import { Eyebrow } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Quickstart, SDK reference and API notes for Dropflow. Learn where the client gets its base URL and how to make your first upload.",
};

const quickstartCode = `pnpm add @dropflow/sdk

import { Dropflow } from "@dropflow/sdk";

const dropflow = new Dropflow({
  publicKey: process.env.NEXT_PUBLIC_DROPFLOW_KEY!,
});

const asset = await dropflow.upload(file, {
  onProgress: (percent) => setProgress(percent),
});

console.log(asset.url);`;

const sdkCode = `const dropflow = new Dropflow({ publicKey: "df_pub_..." });

// Upload a single file with progress and cancellation
const controller = new AbortController();
const asset = await dropflow.upload(file, {
  signal: controller.signal,
  onProgress: (p) => setProgress(p),
});

// Browse and remove assets
const { items, nextCursor } = await dropflow.assets.list({ limit: 50 });
await dropflow.assets.remove(items[0].id);

// Read current usage
const usage = await dropflow.usage.summary();`;

const apiCode = `const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

const response = await fetch(API_URL + "/auth/me", {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});

const { user } = await response.json();`;

const curlCode = `curl -X POST "http://127.0.0.1:3001/auth/login" \\
  -H "Content-Type: application/json" \\
  -c cookies.txt \\
  -d '{"email":"you@example.com","password":"..."}'`;

const onThisPage = [
  { href: "#quickstart", label: "Quickstart" },
  { href: "#sdk", label: "SDK reference" },
  { href: "#api", label: "API" },
  { href: "#errors", label: "Errors" },
];

export default function DocsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Documentation</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Integrate Dropflow.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start with the quickstart, then use the SDK and API reference as
              needed. This documentation describes the intended integration
              surface; the frontend you are viewing does not call the upload
              backend.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button render={<Link href="#quickstart" />}>
                <BookOpen aria-hidden="true" />
                Quickstart
              </Button>
              <Button
                variant="outline"
                render={<Link href="/how-it-works" />}
              >
                Step-by-step guide
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-wide grid gap-10 py-14 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-24 flex flex-col gap-1 border-l pl-4 text-sm"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              On this page
            </p>
            {onThisPage.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-16">
          <section id="quickstart" className="scroll-mt-24">
            <div className="flex items-center gap-2 text-primary">
              <Terminal className="size-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-wider uppercase">
                Getting started
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Quickstart
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Install the SDK, create a project in the dashboard, and pass its
              public key to the client. The public key is safe for browser code;
              keep the private key on your server.
            </p>
            <div className="mt-6">
              <CodeBlock
                code={quickstartCode}
                filename="app/upload.ts"
                language="typescript"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Need the surrounding steps?{" "}
              <Link
                href="/how-it-works"
                className="rounded text-primary underline-offset-4 hover:underline"
              >
                Read the integration guide
              </Link>
              .
            </p>
          </section>

          <section id="sdk" className="scroll-mt-24">
            <div className="flex items-center gap-2 text-primary">
              <Braces className="size-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-wider uppercase">
                Reference
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              SDK reference
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The client exposes uploads, asset management and usage through a
              small, typed surface. Every method returns a promise.
            </p>
            <div className="mt-6 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[520px] text-sm">
                <caption className="sr-only">SDK methods</caption>
                <thead>
                  <tr className="border-b bg-muted/40 text-left">
                    <th scope="col" className="px-4 py-3 font-medium">Method</th>
                    <th scope="col" className="px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    ["new Dropflow({ publicKey })", "Create a client bound to one project."],
                    ["dropflow.upload(file, options)", "Upload a File or Blob; options include onProgress and signal."],
                    ["dropflow.assets.list(options)", "List assets with filters and a cursor."],
                    ["dropflow.assets.remove(id)", "Remove an asset by ID."],
                    ["dropflow.usage.summary()", "Read storage, upload and request totals."],
                  ].map(([method, description]) => (
                    <tr key={method}>
                      <td className="px-4 py-3 font-mono text-xs">{method}</td>
                      <td className="px-4 py-3 text-muted-foreground">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <CodeBlock code={sdkCode} filename="reference.ts" language="typescript" />
            </div>
          </section>

          <section id="api" className="scroll-mt-24">
            <div className="flex items-center gap-2 text-primary">
              <Braces className="size-4" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-wider uppercase">
                Reference
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              API
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The browser client reads its base URL from{" "}
              <code className="rounded border bg-muted/50 px-1.5 py-0.5 font-mono text-xs">
                NEXT_PUBLIC_API_URL
              </code>
              . When that variable is not set, it falls back to{" "}
              <code className="rounded border bg-muted/50 px-1.5 py-0.5 font-mono text-xs">
                http://127.0.0.1:3001
              </code>
              . Requests send credentials so session cookies are included.
            </p>
            <div className="mt-6 grid gap-4">
              <CodeBlock
                code={apiCode}
                filename="client.ts"
                language="typescript"
              />
              <CodeBlock code={curlCode} filename="terminal" language="bash" />
            </div>
            <div className="mt-6 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[480px] text-sm">
                <caption className="sr-only">Authentication endpoints used by this frontend</caption>
                <thead>
                  <tr className="border-b bg-muted/40 text-left">
                    <th scope="col" className="px-4 py-3 font-medium">Method</th>
                    <th scope="col" className="px-4 py-3 font-medium">Path</th>
                    <th scope="col" className="px-4 py-3 font-medium">Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono text-xs">
                  {[
                    ["POST", "/auth/register", "Create account + organization"],
                    ["POST", "/auth/login", "Start a session"],
                    ["POST", "/auth/logout", "End the session"],
                    ["GET", "/auth/me", "Read the current user"],
                  ].map(([method, path, use]) => (
                    <tr key={path}>
                      <td className="px-4 py-3 text-primary">{method}</td>
                      <td className="px-4 py-3">{path}</td>
                      <td className="px-4 py-3 font-sans text-muted-foreground">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Upload and asset endpoints are part of the intended API surface,
              but this frontend does not implement them.
            </p>
          </section>

          <section id="errors" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Errors
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              API failures are surfaced as an <code className="font-mono text-xs">ApiError</code>{" "}
              carrying a message, HTTP status and machine-readable code. Network
              failures are reported separately so a dropped connection is not
              mistaken for a validation error.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              On authentication screens, a real response is required before any
              success is reported — nothing is faked client-side.
            </p>
          </section>

          <CtaBand
            title="Ready to make your first upload?"
            description="Create a project to get a public key and start integrating."
            primaryHref="/signup"
            primaryLabel="Create a project"
            secondaryHref="/features"
            secondaryLabel="Explore features"
          />
        </div>
      </div>
    </>
  );
}
