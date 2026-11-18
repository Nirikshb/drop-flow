import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3, FileText, Megaphone, Newspaper } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { formatDate, type Resource, type ResourceType } from "../_data/resources";

export interface TypeMeta {
  label: ResourceType;
  icon: LucideIcon;
  badgeClassName: string;
  artworkClassName: string;
}

/** Shared visual language for resource types, used on cards and article headers. */
export const typeMeta: Record<ResourceType, TypeMeta> = {
  Report: {
    label: "Report",
    icon: FileText,
    badgeClassName: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    artworkClassName: "from-sky-500/15 via-sky-500/5 to-transparent",
  },
  News: {
    label: "News",
    icon: Newspaper,
    badgeClassName:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    artworkClassName: "from-emerald-500/15 via-emerald-500/5 to-transparent",
  },
  Announcement: {
    label: "Announcement",
    icon: Megaphone,
    badgeClassName:
      "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    artworkClassName: "from-violet-500/15 via-violet-500/5 to-transparent",
  },
  Guide: {
    label: "Guide",
    icon: BookOpen,
    badgeClassName:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    artworkClassName: "from-amber-500/15 via-amber-500/5 to-transparent",
  },
};

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const meta = typeMeta[resource.type];
  const Icon = meta.icon;

  return (
    <Link
      href={`/resourcesnew/${resource.slug}`}
      className={cn(
        "group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <Card className="h-full gap-0 py-0 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/30">
        <div
          className={cn(
            "relative flex h-24 items-center justify-center overflow-hidden rounded-t-xl border-b bg-gradient-to-br",
            meta.artworkClassName,
          )}
        >
          <div
            aria-hidden="true"
            className="grid-pattern pointer-events-none absolute inset-0 opacity-50"
          />
          <div className="relative flex size-11 items-center justify-center rounded-xl border bg-card/85 text-primary shadow-sm backdrop-blur">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("font-normal", meta.badgeClassName)}
            >
              {meta.label}
            </Badge>
            <span className="text-xs text-muted-foreground">{resource.category}</span>
          </div>

          <h3 className="mt-3 text-balance text-base leading-snug font-semibold transition-colors group-hover:text-primary">
            {resource.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {resource.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
            <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span>{formatDate(resource.date)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3" aria-hidden="true" />
                {resource.readTime}
              </span>
            </span>
            <ArrowUpRight
              className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
