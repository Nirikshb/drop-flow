import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bell,
  Check,
  Plus,
  RefreshCw,
  Rss,
  Wrench,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { TemplatePagesStrip } from "../resourcesnew/_components/template-pages-strip";
import { formatDate } from "../resourcesnew/_data/resources";
import { releases } from "./_data/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "A release-by-release history of Dropflow: new capabilities, improvements and fixes across the SDK, validation and storage platform.",
};

function ChangeList({
  label,
  icon: Icon,
  items,
  tone,
}: {
  label: string;
  icon: LucideIcon;
  items: string[];
  tone: string;
}) {
  return (
    <div>
      <p
        className={cn(
          "flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase",
          tone,
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
          >
            <Check
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
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
              Changelog
            </Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              What’s new in Dropflow.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A plain-language record of what shipped and why. New capabilities,
              improvements and fixes — in the order they reached production.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button render={<Link href="#releases" />}>
                Browse releases
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                render={<Link href="/resourcesnew#newsletter" />}
              >
                <Bell aria-hidden="true" />
                Get release emails
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section id="releases">
        <SectionHeading
          eyebrow="Release history"
          title="Every version, at a glance"
          description="Six recent releases, from the first typed SDK to structured validation decisions."
        />

        <div className="relative mt-10">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-4 w-px bg-border sm:left-5"
          />
          <ol className="relative space-y-12">
            {releases.map((release, index) => (
              <li key={release.version} className="relative pl-12 sm:pl-16">
                <div
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 flex size-8 items-center justify-center rounded-full border bg-card shadow-sm sm:size-10"
                >
                  <span className="size-2.5 rounded-full bg-primary" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-primary/20 bg-primary/10 font-mono font-normal text-primary">
                    {release.version}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(release.date)}
                  </span>
                  {index === 0 && (
                    <Badge variant="outline" className="font-normal">
                      Latest
                    </Badge>
                  )}
                </div>

                <h2 className="mt-3 text-balance text-xl font-semibold tracking-tight sm:text-2xl">
                  {release.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {release.summary}
                </p>

                <div className="mt-5 grid gap-6 rounded-xl border bg-card p-5 sm:p-6 md:grid-cols-3 md:gap-8">
                  <ChangeList
                    label="Added"
                    icon={Plus}
                    items={release.added}
                    tone="text-emerald-600 dark:text-emerald-400"
                  />
                  <ChangeList
                    label="Changed"
                    icon={RefreshCw}
                    items={release.changed}
                    tone="text-sky-600 dark:text-sky-400"
                  />
                  <ChangeList
                    label="Fixed"
                    icon={Wrench}
                    items={release.fixed}
                    tone="text-amber-600 dark:text-amber-400"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <section className="border-t bg-muted/20">
        <div className="container-wide py-14 sm:py-18">
          <CtaBand
            eyebrow="Go deeper"
            title="The stories behind the releases"
            description="Read the research, guides and announcements that explain where these changes came from."
            primaryHref="/resourcesnew"
            primaryLabel="Browse resources"
            secondaryHref="/docs"
            secondaryLabel="Read the docs"
          />
          <TemplatePagesStrip className="mt-6" />
        </div>
      </section>
    </>
  );
}
