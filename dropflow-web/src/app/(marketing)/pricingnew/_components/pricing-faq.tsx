"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Are these real prices?",
    answer:
      "No. Every number on this page is illustrative and exists to show the shape of the plans. Final pricing has not been published yet — check back later or talk to our sales team for updates.",
  },
  {
    question: "Does the annual discount actually apply at checkout?",
    answer:
      "The 20% annual saving shown by the toggle is a preview of how we intend to price yearly plans. This frontend does not process payments or collect any payment details, so there is nothing to charge today.",
  },
  {
    question: "What counts as an upload?",
    answer:
      "One completed asset created through the SDK or API. A cancelled, rejected or duplicate upload does not count against your monthly allowance.",
  },
  {
    question: "What happens if I hit a limit?",
    answer:
      "Uploads are rejected with a clear error and your existing assets stay available. Usage and limits are visible in the dashboard so you can plan ahead before you reach them.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "That is the intent. This page is a preview, so the exact mechanics of upgrades, downgrades and proration are not final yet. The illustrative tiers are designed to grow with you.",
  },
  {
    question: "Do you offer a free tier?",
    answer:
      "The illustrative Free plan is intended to make evaluation possible without a credit card. Create a project, make your first upload and explore the asset manager before you decide.",
  },
];

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        const questionId = `pricing-faq-q-${index}`;
        const answerId = `pricing-faq-a-${index}`;

        return (
          <div
            key={faq.question}
            className={cn(
              "rounded-xl border bg-card p-5 transition-colors",
              isOpen && "border-primary/40 bg-primary/[0.02]",
            )}
          >
            <h3>
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-base"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180 text-primary",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              hidden={!isOpen}
              className="mt-3 border-t pt-3"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
