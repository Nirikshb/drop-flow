"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Code2,
  Megaphone,
  Package,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Role = {
  id: string;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  headline: string;
  description: string;
  benefits: string[];
  stat: { value: string; label: string };
};

const roles: Role[] = [
  {
    id: "product",
    label: "Product",
    icon: Package,
    eyebrow: "For product teams",
    headline: "Launch upload flows without a backend project",
    description:
      "Ship a polished, on-brand upload experience in an afternoon. Set your limits once and let Dropflow handle every state from selection to success.",
    benefits: [
      "Drag-and-drop UI primitives",
      "Per-file progress out of the box",
      "Validation rules without server code",
      "Asset URLs ready for your product",
    ],
    stat: { value: "10 min", label: "to first upload" },
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: Code2,
    eyebrow: "For engineering teams",
    headline: "Delete the upload code you never wanted to write",
    description:
      "No signed-URL plumbing, retry queues or polling loops. One typed SDK covers the entire lifecycle with predictable, testable behavior.",
    benefits: [
      "Typed, promise-based SDK",
      "Direct-to-storage, no proxy",
      "Retries and backoff built in",
      "Webhooks and event hooks",
    ],
    stat: { value: "0", label: "servers to maintain" },
  },
  {
    id: "operations",
    label: "Operations",
    icon: Settings2,
    eyebrow: "For operations teams",
    headline: "Keep storage sane and costs predictable",
    description:
      "See every asset, tag and byte in one place. Spot anomalies early and enforce retention policies without chasing an engineer.",
    benefits: [
      "Usage and storage dashboards",
      "Anomaly alerts on spikes",
      "Auto-tagging and instant search",
      "Lifecycle and retention controls",
    ],
    stat: { value: "38%", label: "less storage waste" },
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    eyebrow: "For marketing teams",
    headline: "Move campaigns faster with assets ready to go",
    description:
      "Drop in creative, get instant organized URLs and tags, and keep every file discoverable across the team — no designer handoff required.",
    benefits: [
      "Instant shareable asset URLs",
      "Automatic file tagging",
      "One organized asset library",
      "No handoffs just to upload a file",
    ],
    stat: { value: "2×", label: "faster asset turnaround" },
  },
];

export function RoleTabs() {
  const [active, setActive] = React.useState(0);
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const role = roles[active];
  const Icon = role.icon;

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % roles.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + roles.length) % roles.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = roles.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="rounded-2xl border bg-card p-2 shadow-sm">
      <div
        role="tablist"
        aria-label="Dropflow by team"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {roles.map((item, index) => {
          const TabIcon = item.icon;
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`role-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="role-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-primary/30 bg-primary/10 text-primary shadow-sm"
                  : "border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <TabIcon className="size-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="role-panel"
        aria-labelledby={`role-tab-${role.id}`}
        className="mt-2 rounded-xl bg-gradient-to-br from-primary/5 via-muted/40 to-muted/30 p-6 sm:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl border bg-background text-primary shadow-sm">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {role.eyebrow}
              </p>
            </div>
            <h3 className="mt-6 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {role.headline}
            </h3>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {role.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <p className="text-3xl font-semibold tracking-tight text-gradient">
                {role.stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{role.stat.label}</p>
            </div>
          </div>

          <div className="rounded-xl border bg-background/80 p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What you get
            </p>
            <ul className="mt-4 grid gap-3">
              {role.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <Link
              href="/signupnew"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Get started with Dropflow
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
