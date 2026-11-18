"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Copy,
  FileText,
  Loader2,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "selecting" | "uploading" | "complete";

interface DemoFile {
  name: string;
  size: number;
  mimeType: string;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function InteractiveDemo() {
  const [file, setFile] = React.useState<DemoFile | null>(null);
  const [phase, setPhase] = React.useState<Phase>("selecting");
  const [progress, setProgress] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [assetId, setAssetId] = React.useState("");
  const [uploadedAt, setUploadedAt] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  React.useEffect(() => () => clearTimer(), [clearTimer]);

  const startUpload = React.useCallback(
    (picked: File) => {
      clearTimer();
      setFile({
        name: picked.name,
        size: picked.size,
        mimeType: picked.type || "application/octet-stream",
      });
      setAssetId(Math.random().toString(36).slice(2, 10));
      setProgress(0);
      setUploadedAt(null);
      setPhase("uploading");

      let current = 0;
      intervalRef.current = setInterval(() => {
        current = Math.min(100, current + 6 + Math.floor(Math.random() * 12));
        setProgress(current);
        if (current >= 100) {
          clearTimer();
          setPhase("complete");
          setUploadedAt(
            new Intl.DateTimeFormat("en", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date()),
          );
        }
      }, 160);
    },
    [clearTimer],
  );

  const reset = React.useCallback(() => {
    clearTimer();
    setFile(null);
    setPhase("selecting");
    setProgress(0);
    setAssetId("");
    setUploadedAt(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [clearTimer]);

  const assetUrl =
    file && assetId
      ? `https://assets.dropflow.dev/${assetId}/${encodeURIComponent(file.name)}`
      : "";

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(assetUrl);
      toast.success("Asset URL copied");
    } catch {
      toast.error("Could not copy — check clipboard permissions");
    }
  }

  const statusLabel =
    phase === "complete" ? "Complete" : phase === "uploading" ? "Uploading…" : "Ready";

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <UploadCloud className="size-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold">Upload flow, end to end</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            Simulated
          </Badge>
          {file && (
            <Button variant="ghost" size="xs" onClick={reset}>
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <p className="border-b bg-muted/30 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground sm:px-5">
        Interactive preview — simulated for illustration. Files stay in your
        browser; no backend is contacted and nothing is stored.
      </p>

      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-2">
        <div className="min-w-0">
          <div
            role="button"
            tabIndex={0}
            aria-label="Choose a file to simulate an upload"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              const picked = event.dataTransfer.files?.[0];
              if (picked) startUpload(picked);
            }}
            className={cn(
              "flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              dragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5",
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-lg border bg-background shadow-sm">
              <UploadCloud className="size-5 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium">Drop a file here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Any file · progress is animated locally
            </p>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              aria-label="Select a file for the simulated upload"
              onChange={(event) => {
                const picked = event.target.files?.[0];
                if (picked) startUpload(picked);
              }}
            />
          </div>

          {file && (
            <div className="mt-4 rounded-lg border bg-background p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <FileText className="size-4 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatBytes(file.size)} · {statusLabel}
                  </p>
                </div>
                {phase === "uploading" && (
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {progress}%
                  </span>
                )}
                {phase === "complete" && (
                  <CheckCircle2
                    className="size-4 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Simulated upload progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 170, damping: 24 }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col rounded-lg border bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Upload result
            </p>
            {phase === "complete" ? (
              <Badge className="border-transparent bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400">
                Complete
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-normal">
                {phase === "uploading" ? "Uploading" : "Pending"}
              </Badge>
            )}
          </div>

          {phase === "complete" && file ? (
            <>
              <p className="mt-5 text-xs font-medium">Asset URL</p>
              <div className="mt-1.5 flex items-center gap-1.5 rounded-md border bg-muted/30 py-1 pr-1 pl-2.5">
                <code
                  className="min-w-0 flex-1 truncate font-mono text-xs"
                  title={assetUrl}
                >
                  {assetUrl}
                </code>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Copy generated asset URL"
                  onClick={copyUrl}
                >
                  <Copy aria-hidden="true" />
                </Button>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-xs">
                <div className="min-w-0">
                  <dt className="text-muted-foreground">MIME type</dt>
                  <dd className="mt-1 truncate font-mono" title={file.mimeType}>
                    {file.mimeType}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="mt-1 font-mono">{formatBytes(file.size)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Uploaded</dt>
                  <dd className="mt-1 font-mono">{uploadedAt}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Asset ID</dt>
                  <dd className="mt-1 font-mono">df_{assetId}</dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
              {phase === "uploading" ? (
                <Loader2
                  className="size-5 animate-spin text-primary"
                  aria-hidden="true"
                />
              ) : (
                <UploadCloud
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <p className="text-sm text-muted-foreground">
                {phase === "uploading"
                  ? "Moving bytes, updating progress…"
                  : "Choose a file to preview the result"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
