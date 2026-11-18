"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BanIcon,
  CircleCheckIcon,
  EllipsisIcon,
  FolderKanbanIcon,
  PlusIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import type { Project, ProjectStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { StatusBadge } from "@/components/dashboard/status-badge";
import { CopyButton } from "@/components/dashboard/copy-button";
import { ErrorState } from "@/components/dashboard/error-state";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { formatDate, formatBytes, truncateMiddle } from "@/components/dashboard/format";

const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  organizationId: z.string().min(1, "Choose an organization"),
});
type CreateProjectValues = z.infer<typeof createProjectSchema>;

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });
  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: () => dashboardService.listOrganizations(),
  });

  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", organizationId: "" },
  });

  const organizations = organizationsQuery.data ?? [];
  const nameValue = form.watch("name");
  const slugPreview = nameValue
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  useEffect(() => {
    if (!form.getValues("organizationId") && organizations[0]) {
      form.setValue("organizationId", organizations[0].id);
    }
  }, [organizations, form]);

  const createMutation = useMutation({
    mutationFn: (values: CreateProjectValues) =>
      dashboardService.createProject({
        name: values.name,
        organizationId: values.organizationId,
      }),
    onSuccess: (project) => {
      toast.success(`Project “${project.name}” created`);
      setDialogOpen(false);
      form.reset({ name: "", organizationId: project.organizationId });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      void queryClient.invalidateQueries({ queryKey: ["projects", project.organizationId] });
    },
    onError: () => toast.error("Could not create the project. Please try again."),
  });

  const projects = projectsQuery.data ?? [];

  const statusMutation = useMutation({
    mutationFn: (input: { project: Project; status: ProjectStatus }) =>
      dashboardService.updateProject(input.project.id, { status: input.status }),
    onSuccess: (updated) => {
      toast.success(`Project “${updated.name}” is now ${updated.status}`);
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not change the project status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (project: Project) => dashboardService.deleteProject(project.id),
    onSuccess: () => {
      toast.success(`“${projectToDelete?.name ?? "Project"}” deleted`);
      setProjectToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      void queryClient.invalidateQueries({ queryKey: ["usage"] });
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not delete the project"),
  });

  function toggleStatus(project: Project) {
    const next: ProjectStatus = project.status === "active" ? "disabled" : "active";
    statusMutation.mutate({ project, status: next });
  }

  function confirmDelete() {
    if (!projectToDelete) return;
    deleteMutation.mutate(projectToDelete);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Separate environments, API keys and upload rules for each of your apps."
        actions={
          <Button
            onClick={() => {
              form.reset({ name: "", organizationId: organizations[0]?.id ?? "" });
              setDialogOpen(true);
            }}
          >
            <PlusIcon />
            New project
          </Button>
        }
      />

      <Card>
        <CardContent className="px-0">
          {projectsQuery.isLoading ? (
            <LoadingState variant="table" count={5} className="px-4" />
          ) : projectsQuery.isError ? (
            <ErrorState
              className="m-4"
              onRetry={() => void projectsQuery.refetch()}
            />
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderKanbanIcon}
              title="No projects yet"
              description="Create your first project to get a public key and start uploading files."
              action={<Button onClick={() => setDialogOpen(true)}>New project</Button>}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Public key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Max file size</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="w-12 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const effectiveStatus = project.status;
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="font-medium hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {project.name}
                        </Link>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          /{project.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <code className="rounded bg-muted px-1.5 py-1 font-mono text-[11px]">
                            {truncateMiddle(project.publicKey, 12, 6)}
                          </code>
                          <CopyButton
                            value={project.publicKey}
                            label="Copy public key"
                            size="icon-sm"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={effectiveStatus} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell tabular-nums text-muted-foreground">
                        {formatBytes(project.maxFileSize)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {formatDate(project.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Actions for ${project.name}`}
                              />
                            }
                          >
                            <EllipsisIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              render={
                                <Link href={`/dashboard/projects/${project.id}`} />
                              }
                            >
                              <Settings2Icon />
                              View settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(project)}>
                              {effectiveStatus === "active" ? (
                                <BanIcon />
                              ) : (
                                <CircleCheckIcon />
                              )}
                              {effectiveStatus === "active" ? "Disable" : "Enable"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setProjectToDelete(project)}
                            >
                              <Trash2Icon />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Projects keep their assets, keys and upload limits isolated.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                placeholder="Production"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : (
                <p className="font-mono text-[11px] text-muted-foreground">
                  Slug: /{slugPreview || "your-project"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Organization</Label>
              <Select
                value={form.watch("organizationId")}
                onValueChange={(value) =>
                  form.setValue("organizationId", value ?? "")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.organizationId ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.organizationId.message}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {projectToDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the project and its usage history. Delete or move
              all live assets first; soft-deleted assets are removed with the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2Icon />
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
