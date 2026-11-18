"use client";

import { useCallback, useRef, useState } from "react";
import {
  UploadCancelledError, type Asset, type UploadProgress,
} from "@dropflow/sdk";
import { useDropflow } from "./use-dropflow.js";

export type UploadStateStatus = "idle" | "uploading" | "completed" | "failed" | "cancelled";

export interface UseUploadResult {
  upload: (file: Blob) => Promise<Asset | undefined>;
  cancel: () => void;
  reset: () => void;
  status: UploadStateStatus;
  progress: UploadProgress;
  asset: Asset | null;
  error: Error | null;
}

const EMPTY_PROGRESS: UploadProgress = { loaded: 0, total: 0, percentage: 0 };

/** Owns the state of one upload. The SDK owns the actual protocol. */
export function useUpload(): UseUploadResult {
  const client = useDropflow();
  const controllerRef = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<UploadStateStatus>("idle");
  const [progress, setProgress] = useState<UploadProgress>(EMPTY_PROGRESS);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(
    async (file: Blob) => {
      const controller = new AbortController();
      controllerRef.current = controller;
      setStatus("uploading");
      setProgress({ loaded: 0, total: file.size, percentage: 0 });
      setError(null);
      setAsset(null);

      try {
        const result = await client.upload(file, {
          signal: controller.signal,
          onProgress: setProgress,
        });
        setAsset(result);
        setStatus("completed");
        return result;
      } catch (caught) {
        const failure = caught instanceof Error ? caught : new Error(String(caught));
        setError(failure);
        setStatus(failure instanceof UploadCancelledError ? "cancelled" : "failed");
        return undefined;
      } finally {
        controllerRef.current = null;
      }
    },
    [client],
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus("idle");
    setProgress(EMPTY_PROGRESS);
    setAsset(null);
    setError(null);
  }, []);

  return { upload, cancel, reset, status, progress, asset, error };
}
