"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  BellIcon,
  Building2Icon,
  CheckIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  FolderKanbanIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import { authService } from "@/services/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { ActivityIcon } from "./status-badge";
import { formatRelativeTime, initials, truncateMiddle } from "./format";
import { cn } from "@/lib/utils";

function routeMeta(pathname: string): { crumb: string; title: string } {
  if (pathname === "/dashboard") return { crumb: "Overview", title: "Overview" };
  if (pathname.startsWith("/dashboard/projects/")) {
    return { crumb: "Projects", title: "Project settings" };
  }
  if (pathname.startsWith("/dashboard/projects")) {
    return { crumb: "Manage", title: "Projects" };
  }
  if (pathname.startsWith("/dashboard/assets")) {
    return { crumb: "Manage", title: "Assets" };
  }
  if (pathname.startsWith("/dashboard/uploads")) {
    return { crumb: "Manage", title: "Uploads" };
  }
  if (pathname.startsWith("/dashboard/api-keys")) {
    return { crumb: "Manage", title: "API keys" };
  }
  if (pathname.startsWith("/dashboard/usage")) {
    return { crumb: "Insights", title: "Usage" };
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return { crumb: "Account", title: "Settings" };
  }
  return { crumb: "Dashboard", title: "Dashboard" };
}

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const meta = routeMeta(pathname);

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => dashboardService.getCurrentUser(),
  });
  const me = meQuery.data;
  const displayName = me?.name ?? "Your account";

  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: () => dashboardService.listOrganizations(),
  });

  const activeOrgId =
    selectedOrgId ?? organizationsQuery.data?.[0]?.id ?? "";

  const projectsQuery = useQuery({
    queryKey: ["projects", activeOrgId],
    queryFn: () => dashboardService.listProjects(activeOrgId || undefined),
    enabled: Boolean(activeOrgId),
  });

  const activityQuery = useQuery({
    queryKey: ["activity"],
    queryFn: () => dashboardService.getActivity(),
  });

  const organizations = organizationsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const activeOrg = organizations.find((org) => org.id === activeOrgId);
  const activeProject = projects.find(
    (project) => project.id === selectedProjectId,
  );
  const activity = activityQuery.data ?? [];

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await authService.logout();
      toast.success("Signed out");
      router.push("/login");
    } catch {
      toast.error("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation" />}>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 lg:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="hidden text-muted-foreground sm:inline">
          {meta.crumb}
        </span>
        <ChevronRightIcon className="hidden size-3.5 text-muted-foreground/60 sm:inline" />
        <span className="truncate font-medium text-foreground">{meta.title}</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" aria-label="Select organization" />
            }
          >
            <Building2Icon />
            <span className="hidden max-w-32 truncate md:inline">
              {activeOrg?.name ?? (organizationsQuery.isLoading ? "Loading…" : "Organization")}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {organizations.length === 0 ? (
              <p className="px-1.5 py-2 text-xs text-muted-foreground">
                No organizations available
              </p>
            ) : (
              organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => {
                    setSelectedOrgId(org.id);
                    setSelectedProjectId(null);
                  }}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{org.name}</span>
                    <span className="text-xs text-muted-foreground">{org.role}</span>
                  </span>
                  {org.id === activeOrgId ? <CheckIcon className="text-primary" /> : null}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" aria-label="Select project" />
            }
          >
            <FolderKanbanIcon />
            <span className="hidden max-w-32 truncate lg:inline">
              {activeProject?.name ?? "All projects"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuLabel>Projects</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedProjectId(null)}>
              <span className="flex-1">All projects</span>
              {!selectedProjectId ? <CheckIcon className="text-primary" /> : null}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {projects.length === 0 ? (
              <p className="px-1.5 py-2 text-xs text-muted-foreground">
                No projects available
              </p>
            ) : (
              projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{project.name}</span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                      {truncateMiddle(project.publicKey, 12, 4)}
                    </span>
                  </span>
                  {project.id === selectedProjectId ? (
                    <CheckIcon className="text-primary" />
                  ) : null}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Recent activity" />
            }
          >
            <span className="relative">
              <BellIcon />
              {activity.length > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary" />
              ) : null}
            </span>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-3">
            <PopoverHeader>
              <PopoverTitle>Recent activity</PopoverTitle>
            </PopoverHeader>
            <div className="max-h-80 overflow-y-auto">
              {activityQuery.isLoading ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  Loading activity…
                </p>
              ) : activity.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No activity yet
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {activity.slice(0, 6).map((event) => (
                    <li key={event.id} className="flex gap-3 py-2.5 first:pt-1">
                      <ActivityIcon type={event.type} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug text-foreground">
                          {event.description}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatRelativeTime(event.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" aria-label="User menu" />}
          >
            <Avatar size="sm">
              <AvatarFallback>{initials(displayName)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuLabel>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{displayName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {me?.email ?? ""}
                </span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href="/dashboard/settings" />}
              className="gap-2"
            >
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/docs" />} className="gap-2">
              <CircleHelpIcon />
              Docs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={signOut}
              disabled={signingOut}
              className="gap-2"
            >
              <LogOutIcon />
              {signingOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function HeaderActionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonVariants({ size: "sm" }), className)}>
      {children}
    </Link>
  );
}
