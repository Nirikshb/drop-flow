import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "./_components/comparison-table";
import { PricingFaq } from "./_components/pricing-faq";
import { PricingPlans } from "./_components/pricing-plans";
import { TemplatePages } from "./_components/template-pages";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Illustrative pricing for Dropflow's Free, Pro and Business plans, with a monthly and annual toggle, a full feature comparison and FAQs. Final pricing has not been published yet.",
};

const enterprisePoints = [
  "Custom upload volume and storage limits",
  "SSO / SAML and audit logging",
  "Dedicated success manager and SLAs",
  "Priority incident response",
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Simple, transparent pricing</Eyebrow>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Pricing that scales{" "}
                <span className="text-gradient">with your uploads</span>.
              </h1>
              <Badge variant="outline" className="font-normal">
                Illustrative
              </Badge>
            </div>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start free, grow into Pro, and move to Business when your team
              needs more room. Every figure on this page is a preview — final
              pricing has not been published, so treat the numbers as a shape,
              not an offer.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b bg-primary/5">
        <div className="container-wide py-2.5 text-xs text-muted-foreground">
          Illustrative — final pricing not published. No payment is collected
          anywhere in this application.
        </div>
      </section>

      <Section>
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Plans"
            title="Choose the plan that fits today"
            description="Three straightforward tiers. Switch the billing toggle to preview how annual pricing could look — the figures update instantly."
            align="center"
          />
          <PricingPlans />
        </div>
      </Section>

      <Section className="border-y bg-muted/20">
        <div className="flex flex-col gap-2">
          <SectionHeading
            eyebrow="Compare"
            title="Every feature, side by side"
            description="A full look at what each illustrative plan includes across uploads, storage, security, integrations and support."
          />
          <ComparisonTable />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            description="A few things teams ask before choosing a tier. Everything here reflects the illustrative nature of this preview."
          />
          <PricingFaq />
        </div>
      </Section>

      <section className="container-wide pb-4 sm:pb-6">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-8 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-cyan-500/[0.08]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-24 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <Eyebrow>
                <Sparkles className="size-3" aria-hidden="true" />
                Enterprise
              </Eyebrow>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Need more than Business?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Tell us what you are building and we will shape an illustrative
                plan around it — from custom limits to the controls your
                security team expects.
              </p>
              <ul className="mt-5 grid gap-2.5 text-sm sm:grid-cols-2">
                {enterprisePoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button render={<Link href="/contact-salesnew" />}>
                Contact sales
                <ArrowRight aria-hidden="true" />
              </Button>
              <p className="text-xs text-muted-foreground md:text-right">
                Illustrative only — no payment details are collected.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-14 sm:py-20">
        <CtaBand
          eyebrow="Get started"
          title="Start with the free tier"
          description="No credit card, no sales call. Create a project, make your first upload and see how Dropflow fits your workflow."
          primaryHref="/signupnew"
          primaryLabel="Get started free"
          secondaryHref="/contact-salesnew"
          secondaryLabel="Talk to sales"
        />
      </section>

      <TemplatePages />
    </>
  );
}
