"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Dropflow, UploadCancelledError } from "@dropflow/sdk";
import {
  CheckCircle2Icon,
  CloudUploadIcon,
  RotateCcwIcon,
  UploadCloudIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { UploadItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { FileIconBadge } from "@/components/dashboard/file-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatBytes, mimeFromFilename } from "@/components/dashboard/format";
import { dashboardService } from "@/services";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";
const MAX_CONCURRENT = 2;

type QueueItem = UploadItem & {
  file?: File;
  assetUrl?: string;
};

function newId(): string {
  return `upl_${crypto.randomUUID()}`;
}

export default function UploadsPage() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controllers = useRef<Map<string, AbortController>>(new Map());

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });
  const activeProject = projectsQuery.data?.[0];

  const patch = useCallback((id: string, changes: Partial<QueueItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }, []);

  const startUpload = useCallback(
    async (id: string) => {
      const item = items.find((entry) => entry.id === id);
      if (!item?.file || !activeProject?.publicKey) return;

      const controller = new AbortController();
      controllers.current.set(id, controller);
      patch(id, { status: "uploading", progress: 0, error: undefined });

      try {
        const client = new Dropflow({
          publicKey: activeProject.publicKey,
          baseUrl: API_URL,
        });
        const asset = await client.upload(item.file, {
          signal: controller.signal,
          retries: 2,
          onProgress: (progress) => {
            patch(id, { progress: Math.round(progress.percentage) });
          },
        });
        patch(id, {
          status: "completed",
          progress: 100,
          assetId: asset.id,
          assetUrl: asset.url,
        });
        queryClient.invalidateQueries({ queryKey: ["assets"] });
        queryClient.invalidateQueries({ queryKey: ["usage"] });
        toast.success(`${item.fileName} uploaded`);
      } catch (error) {
        if (error instanceof UploadCancelledError) {
          patch(id, { status: "cancelled" });
          return;
        }
        patch(id, {
          status: "failed",
          error: error instanceof Error ? error.message : "Upload failed",
        });
        toast.error(`Could not upload ${item.fileName}`);
      } finally {
        controllers.current.delete(id);
      }
    },
    [activeProject?.publicKey, items, patch, queryClient],
  );

  const queuedIds = useMemo(
    () => items.filter((item) => item.status === "queued").map((item) => item.id),
    [items],
  );

  useEffect(() => {
    const active = items.filter((item) => item.status === "uploading").length;
    if (active >= MAX_CONCURRENT) return;
    const nextId = queuedIds[0];
    if (nextId) void startUpload(nextId);
  }, [items, queuedIds, startUpload]);

  useEffect(() => {
    const map = controllers.current;
    return () => map.forEach((controller) => controller.abort());
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;
    const additions: QueueItem[] = incoming.map((file) => ({
      id: newId(),
      fileName: file.name,
      size: file.size,
      progress: 0,
      status: "queued",
      file,
    }));
    setItems((current) => [...current, ...additions]);
    toast.info(`${incoming.length} file${incoming.length === 1 ? "" : "s"} added to the queue`);
  }, []);

  function cancelUpload(id: string) {
    controllers.current.get(id)?.abort();
    patch(id, { status: "cancelled" });
    toast.info("Upload cancelled");
  }

  function clearFinished() {
    setItems((current) =>
      current.filter(
        (item) =>
          item.status !== "completed" &&
          item.status !== "failed" &&
          item.status !== "cancelled",
      ),
    );
  }

  const stats = useMemo(
    () => ({
      files: items.length,
      totalSize: items.reduce((sum, item) => sum + item.size, 0),
      completed: items.filter((item) => item.status === "completed").length,
      failed: items.filter((item) => item.status === "failed").length,
    }),
    [items],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Uploads"
        description="Files are uploaded directly to storage through the Dropflow SDK."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {activeProject ? `Uploading to ${activeProject.name}` : "No project available"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
              dragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50",
            )}
          >
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CloudUploadIcon className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-heading text-sm font-medium">Drop files here to upload</p>
              <p className="text-xs text-muted-foreground">
                Multiple files are supported. Uploads respect this project&apos;s restrictions.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!activeProject}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloudIcon />
              Browse files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              aria-label="Choose files to upload"
              onChange={(event) => {
                if (event.target.files) addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Files", stats.files],
              ["Total size", formatBytes(stats.totalSize)],
              ["Completed", stats.completed],
              ["Failed", stats.failed],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle>Queue</CardTitle>
          {items.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearFinished}>
              Clear finished
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              compact
              icon={UploadCloudIcon}
              title="The queue is empty"
              description="Drop files above to upload them with progress, cancellation and retry."
            />
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const active = item.status === "uploading" || item.status === "queued";
                return (
                  <li key={item.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <FileIconBadge mimeType={mimeFromFilename(item.fileName)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.fileName}</p>
                        <p className="text-[11px] text-muted-foreground tabular-nums">
                          {formatBytes(item.size)} · {item.progress}%
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                      <div className="flex items-center gap-1">
                        {active ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Cancel ${item.fileName}`}
                            onClick={() => cancelUpload(item.id)}
                          >
                            <XIcon />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Retry ${item.fileName}`}
                            disabled={!item.file}
                            onClick={() => void startUpload(item.id)}
                          >
                            <RotateCcwIcon />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div
                      className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="progressbar"
                      aria-label={`${item.fileName} progress`}
                      aria-valuenow={item.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          item.status === "completed"
                            ? "bg-emerald-500"
                            : item.status === "cancelled"
                              ? "bg-muted-foreground/50"
                              : "bg-primary",
                        )}
                        initial={false}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.18, ease: "linear" }}
                      />
                    </div>

                    {item.status === "completed" && item.assetUrl ? (
                      <a
                        href={item.assetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        <CheckCircle2Icon className="size-3" />
                        Uploaded — open asset
                      </a>
                    ) : null}
                    {item.status === "failed" ? (
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-destructive">
                        <XCircleIcon className="size-3" />
                        {item.error ?? "Upload failed — use retry to start again."}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">Live SDK</Badge>
        <p className="text-xs text-muted-foreground">
          Uploads use the same signed-URL pipeline as the published SDK.
        </p>
      </div>
    </div>
  );
}
