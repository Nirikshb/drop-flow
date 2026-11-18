import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  loading?: boolean;
  className?: string;
}

const DELTA_TONES = {
  positive: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  negative: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  delta,
  deltaTone = "neutral",
  loading = false,
  className,
}: StatCardProps) {
  return (
    <Card size="sm" className={cn("gap-3", className)}>
      <div className="flex items-start justify-between gap-2 px-(--card-spacing)">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      {loading ? (
        <div className="space-y-2 px-(--card-spacing) pb-1">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      ) : (
        <div className="space-y-1 px-(--card-spacing) pb-1">
          <div className="font-heading text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </div>
          <div className="flex min-h-5 flex-wrap items-center gap-2">
            {delta ? (
              <span
                className={cn(
                  "inline-flex h-5 items-center rounded-4xl px-2 text-xs font-medium",
                  DELTA_TONES[deltaTone],
                )}
              >
                {delta}
              </span>
            ) : null}
            {hint ? (
              <span className="text-xs text-muted-foreground">{hint}</span>
            ) : null}
          </div>
        </div>
      )}
    </Card>
  );
}
