import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function LoadingState({
  variant = "cards",
  count = 4,
  className,
}: {
  variant?: "cards" | "table" | "rows";
  count?: number;
  className?: string;
}) {
  if (variant === "table") {
    return (
      <div className={cn("space-y-2", className)} aria-label="Loading data" role="status">
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "rows") {
    return (
      <div className={cn("space-y-3", className)} role="status" aria-label="Loading data">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
      role="status"
      aria-label="Loading data"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
