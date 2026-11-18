import type { UsageSummary } from "@/types";
import { cn } from "@/lib/utils";
import { formatBytes, formatNumber } from "./format";

type MonthlyPoint = UsageSummary["monthly"][number];

export function UsageChart({
  data,
  metric = "uploads",
  className,
  compact = false,
}: {
  data: MonthlyPoint[];
  metric?: "uploads" | "bytes";
  className?: string;
  compact?: boolean;
}) {
  if (data.length === 0) return null;

  const values = data.map((point) => point[metric]);
  const max = Math.max(...values, 1);
  const format = metric === "bytes" ? formatBytes : formatNumber;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-end gap-2 border-b border-border sm:gap-4",
          compact ? "h-40" : "h-56 sm:h-72",
        )}
      >
        {data.map((point, index) => {
          const value = point[metric];
          const height = Math.min(86, Math.max(3, Math.round((value / max) * 86)));
          return (
            <div
              key={`${point.month}-${index}`}
              className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
              title={`${point.month}: ${format(value)}`}
            >
              <div
                className={cn(
                  "w-full max-w-14 rounded-t-md bg-gradient-to-t from-primary/45 to-primary transition-all duration-300 group-hover:from-primary/70 group-hover:to-primary",
                  index === data.length - 1 && "from-primary/70",
                )}
                style={{ height: `${height}%` }}
              />
              <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background opacity-0 whitespace-nowrap transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {format(value)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-4">
        {data.map((point, index) => (
          <div
            key={`${point.month}-label-${index}`}
            className="min-w-0 flex-1 text-center text-xs text-muted-foreground"
          >
            {point.month}
          </div>
        ))}
      </div>
    </div>
  );
}
