import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Minus } from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Illustrative pricing for Dropflow's Free, Pro and Business plans. Final pricing has not been published yet.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For side projects, prototypes and evaluation.",
    features: [
      "5 GB storage",
      "10k uploads / month",
      "2 projects",
      "10 MB max file size",
      "Community documentation",
    ],
    cta: "Start free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    description: "For products with a steady stream of users.",
    features: [
      "50 GB storage",
      "250k uploads / month",
      "10 projects",
      "100 MB max file size",
      "Email support",
    ],
    cta: "Get started",
    href: "/signup",
    featured: true,
  },
  {
    name: "Business",
    price: "$99",
    cadence: "per month",
    description: "For teams operating at larger scale.",
    features: [
      "250 GB storage",
      "2M uploads / month",
      "Unlimited projects",
      "1 GB max file size",
      "Priority support",
    ],
    cta: "Contact us",
    href: "/contact",
    featured: false,
  },
];

const comparison: { label: string; free: string; pro: string; business: string }[] = [
  { label: "Storage", free: "5 GB", pro: "50 GB", business: "250 GB" },
  { label: "Uploads / month", free: "10,000", pro: "250,000", business: "2,000,000" },
  { label: "Projects", free: "2", pro: "10", business: "Unlimited" },
  { label: "Max file size", free: "10 MB", pro: "100 MB", business: "1 GB" },
  { label: "Asset history", free: "30 days", pro: "1 year", business: "Unlimited" },
  { label: "Custom MIME allowlist", free: "—", pro: "✓", business: "✓" },
  { label: "Priority support", free: "—", pro: "—", business: "✓" },
];

const faqs = [
  {
    question: "Are these real prices?",
    answer:
      "No. Every number on this page is illustrative and exists to show the shape of the plans. Final pricing has not been published yet — check back later or contact us for updates.",
  },
  {
    question: "What counts as an upload?",
    answer:
      "One completed asset created through the SDK or API. A cancelled or rejected upload does not count against your monthly allowance.",
  },
  {
    question: "What happens if I hit a limit?",
    answer:
      "Uploads are rejected with a clear error and your existing assets stay available. Usage and limits are visible in the dashboard so you can plan ahead.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "That is the intent. This page is a preview, so the mechanics of upgrades and downgrades are not final yet.",
  },
  {
    question: "Do you offer a free tier?",
    answer:
      "The illustrative Free plan is intended to make evaluation possible without a credit card. No payment is collected by this frontend.",
  },
];

function ComparisonCell({ value }: { value: string }) {
  if (value === "✓") {
    return <Check className="size-4 text-primary" aria-label="Included" />;
  }
  if (value === "—") {
    return <Minus className="size-4 text-muted-foreground" aria-label="Not included" />;
  }
  return <span>{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Pricing, at a glance.
              </h1>
              <Badge variant="outline" className="font-normal">
                Illustrative
              </Badge>
            </div>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              These plans and numbers are a preview. Final pricing has not been
              published — do not treat the figures below as an offer.
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

      <section className="container-wide py-16 sm:py-24">
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-6 sm:p-7",
                plan.featured && "border-primary shadow-md ring-1 ring-primary/20",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                {plan.featured && (
                  <Badge className="border-transparent bg-primary/10 text-primary hover:bg-primary/10">
                    Popular
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-xs text-muted-foreground">/ {plan.cadence}</span>
              </div>
              <ul className="mt-7 flex flex-1 flex-col gap-3.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={plan.featured ? "default" : "outline"}
                render={<Link href={plan.href} />}
              >
                {plan.cta}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Compare the plans
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            All figures are illustrative placeholders.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-[540px] text-sm">
              <caption className="sr-only">Illustrative plan comparison</caption>
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th scope="col" className="px-4 py-3 font-medium">Feature</th>
                  <th scope="col" className="px-4 py-3 font-medium">Free</th>
                  <th scope="col" className="px-4 py-3 font-medium">Pro</th>
                  <th scope="col" className="px-4 py-3 font-medium">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-4 py-3 text-left font-normal text-muted-foreground">
                      {row.label}
                    </th>
                    <td className="px-4 py-3"><ComparisonCell value={row.free} /></td>
                    <td className="px-4 py-3"><ComparisonCell value={row.pro} /></td>
                    <td className="px-4 py-3"><ComparisonCell value={row.business} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border bg-card p-4 open:bg-muted/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-wide pb-20 sm:pb-28">
        <CtaBand
          title="Start with the free tier"
          description="No credit card, no sales call. Create a project and make your first upload."
          primaryHref="/signup"
          primaryLabel="Get started"
          secondaryHref="/contact"
          secondaryLabel="Ask a question"
        />
      </section>
    </>
  );
}
