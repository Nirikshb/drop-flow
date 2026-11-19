"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLinkIcon, FileTextIcon, PanelRightIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import { ApiError } from "@/services/auth";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ErrorState } from "@/components/dashboard/error-state";
import { FileIconBadge } from "@/components/dashboard/file-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatBytes, formatDate, formatNumber } from "@/components/dashboard/format";
import { cn } from "@/lib/utils";

const Divider = () => <div className="mx-5 h-px w-[280px] shrink-0 bg-[#e9e9e9]" />;

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[12px] leading-[18px]">
      <span className="w-[108px] shrink-0 text-[#7c7c7c]">{label}</span>
      <span className="min-w-0 flex-1 break-words text-black">{children}</span>
    </div>
  );
}

export function DetailsPanel({
  projectId,
  selectedAssetId,
  projectName,
  onClose,
  onDeleted,
}: {
  projectId: string | null;
  selectedAssetId: string | null;
  projectName?: string;
  onClose?: () => void;
  onDeleted?: (assetId: string, projectId: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const assetQuery = useQuery({
    queryKey: ["asset", projectId, selectedAssetId],
    queryFn: () => dashboardService.getAsset(projectId as string, selectedAssetId as string),
    enabled: Boolean(projectId && selectedAssetId),
  });

  const asset = assetQuery.data;
  const isNotFound = assetQuery.isError && assetQuery.error instanceof ApiError && assetQuery.error.status === 404;

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!asset || !projectId) throw new Error("Asset context missing");
      return dashboardService.deleteAsset(asset.id, projectId);
    },
    onSuccess: () => {
      toast.success("Asset deleted");
      setDeleteOpen(false);
      if (asset && projectId) {
        void queryClient.invalidateQueries({ queryKey: ["assets", projectId] });
        void queryClient.invalidateQueries({ queryKey: ["asset", projectId] });
        onDeleted?.(asset.id, projectId);
      }
    },
    onError: () => {
      toast.error("Could not delete the asset. Please try again.");
    },
  });

  return (
    <div
      className={cn(
        "fd-root fd-scroll flex h-full w-[320px] shrink-0 flex-col overflow-y-auto",
        "bg-[#f6f6f6] text-black",
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 px-6">
        <h2 className="truncate text-[13px] font-medium text-black">Asset details</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details panel"
          className="grid size-6 shrink-0 place-items-center rounded-[6px] text-[#5b5b5b] outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
        >
          <PanelRightIcon className="size-4" aria-hidden="true" />
        </button>
      </div>

      <Divider />

      {!projectId || !selectedAssetId ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-16 text-center">
          <span className="grid size-10 place-items-center rounded-lg bg-[#ececec] text-[#5b5b5b]">
            <FileTextIcon className="size-[18px]" aria-hidden="true" />
          </span>
          <p className="text-[12px] leading-[18px] text-[#7c7c7c]">
            Select an asset to inspect its metadata, preview and download link.
          </p>
        </div>
      ) : assetQuery.isLoading ? (
        <div className="space-y-3 px-5 py-5" aria-busy="true">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isNotFound ? (
        <div className="p-6">
          <ErrorState message="This asset is no longer available." />
        </div>
      ) : assetQuery.isError ? (
        <div className="p-6">
          <ErrorState
            message="We couldn't load this asset's details."
            onRetry={() => assetQuery.refetch()}
          />
        </div>
      ) : asset ? (
        <>
          <section className="space-y-3 px-5 py-5">
            <div className="flex items-start gap-3">
              <FileIconBadge mimeType={asset.mimeType} className="size-10" iconClassName="size-5" />
              <div className="min-w-0">
                <p className="break-words text-[13px] font-medium leading-[19px] text-black">
                  {asset.originalFilename}
                </p>
                <p className="truncate text-[11px] leading-[16px] text-[#7c7c7c]">{asset.mimeType}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] text-[#7c7c7c]">Status</span>
              <StatusBadge status={asset.status} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#7b61ff] px-3 text-[13px] font-medium text-white outline-none transition-colors hover:bg-[#6a50f0] focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
              >
                <ExternalLinkIcon className="size-4" aria-hidden="true" />
                Open asset
              </Link>
              <CopyButton
                value={asset.url}
                label="Copy link"
                variant="outline"
                size="sm"
                className="h-8 text-[13px]"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                disabled={deleteMutation.isPending}
                className="h-8 text-[13px] text-[#dc2626] hover:text-[#dc2626]"
              >
                <Trash2Icon />
                Delete
              </Button>
            </div>
            <p className="text-[11px] leading-[16px] text-[#9a9a9a]">
              Links expire 15 minutes after loading.
            </p>
          </section>

          <Divider />

          <section className="space-y-2 px-5 py-5" aria-label="Metadata">
            <MetaRow label="File type">{asset.mimeType}</MetaRow>
            <MetaRow label="Size">{formatBytes(asset.sizeBytes)}</MetaRow>
            <MetaRow label="Size (bytes)">{formatNumber(asset.sizeBytes)}</MetaRow>
            <MetaRow label="Created">{formatDate(asset.createdAt)}</MetaRow>
            <MetaRow label="Checksum">{asset.checksum ?? "—"}</MetaRow>
            {projectName ? <MetaRow label="Project">{projectName}</MetaRow> : null}
            <MetaRow label="Object key">{asset.objectKey}</MetaRow>
          </section>

          <Divider />

          <section className="space-y-2 px-5 py-5" aria-label="Download link">
            <p className="text-[12px] leading-[18px] text-[#7c7c7c]">Signed download link</p>
            <p className="break-all font-mono text-[11px] leading-[16px] text-black">{asset.url}</p>
          </section>
        </>
      ) : null}

      <AlertDialog open={deleteOpen} onOpenChange={(open) => !open && setDeleteOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this asset?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{asset?.originalFilename}</strong> will be removed from this
              project&apos;s library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete asset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
