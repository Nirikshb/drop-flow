/** Presentation helpers shared by dashboard views. No fake data lives here. */

export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB"] as const;
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** index;
  const digits =
    index === 0 ? 0 : value < 10 ? fractionDigits : value < 100 ? 1 : 0;
  return `${value.toFixed(digits)} ${units[index]}`;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

/** UTC keeps server and client renders identical (no hydration mismatch). */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const time = date.getTime();
  if (Number.isNaN(time)) return "—";

  const seconds = Math.round((time - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  const future = seconds > 0;

  if (abs < 45) return "just now";

  // Each entry is the upper bound (in seconds) for the *previous* unit.
  const thresholds: [number, string][] = [
    [60, "second"],
    [3_600, "minute"],
    [86_400, "hour"],
    [604_800, "day"],
    [2_629_800, "week"],
    [31_557_600, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let index = 0;
  while (abs >= thresholds[index]![0]) index += 1;

  const unit = thresholds[index]![1];
  const divisor = index === 0 ? 1 : thresholds[index - 1]![0];
  const amount = Math.max(1, Math.round(abs / divisor));
  const label = `${amount} ${unit}${amount === 1 ? "" : "s"}`;
  return future ? `in ${label}` : `${label} ago`;
}

export type FileKind =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "archive"
  | "text"
  | "other";

export function fileKind(mimeType: string): FileKind {
  const mime = (mimeType || "").toLowerCase();
  if (mime === "application/pdf" || mime.endsWith("+pdf")) return "pdf";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("text/")) return "text";
  if (
    mime.includes("zip") ||
    mime.includes("tar") ||
    mime.includes("gzip") ||
    mime.includes("compressed") ||
    mime === "application/x-7z-compressed" ||
    mime === "application/x-rar-compressed"
  ) {
    return "archive";
  }
  if (mime.includes("json") || mime.includes("csv") || mime.includes("xml")) {
    return "text";
  }
  return "other";
}

/** Best-effort MIME guess used only for icons in the local upload demo queue. */
export function mimeFromFilename(name: string): string {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  const known: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    pdf: "application/pdf",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    "7z": "application/x-7z-compressed",
    gz: "application/gzip",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    csv: "text/csv",
    json: "application/json",
    xml: "application/xml",
    txt: "text/plain",
    md: "text/plain",
  };
  return known[extension] ?? "application/octet-stream";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

export function truncateMiddle(value: string, head = 10, tail = 6): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}
