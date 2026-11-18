import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Gauge,
  GitBranch,
  Globe2,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Meet the team behind Dropflow and the mission to make file uploads a solved problem for every developer.",
};

const templatePages = [
  { href: "/homenew", label: "Home" },
  { href: "/pricingnew", label: "Pricing" },
  { href: "/integrationsnew", label: "Integrations" },
  { href: "/careersnew", label: "Careers" },
  { href: "/resourcesnew", label: "Resources" },
  { href: "/changelognew", label: "Changelog" },
  { href: "/aboutnew", label: "About" },
  { href: "/contact-salesnew", label: "Contact sales" },
  { href: "/privacypolicynew", label: "Privacy policy" },
  { href: "/termsnew", label: "Terms" },
  { href: "/cookiesnew", label: "Cookies" },
  { href: "/loginnew", label: "Log in" },
  { href: "/signupnew", label: "Sign up" },
];

function TemplatePagesStrip() {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Template pages
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {templatePages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded text-xs text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const values: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GitBranch,
    title: "Developer-first, always",
    description:
      "A typed SDK, predictable errors and docs you can actually follow. If it frustrates us, it ships to you last.",
  },
  {
    icon: LockKeyhole,
    title: "Private by default",
    description:
      "Assets are scoped to your projects. We design restrictions and access controls before convenience features.",
  },
  {
    icon: Gauge,
    title: "Reliability is a feature",
    description:
      "Retries, cancellation and real progress are table stakes. Uploads should feel boring, in the best possible way.",
  },
  {
    icon: HeartHandshake,
    title: "Honest by design",
    description:
      "Clear limits, readable pricing and no dark patterns. We would rather explain a trade-off than hide it.",
  },
  {
    icon: Globe2,
    title: "Built for every team",
    description:
      "From a solo prototype to a global product, the same small API scales with the work you throw at it.",
  },
];

const stats = [
  { value: "2.4B+", label: "Assets delivered" },
  { value: "180+", label: "Countries served" },
  { value: "99.99%", label: "Upload success rate" },
  { value: "12k+", label: "Developers onboard" },
];

const milestones = [
  {
    year: "2021",
    title: "The problem we kept solving",
    description:
      "Dropflow started with a shared frustration: every new product rebuilt the same upload pipeline from scratch.",
  },
  {
    year: "2022",
    title: "The first SDK ships",
    description:
      "A small, typed JavaScript client turned validation, progress and asset URLs into four lines of code.",
  },
  {
    year: "2023",
    title: "Direct-to-storage",
    description:
      "Files began moving straight from the browser to object storage, taking the app server out of the hot path.",
  },
  {
    year: "2024",
    title: "Assets and insight",
    description:
      "Asset management, usage tracking and project-level limits gave teams a clear view of everything they upload.",
  },
  {
    year: "2026",
    title: "Scaling with our customers",
    description:
      "Today Dropflow powers billions of uploads for teams ranging from weekend prototypes to production platforms.",
  },
];

const team = [
  {
    name: "Maya Chen",
    role: "Co-founder & CEO",
    initials: "MC",
    gradient: "from-primary to-cyan-500",
  },
  {
    name: "Daniel Okafor",
    role: "Co-founder & CTO",
    initials: "DO",
    gradient: "from-violet-500 to-primary",
  },
  {
    name: "Priya Nair",
    role: "Head of Product",
    initials: "PN",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Tomás Rivera",
    role: "Staff Engineer, Infrastructure",
    initials: "TR",
    gradient: "from-sky-500 to-primary",
  },
  {
    name: "Aisha Bello",
    role: "Design Lead",
    initials: "AB",
    gradient: "from-amber-500 to-rose-500",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-16 -right-40 size-[24rem] rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div className="container-wide relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>About Dropflow</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              We make uploads a <span className="text-gradient">solved problem.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dropflow is a small team of engineers and product people building the
              infrastructure we always wanted: one honest SDK for validation, direct
              uploads and asset management.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-11 px-5"
                render={<Link href="/contact-salesnew" />}
              >
                Talk to our team
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
          </div>
        </div>
      </section>

      {/* Mission / story */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="Our mission"
            title="Spend your time on the product, not the plumbing."
            description="Every app needs to accept files. Almost none of them should have to build that pipeline themselves."
          />
          <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              Dropflow began in 2021 when our founders kept writing the same upload
              code — signed URLs, size checks, progress events, retry loops — on one
              project after another. The work was identical every time, and it was
              always the part that slipped.
            </p>
            <p>
              We decided to do it once, properly. The first SDK shipped in 2022, and
              it focused on a narrow promise: a File in, a stable asset URL out, with
              everything in between handled for you.
            </p>
            <p>
              That promise still guides us. We stay small on purpose, we keep the API
              boring, and we measure our success by how quickly a developer can make
              their first upload — not by how many features we can add.
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                <Compass className="size-3.5 text-primary" aria-hidden="true" />
                Developer-first
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
                Private by default
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                Small, honest API
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Impact stats */}
      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="Our impact"
          title="A lot of uploads, quietly handled."
          description="A snapshot of the work flowing through Dropflow today."
          align="center"
          className="mx-auto max-w-2xl"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-6 text-center"
            >
              <p className="text-balance text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeading
          eyebrow="How we work"
          title="Five values we actually use."
          description="These are the rules we reach for when a decision is not obvious."
          align="center"
          className="mx-auto max-w-2xl"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <value.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section className="border-y bg-muted/20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Our story"
            title="From a shared frustration to shared infrastructure."
            description="A few milestones from the road so far."
          />
          <div className="relative mt-2">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[9px] w-px bg-border"
            />
            <ol className="relative flex flex-col gap-8">
              {milestones.map((milestone) => (
                <li key={milestone.year} className="relative pl-10">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 left-0 flex size-5 items-center justify-center rounded-full bg-primary/15 ring-4 ring-background"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                  </span>
                  <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                    {milestone.year}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeading
          eyebrow="The team"
          title="Small team, focused work."
          description="The people behind the SDK you install."
          align="center"
          className="mx-auto max-w-2xl"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-4 rounded-xl border bg-card p-5"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-semibold text-white shadow-inner",
                  member.gradient,
                )}
              >
                {member.initials}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 rounded-xl border border-dashed bg-muted/20 p-5">
            <div
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border bg-card text-primary"
            >
              <Users className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium">And the rest of the crew</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Engineers, support and ops across the globe.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <CtaBand
          eyebrow="Work with us"
          title="Build with a team that sweats the details."
          description="Get started free in minutes, or talk to us about a larger rollout."
          primaryHref="/signupnew"
          primaryLabel="Start building free"
          secondaryHref="/contact-salesnew"
          secondaryLabel="Contact sales"
        />
      </Section>

      {/* Template pages */}
      <div className="border-t">
        <div className="container-wide py-8">
          <TemplatePagesStrip />
        </div>
      </div>
    </>
  );
}
