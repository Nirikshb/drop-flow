import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}

export function CtaBand({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: CtaBandProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-8 sm:p-10",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={primaryHref} />}>
            {primaryLabel}
            <ArrowRight aria-hidden="true" />
          </Button>
          {secondaryHref && secondaryLabel && (
            <Button
              variant="outline"
              render={<Link href={secondaryHref} />}
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
