import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Gauge,
  Quote,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FaqAccordion } from "./_components/faq-accordion";
import { HeroMockup } from "./_components/hero-mockup";
import { RoleTabs } from "./_components/role-tabs";
import "./homenew-palette.css";

export const metadata: Metadata = {
  title: "Ship file uploads, not upload infrastructure",
  description:
    "Dropflow is the AI-native upload and asset layer for product teams — validation, resilient delivery, smart compression and a searchable library behind one small SDK.",
};

const painStats = [
  {
    value: "6–8 weeks",
    label: "Average DIY build",
    detail: "before an upload flow is production ready",
  },
  {
    value: "$42k+",
    label: "Annual upkeep",
    detail: "in engineering time for a homegrown pipeline",
  },
  {
    value: "1 in 5",
    label: "Uploads fail",
    detail: "without retries and resilient delivery",
  },
  {
    value: "12+ hrs",
    label: "Every month",
    detail: "lost to upload bugs and support tickets",
  },
];

const comparison = [
  {
    capability: "Time to first upload",
    dropflow: "Under 10 minutes",
    diy: "6–8 weeks",
    widget: "A few hours",
  },
  {
    capability: "Validation & MIME rules",
    dropflow: "AI-aware, configurable",
    diy: "Build and maintain",
    widget: "Basic size limits",
  },
  {
    capability: "Smart retries & backoff",
    dropflow: "Built in",
    diy: "You build it",
    widget: "Not included",
  },
  {
    capability: "Direct-to-storage delivery",
    dropflow: "Native, no proxy",
    diy: "Custom signed URLs",
    widget: "Varies",
  },
  {
    capability: "Asset library & tags",
    dropflow: "Searchable, auto-tagged",
    diy: "DIY database",
    widget: "Minimal",
  },
  {
    capability: "Usage & insights",
    dropflow: "Out of the box",
    diy: "Own dashboards",
    widget: "None",
  },
];

const testimonials = [
  {
    quote:
      "We budgeted two sprints to build uploads. With Dropflow we had a production-ready flow — validation, progress, all of it — before lunch. That sprint went straight back to the roadmap.",
    name: "Mira Chen",
    role: "VP Product",
    company: "Northstar",
    initials: "MC",
    tone: "from-[var(--hn-accent)] to-[var(--hn-accent-hover)]",
  },
  {
    quote:
      "The AI validation is the part nobody expects. It catches the malformed files our users used to send in support tickets, and retries quietly handle flaky connections.",
    name: "Daniel Okafor",
    role: "Staff Engineer",
    company: "Lattice Health",
    initials: "DO",
    tone: "from-[var(--hn-info)] to-[var(--hn-accent-hover)]",
  },
  {
    quote:
      "Our asset library finally stopped being a folder in someone's Drive. Everything is tagged, searchable and one click from a shareable URL. Our whole team uses it.",
    name: "Priya Raman",
    role: "Head of Operations",
    company: "Forma Studio",
    initials: "PR",
    tone: "from-[var(--hn-accent)] to-[var(--hn-info)]",
  },
];

const metrics: Array<{
  value: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}> = [
  {
    value: "1,200+",
    label: "Engineering hours saved",
    detail: "per year, per team",
    icon: Clock3,
  },
  {
    value: "38%",
    label: "Less storage consumed",
    detail: "via adaptive compression",
    icon: Gauge,
  },
  {
    value: "99.98%",
    label: "Upload success rate",
    detail: "with smart retries",
    icon: TrendingUp,
  },
  {
    value: "10 min",
    label: "To first production upload",
    detail: "from an empty project",
    icon: Zap,
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For side projects and first prototypes.",
    features: [
      "5 GB storage",
      "10k uploads / month",
      "2 projects",
      "AI validation basics",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    description: "For products with real users.",
    features: [
      "50 GB storage",
      "250k uploads / month",
      "10 projects",
      "Full AI toolkit & insights",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Business",
    price: "$99",
    cadence: "/ month",
    description: "For teams operating at scale.",
    features: [
      "250 GB storage",
      "2M uploads / month",
      "Unlimited projects",
      "Priority support & SLAs",
    ],
    cta: "Talk to sales",
    featured: false,
  },
];

const templatePages = [
  { href: "/homenew", label: "Home" },
  { href: "/pricingnew", label: "Pricing" },
  { href: "/integrationsnew", label: "Integrations" },
  { href: "/careersnew", label: "Careers" },
  { href: "/resourcesnew", label: "Resources" },
  { href: "/changelognew", label: "Changelog" },
  { href: "/aboutnew", label: "About" },
  { href: "/contact-salesnew", label: "Contact sales" },
  { href: "/privacypolicynew", label: "Privacy" },
  { href: "/termsnew", label: "Terms" },
  { href: "/cookiesnew", label: "Cookies" },
  { href: "/loginnew", label: "Login" },
  { href: "/signupnew", label: "Sign up" },
];

export default function HomeNewPage() {
  return (
    <div className="homenew-palette bg-background text-foreground">
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-32 size-[34rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-24 -right-40 size-[28rem] rounded-full bg-[var(--hn-sunken)] blur-3xl"
        />
        <div className="container-wide relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <Eyebrow>
              <Sparkles className="size-3" aria-hidden="true" />
              AI-native upload infrastructure
            </Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Ship file uploads, not upload{" "}
              <span className="text-gradient">infrastructure.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dropflow gives product teams an AI-native upload and asset layer —
              validation, resilient delivery, smart compression and a searchable
              library — behind one small SDK. Skip the six-week build and ship the
              experience your users expect.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-11 px-5"
                render={<Link href="/signupnew" />}
              >
                Start building free
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5"
                render={<Link href="/contact-salesnew" />}
              >
                Talk to sales
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" aria-hidden="true" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" aria-hidden="true" />
                10-minute setup
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" aria-hidden="true" />
                Private by default
              </span>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* 2. Pain-point stats band */}
      <section className="relative overflow-hidden border-y bg-primary text-primary-foreground">
        <div
          aria-hidden="true"
          className="grid-pattern pointer-events-none absolute inset-0 opacity-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-[var(--hn-sunken)] blur-3xl"
        />
        <div className="container-wide relative py-14 sm:py-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/70">
                The cost of DIY
              </p>
              <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Upload infrastructure is a tax on your roadmap.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
              Every team rebuilds the same pipeline. The bill is measured in
              sprints, maintenance and the bugs that reach your users.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {painStats.map((stat) => (
              <div
                key={stat.label}
                className="lg:border-l lg:border-primary-foreground/20 lg:pl-6 lg:first:border-0 lg:first:pl-0"
              >
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium">{stat.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/70">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tool comparison table */}
      <Section>
        <SectionHeading
          eyebrow="The comparison"
          title="Purpose-built versus pieced together"
          description="A generic widget gets bytes onto a server. Building it yourself gets you a second product to maintain. Dropflow is designed for the whole lifecycle."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-10 hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="w-[26%] px-5 py-4 font-medium text-muted-foreground">
                  Capability
                </th>
                <th className="bg-primary/5 px-5 py-4">
                  <span className="inline-flex flex-wrap items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Sparkles className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-semibold">Dropflow</span>
                    <Badge className="border-transparent bg-primary/15 text-primary hover:bg-primary/15">
                      Recommended
                    </Badge>
                  </span>
                </th>
                <th className="px-5 py-4 font-medium text-muted-foreground">
                  DIY build
                </th>
                <th className="px-5 py-4 font-medium text-muted-foreground">
                  Generic widget
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {comparison.map((row) => (
                <tr
                  key={row.capability}
                  className="transition-colors hover:bg-muted/20"
                >
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-medium"
                  >
                    {row.capability}
                  </th>
                  <td className="bg-primary/5 px-5 py-4">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <Check
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {row.dropflow}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{row.diy}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {row.widget}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-3 md:hidden">
          {comparison.map((row) => (
            <div
              key={row.capability}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <p className="font-medium">{row.capability}</p>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 px-3 py-2">
                  <dt className="text-xs font-medium text-primary">Dropflow</dt>
                  <dd className="text-right font-medium">{row.dropflow}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-1">
                  <dt className="text-xs text-muted-foreground">DIY build</dt>
                  <dd className="text-right text-muted-foreground">{row.diy}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-1">
                  <dt className="text-xs text-muted-foreground">
                    Generic widget
                  </dt>
                  <dd className="text-right text-muted-foreground">
                    {row.widget}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. AI feature bento grid */}
      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="The AI layer"
          title="Intelligence built into every upload"
          description="Dropflow doesn't just move files. It checks, adapts, watches and explains — so your pipeline gets smarter as it runs."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-10 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Validation — large feature */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:col-span-2 lg:row-span-2 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -bottom-12 size-56 rounded-full bg-primary/10 blur-3xl"
            />
            <ShieldCheck
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -bottom-6 size-44 text-primary/10"
            />
            <div className="relative flex items-center gap-2">
              <span className="inline-flex size-10 items-center justify-center rounded-xl border bg-background/70 text-primary shadow-sm backdrop-blur">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <Badge
                variant="secondary"
                className="border-primary/20 bg-primary/10 text-primary"
              >
                AI-aware
              </Badge>
            </div>
            <div className="relative mt-8">
              <h3 className="text-xl font-semibold tracking-tight">
                Validation that thinks
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Dropflow checks type, size and content signatures before a single
                byte is stored — and explains rejections in plain language.
              </p>
              <div className="mt-5 max-w-sm rounded-xl border bg-background/80 p-3 shadow-sm backdrop-blur">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--hn-accent-soft)]">
                    <Check
                      className="size-4 text-[var(--hn-accent-ink)]"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      campaign-hero.webp
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Signature verified · 2.4 MB
                    </p>
                  </div>
                  <Badge className="border-transparent bg-[var(--hn-accent-soft)] text-[var(--hn-accent-ink)] hover:bg-[var(--hn-accent-soft)]">
                    Passed
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Smart retries */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--hn-border)] bg-gradient-to-br from-[var(--hn-accent-soft)] via-background to-background p-6 sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-background/70 text-[var(--hn-accent-ink)] shadow-sm">
                <RefreshCw className="size-4" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold">Smart retries</h3>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Transient failures are retried with exponential backoff before your
              users ever see an error.
            </p>
            <div className="mt-auto flex items-center gap-2 pt-5">
              {[
                { label: "Attempt 1", sub: "failed", tone: "bg-[var(--hn-warn-soft)] text-[var(--hn-warn)]" },
                { label: "Retry 2", sub: "1.2s", tone: "bg-[var(--hn-warn-soft)] text-[var(--hn-warn)]" },
                { label: "Delivered", sub: "ok", tone: "bg-[var(--hn-accent-soft)] text-[var(--hn-accent-ink)]" },
              ].map((step, index) => (
                <div key={step.label} className="flex flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex-1 rounded-lg border px-2 py-1.5 text-center",
                      step.tone,
                    )}
                  >
                    <p className="text-[10px] font-semibold">{step.label}</p>
                    <p className="text-[9px] opacity-80">{step.sub}</p>
                  </div>
                  {index < 2 && (
                    <ArrowRight
                      className="size-3 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive compression */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--hn-border)] bg-gradient-to-br from-[var(--hn-info-soft)] via-background to-background p-6">
            <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-background/70 text-[var(--hn-info)] shadow-sm">
              <Gauge className="size-4" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold">Adaptive compression</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every file is tuned for its format, without a visible quality drop.
            </p>
            <div className="mt-auto flex items-baseline gap-2 pt-5">
              <span className="text-sm text-muted-foreground line-through">4.8 MB</span>
              <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="text-xl font-semibold text-[var(--hn-info)]">1.2 MB</span>
            </div>
          </div>

          {/* Anomaly detection */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--hn-border)] bg-gradient-to-br from-[var(--hn-warn-soft)] via-background to-background p-6">
            <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-background/70 text-[var(--hn-warn)] shadow-sm">
              <ScanSearch className="size-4" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold">Anomaly detection</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Unusual spikes are flagged before they become an incident.
            </p>
            <div className="mt-auto flex h-10 items-end gap-1.5 pt-5" aria-hidden="true">
              {[35, 48, 42, 60, 38, 52, 92, 44, 50].map((height, index) => (
                <span
                  key={index}
                  className={cn(
                    "flex-1 rounded-sm",
                    index === 6 ? "bg-[var(--hn-warn)]" : "bg-[var(--hn-warn-soft)]",
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Auto-tagging */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--hn-border)] bg-gradient-to-br from-[var(--hn-info-soft)] via-background to-background p-6 sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-background/70 text-[var(--hn-info)] shadow-sm">
                <Tag className="size-4" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold">Auto-tagging</h3>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Files arrive organized. Contextual tags make every asset searchable
              the moment it lands.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {["product", "q4-launch", "social", "approved"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--hn-border)] bg-background/70 px-2.5 py-1 text-xs font-medium text-[var(--hn-info)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Usage insights */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--hn-border)] bg-gradient-to-br from-[var(--hn-warn-soft)] via-background to-background p-6 sm:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl border bg-background/70 text-[var(--hn-warn)] shadow-sm">
                    <BarChart3 className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold">Usage insights</h3>
                </div>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Understand storage, bandwidth and request volume without wiring
                  up a separate analytics stack.
                </p>
              </div>
              <Badge
                variant="secondary"
                className="border-[var(--hn-border)] bg-[var(--hn-warn-soft)] text-[var(--hn-warn)]"
              >
                +24% this month
              </Badge>
            </div>
            <div className="mt-auto flex h-14 items-end gap-2 pt-5" aria-hidden="true">
              {[38, 52, 44, 68, 58, 76, 70, 88, 80, 96].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--hn-warn-soft)] to-[var(--hn-warn)]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Role-based use cases */}
      <Section>
        <SectionHeading
          eyebrow="Built for every team"
          title="One platform, tailored to how you work"
          description="Pick a team to see the parts of Dropflow that matter most to their day-to-day."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-10">
          <RoleTabs />
        </div>
      </Section>

      {/* 6. Testimonials */}
      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="Customer stories"
          title="Teams ship faster with Dropflow"
          description="From first prototype to millions of uploads, teams trust Dropflow to keep files moving."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure
              key={item.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
                index === 1 && "lg:-translate-y-2 lg:shadow-lg",
              )}
            >
              <div className="flex items-center gap-0.5 text-[var(--hn-warn)]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star
                    key={star}
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <Quote
                className="mt-4 size-6 text-primary/20"
                aria-hidden="true"
              />
              <blockquote className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
                    item.tone,
                  )}
                >
                  {item.initials}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.role} · {item.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* 7. Value metrics */}
      <section className="border-b">
        <div className="container-wide py-14 sm:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:gap-0">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="flex gap-4 lg:px-6 lg:first:pl-0 lg:last:pr-0"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card text-primary shadow-sm">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm font-medium">{metric.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {metric.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Pricing teaser */}
      <Section className="bg-muted/20">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Scale when you need to."
          description="Straightforward plans based on storage and uploads — no per-seat fees, no surprises."
          align="center"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm",
                tier.featured &&
                  "border-primary shadow-lg ring-1 ring-primary/20",
              )}
            >
              {tier.featured && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-[var(--hn-accent)]"
                />
              )}
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">{tier.name}</h3>
                {tier.featured && (
                  <Badge className="border-transparent bg-primary/10 text-primary hover:bg-primary/10">
                    Most popular
                  </Badge>
                )}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">
                  {tier.price}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tier.cadence}
                </span>
              </div>
              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-7 w-full"
                variant={tier.featured ? "default" : "outline"}
                render={
                  <Link href={tier.name === "Business" ? "/contact-salesnew" : "/signupnew"} />
                }
              >
                {tier.cta}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <Button
            variant="link"
            className="px-0"
            render={<Link href="/pricingnew" />}
          >
            Compare every plan and feature
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </Section>

      {/* 9. FAQ accordion */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you need to know before you wire Dropflow into your product."
          >
            <p className="text-sm text-muted-foreground">
              Still curious?{" "}
              <Link
                href="/contact-salesnew"
                className="font-medium text-primary hover:underline"
              >
                Talk to our team
              </Link>
              .
            </p>
          </SectionHeading>
          <FaqAccordion />
        </div>
      </Section>

      {/* 10. Final CTA band */}
      <Section className="pt-2">
        <CtaBand
          eyebrow="Get started"
          title="Your upload pipeline can be done by lunch"
          description="Create a project, drop in the SDK, and ship an upload experience your users will never have to think about."
          primaryHref="/signupnew"
          primaryLabel="Start building free"
          secondaryHref="/contact-salesnew"
          secondaryLabel="Talk to sales"
          className="bg-gradient-to-br from-primary/10 via-card to-card"
        />

        {/* Template pages strip */}
        <div className="mt-12 flex flex-col gap-3 border-t pt-6">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Template pages
          </span>
          <nav aria-label="Template pages" className="flex flex-wrap gap-1.5">
            {templatePages.map((page) => {
              const current = page.href === "/homenew";
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
                    current &&
                      "border-primary/30 bg-primary/10 font-medium text-primary",
                  )}
                >
                  {page.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Section>
    </div>
  );
}
