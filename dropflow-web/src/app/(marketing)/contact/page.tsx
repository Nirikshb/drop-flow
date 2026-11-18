import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Mail } from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import { Eyebrow } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about Dropflow. Note that the support inbox is not configured in this environment.",
};

const faqs = [
  {
    question: "Where does my message go?",
    answer:
      "Nowhere. There is no support inbox configured in this environment, and submitting the form only shows a notification. Nothing is sent or stored.",
  },
  {
    question: "Where can I find setup instructions?",
    answer: (
      <>
        The{" "}
        <Link href="/docs" className="text-primary underline-offset-4 hover:underline">
          documentation
        </Link>{" "}
        has a quickstart, SDK reference and API notes. The{" "}
        <Link href="/how-it-works" className="text-primary underline-offset-4 hover:underline">
          integration guide
        </Link>{" "}
        walks through the same steps in order.
      </>
    ),
  },
  {
    question: "Is pricing final?",
    answer:
      "No. All numbers shown are illustrative and final pricing has not been published.",
  },
  {
    question: "How do I report a problem with this site?",
    answer:
      "This frontend is a preview. For a real support channel, an inbox would need to be configured by the operator first.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="container-wide relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Questions? We&apos;d like to hear them.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Use the form below to draft a message. Be aware that no support
              inbox is connected here — submission will not deliver anything.
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Mail className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Send a message</h2>
          </div>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">Common questions</h2>
          <div className="mt-6 flex flex-col gap-3">
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
                <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-dashed p-4 text-xs leading-relaxed text-muted-foreground">
            For documentation and integration questions, the{" "}
            <Link href="/docs" className="text-primary underline-offset-4 hover:underline">
              docs
            </Link>{" "}
            are the fastest path to an answer.
          </div>
        </div>
      </section>
    </>
  );
}
