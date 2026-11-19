"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PEOPLE, type Progress, type Urgency } from "../_data/tasks";

export function SelectionCircle({
  selected,
  onToggle,
  label,
}: {
  selected: boolean;
  onToggle?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={(event) => {
        event.stopPropagation();
        onToggle?.();
      }}
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50",
        selected
          ? "border-[#7b61ff] bg-[#7b61ff] text-white"
          : "border-[#d4d4d4] bg-white hover:border-[#7b61ff]",
      )}
    >
      {selected ? (
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
          <path d="M2.5 6.2 4.8 8.5 9.5 3.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </button>
  );
}

export function ProgressIcon({ progress, className }: { progress: Progress; className?: string }) {
  if (progress === "Ongoing") {
    return (
      <svg viewBox="0 0 20 20" className={cn("size-4 shrink-0 text-[#7b61ff]", className)} aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={i}
            x1="10" y1="2.5" x2="10" y2="5.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity={0.35 + (i / 8) * 0.65}
            transform={`rotate(${i * 45} 10 10)`}
          />
        ))}
      </svg>
    );
  }
  if (progress === "Completed") {
    return (
      <svg viewBox="0 0 20 20" className={cn("size-4 shrink-0 text-[#3fba57]", className)} aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="currentColor" />
        <path d="M6 10.2 8.7 12.9 14 7.6" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (progress === "In review") {
    return (
      <svg viewBox="0 0 20 20" className={cn("size-4 shrink-0 text-[#43b4ff]", className)} aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="currentColor" />
        <path d="M10 5.5V10l3 1.8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className={cn("size-4 shrink-0 text-[#9a9a9a]", className)} aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path d="M10 9v5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="6.4" r="0.9" fill="white" />
    </svg>
  );
}

export function UrgencyBars({ urgency, className }: { urgency: Urgency; className?: string }) {
  const color = urgency === "Critical" ? "#ef4444" : urgency === "Moderate" ? "#f59e0b" : "#3fba57";
  const count = urgency === "Critical" ? 3 : urgency === "Moderate" ? 2 : 1;
  return (
    <span className={cn("inline-flex h-4 items-end gap-[2px]", className)} title={urgency}>
      {[5, 8, 11].map((h, i) => (
        <span
          key={h}
          style={{ height: h, backgroundColor: i < count ? color : `${color}35` }}
          className="w-[2px] rounded-[1px]"
        />
      ))}
    </span>
  );
}

export function Avatar({
  initials,
  name,
  tone = "bg-[#e5e5e5] text-[#5b5b5b]",
  className,
}: {
  initials: string;
  name: string;
  tone?: string;
  className?: string;
}) {
  return (
    <span
      title={name}
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full text-[9px] font-semibold leading-none ring-1 ring-white",
        tone,
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function AvatarStack({ ids, className }: { ids: string[]; className?: string }) {
  return (
    <span className={cn("flex items-center -space-x-1", className)}>
      {ids.map((id) => {
        const person = PEOPLE.find((p) => p.id === id);
        if (!person) return null;
        return <Avatar key={id} initials={person.initials} name={person.name} tone={person.tone} />;
      })}
    </span>
  );
}

export function TagPill({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "orange" | "green";
  children?: ReactNode;
}) {
  const tones = {
    blue: "bg-[#e5f1ff] text-[#2eaadc]",
    orange: "bg-[#fff3e5] text-[#dc682e]",
    green: "bg-[#e5ffef] text-[#3fba57]",
  } as const;
  return (
    <span className={cn("inline-flex h-[22px] items-center rounded-[6px] px-2 text-xs font-medium", tones[tone])}>
      {label}
    </span>
  );
}
