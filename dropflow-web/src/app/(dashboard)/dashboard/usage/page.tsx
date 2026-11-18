"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3Icon,
  FolderKanbanIcon,
  HardDriveIcon,
  ImagesIcon,
  InfoIcon,
  UploadCloudIcon,
  WebhookIcon,
} from "lucide-react";
import { dashboardService } from "@/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ErrorState } from "@/components/dashboard/error-state";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { formatBytes, formatNumber } from "@/components/dashboard/format";
import { cn } from "@/lib/utils";

interface LimitRow {
  label: string;
  current: number;
  limit: number;
  format: (value: number) => string;
}

function LimitsTable({ rows, note }: { rows: LimitRow[]; note: string }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {rows.map((row) => {
          const percent = Math.min(
            100,
            Math.round((row.current / Math.max(1, row.limit)) * 100),
          );
          const color =
            percent > 80
              ? "bg-destructive"
              : percent > 60
                ? "bg-amber-500"
                : "bg-primary";
          return (
            <div key={row.label} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {row.format(row.current)} / {row.format(row.limit)}
                  <span className="ml-2 font-medium text-foreground">{percent}%</span>
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={`${row.label} usage`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={cn("h-full rounded-full transition-all", color)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

export default function UsagePage() {
  const [metric, setMetric] = useState<"uploads" | "bytes">("uploads");

  const usageQuery = useQuery({
    queryKey: ["usage"],
    queryFn: () => dashboardService.getUsage(),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });
  const assetsQuery = useQuery({
    queryKey: ["assets"],
    queryFn: () => dashboardService.listAssets(),
  });

  const usage = usageQuery.data;
  const lastMonth = usage?.monthly.at(-1);

  if (usageQuery.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingState />
        <LoadingState variant="rows" count={6} />
      </div>
    );
  }

  if (usageQuery.isError || !usage) {
    return (
      <div className="space-y-6">
        <ErrorState onRetry={() => void usageQuery.refetch()} />
      </div>
    );
  }

  const largestAsset = (assetsQuery.data ?? []).reduce(
    (max, asset) => Math.max(max, asset.sizeBytes),
    0,
  );

  const rows: LimitRow[] = [
    {
      label: "Storage",
      current: usage.storageBytes,
      limit: usage.limits.storageBytes,
      format: formatBytes,
    },
    {
      label: "Monthly uploads",
      current: lastMonth?.uploads ?? 0,
      limit: usage.limits.monthlyUploads,
      format: formatNumber,
    },
    {
      label: "Projects",
      current: projectsQuery.data?.length ?? 0,
      limit: usage.limits.projects,
      format: formatNumber,
    },
    {
      label: "Max file size",
      current: largestAsset,
      limit: usage.limits.maxFileSize,
      format: formatBytes,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usage"
        description={`Your ${usage.plan} plan at a glance — storage, uploads, assets and requests.`}
        actions={
          <Badge variant="secondary" className="capitalize">
            {usage.plan} plan
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Storage"
          value={formatBytes(usage.storageBytes)}
          icon={HardDriveIcon}
          hint={`of ${formatBytes(usage.limits.storageBytes)}`}
        />
        <StatCard
          label="Assets"
          value={formatNumber(usage.assetCount)}
          icon={ImagesIcon}
          hint="Currently stored"
        />
        <StatCard
          label="Uploads"
          value={formatNumber(usage.uploadCount)}
          icon={UploadCloudIcon}
          hint="Successful uploads"
        />
        <StatCard
          label="Requests"
          value={formatNumber(usage.requestCount)}
          icon={WebhookIcon}
          hint="Authenticated API calls"
        />
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle>Monthly usage</CardTitle>
            <p className="text-xs text-muted-foreground">Last {usage.monthly.length} months</p>
          </div>
          <div className="flex items-center rounded-lg bg-muted p-[3px]" role="group" aria-label="Chart metric">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-pressed={metric === "uploads"}
              onClick={() => setMetric("uploads")}
              className={cn(metric === "uploads" && "bg-background shadow-sm")}
            >
              Uploads
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-pressed={metric === "bytes"}
              onClick={() => setMetric("bytes")}
              className={cn(metric === "bytes" && "bg-background shadow-sm")}
            >
              Bytes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {usage.monthly.length === 0 ? (
            <EmptyState
              compact
              icon={BarChart3Icon}
              title="No monthly data"
              description="Usage will appear here after your first upload."
            />
          ) : (
            <UsageChart data={usage.monthly} metric={metric} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan limits</CardTitle>
        </CardHeader>
        <CardContent>
          <LimitsTable
            rows={rows}
            note="Bars turn amber above 60% and red above 80% of the plan limit."
          />
        </CardContent>
      </Card>

      <Alert>
        <InfoIcon />
        <div className="space-y-1">
          <AlertTitle>How usage is counted</AlertTitle>
          <AlertDescription>
            Storage is the sum of bytes for assets currently retained, including
            completed uploads. Monthly uploads count successful uploads within the
            current calendar month. Requests count authenticated API calls made by
            your projects. Limits are evaluated against the active plan and reset at
            the start of each billing period.
          </AlertDescription>
        </div>
      </Alert>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FolderKanbanIcon className="size-3.5" />
        Project and asset values are read live from the dashboard service.
      </div>
    </div>
  );
}
