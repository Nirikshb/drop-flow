import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Database,
  Rss,
  Sparkles,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { NewsletterForm } from "./_components/newsletter-form";
import { ResourceFilters } from "./_components/resource-filters";
import { TemplatePagesStrip } from "./_components/template-pages-strip";
import { formatDate, resources } from "./_data/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Research, product announcements and practical guides from the Dropflow team on upload infrastructure, AI validation and storage at scale.",
};

const featured = resources.find((resource) => resource.featured) ?? resources[0];

export default function ResourcesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>
              <Rss className="size-3.5" aria-hidden="true" />
              Resources
            </Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Field notes for teams that ship files.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Research, announcements and hands-on guides on upload
              infrastructure, AI validation and the real cost of storing assets
              at scale — written by the people building Dropflow.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button render={<Link href="#all-resources" />}>
                <BookOpen aria-hidden="true" />
                Browse the library
              </Button>
              <Button
                variant="outline"
                render={<Link href="/changelognew" />}
              >
                See the changelog
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section className="border-b">
        <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div
            aria-hidden="true"
            className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-10 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-sky-500/25 bg-sky-500/10 font-normal text-sky-700 dark:text-sky-300">
                  Featured report
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(featured.date)} · {featured.readTime}
                </span>
              </div>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button render={<Link href={`/resourcesnew/${featured.slug}`} />}>
                  Read the report
                  <ArrowRight aria-hidden="true" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  By {featured.author}
                </span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="relative hidden lg:block"
            >
              <div className="rounded-xl border bg-background/80 p-5 shadow-lg backdrop-blur">
                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  In this report
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { icon: Activity, value: "2.4×", label: "median asset growth" },
                    { icon: Database, value: "61%", label: "uploads start on mobile" },
                    { icon: Sparkles, value: "38%", label: "fewer file-related tickets" },
                  ].map(({ icon: Icon, value, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
                    >
                      <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{value}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          {label}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="all-resources">
        <SectionHeading
          eyebrow="The library"
          title="Everything we've published"
          description="Filter by format or topic to find the research, guide or announcement you need."
        />
        <div className="mt-8">
          <ResourceFilters resources={resources} />
        </div>
      </Section>

      <Section id="newsletter" className="border-y bg-muted/20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-14">
          <div>
            <Eyebrow>Newsletter</Eyebrow>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              One useful email a month.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              A short dispatch with new research, release highlights and the
              occasional deep dive into a problem we solved in production. No
              filler, no weekly noise.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Written by the team building Dropflow",
                "Practical takeaways you can use the same day",
                "One email a month — unsubscribe whenever you like",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm sm:p-8">
            <div
              aria-hidden="true"
              className="grid-pattern pointer-events-none absolute inset-0 opacity-30"
            />
            <div className="relative">
              <h3 className="text-lg font-semibold">Subscribe to the dispatch</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Get the next issue in your inbox.
              </p>
              <div className="mt-6">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <section className="container-wide pb-18 sm:pb-24">
        <CtaBand
          eyebrow="Start building"
          title="Put the guidance to work"
          description="Create a project, get a public key and make your first upload in minutes."
          primaryHref="/signupnew"
          primaryLabel="Create a project"
          secondaryHref="/docs"
          secondaryLabel="Read the docs"
        />
        <TemplatePagesStrip className="mt-6" />
      </section>
    </>
  );
}
