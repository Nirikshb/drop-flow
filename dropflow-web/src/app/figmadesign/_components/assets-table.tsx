"use client";

import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ImagesIcon, SearchIcon } from "lucide-react";
import { dashboardService } from "@/services";
import type { AssetsPage } from "@/services/types";
import type { Asset } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SelectionCircle } from "./primitives";
import { FileIconBadge } from "@/components/dashboard/file-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { formatBytes, formatDate } from "@/components/dashboard/format";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Largest first", value: "largest" },
  { label: "Name A–Z", value: "name" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const KIND_OPTIONS = [
  { label: "All types", value: "" },
  { label: "Images", value: "image/*" },
  { label: "PDF", value: "application/pdf" },
  { label: "Video", value: "video/*" },
  { label: "Audio", value: "audio/*" },
  { label: "Archives", value: "application/zip" },
  { label: "Text / data", value: "text/*" },
] as const;

function AssetRow({
  asset,
  selected,
  onToggle,
}: {
  asset: Asset;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <TableRow className={cn("h-12 cursor-pointer", selected && "bg-white")} aria-selected={selected}>
      <TableCell className="w-5 pr-0">
        <SelectionCircle
          selected={selected}
          onToggle={onToggle}
          label={`Select ${asset.originalFilename}`}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <FileIconBadge mimeType={asset.mimeType} className="size-9" />
          <span className="max-w-56 truncate text-sm">{asset.originalFilename}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{formatBytes(asset.sizeBytes)}</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(asset.createdAt)}</TableCell>
      <TableCell>
        <StatusBadge status={asset.status} />
      </TableCell>
    </TableRow>
  );
}

export function AssetsTable({
  projectId,
  onSelectAsset,
}: {
  projectId: string;
  onSelectAsset: (assetId: string | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevProjectId, setPrevProjectId] = useState(projectId);
  if (prevProjectId !== projectId) {
    setPrevProjectId(projectId);
    setSelectedId(null);
    onSelectAsset?.(null);
  }

  const assetsQuery = useInfiniteQuery({
    queryKey: ["assets", projectId, debouncedSearch, kindFilter, sort],
    initialPageParam: 0,
    queryFn: ({ pageParam }): Promise<AssetsPage> =>
      dashboardService.listAssetsPage(projectId, {
        search: debouncedSearch || undefined,
        mimeType: kindFilter || undefined,
        sort,
        limit: 100,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? Number(lastPage.nextCursor) : undefined),
  });

  const assets = useMemo(
    () => assetsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [assetsQuery.data],
  );
  const hasNextPage = assetsQuery.hasNextPage;

  const handleRowToggle = (asset: Asset) => {
    const next = selectedId === asset.id ? null : asset.id;
    setSelectedId(next);
    onSelectAsset(next);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-col gap-2 border-b border-[#e5e5e5] p-4 md:flex-row md:items-center lg:gap-3">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7c7c7c]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find asset"
            aria-label="Find asset"
            className="h-8 pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={kindFilter} onValueChange={(value) => setKindFilter(value ?? "")}>
            <SelectTrigger aria-label="Filter by type" className="w-[180px] h-8">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {KIND_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort((value ?? "newest") as SortOption)}
          >
            <SelectTrigger aria-label="Sort assets" className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {assetsQuery.isLoading ? (
          <LoadingState variant="table" count={6} className="p-4" />
        ) : assetsQuery.isError ? (
          <div className="p-6">
            <ErrorState onRetry={() => assetsQuery.refetch()} />
          </div>
        ) : assets.length === 0 ? (
          <EmptyState
            icon={ImagesIcon}
            title="No assets in this project"
            description="Uploaded assets will appear here."
            className="h-full"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="h-12">
                <TableHead className="w-5 pr-0"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <AssetRow
                  key={asset.id}
                  asset={asset}
                  selected={selectedId === asset.id}
                  onToggle={() => handleRowToggle(asset)}
                />
              ))}
            </TableBody>
          </Table>
        )}
        {hasNextPage ? (
          <div className="flex justify-center border-t border-[#e5e5e5] p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void assetsQuery.fetchNextPage();
              }}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
