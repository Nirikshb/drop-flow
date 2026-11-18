import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe2,
  HeartPulse,
  Laptop,
  Sparkles,
} from "lucide-react";

import { JobFilters } from "./_components/job-filters";
import { TemplatePagesStrip } from "./_components/template-pages-strip";
import { jobs } from "./_data/jobs";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureCard } from "@/components/marketing/feature-card";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the small, distributed team building Dropflow — the upload layer developers rely on. Explore open roles across engineering, design, developer relations and go-to-market.",
};

const cultureStats = [
  { value: "42", label: "People on the team" },
  { value: "14", label: "Countries represented" },
  { value: "83%", label: "Working remotely" },
  { value: String(jobs.length), label: "Open roles today" },
];

const benefits = [
  {
    icon: Globe2,
    title: "Remote-first, properly",
    description:
      "Work from where you do your best thinking. We write things down, keep meetings few and default to async across time zones.",
  },
  {
    icon: Sparkles,
    title: "Meaningful equity",
    description:
      "Everyone shares in the outcome. You get a real grant, clear terms and the context to understand what it could be worth.",
  },
  {
    icon: HeartPulse,
    title: "Health & wellbeing",
    description:
      "Comprehensive medical, dental and vision cover, plus a simple annual wellness budget you can actually use.",
  },
  {
    icon: BookOpen,
    title: "Learning budget",
    description:
      "A yearly allowance for books, courses and conferences, with time set aside to put what you learn into practice.",
  },
  {
    icon: CalendarDays,
    title: "Flexible time off",
    description:
      "Take the time you need with a generous, trust-based policy and a minimum we actively encourage you to exceed.",
  },
  {
    icon: Laptop,
    title: "Home office setup",
    description:
      "A budget for the desk, monitor and chair that fit your space, refreshed when it is genuinely time to upgrade.",
  },
];

export default function CareersPage() {
  return (
    <>
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
        <div className="container-wide relative py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Careers at Dropflow</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Build things developers <span className="text-gradient">rely on.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              We are a small, distributed team making file uploads feel
              effortless. If you like clear problems, careful engineering and
              shipping work people use every day, you will feel at home here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="#open-roles" />}>
                Browse open roles
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/aboutnew" />}
              >
                About Dropflow
              </Button>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-10 sm:grid-cols-4">
            {cultureStats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <TemplatePagesStrip current="/careersnew" />

      <Section className="border-b bg-muted/20">
        <SectionHeading
          eyebrow="How we work"
          title="Good work, without the theatre"
          description="We keep the company small on purpose: clear ownership, written decisions and enough trust to do your best work without constant oversight."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <FeatureCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </Section>

      <Section id="open-roles">
        <SectionHeading
          eyebrow="Open roles"
          title="Find your place on the team"
          description="These roles are illustrative template content. Filter by team, location or how you like to work — every opening links to a full description."
        />
        <div className="mt-10">
          <JobFilters jobs={jobs} />
        </div>
      </Section>

      <Section className="pt-0">
        <CtaBand
          eyebrow="Nothing quite right?"
          title="We are always up for a good conversation"
          description="If your experience does not fit a listed role but you think you would make Dropflow better, tell us what you would work on."
          primaryHref="/contact-salesnew"
          primaryLabel="Get in touch"
          secondaryHref="/aboutnew"
          secondaryLabel="Learn about us"
        />
      </Section>
    </>
  );
}
