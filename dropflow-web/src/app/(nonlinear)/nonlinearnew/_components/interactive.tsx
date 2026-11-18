"use client";

import { useState } from "react";

export const planSteps = [
  {
    title: "Plan a week in 30 seconds",
    text: "Drag tasks onto your week. Nonlinear finds the right slots, defends focus blocks, and reshuffles when meetings move.",
  },
  {
    title: "Schedule without the back-and-forth",
    text: "Share one link. Nonlinear offers slots that protect deep work, dodge time-zone misery, and balance load across the team — without the endless email thread.",
  },
  {
    title: "Focus that actually holds",
    text: "Start a focus session and notifications go quiet, Slack waits, and your calendar defends the block until you are done.",
  },
  {
    title: "Sync across every surface",
    text: "The same data, the same keyboard shortcuts, the same surfaces — from a single afternoon to a full quarter.",
  },
];

export function PlanTabs() {
  const [active, setActive] = useState(0);
  return (
    <div className="nl-tabs">
      <div className="nl-tab-list" role="tablist" aria-label="How it works">
        {planSteps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={`nl-tab ${active === index ? "on" : ""}`}
            onClick={() => setActive(index)}
          >
            <span>0{index + 1}</span>
            {["Plan", "Schedule", "Focus", "Sync"][index]}
          </button>
        ))}
      </div>
      <div className="nl-panel" role="tabpanel">
        <div className="nl-panel-art" aria-hidden="true" />
        <h3 className="nl-h3">{planSteps[active]!.title}</h3>
        <p className="nl-card-text" style={{ marginTop: 12, maxWidth: 560 }}>
          {planSteps[active]!.text}
        </p>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "What is Nonlinear Calendar and how does it differ from other calendar apps?",
    a: "Nonlinear Calendar is a time-management workspace for product teams. It combines planning, focusing, scheduling links and an AI agent in one surface, so your calendar reflects how work actually gets shipped instead of just listing meetings.",
  },
  {
    q: "How does the AI agent handle reschedules?",
    a: "Aria watches for changes, proposes the smallest possible reshuffle, and sends updates to everyone involved. Low-stakes invites are accepted automatically when they fit your protected focus hours.",
  },
  {
    q: "Can I keep using Google Calendar or Linear?",
    a: "Yes. Nonlinear syncs both ways with the calendars and issue trackers your team already uses. Nothing has to be migrated on day one.",
  },
  {
    q: "Does it work across time zones?",
    a: "Scheduling links consider every participant's working hours and offer slots that avoid the worst early-morning or late-night meetings.",
  },
  {
    q: "Is there a free plan?",
    a: "The template shows an illustrative early-access launch. Pricing is not final and no payment is collected on this page.",
  },
  {
    q: "How do I get early access?",
    a: "Use the Get early access button above. This is a design-template preview, so the form does not transmit or store any data.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 840, margin: "0 auto" }}>
      {faqs.map((item, index) => (
        <div className="nl-faq-item" key={item.q}>
          <button
            type="button"
            className="nl-faq-q"
            aria-expanded={open === index}
            onClick={() => setOpen(open === index ? null : index)}
          >
            {item.q}
            <span aria-hidden="true" style={{ color: "#a78bfa" }}>
              {open === index ? "−" : "+"}
            </span>
          </button>
          {open === index && <p className="nl-faq-a">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
