"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What exactly does Dropflow replace?",
    answer:
      "It replaces the upload pipeline you would otherwise build and maintain: storage wiring, signed URLs, validation, progress, retries, asset records and usage tracking. You keep your product code; Dropflow owns the plumbing around file delivery.",
  },
  {
    question: "Do I need to change my backend?",
    answer:
      "No. Files travel directly from your user's browser to Dropflow-managed storage, so there is no proxy to run in your own infrastructure. Create a project, add the SDK to your frontend, and start uploading. Optional webhooks let you react to completed uploads when you need to.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Plans are based on storage and monthly upload volume, with a free tier for side projects and prototypes. There are no per-seat fees, and overages are visible in your dashboard before they become a surprise on an invoice.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Every project is isolated with its own keys, limits and asset namespace. Upload URLs are short-lived and scoped to a single file, buckets are never publicly listed, and API keys are stored as hashes and shown only once at creation.",
  },
  {
    question: "Can I migrate files we already have?",
    answer:
      "Yes. You can import existing assets through the API with their metadata and checksums intact, then use Dropflow's tagging and search from day one. Our team can help plan larger migrations on the Business plan.",
  },
  {
    question: "What happens when an upload fails?",
    answer:
      "Transient network failures are retried automatically with exponential backoff. If an upload still cannot complete, your UI receives a clear terminal state and the pending asset is cleaned up — no orphaned records, no stuck spinners.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="divide-y rounded-2xl border bg-card shadow-sm">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none sm:px-6"
              >
                <span className="text-sm font-medium sm:text-base">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-all duration-200",
                    isOpen && "rotate-45 border-primary bg-primary text-primary-foreground",
                  )}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              id={`faq-answer-${index}`}
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
