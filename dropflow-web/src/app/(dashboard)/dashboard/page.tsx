"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity as ActivityLucideIcon,
  FolderKanbanIcon,
  HardDriveIcon,
  ImagesIcon,
  UploadCloudIcon,
  WebhookIcon,
} from "lucide-react";
import { dashboardService } from "@/services";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { FileIconBadge } from "@/components/dashboard/file-icon";
import { ActivityIcon, StatusBadge } from "@/components/dashboard/status-badge";
import { ErrorState } from "@/components/dashboard/error-state";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import {
  formatBytes,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "@/components/dashboard/format";

function SectionHeading({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-heading text-sm font-semibold text-foreground">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default function OverviewPage() {
  const [greeting, setGreeting] = useState("Good morning");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening",
    );
    setToday(
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(now),
    );
  }, []);

  const usageQuery = useQuery({
    queryKey: ["usage"],
    queryFn: () => dashboardService.getUsage(),
  });
  const assetsQuery = useQuery({
    queryKey: ["assets"],
    queryFn: () => dashboardService.listAssets(),
  });
  const activityQuery = useQuery({
    queryKey: ["activity"],
    queryFn: () => dashboardService.getActivity(),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => dashboardService.getCurrentUser(),
  });

  const usage = usageQuery.data;
  const assets = assetsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const activity = activityQuery.data ?? [];

  const recentAssets = useMemo(
    () =>
      [...assets]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [assets],
  );

  const lastMonth = usage?.monthly.at(-1);
  const storagePercent = usage
    ? Math.min(
        100,
        Math.round((usage.storageBytes / Math.max(1, usage.limits.storageBytes)) * 100),
      )
    : 0;

  const projectName = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.name ?? "Unknown";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting}${meQuery.data?.name ? `, ${meQuery.data.name}` : ""}`}
        description={
          today
            ? `${today} — here is what is happening across your workspace.`
            : "Here is what is happening across your workspace."
        }
      />

      <section aria-label="Key metrics">
        {usageQuery.isLoading ? (
          <LoadingState count={4} />
        ) : usageQuery.isError || !usage ? (
          <ErrorState
            message="We couldn't load your usage summary."
            onRetry={() => void usageQuery.refetch()}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Storage used"
              value={formatBytes(usage.storageBytes)}
              icon={HardDriveIcon}
              hint={`${storagePercent}% of ${formatBytes(usage.limits.storageBytes)} plan`}
            />
            <StatCard
              label="Total assets"
              value={formatNumber(usage.assetCount)}
              icon={ImagesIcon}
              hint="Stored across all projects"
            />
            <StatCard
              label="Uploads this month"
              value={formatNumber(lastMonth?.uploads ?? 0)}
              icon={UploadCloudIcon}
              hint={lastMonth ? `${lastMonth.month} — current month` : "No monthly data"}
              delta={lastMonth ? "+this month" : undefined}
              deltaTone="positive"
            />
            <StatCard
              label="Requests"
              value={formatNumber(usage.requestCount)}
              icon={WebhookIcon}
              hint="API requests to date"
            />
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
            <div className="space-y-1">
              <CardTitle>Upload activity</CardTitle>
              <p className="text-xs text-muted-foreground">Monthly uploads over the last 6 months</p>
            </div>
            <Badge variant="secondary">
              {usage?.monthly.length ?? 0} months
            </Badge>
          </CardHeader>
          <CardContent>
            {usageQuery.isLoading ? (
              <LoadingState variant="rows" count={4} />
            ) : usageQuery.isError || !usage ? (
              <ErrorState onRetry={() => void usageQuery.refetch()} />
            ) : usage.monthly.length === 0 ? (
              <EmptyState
                compact
                title="No upload activity yet"
                description="Uploads will appear here once your SDK starts sending files."
                icon={UploadCloudIcon}
              />
            ) : (
              <UsageChart data={usage.monthly} metric="uploads" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityQuery.isLoading ? (
              <LoadingState variant="rows" count={4} className="[&>div]:flex" />
            ) : activityQuery.isError ? (
              <ErrorState onRetry={() => void activityQuery.refetch()} />
            ) : activity.length === 0 ? (
              <EmptyState compact title="No activity yet" icon={ActivityLucideIcon} />
            ) : (
              <ul className="space-y-3">
                {activity.slice(0, 5).map((event) => (
                  <li key={event.id} className="flex gap-3">
                    <ActivityIcon type={event.type} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug text-foreground">
                        {event.description}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatRelativeTime(event.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <section>
        <SectionHeading title="Recent uploads" href="/dashboard/assets" />
        <Card>
          <CardContent className="px-0">
            {assetsQuery.isLoading ? (
              <LoadingState variant="table" count={4} className="px-4" />
            ) : assetsQuery.isError ? (
              <ErrorState
                className="m-4"
                onRetry={() => void assetsQuery.refetch()}
              />
            ) : recentAssets.length === 0 ? (
              <EmptyState
                compact
                icon={UploadCloudIcon}
                title="No uploads yet"
                description="Your most recently uploaded assets will show up here."
                action={
                  <Link
                    href="/dashboard/uploads"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Go to uploads
                  </Link>
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="hidden md:table-cell">Project</TableHead>
                    <TableHead className="hidden sm:table-cell">Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <FileIconBadge mimeType={asset.mimeType} />
                          <span className="max-w-48 truncate font-medium">
                            {asset.originalFilename}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground">
                        {asset.mimeType}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatBytes(asset.sizeBytes)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {projectName(asset.projectId)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {formatDate(asset.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionHeading title="Projects" href="/dashboard/projects" linkLabel="Manage projects" />
        {projectsQuery.isLoading ? (
          <LoadingState count={3} />
        ) : projectsQuery.isError ? (
          <ErrorState onRetry={() => void projectsQuery.refetch()} />
        ) : projects.length === 0 ? (
          <EmptyState
            compact
            icon={FolderKanbanIcon}
            title="No projects yet"
            description="Create a project to start accepting uploads."
            action={
              <Link
                href="/dashboard/projects"
                className="text-xs font-medium text-primary hover:underline"
              >
                Create a project
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-medium">
                      {project.name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      /{project.slug}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {
                      assets.filter((asset) => asset.projectId === project.id)
                        .length
                    }{" "}
                    assets
                  </span>
                  <span>Max {formatBytes(project.maxFileSize)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
