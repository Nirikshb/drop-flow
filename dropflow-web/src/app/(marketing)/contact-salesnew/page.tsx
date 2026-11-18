import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  Mail,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import { CtaBand } from "@/components/marketing/cta-band";
import { Eyebrow, Section, SectionHeading } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { ContactSalesForm } from "./_components/contact-sales-form";

export const metadata: Metadata = {
  title: "Contact sales",
  description:
    "Tell Dropflow about your team and upload workflow. This preview form validates locally and has no backend connected.",
};

const templatePages = [
  { href: "/homenew", label: "Home" },
  { href: "/pricingnew", label: "Pricing" },
  { href: "/integrationsnew", label: "Integrations" },
  { href: "/careersnew", label: "Careers" },
  { href: "/resourcesnew", label: "Resources" },
  { href: "/changelognew", label: "Changelog" },
  { href: "/aboutnew", label: "About" },
  { href: "/contact-salesnew", label: "Contact sales" },
  { href: "/privacypolicynew", label: "Privacy policy" },
  { href: "/termsnew", label: "Terms" },
  { href: "/cookiesnew", label: "Cookies" },
  { href: "/loginnew", label: "Log in" },
  { href: "/signupnew", label: "Sign up" },
];

function TemplatePagesStrip() {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Template pages
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {templatePages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded text-xs text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const processSteps = [
  {
    icon: ClipboardList,
    title: "Share your setup",
    description:
      "Tell us about your upload volume, file types and where files need to live.",
  },
  {
    icon: MessageSquareText,
    title: "Talk it through",
    description:
      "We map your workflow to the SDK and call out any trade-offs up front.",
  },
  {
    icon: CalendarCheck,
    title: "Get a tailored walkthrough",
    description:
      "See a live integration against your requirements, then decide at your pace.",
  },
  {
    icon: Sparkles,
    title: "Ship with support",
    description:
      "Roll out with clear limits and a documented path from prototype to production.",
  },
];

const faqs = [
  {
    question: "What happens after I submit this form?",
    answer:
      "Nothing yet. This is a preview with no sales inbox connected — the form validates locally and does not transmit or store your details. Connect a backend to receive submissions.",
  },
  {
    question: "Who is Dropflow for?",
    answer:
      "Teams that need reliable uploads without maintaining their own pipeline: product engineering teams, platform teams and agencies shipping on behalf of clients.",
  },
  {
    question: "Can you help with a migration?",
    answer:
      "The SDK is designed to drop into an existing app. In a real engagement we would review your current upload flow and suggest the smallest change that gets you to direct-to-storage transfers.",
  },
  {
    question: "Are the prices on the pricing page final?",
    answer:
      "No. The numbers there are illustrative and final pricing has not been published. Use the plan shapes to understand the options, not as a quote.",
  },
  {
    question: "Do you support security reviews?",
    answer:
      "Private-by-default design, project scoping and file restrictions are core to the product. For a real rollout, connect a backend here and we can discuss your specific review process.",
  },
];

const alternatives = [
  {
    icon: BookOpen,
    title: "Self-serve with the docs",
    description: "Quickstart, SDK reference and API notes, available any time.",
    href: "/docs",
    cta: "Open docs",
  },
  {
    icon: Mail,
    title: "General questions",
    description: "For non-sales questions, use the general contact page.",
    href: "/contact",
    cta: "Go to contact",
  },
  {
    icon: ClipboardList,
    title: "Compare plan shapes",
    description: "See the illustrative Free, Pro and Business plans side by side.",
    href: "/pricingnew",
    cta: "View pricing",
  },
];

function FormFallback() {
  return (
    <div className="flex min-h-[28rem] flex-col gap-5" aria-hidden="true">
      {["h-9", "h-9", "h-9", "h-9", "h-28", "h-9"].map((height, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className={`${height} w-full rounded-lg bg-muted/60`} />
        </div>
      ))}
    </div>
  );
}

export default function ContactSalesPage() {
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
          className="pointer-events-none absolute -top-40 left-1/3 size-[32rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 -right-40 size-[24rem] rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div className="container-wide relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Talk to sales</Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Let&apos;s find the right <span className="text-gradient">setup for your team.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tell us what you are building and how files move through your product.
              We will help you map it to Dropflow — no pressure, no guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* Form + process */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="rounded-xl border bg-card p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-tight">Tell us about your team</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                A few details help us make the conversation useful.
              </p>
            </div>
            <Suspense fallback={<FormFallback />}>
              <ContactSalesForm />
            </Suspense>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">How the conversation works</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A short, focused process — designed to respect your time.
            </p>
            <ol className="mt-8 flex flex-col gap-7">
              {processSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="size-4" aria-hidden="true" />
                    </span>
                    {index < processSteps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mt-2 w-px flex-1 bg-border"
                      />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-medium">
                      <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 rounded-lg border border-dashed bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
              This page is a template preview. The form validates in your browser but
              has no backend — connect one before using it to collect real interest.
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-y bg-muted/20">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="A few things people ask before reaching out."
        />
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
      </Section>

      {/* Alternate contact options */}
      <Section>
        <SectionHeading
          eyebrow="Other ways forward"
          title="Prefer to explore on your own?"
          description="These paths do not need a conversation to get started."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {alternatives.map((option) => (
            <div
              key={option.title}
              className="flex flex-col rounded-xl border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <option.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{option.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {option.description}
              </p>
              <Button
                variant="link"
                className="mt-4 h-auto justify-start p-0"
                render={<Link href={option.href} />}
              >
                {option.cta}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <CtaBand
          eyebrow="Ready when you are"
          title="Want to try it first?"
          description="Create a free project and make your first upload — no sales call required."
          primaryHref="/signupnew"
          primaryLabel="Start free"
          secondaryHref="/docs"
          secondaryLabel="Read the docs"
        />
      </Section>

      {/* Template pages */}
      <div className="border-t">
        <div className="container-wide py-8">
          <TemplatePagesStrip />
        </div>
      </div>
    </>
  );
}
