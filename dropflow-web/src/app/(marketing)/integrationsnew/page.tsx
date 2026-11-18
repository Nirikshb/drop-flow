import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Blocks, Check, PlugZap, Sparkles } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { IntegrationsBrowser } from "./_components/integrations-browser";
import { TemplatePagesStrip } from "./_components/template-pages-strip";
import { integrations } from "./_data/integrations";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Connect Dropflow to the CMS, storefront and productivity tools your team already uses. One upload layer for every asset workflow.",
};

const highlights = [
  "One upload layer for every tool in your stack",
  "Validation, retries and progress handled for you",
  "Stable delivery URLs your content can rely on",
  "Metadata that stays consistent across platforms",
];

export default function IntegrationsPage() {
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
          className="pointer-events-none absolute top-16 -right-36 size-[24rem] rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div className="container-wide relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="mx-auto">
              <PlugZap className="size-3.5" aria-hidden="true" />
              Integrations
            </Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
              Plug Dropflow into your{" "}
              <span className="text-gradient">content stack.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your team already has a CMS, a storefront and a dozen productivity
              tools. Dropflow connects to the ones that matter — giving every
              asset a reliable upload path and a clean delivery URL.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
                Talk to our team
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t pt-8 text-center">
            {[
              { value: String(integrations.length), label: "Integrations" },
              { value: "4", label: "Categories" },
              { value: "1", label: "Asset layer" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directory */}
      <Section>
        <SectionHeading
          eyebrow="The directory"
          title="Find the connection you need"
          description="Search by name or browse by category. Every integration uses the same Dropflow primitives underneath."
        />
        <div className="mt-8">
          <IntegrationsBrowser integrations={integrations} />
        </div>
      </Section>

      {/* Why it works */}
      <Section className="border-y bg-muted/20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Built to fit"
              title="One upload layer, every tool"
              description="Integrations are thin adapters over the same Dropflow API. The behavior your users expect — validation, progress and reliable URLs — stays identical wherever files are uploaded."
            />
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              More connections added regularly
            </div>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-relaxed">{item}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Missing a tool */}
      <Section>
        <div className="flex flex-col items-start gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-primary/5 text-primary">
              <Blocks className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold">
                Don&apos;t see the tool you use?
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Dropflow exposes a typed SDK and webhooks, so you can build a
                custom connection in an afternoon. Tell us what you need and
                we&apos;ll help you wire it up.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0"
            render={<Link href="/contact-salesnew" />}
          >
            Request an integration
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <Section className="space-y-4">
        <CtaBand
          eyebrow="Get started"
          title="Connect your first tool today"
          description="Create a project, pick an integration and ship a reliable upload flow without the infrastructure work."
          primaryHref="/signupnew"
          primaryLabel="Start building free"
          secondaryHref="/contact-salesnew"
          secondaryLabel="Talk to our team"
        />
      </Section>

      {/* Template page cross-links */}
      <Section className="border-t py-10 sm:py-12">
        <TemplatePagesStrip />
      </Section>
    </>
  );
}
