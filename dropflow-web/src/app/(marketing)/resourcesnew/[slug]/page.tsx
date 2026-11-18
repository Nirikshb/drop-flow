import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ResourceCard, typeMeta } from "../_components/resource-card";
import { TemplatePagesStrip } from "../_components/template-pages-strip";
import {
  formatDate,
  getRelatedResources,
  getResourceBySlug,
  resources,
} from "../_data/resources";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return { title: "Resource not found" };
  }

  return {
    title: resource.title,
    description: resource.excerpt,
  };
}

export default async function ResourceArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const meta = typeMeta[resource.type];
  const Icon = meta.icon;
  const related = getRelatedResources(resource.slug, 3);
  const headings = resource.body.flatMap((block, index) =>
    block.kind === "heading"
      ? [{ id: `section-${index}`, text: block.text }]
      : [],
  );
  const initials = resource.author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

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
        <div className="container-wide relative py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Button
                variant="link"
                size="xs"
                className="h-auto px-0 font-normal"
                render={<Link href="/resourcesnew" />}
              >
                Resources
              </Button>
              <ChevronRight className="size-3" aria-hidden="true" />
              <span>{resource.category}</span>
              <ChevronRight className="size-3" aria-hidden="true" />
              <span className="max-w-[16rem] truncate text-foreground">
                {resource.title}
              </span>
            </nav>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn("font-normal", meta.badgeClassName)}
              >
                <Icon aria-hidden="true" />
                {meta.label}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                {resource.category}
              </Badge>
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {resource.title}
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {resource.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 text-[11px] font-semibold text-white">
                  {initials}
                </span>
                <span className="text-foreground">{resource.author}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                {formatDate(resource.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4" aria-hidden="true" />
                {resource.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-wide grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
        <article className="mx-auto w-full max-w-2xl">
          {resource.body.map((block, index) => {
            if (block.kind === "heading") {
              return (
                <h2
                  key={index}
                  id={`section-${index}`}
                  className="mt-10 scroll-mt-24 text-balance text-2xl font-semibold tracking-tight first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.kind === "list") {
              return (
                <ul key={index} className="mt-5 space-y-2.5">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      <Check
                        className="mt-1 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p
                key={index}
                className="mt-5 text-sm leading-8 text-muted-foreground first:mt-0 sm:text-base"
              >
                {block.text}
              </p>
            );
          })}

          <div className="mt-12 flex flex-wrap gap-2 border-t pt-8">
            <Button render={<Link href="/resourcesnew" />}>
              <ArrowLeft aria-hidden="true" />
              All resources
            </Button>
            <Button
              variant="outline"
              render={<Link href="/changelognew" />}
            >
              View changelog
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-5">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              In this article
            </p>
            <nav aria-label="On this page" className="mt-3 flex flex-col gap-1">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="rounded border-l-2 border-transparent py-1.5 pl-3 text-sm leading-snug text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {heading.text}
                </a>
              ))}
            </nav>
            <div className="mt-5 border-t pt-5">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Written by
              </p>
              <p className="mt-2 text-sm font-medium">{resource.author}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Dropflow product and engineering team
              </p>
            </div>
          </div>
        </aside>
      </div>

      <Section className="border-t bg-muted/20">
        <SectionHeading
          eyebrow="Keep reading"
          title="Related resources"
          description="More from the Dropflow team on infrastructure, validation and storage."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ResourceCard key={item.slug} resource={item} />
          ))}
        </div>
      </Section>

      <section className="container-wide pb-18 sm:pb-24">
        <CtaBand
          eyebrow="Get started"
          title="Ready to put this into practice?"
          description="Spin up a project and try resumable uploads and validation yourself."
          primaryHref="/signupnew"
          primaryLabel="Create a project"
          secondaryHref="/resourcesnew"
          secondaryLabel="Back to resources"
        />
        <TemplatePagesStrip className="mt-6" />
      </section>
    </>
  );
}
