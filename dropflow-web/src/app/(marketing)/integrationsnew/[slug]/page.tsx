import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, Sparkles } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TemplatePagesStrip } from "../_components/template-pages-strip";
import {
  getIntegration,
  getRelatedIntegrations,
  integrations,
} from "../_data/integrations";
import { getAccent, getGlyphIcon } from "../_lib/visuals";

export function generateStaticParams() {
  return integrations.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const integration = getIntegration(slug);

  if (!integration) {
    return { title: "Integration not found" };
  }

  return {
    title: `${integration.name} integration`,
    description: integration.shortDescription,
  };
}

export default async function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const integration = getIntegration(slug);

  if (!integration) {
    notFound();
  }

  const Icon = getGlyphIcon(integration.glyph);
  const accent = getAccent(integration.accent);
  const related = getRelatedIntegrations(slug, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/20">
        <div className="container-wide py-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link
              href="/integrationsnew"
              className="transition-colors hover:text-foreground"
            >
              Directory
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="font-medium text-foreground">
              {integration.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-50"
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br",
            accent.header,
          )}
        />
        <div className="container-wide relative py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-5">
              <span
                className={cn(
                  "flex size-16 items-center justify-center rounded-2xl text-white shadow-lg sm:size-20",
                  accent.tile,
                )}
              >
                <Icon className="size-8 sm:size-10" aria-hidden="true" />
              </span>
              <div>
                <Badge variant="secondary" className="font-normal">
                  {integration.category}
                </Badge>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  {integration.name}
                </h1>
              </div>
            </div>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {integration.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button render={<Link href="/signupnew" />}>
                Connect {integration.name}
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                render={<Link href="/integrationsnew" />}
              >
                Browse all integrations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <Section className="border-b">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading
            eyebrow="Overview"
            title={`Why teams connect ${integration.name}`}
          />
          <div>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {integration.longDescription}
            </p>
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Common use cases
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {integration.useCases.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-start gap-2.5 rounded-lg border bg-card p-4"
                  >
                    <Sparkles
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* What you can do */}
      <Section>
        <SectionHeading
          eyebrow="Capabilities"
          title="What you can do"
          description="Practical things this connection unlocks, using the same Dropflow primitives on every integration."
          align="center"
          className="mx-auto max-w-2xl"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integration.features.map((feature) => (
            <div
              key={feature}
              className="flex gap-3 rounded-lg border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium leading-relaxed">{feature}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How to connect */}
      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="Setup"
          title="How to connect"
          description="Most teams are live in a single sitting. Follow the steps in order — no infrastructure to provision."
          align="center"
          className="mx-auto max-w-2xl"
        />
        <div className="relative mx-auto mt-12 grid max-w-5xl gap-7 sm:grid-cols-2 lg:grid-cols-5">
          {integration.setupSteps.map((step, index) => (
            <div key={step} className="relative">
              <div className="flex size-10 items-center justify-center rounded-full border bg-card text-sm font-semibold text-primary shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {step}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Related integrations */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Keep exploring"
            title="Related integrations"
            description="More ways to connect Dropflow to the tools your team uses."
          />
          <Button
            variant="link"
            className="px-0"
            render={<Link href="/integrationsnew" />}
          >
            View all integrations
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => {
            const RelatedIcon = getGlyphIcon(item.glyph);
            const relatedAccent = getAccent(item.accent);
            return (
              <Link
                key={item.slug}
                href={`/integrationsnew/${item.slug}`}
                className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg text-white shadow-sm",
                      relatedAccent.tile,
                    )}
                  >
                    <RelatedIcon className="size-5" aria-hidden="true" />
                  </span>
                  <Badge variant="secondary" className="font-normal">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="mt-4 text-base font-semibold">{item.name}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View integration
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <Section className="space-y-4">
        <CtaBand
          eyebrow="Get started"
          title={`Start using ${integration.name} with Dropflow`}
          description="Create a free project, connect your integration and ship a reliable upload flow this week."
          primaryHref="/signupnew"
          primaryLabel="Create a free project"
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
