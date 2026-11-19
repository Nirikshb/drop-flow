"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FolderKanbanIcon } from "lucide-react";
import type { Project } from "@/types";
import { dashboardService } from "@/services";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ErrorState } from "@/components/dashboard/error-state";
import { formatBytes, formatDate, truncateMiddle } from "@/components/dashboard/format";
import { cn } from "@/lib/utils";
import { AppHeader } from "./app-header";
import { AssetsTable } from "./assets-table";
import { DetailsPanel } from "./details-panel";
import { WorkspaceSidebar } from "./workspace-sidebar";

function ProjectStatus({ status }: { status: Project["status"] }) {
  const tone =
    status === "active"
      ? "bg-[#e5ffef] text-[#3fba57]"
      : status === "suspended"
        ? "bg-[#fff3e5] text-[#dc682e]"
        : "bg-[#ececec] text-[#7c7c7c]";

  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px] font-medium capitalize",
        tone,
      )}
    >
      {status}
    </span>
  );
}

export function IssueTracker() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [mobileDetails, setMobileDetails] = useState(false);

  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: () => dashboardService.listOrganizations(),
  });

  const organizations = organizationsQuery.data ?? [];
  const activeOrg = organizations[0];

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });

  const projects = projectsQuery.data ?? [];
  const activeProject = projects[0];

  const handleToggleDetails = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1280) {
      setDetailsOpen((open) => !open);
    } else {
      setMobileDetails((open) => !open);
    }
  };

  const handleCloseDetails = () => {
    setSelectedAssetId(null);
    if (typeof window !== "undefined" && window.innerWidth >= 1280) {
      setDetailsOpen(false);
    } else {
      setMobileDetails(false);
    }
  };

  const handleAssetDeleted = (assetId: string, projectId: string) => {
    if (selectedAssetId === assetId && activeProject?.id === projectId) {
      setSelectedAssetId(null);
    }
  };

  return (
    <div className="fd-root fd-scroll flex h-dvh min-h-0 w-full overflow-hidden bg-[#f6f6f6] text-[#000000]">
      <aside className="hidden w-[256px] shrink-0 border-r border-[#e5e5e5] lg:block">
        <WorkspaceSidebar
          organizations={organizations}
          activeOrg={activeOrg}
          organizationsLoading={organizationsQuery.isLoading}
          onSelectOrg={() => setSelectedAssetId(null)}
          projects={projects}
          projectsLoading={projectsQuery.isLoading}
          activeProject={activeProject}
          onSelectProject={() => setSelectedAssetId(null)}
        />
      </aside>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            query={query}
            onQueryChange={setQuery}
            onToggleDetails={handleToggleDetails}
          />

          <main className="fd-scroll min-w-0 flex-1 overflow-y-auto bg-white">
            {organizationsQuery.isError ? (
              <div className="p-6">
                <ErrorState
                  message="We couldn't load your organizations."
                  onRetry={() => organizationsQuery.refetch()}
                />
              </div>
            ) : organizationsQuery.isLoading ? (
              <p className="px-6 py-10 text-sm text-[#7c7c7c]">Loading workspace…</p>
            ) : !activeOrg ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
                <span className="grid size-11 place-items-center rounded-xl bg-[#f6f6f6] text-[#5b5b5b]">
                  <FolderKanbanIcon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-medium text-black">No organization yet</h2>
                <p className="max-w-sm text-[13px] leading-[19px] text-[#7c7c7c]">
                  Join or create an organization to start managing projects and assets.
                </p>
              </div>
            ) : projectsQuery.isError ? (
              <div className="p-6">
                <ErrorState
                  message="We couldn't load projects for this organization."
                  onRetry={() => projectsQuery.refetch()}
                />
              </div>
            ) : projectsQuery.isLoading ? (
              <p className="px-6 py-10 text-sm text-[#7c7c7c]">Loading projects…</p>
            ) : !activeProject ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
                <span className="grid size-11 place-items-center rounded-xl bg-[#f6f6f6] text-[#5b5b5b]">
                  <FolderKanbanIcon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-medium text-black">No projects yet</h2>
                <p className="max-w-sm text-[13px] leading-[19px] text-[#7c7c7c]">
                  Create a project in {activeOrg.name} to organize assets by app or environment.
                </p>
                <Link
                  href="/dashboard/projects"
                  className="mt-1 inline-flex h-8 items-center rounded-md bg-[#7b61ff] px-3 text-sm font-medium text-white outline-none transition-colors hover:bg-[#6a50f0] focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
                >
                  Create a project
                </Link>
              </div>
            ) : (
              <div className="h-full min-h-0">
                <div className="flex h-[52px] shrink-0 items-center justify-between gap-3 px-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <h1 className="truncate text-sm font-medium leading-none text-black">
                      {activeProject.name}
                    </h1>
                    <ProjectStatus status={activeProject.status} />
                  </div>
                  <Link
                    href="/dashboard/projects"
                    className="shrink-0 rounded-md px-2 py-1 text-[13px] font-medium text-[#3c3c3c] outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
                  >
                    Manage project
                  </Link>
                </div>

                <div className="h-px w-full bg-[#e5e5e5]" />

                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 px-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetaRow label="Organization" value={<span className="truncate">{activeOrg.name}</span>} />
                  <MetaRow
                    label="Public key"
                    value={
                      <>
                        <span className="truncate font-mono text-[12px]">
                          {truncateMiddle(activeProject.publicKey, 12, 6)}
                        </span>
                        <CopyButton
                          value={activeProject.publicKey}
                          label="Copy public key"
                          size="icon-xs"
                          className="text-[#7c7c7c]"
                        />
                      </>
                    }
                  />
                  <MetaRow label="Max file size" value={formatBytes(activeProject.maxFileSize)} />
                  <MetaRow label="Created" value={formatDate(activeProject.createdAt)} />
                </dl>

                <div className="h-px w-full bg-[#e5e5e5]" />

                <AssetsTable
                  projectId={activeProject.id}
                  onSelectAsset={setSelectedAssetId}
                />
              </div>
            )}
          </main>
        </div>

        <aside
          className={cn(
            "w-[320px] shrink-0 border-l border-[#e5e5e5] bg-[#f6f6f6]",
            detailsOpen ? "hidden xl:block" : "hidden",
          )}
        >
          <DetailsPanel
            projectId={activeProject?.id ?? null}
            selectedAssetId={selectedAssetId}
            projectName={activeProject?.name}
            onClose={handleCloseDetails}
            onDeleted={handleAssetDeleted}
          />
        </aside>
      </div>

      {mobileDetails ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileDetails(false)}
          />
          <aside className="absolute inset-y-0 right-0 w-[320px] border-l border-[#e5e5e5] bg-[#f6f6f6] shadow-xl">
            <DetailsPanel
              projectId={activeProject?.id ?? null}
              selectedAssetId={selectedAssetId}
              projectName={activeProject?.name}
              onClose={handleCloseDetails}
              onDeleted={handleAssetDeleted}
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-3 text-[13px]">
      <dt className="w-20 shrink-0 text-[#7c7c7c]">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2">{value}</dd>
    </div>
  );
}
