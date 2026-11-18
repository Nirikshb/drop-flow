import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Wallet,
} from "lucide-react";

import { TemplatePagesStrip } from "../_components/template-pages-strip";
import { getJobBySlug, getRelatedJobs, jobs } from "../_data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eyebrow, Section } from "@/components/marketing/section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return { title: "Role not found" };
  }

  return {
    title: `${job.title} — Careers`,
    description: job.summary,
  };
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Check className="size-3 text-primary" aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const relatedJobs = getRelatedJobs(job.slug, 3);
  const applyHref = `/contact-salesnew?role=${encodeURIComponent(job.slug)}`;

  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-50"
        />
        <div className="container-wide relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="relative">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link href="/careersnew" className="hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-foreground">
                {job.title}
              </li>
            </ol>
          </nav>

          <div className="relative mt-8 max-w-4xl">
            <Eyebrow>{job.department}</Eyebrow>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-normal">
                <MapPin aria-hidden="true" />
                {job.location}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {job.workArrangement}
              </Badge>
              <Badge variant="outline" className="font-normal">
                <Clock3 aria-hidden="true" />
                {job.employmentType}
              </Badge>
              <Badge variant="outline" className="font-normal tabular-nums">
                <Wallet aria-hidden="true" />
                {job.compensation}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <TemplatePagesStrip current="/careersnew" />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
          <div className="min-w-0">
            <section>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                About the role
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {job.summary}
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                What you will do
              </h2>
              <div className="mt-5">
                <BulletList items={job.responsibilities} />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                What you will bring
              </h2>
              <div className="mt-5">
                <BulletList items={job.requirements} />
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Nice to have
              </h2>
              <div className="mt-5">
                <BulletList items={job.niceToHave} />
              </div>
            </section>

            <section className="mt-12 rounded-xl border bg-primary/5 p-6 sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight">
                Meet the team
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {job.team}
              </p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Ready to apply?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tell us a little about yourself and what draws you to this
                  role. We read every note.
                </p>
                <Button
                  className="mt-5 w-full"
                  render={<Link href={applyHref} />}
                >
                  Apply for this role
                  <ArrowRight aria-hidden="true" />
                </Button>
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                  Template preview — no application is submitted and no data is
                  collected.
                </p>
              </CardContent>
            </Card>

            <Link
              href="/careersnew#open-roles"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to all roles
            </Link>
          </aside>
        </div>
      </Section>

      {relatedJobs.length > 0 && (
        <Section className="border-t bg-muted/20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Keep looking</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Other open roles
              </h2>
            </div>
            <Button variant="link" render={<Link href="/careersnew#open-roles" />}>
              View all roles
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedJobs.map((role) => (
              <Link
                key={role.slug}
                href={`/careersnew/${role.slug}`}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card className="h-full transition-all group-hover:border-primary/40 group-hover:shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-sm leading-snug group-hover:text-primary">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="font-normal">
                        {role.department}
                      </Badge>
                      <Badge variant="outline" className="font-normal">
                        {role.workArrangement}
                      </Badge>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {role.location}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
