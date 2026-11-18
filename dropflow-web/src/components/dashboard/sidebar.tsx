"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3Icon,
  CloudUploadIcon,
  FolderKanbanIcon,
  ImagesIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  UploadCloudIcon,
  type LucideIcon,
} from "lucide-react";
import { dashboardService } from "@/services";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatBytes } from "./format";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboardIcon }],
  },
  {
    title: "Manage",
    items: [
      { label: "Projects", href: "/dashboard/projects", icon: FolderKanbanIcon },
      { label: "Assets", href: "/dashboard/assets", icon: ImagesIcon },
      { label: "Uploads", href: "/dashboard/uploads", icon: UploadCloudIcon },
      { label: "API keys", href: "/dashboard/api-keys", icon: KeyRoundIcon },
    ],
  },
  {
    title: "Insights",
    items: [{ label: "Usage", href: "/dashboard/usage", icon: BarChart3Icon }],
  },
  {
    title: "Account",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings2Icon }],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const usageQuery = useQuery({
    queryKey: ["usage"],
    queryFn: () => dashboardService.getUsage(),
  });

  const usage = usageQuery.data;
  const percent = usage
    ? Math.min(
        100,
        Math.round((usage.storageBytes / Math.max(1, usage.limits.storageBytes)) * 100),
      )
    : 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <CloudUploadIcon className="size-4" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <div className="font-heading text-sm font-semibold">Dropflow</div>
          <div className="text-[10px] text-muted-foreground">Developer console</div>
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5"
        aria-label="Dashboard navigation"
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {section.title}
            </p>
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                  {active ? (
                    <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="space-y-2.5 rounded-xl bg-sidebar-accent/50 p-3 ring-1 ring-sidebar-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium">
              {usage ? `${usage.plan[0]!.toUpperCase()}${usage.plan.slice(1)} plan` : "Plan"}
            </span>
            <Link
              href="/pricing"
              onClick={onNavigate}
              className="text-xs font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              Upgrade
            </Link>
          </div>
          {usageQuery.isLoading ? (
            <Skeleton className="h-3 w-full" />
          ) : (
            <>
              <Progress value={percent} className="[&_[data-slot=progress-track]]:h-1.5" />
              <p className="text-[11px] text-muted-foreground tabular-nums">
                {formatBytes(usage?.storageBytes ?? 0)} of{" "}
                {formatBytes(usage?.limits.storageBytes ?? 0)} storage used
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
