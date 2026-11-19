"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type LucideIcon,
  BarChart3Icon,
  CheckIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  CloudUploadIcon,
  FolderKanbanIcon,
  HouseIcon,
  ImagesIcon,
  Settings2Icon,
  UploadCloudIcon,
} from "lucide-react";
import type { Organization, Project } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PLAN_LABELS: Record<Organization["plan"], string> = {
  free: "Free plan",
  pro: "Pro plan",
  business: "Business plan",
};

const WORKSPACE_NAV = [
  { label: "Overview", href: "/dashboard", icon: HouseIcon },
  { label: "Assets", href: "/figmadesign", icon: ImagesIcon },
  { label: "Uploads", href: "/dashboard/uploads", icon: UploadCloudIcon },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanbanIcon },
  { label: "Usage", href: "/dashboard/usage", icon: BarChart3Icon },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/figmadesign") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  icon: Icon,
  label,
  href,
  active,
  className,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50",
        active
          ? "bg-white font-medium text-black shadow-sm"
          : "text-[#5b5b5b] hover:bg-black/5",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="flex h-7 items-center px-2 text-xs text-[#7c7c7c]">{label}</p>
  );
}

export function WorkspaceSidebar({
  organizations,
  activeOrg,
  organizationsLoading,
  onSelectOrg,
  projects,
  projectsLoading,
  activeProject,
  onSelectProject,
  className,
}: {
  organizations: Organization[];
  activeOrg: Organization | undefined;
  organizationsLoading: boolean;
  onSelectOrg: (id: string) => void;
  projects: Project[];
  projectsLoading: boolean;
  activeProject: Project | undefined;
  onSelectProject: (id: string) => void;
  className?: string;
}) {
  const pathname = usePathname();
  const orgName = activeOrg?.name ?? (organizationsLoading ? "Loading…" : "No organization");
  const planLabel = activeOrg ? PLAN_LABELS[activeOrg.plan] : "No active plan";

  return (
    <div className={cn("flex h-full w-full flex-col bg-[#f6f6f6] text-[#5b5b5b]", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-16 w-full shrink-0 items-center gap-2 px-4 text-left outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-black text-xs font-medium uppercase text-white">
            {orgName.slice(0, 1)}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="flex items-center gap-1 text-sm font-medium text-black">
              <span className="truncate">{orgName}</span>
              <ChevronDownIcon className="size-3.5 shrink-0" aria-hidden="true" />
            </span>
            <span className="flex items-center gap-1 text-xs text-[#7c7c7c]">
              <CloudUploadIcon className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{planLabel}</span>
            </span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-56">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {organizations.length === 0 ? (
            <p className="px-1.5 py-2 text-xs text-muted-foreground">
              {organizationsLoading ? "Loading organizations…" : "No organizations available"}
            </p>
          ) : (
            organizations.map((org) => (
              <DropdownMenuItem key={org.id} onClick={() => onSelectOrg(org.id)}>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{org.name}</span>
                  <span className="text-xs text-muted-foreground">{org.role}</span>
                </span>
                {org.id === activeOrg?.id ? <CheckIcon className="text-primary" /> : null}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <nav className="flex flex-col px-2" aria-label="Workspace">
        {WORKSPACE_NAV.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(pathname, item.href)}
          />
        ))}
      </nav>

      <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-2">
        <SectionLabel label="Projects" />
        <div className="flex flex-col">
          {projectsLoading ? (
            <p className="px-2 py-1.5 text-sm text-[#7c7c7c]">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-[#7c7c7c]">No projects yet</p>
          ) : (
            projects.map((project) => {
              const selected = project.id === activeProject?.id;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  aria-pressed={selected}
                  title={project.name}
                  className={cn(
                    "flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50",
                    selected
                      ? "bg-white font-medium text-black shadow-sm"
                      : "text-[#5b5b5b] hover:bg-black/5",
                  )}
                >
                  <FolderKanbanIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{project.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="shrink-0 px-2 pb-3">
        <div className="rounded-lg bg-[#f1efff] p-3">
          <p className="text-xs leading-relaxed text-[#5b5b5b]">
            {activeOrg ? (
              <>
                You are on the <span className="font-semibold text-black">{planLabel}</span>.
                Review your storage and upload limits.
              </>
            ) : (
              "Select an organization to see plan details."
            )}
          </p>
          <Link
            href="/dashboard/usage"
            className="mt-2 inline-flex h-7 items-center rounded-md bg-white px-3 text-xs font-medium text-[#5b5b5b] shadow-sm outline-none transition-colors hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-[#7b61ff]/50"
          >
            View usage
          </Link>
        </div>
        <nav className="mt-2 flex flex-col" aria-label="Account">
          <NavLink
            href="/dashboard/settings"
            icon={Settings2Icon}
            label="Settings"
            active={isActive(pathname, "/dashboard/settings")}
          />
          <NavLink
            href="/docs"
            icon={CircleHelpIcon}
            label="Help & support"
            active={isActive(pathname, "/docs")}
          />
        </nav>
      </div>
    </div>
  );
}
