"use client";

import type { UploadProgress } from "@dropflow/sdk";

export interface UploadListEntry {
  id: string;
  fileName: string;
  status: "queued" | "uploading" | "completed" | "failed" | "cancelled";
  progress: UploadProgress;
  error?: string;
}

/** Presentational only — state ownership stays with the caller. */
export function DropflowUploadList({
  items,
  onCancel,
  onRetry,
}: {
  items: UploadListEntry[];
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
}) {
  if (items.length === 0) return <p>No uploads yet.</p>;
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.fileName}</span>
          <span>{item.status}</span>
          <progress value={item.progress.percentage} max={100} />
          {item.error && <span role="alert">{item.error}</span>}
          {(item.status === "uploading" || item.status === "queued") && onCancel && (
            <button type="button" onClick={() => onCancel(item.id)}>Cancel</button>
          )}
          {(item.status === "failed" || item.status === "cancelled") && onRetry && (
            <button type="button" onClick={() => onRetry(item.id)}>Retry</button>
          )}
        </li>
      ))}
    </ul>
  );
}
