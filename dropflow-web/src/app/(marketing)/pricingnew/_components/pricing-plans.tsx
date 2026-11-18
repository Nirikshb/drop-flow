"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

type Plan = {
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "For side projects, prototypes and first experiments.",
    features: [
      "5 GB storage",
      "10,000 uploads / month",
      "2 projects",
      "10 MB max file size",
      "Community documentation",
    ],
    cta: "Start free",
    href: "/signupnew",
    featured: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    description: "For products with a steady stream of uploads.",
    features: [
      "50 GB storage",
      "250,000 uploads / month",
      "10 projects",
      "100 MB max file size",
      "Custom MIME allowlist",
      "Webhooks & email support",
    ],
    cta: "Get started",
    href: "/signupnew",
    featured: true,
  },
  {
    name: "Business",
    monthlyPrice: 99,
    description: "For teams running Dropflow at larger scale.",
    features: [
      "250 GB storage",
      "2,000,000 uploads / month",
      "Unlimited projects",
      "1 GB max file size",
      "Priority support",
      "Audit log & SSO readiness",
    ],
    cta: "Contact sales",
    href: "/contact-salesnew",
    featured: false,
  },
];

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const isAnnual = billing === "annual";

  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 rounded-full border bg-card p-1 shadow-sm"
        >
          <button
            type="button"
            aria-pressed={!isAnnual}
            onClick={() => setBilling("monthly")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              !isAnnual
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={isAnnual}
            onClick={() => setBilling("annual")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isAnnual
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Annually
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                isAnnual
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary/10 text-primary",
              )}
            >
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Prices are illustrative. Annual shows a preview 20% discount — no
          payment is collected anywhere.
        </p>
      </div>

      <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const isFree = plan.monthlyPrice === 0;
          const amount = isFree
            ? "$0"
            : isAnnual
              ? `$${(plan.monthlyPrice * 0.8).toFixed(2)}`
              : `$${plan.monthlyPrice}`;
          const cadence = isFree ? "forever" : "mo";
          const note = isFree
            ? "Free forever — no card required"
            : isAnnual
              ? `Save 20% · $${(plan.monthlyPrice * 12 * 0.8).toFixed(2)} billed yearly`
              : "Billed monthly";

          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7",
                plan.featured &&
                  "border-primary shadow-lg ring-1 ring-primary/25",
              )}
            >
              {plan.featured && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              )}

              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {plan.name}
                </h3>
                {plan.featured && (
                  <Badge className="border-transparent bg-primary/10 text-primary hover:bg-primary/10">
                    Most popular
                  </Badge>
                )}
              </div>
              <p className="mt-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-7 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight">
                  {amount}
                </span>
                {!isFree && isAnnual && (
                  <span className="text-sm font-normal text-muted-foreground line-through">
                    ${plan.monthlyPrice}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  / {cadence}
                </span>
              </div>
              <p className="mt-1.5 min-h-5 text-xs text-muted-foreground">
                {note}
              </p>

              <ul className="mt-7 flex flex-1 flex-col gap-3.5 border-t pt-6 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
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
          );
        })}
      </div>
    </div>
  );
}
