import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  BarChart3,
  BookOpen,
  Check,
  CloudUpload,
  Code2,
  Database,
  FileText,
  Filter,
  FolderOpen,
  Gauge,
  Image as ImageIcon,
  KeyRound,
  Layers,
  Lock,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureCard } from "@/components/marketing/feature-card";
import { InteractiveDemo } from "@/components/marketing/interactive-demo";
import { Reveal } from "@/components/marketing/reveal";
import { SdkTabs } from "@/components/marketing/sdk-tabs";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "File uploads, without the infrastructure",
  description:
    "One SDK for validation, direct-to-storage uploads, progress, retries and asset management. Dropflow handles the plumbing so you can keep shipping.",
};

const avoidedWork = [
  {
    title: "Storage integration",
    description: "Wire up buckets, credentials and signed URLs once — then forget about them.",
  },
  {
    title: "Validation rules",
    description: "Enforce size limits and MIME types at the edge, before bytes are stored.",
  },
  {
    title: "Progress reporting",
    description: "Real upload progress without polling your own backend for state.",
  },
  {
    title: "Retries & resilience",
    description: "Transient failures are retried with backoff instead of failing your users.",
  },
  {
    title: "Asset management",
    description: "List, inspect and delete assets from one consistent API and dashboard.",
  },
  {
    title: "Usage tracking",
    description: "Storage, uploads and requests are counted and visible out of the box.",
  },
];

const steps = [
  {
    title: "Create a project",
    description: "A project gives you an isolated bucket, a public key and its own limits.",
  },
  {
    title: "Install the SDK",
    description: "Add one dependency and initialise the client with your public key.",
  },
  {
    title: "Upload files",
    description: "Pass a File or Blob, observe progress, and get a stable asset URL back.",
  },
  {
    title: "Manage assets",
    description: "Browse, filter and remove files from the dashboard or the API.",
  },
];

const features = [
  {
    icon: CloudUpload,
    title: "Direct-to-storage",
    description: "Files move straight from the browser to object storage. Your server stays out of the hot path.",
  },
  {
    icon: Gauge,
    title: "Real progress",
    description: "Per-file progress callbacks your UI can render immediately — no custom event bus required.",
  },
  {
    icon: Ban,
    title: "Cancellation",
    description: "Abort an in-flight upload from any component and clean up the pending asset automatically.",
  },
  {
    icon: RotateCcw,
    title: "Smart retries",
    description: "Network hiccups are retried with exponential backoff before an upload is marked failed.",
  },
  {
    icon: Filter,
    title: "File restrictions",
    description: "Declare allowed MIME types and a maximum size per project. Invalid files never get a URL.",
  },
  {
    icon: FolderOpen,
    title: "Asset management",
    description: "Every upload becomes a queryable asset with metadata, checksums and lifecycle state.",
  },
  {
    icon: BarChart3,
    title: "Usage tracking",
    description: "See storage, bandwidth and request volume by month, without wiring up analytics.",
  },
  {
    icon: Code2,
    title: "Developer-first SDK",
    description: "Typed, promise-based and small. The API reads like the rest of your TypeScript code.",
  },
];

const securityItems = [
  {
    icon: KeyRound,
    title: "Signed upload URLs",
    description: "Short-lived, scoped credentials grant a single upload. No long-lived secrets in the browser.",
  },
  {
    icon: Lock,
    title: "Private buckets",
    description: "Objects are never publicly listed. Delivery URLs are explicit and revocable.",
  },
  {
    icon: Layers,
    title: "Project isolation",
    description: "Each project has its own keys, limits and asset namespace. Nothing crosses boundaries.",
  },
  {
    icon: ShieldCheck,
    title: "Hashed keys",
    description: "API keys are stored as hashes and shown only once at creation time.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For side projects and trying things out.",
    storage: "5 GB",
    features: ["5 GB storage", "10k uploads / month", "2 projects", "Community documentation"],
    cta: "Start free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    description: "For products with real users.",
    storage: "50 GB",
    features: ["50 GB storage", "250k uploads / month", "10 projects", "Email support"],
    cta: "Get started",
    href: "/signup",
    featured: true,
  },
  {
    name: "Business",
    price: "$99",
    cadence: "per month",
    description: "For teams running at scale.",
    storage: "250 GB",
    features: ["250 GB storage", "2M uploads / month", "Unlimited projects", "Priority support"],
    cta: "Contact us",
    href: "/contact",
    featured: false,
  },
];

const mockUploads = [
  { name: "avatar-mira.png", meta: "image/png · just now", size: "248 KB", color: "bg-emerald-500/15 text-emerald-600", icon: ImageIcon },
  { name: "quarterly-report.pdf", meta: "application/pdf · 12 min ago", size: "1.8 MB", color: "bg-rose-500/15 text-rose-600", icon: FileText },
  { name: "product-shot.webp", meta: "image/webp · 1 hour ago", size: "912 KB", color: "bg-sky-500/15 text-sky-600", icon: ImageIcon },
  { name: "invoice-2041.csv", meta: "text/csv · 3 hours ago", size: "36 KB", color: "bg-amber-500/15 text-amber-600", icon: FileText },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -right-40 size-[26rem] rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div className="container-wide relative py-20 sm:py-28 lg:py-32">
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Eyebrow>Developer infrastructure · Uploads</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              File uploads, without the <span className="text-gradient">infrastructure.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              One SDK for validation, direct-to-storage uploads, progress and asset
              management. Dropflow handles the plumbing — you keep building your
              product.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="h-11 px-5"
                render={<Link href="/signup" />}
              >
                Start building free
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5"
                render={<Link href="/docs" />}
              >
                <BookOpen aria-hidden="true" />
                Read the docs
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required · SDK-first · Private by default
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Interactive demo */}
      <Section>
        <SectionHeading
          eyebrow="See it in action"
          title="A complete upload flow, in one component"
          description="Pick a file and watch the states transition — from selection to a generated asset URL. This is a visual simulation, not a live backend."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-10">
          <InteractiveDemo />
        </div>
      </Section>

      {/* 3. The work you don't need to do */}
      <Section className="border-y bg-muted/20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="The work you don't need to do"
            title="Uploads are a solved problem. Stop re-solving them."
            description="Every app rebuilds the same upload pipeline. Dropflow packages the boring, error-prone parts behind one small API."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {avoidedWork.map((item) => (
              <li key={item.title} className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4. How it works */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="From project to production in four steps"
          description="No infrastructure to provision and no webhooks to babysit. The whole integration fits in an afternoon."
          align="center"
        />
        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute top-6 right-6 left-6 hidden h-px bg-border lg:block"
          />
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border bg-card text-sm font-semibold text-primary shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. SDK example */}
      <Section className="border-y bg-muted/20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The SDK"
              title="A few lines. That's the integration."
              description="Initialize once, upload anywhere, and read the resulting URL straight from the response. Progress is a callback, not a polling loop."
            />
            <ul className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary" aria-hidden="true" />
                Typed for TypeScript, plain JavaScript friendly
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary" aria-hidden="true" />
                Cancellation and retries built into every upload
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-primary" aria-hidden="true" />
                No server-side proxy required
              </li>
            </ul>
            <Button
              variant="link"
              className="mt-5 px-0"
              render={<Link href="/docs#sdk" />}
            >
              Browse the SDK reference
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <SdkTabs />
        </div>
      </Section>

      {/* 6. Feature grid */}
      <Section>
        <SectionHeading
          eyebrow="Built for real products"
          title="Everything an upload pipeline needs"
          description="Practical primitives that remove entire categories of bugs from your app."
          align="center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Section>

      {/* 7. Dashboard preview */}
      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="Inside Dropflow"
          title="One place to see everything you've uploaded"
          description="A lightweight dashboard for assets, usage and project settings — no separate observability stack required."
          align="center"
        />
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-xl border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              app.dropflow.dev/dashboard
            </span>
          </div>
          <div className="grid min-h-[420px] md:grid-cols-[170px_1fr]">
            <aside className="hidden border-r bg-muted/20 p-3 md:block">
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="size-6 rounded-md bg-primary" aria-hidden="true" />
                <span className="text-xs font-semibold">dropflow</span>
              </div>
              <nav aria-label="Dashboard preview navigation" className="mt-4 flex flex-col gap-1">
                {["Overview", "Assets", "Uploads", "Projects", "API keys", "Settings"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                        index === 0
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
                      {item}
                    </div>
                  ),
                )}
              </nav>
            </aside>
            <div className="min-w-0 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Overview</p>
                  <p className="text-xs text-muted-foreground">
                    Your upload activity at a glance
                  </p>
                </div>
                <span className="rounded-md border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
                  Last 30 days
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3.5">
                  <p className="text-[11px] text-muted-foreground">Storage used</p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight">12.4 GB</p>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[25%] rounded-full bg-primary" />
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground">of 50 GB</p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="text-[11px] text-muted-foreground">Uploads this month</p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight">8,412</p>
                  <p className="mt-6 text-[10px] text-emerald-600">+12% vs. last month</p>
                </div>
                <div className="rounded-lg border p-3.5">
                  <p className="text-[11px] text-muted-foreground">Total assets</p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight">1,293</p>
                  <p className="mt-6 text-[10px] text-muted-foreground">across 2 projects</p>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border">
                <div className="border-b px-3 py-2 text-xs font-medium">Recent uploads</div>
                <ul className="divide-y">
                  {mockUploads.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name} className="flex items-center gap-3 px-3 py-2.5">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-md",
                            item.color,
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium">{item.name}</span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {item.meta}
                          </span>
                        </span>
                        <span className="hidden shrink-0 text-[11px] tabular-nums text-muted-foreground sm:block">
                          {item.size}
                        </span>
                        <Badge
                          variant="secondary"
                          className="hidden shrink-0 font-normal text-emerald-600 sm:inline-flex dark:text-emerald-400"
                        >
                          Complete
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Security & reliability */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Security & reliability"
              title="Private by design, without extra work"
              description="Sensible defaults keep user files isolated and credentials out of the browser. No certification claims — just the mechanics that matter."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {securityItems.map((item) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* 9. Pricing preview */}
      <Section className="border-t bg-muted/20">
        <SectionHeading
          eyebrow="Pricing preview"
          title="Simple plans that grow with your uploads"
          description="Numbers below are illustrative — final pricing has not been published yet."
          align="center"
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-6",
                plan.featured && "border-primary shadow-md ring-1 ring-primary/20",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <Badge className="border-transparent bg-primary/10 text-primary hover:bg-primary/10">
                    Popular
                  </Badge>
                )}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-xs text-muted-foreground">/ {plan.cadence}</span>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-7 w-full"
                variant={plan.featured ? "default" : "outline"}
                render={<Link href={plan.href} />}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Illustrative — final pricing not published. {`{ storage shown: 5 GB / 50 GB / 250 GB }`}
        </p>
      </Section>

      {/* 10. Docs CTA + final CTA */}
      <Section className="space-y-4">
        <CtaBand
          eyebrow="Documentation"
          title="Everything you need to integrate"
          description="Quickstart, SDK reference and API notes — with the base URL wired to your environment."
          primaryHref="/docs"
          primaryLabel="Read the documentation"
          secondaryHref="/how-it-works"
          secondaryLabel="See how it works"
        />
        <CtaBand
          eyebrow="Get started"
          title="Ship uploads this week"
          description="Create a project, install the SDK, and make your first upload. No credit card required."
          primaryHref="/signup"
          primaryLabel="Start building free"
          secondaryHref="/contact"
          secondaryLabel="Talk to us"
        />
      </Section>
    </>
  );
}
