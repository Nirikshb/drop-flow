"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ImagesIcon,
  LayoutGridIcon,
  ListIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import type { Asset } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/page-header";
import { FileIconBadge } from "@/components/dashboard/file-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ErrorState } from "@/components/dashboard/error-state";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  fileKind,
  formatBytes,
  formatDate,
  formatDateTime,
  formatNumber,
  type FileKind,
} from "@/components/dashboard/format";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<FileKind, string> = {
  image: "Images",
  video: "Video",
  audio: "Audio",
  pdf: "PDF",
  archive: "Archives",
  text: "Text / data",
  other: "Other",
};

type SortOption = "newest" | "oldest" | "largest" | "name";

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border py-2 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-all text-xs">{value}</dd>
    </div>
  );
}

export default function AssetsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const assetsQuery = useQuery({
    queryKey: ["assets"],
    queryFn: () => dashboardService.listAssets(),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });

  const assets = assetsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];

  const availableKinds = useMemo(
    () => Array.from(new Set(assets.map((asset) => fileKind(asset.mimeType)))),
    [assets],
  );

  const visibleAssets = useMemo(() => {
    const result = assets.filter((asset) => {
      const matchesSearch =
        !debouncedSearch ||
        asset.originalFilename.toLowerCase().includes(debouncedSearch) ||
        asset.mimeType.toLowerCase().includes(debouncedSearch);
      const matchesKind =
        kindFilter === "all" || fileKind(asset.mimeType) === kindFilter;
      return matchesSearch && matchesKind;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.createdAt.localeCompare(b.createdAt);
        case "largest":
          return b.sizeBytes - a.sizeBytes;
        case "name":
          return a.originalFilename.localeCompare(b.originalFilename);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [assets, debouncedSearch, kindFilter, sort]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dashboardService.deleteAsset(id),
    onSuccess: () => {
      toast.success("Asset deleted");
      setDeleteTarget(null);
      setSelectedAsset(null);
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
      void queryClient.invalidateQueries({ queryKey: ["usage"] });
    },
    onError: () => toast.error("Could not delete the asset. Please try again."),
  });

  const projectName = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.name ?? projectId;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Every file uploaded across your projects, in one searchable library."
        actions={
          <Badge variant="secondary" className="tabular-nums">
            {visibleAssets.length} shown
          </Badge>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by filename or MIME type…"
            aria-label="Search assets"
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={kindFilter}
            onValueChange={(value) => setKindFilter(value ?? "all")}
          >
            <SelectTrigger aria-label="Filter by type" className="w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {availableKinds.map((kind) => (
                <SelectItem key={kind} value={kind}>
                  {KIND_LABELS[kind]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort((value ?? "newest") as SortOption)}
          >
            <SelectTrigger aria-label="Sort assets" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="largest">Largest first</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-lg bg-muted p-[3px]" role="group" aria-label="View mode">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(view === "grid" && "bg-background shadow-sm")}
            >
              <LayoutGridIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={cn(view === "list" && "bg-background shadow-sm")}
            >
              <ListIcon />
            </Button>
          </div>
        </div>
      </div>

      {assetsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : assetsQuery.isError ? (
        <ErrorState onRetry={() => void assetsQuery.refetch()} />
      ) : assets.length === 0 ? (
        <EmptyState
          icon={ImagesIcon}
          title="No assets yet"
          description="Once files are uploaded through the SDK they will appear in this library."
        />
      ) : visibleAssets.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No matching assets"
          description="Try a different search term or MIME type filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setKindFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleAssets.map((asset) => (
            <Card
              key={asset.id}
              className="group cursor-pointer gap-0 p-0 transition-shadow hover:ring-2 hover:ring-primary/40"
              onClick={() => setSelectedAsset(asset)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedAsset(asset);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${asset.originalFilename}`}
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-muted to-accent">
                <FileIconBadge
                  mimeType={asset.mimeType}
                  className="size-16 rounded-2xl bg-background/80 shadow-sm"
                  iconClassName="size-7"
                />
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-sm font-medium">{asset.originalFilename}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
                  <span>{formatBytes(asset.sizeBytes)}</span>
                  <span>{formatDate(asset.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 opacity-70 transition-opacity group-hover:opacity-100">
                  <span className="truncate text-[11px] text-muted-foreground">
                    {projectName(asset.projectId)}
                  </span>
                  <CopyButton
                    value={asset.url}
                    label="Copy URL"
                    size="icon-xs"
                    onClick={(event) => event.stopPropagation()}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="gap-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Project</TableHead>
                <TableHead className="hidden lg:table-cell">MIME type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="hidden sm:table-cell">Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <FileIconBadge mimeType={asset.mimeType} />
                      <span className="max-w-56 truncate font-medium">
                        {asset.originalFilename}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {projectName(asset.projectId)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-[11px] text-muted-foreground">
                    {asset.mimeType}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatBytes(asset.sizeBytes)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(asset.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={asset.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <CopyButton
                      value={asset.url}
                      label="Copy URL"
                      size="icon-sm"
                      onClick={(event) => event.stopPropagation()}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog
        open={Boolean(selectedAsset)}
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selectedAsset ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <FileIconBadge mimeType={selectedAsset.mimeType} className="size-11" iconClassName="size-5" />
                  <div className="min-w-0">
                    <DialogTitle className="truncate">
                      {selectedAsset.originalFilename}
                    </DialogTitle>
                    <DialogDescription>Asset details and metadata</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <dl>
                <MetaRow label="Asset ID" value={<code className="font-mono">{selectedAsset.id}</code>} />
                <MetaRow label="Object key" value={<code className="font-mono">{selectedAsset.objectKey}</code>} />
                <MetaRow label="MIME type" value={<code className="font-mono">{selectedAsset.mimeType}</code>} />
                <MetaRow label="Size" value={`${formatBytes(selectedAsset.sizeBytes)} (${formatNumber(selectedAsset.sizeBytes)} bytes)`} />
                <MetaRow label="Checksum" value={<code className="font-mono">{selectedAsset.checksum ?? "—"}</code>} />
                <MetaRow label="Project" value={projectName(selectedAsset.projectId)} />
                <MetaRow label="Created" value={formatDateTime(selectedAsset.createdAt)} />
                <MetaRow label="Status" value={<StatusBadge status={selectedAsset.status} />} />
                <MetaRow
                  label="URL"
                  value={
                    <span className="flex items-start gap-2">
                      <span className="min-w-0 break-all font-mono">{selectedAsset.url}</span>
                      <CopyButton value={selectedAsset.url} label="Copy URL" size="icon-xs" />
                    </span>
                  }
                />
              </dl>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedAsset(null)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteTarget(selectedAsset);
                    setSelectedAsset(null);
                  }}
                >
                  <Trash2Icon />
                  Delete asset
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this asset?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.originalFilename}</strong> will be permanently
              deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete asset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
