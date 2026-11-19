import {
  Check,
  FileImage,
  FileText,
  Image as ImageIcon,
  Lock,
  RotateCcw,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const queue = [
  {
    name: "hero-banner.webp",
    meta: "image/webp · 2.4 MB",
    progress: 78,
    state: "uploading",
    icon: ImageIcon,
    tone: "bg-[var(--hn-info-soft)] text-[var(--hn-info)]",
  },
  {
    name: "brand-guide.pdf",
    meta: "application/pdf · 860 KB",
    progress: 100,
    state: "done",
    icon: FileText,
    tone: "bg-[var(--hn-warn-soft)] text-[var(--hn-warn)]",
  },
  {
    name: "team-photo.png",
    meta: "image/png · 1.1 MB",
    progress: 100,
    state: "done",
    icon: FileImage,
    tone: "bg-[var(--hn-accent-soft)] text-[var(--hn-accent-ink)]",
  },
  {
    name: "design-assets.zip",
    meta: "application/zip · 6.2 MB",
    progress: 34,
    state: "retry",
    icon: UploadCloud,
    tone: "bg-[var(--hn-warn-soft)] text-[var(--hn-warn)]",
  },
] as const;

const thumbs = [
  { from: "#C9D0C9", to: "#56605A", label: "WEBP" },
  { from: "#E2E7E0", to: "#9AA69C", label: "PNG" },
  { from: "#BFD8CC", to: "#1E6B4F", label: "JPG" },
  { from: "#E4E8E2", to: "#8A9A92", label: "PDF" },
  { from: "#DCE6EA", to: "#1F4E5F", label: "SVG" },
  { from: "#EEF1EC", to: "#56605A", label: "MP4" },
] as const;

export function HeroMockup() {
  return (
    <div
      role="img"
      aria-label="Preview of the Dropflow dashboard showing a live upload queue with progress bars, a searchable asset grid, and AI validation checks"
      className="relative mx-auto w-full max-w-xl lg:max-w-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[var(--hn-sunken)] via-[var(--hn-sunken)] to-transparent blur-2xl"
      />
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[var(--hn-muted)]" />
            <span className="size-2.5 rounded-full bg-[var(--hn-border)]" />
            <span className="size-2.5 rounded-full bg-[var(--hn-accent)]" />
          </div>
          <div className="ml-2 flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
            <Lock className="size-3" aria-hidden="true" />
            app.dropflow.dev/uploads
          </div>
          <Badge className="ml-auto border-transparent bg-[var(--hn-accent-soft)] text-[var(--hn-accent-ink)] hover:bg-[var(--hn-accent-soft)]">
            <span className="size-1.5 rounded-full bg-[var(--hn-accent)]" />
            Live
          </Badge>
        </div>

        <div className="grid gap-4 p-4 sm:p-5">
          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold">Upload queue</p>
                <p className="text-[10px] text-muted-foreground">
                  Direct-to-storage · 4 files
                </p>
              </div>
              <span className="rounded-md border bg-muted/40 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                This session
              </span>
            </div>
            <ul className="mt-3 divide-y">
              {queue.map((file) => {
                const Icon = file.icon;
                return (
                  <li key={file.name} className="flex items-center gap-3 py-2.5">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        file.tone,
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-medium">
                          {file.name}
                        </span>
                        {file.state === "done" ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-[var(--hn-accent-ink)]">
                            <Check className="size-3" aria-hidden="true" />
                            Done
                          </span>
                        ) : file.state === "retry" ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-[var(--hn-warn)]">
                            <RotateCcw className="size-3" aria-hidden="true" />
                            Retrying
                          </span>
                        ) : (
                          <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                            {file.progress}%
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            file.state === "done"
                              ? "bg-[var(--hn-accent)]"
                              : file.state === "retry"
                                ? "bg-[var(--hn-warn)]"
                                : "bg-primary",
                          )}
                          style={{ width: `${file.progress}%` }}
                        />
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                        {file.meta}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold">Asset library</p>
                <span className="text-[10px] text-muted-foreground">1,293 total</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {thumbs.map((thumb) => (
                  <div
                    key={thumb.label}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${thumb.from}, ${thumb.to})`,
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/25 px-1 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm">
                      {thumb.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
                <p className="text-xs font-semibold">AI checks</p>
              </div>
              <ul className="mt-3 space-y-2.5">
                {[
                  "MIME type verified",
                  "Content signature clean",
                  "Auto-tagged · campaign, q4",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-muted-foreground"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--hn-accent-soft)]">
                      <Check className="size-2.5 text-[var(--hn-accent-ink)]" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-primary/5 px-3 py-2 text-[10px] font-medium text-primary">
                0 invalid files stored this week
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-2 hidden items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-lg sm:flex">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[10px] font-semibold">
            AI validation passed
          </span>
          <span className="block text-[9px] text-muted-foreground">
            Before a byte was stored
          </span>
        </span>
      </div>
      <div className="absolute -top-3 right-2 hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 shadow-lg sm:flex">
        <span className="size-1.5 rounded-full bg-[var(--hn-accent)]" />
        <span className="text-[10px] font-medium">99.98% success rate</span>
      </div>
    </div>
  );
}
