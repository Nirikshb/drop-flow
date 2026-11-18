import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 transition-colors hover:border-primary/40",
        className,
      )}
    >
      <div className="flex size-9 items-center justify-center rounded-md border bg-primary/5 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
