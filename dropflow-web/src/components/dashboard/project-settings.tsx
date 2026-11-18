"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeftIcon, PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import type { ProjectStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "./page-header";
import { StatusBadge } from "./status-badge";
import { CopyButton } from "./copy-button";
import { ErrorState } from "./error-state";
import { LoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";
import { formatDate, formatBytes } from "./format";

const settingsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  maxFileSizeMB: z.number().min(1, "Must be at least 1 MB").max(10_000),
  allowedMimeTypes: z.array(z.string().trim().min(1)),
  enabled: z.boolean(),
});
type SettingsValues = z.infer<typeof settingsSchema>;

export function ProjectSettings({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });
  const project = projectsQuery.data?.find((item) => item.id === projectId);

  const [mimeDraft, setMimeDraft] = useState("");
  const [ready, setReady] = useState(false);
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      maxFileSizeMB: 50,
      allowedMimeTypes: [],
      enabled: true,
    },
  });

  useEffect(() => {
    if (!project) return;
    form.reset({
      name: project.name,
      maxFileSizeMB: Math.max(1, Math.round(project.maxFileSize / 1_048_576)),
      allowedMimeTypes: project.allowedMimeTypes,
      enabled: project.status === "active",
    });
    setReady(true);
  }, [project, form]);

  const mimeTypes = form.watch("allowedMimeTypes");

  function addMimeType() {
    const value = mimeDraft.trim();
    if (!value) return;
    if (mimeTypes.includes(value)) {
      toast.info("That MIME type is already in the list");
      return;
    }
    form.setValue("allowedMimeTypes", [...mimeTypes, value]);
    setMimeDraft("");
  }

  function removeMimeType(value: string) {
    form.setValue(
      "allowedMimeTypes",
      mimeTypes.filter((item) => item !== value),
    );
  }

  function onSave(values: SettingsValues) {
    if (!project) return;
    updateMutation.mutate(values);
  }

  const updateMutation = useMutation({
    mutationFn: (values: SettingsValues) =>
      dashboardService.updateProject(project!.id, {
        name: values.name,
        maxFileSize: Math.round(values.maxFileSizeMB * 1_048_576),
        allowedMimeTypes: values.allowedMimeTypes,
        status: values.enabled ? "active" : "disabled",
      }),
    onSuccess: (updated) => {
      toast.success("Project settings saved");
      form.reset({
        name: updated.name,
        maxFileSizeMB: Math.max(1, Math.round(updated.maxFileSize / 1_048_576)),
        allowedMimeTypes: updated.allowedMimeTypes,
        enabled: updated.status === "active",
      });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not save the project settings"),
  });

  if (projectsQuery.isLoading) {
    return <LoadingState count={2} />;
  }

  if (projectsQuery.isError) {
    return <ErrorState onRetry={() => void projectsQuery.refetch()} />;
  }

  if (!project) {
    return (
      <EmptyState
        icon={ArrowLeftIcon}
        title="Project not found"
        description="This project may have been removed or the link is incorrect."
        action={
          <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:underline">
            Back to projects
          </Link>
        }
      />
    );
  }

  if (!ready) {
    return <LoadingState count={2} />;
  }

  const effectiveStatus: ProjectStatus = form.watch("enabled") ? "active" : "disabled";

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description={
          <>
            Project ID <code className="font-mono text-xs">{project.id}</code> · created{" "}
            {formatDate(project.createdAt)}
          </>
        }
        actions={
          <Link
            href="/dashboard/projects"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeftIcon className="size-4" />
            All projects
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>General settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Project name</Label>
                <Input
                  id="settings-name"
                  {...form.register("name")}
                  aria-invalid={Boolean(form.formState.errors.name)}
                />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                ) : (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Slug: /{project.slug}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="settings-enabled">Project enabled</Label>
                  <p className="text-xs text-muted-foreground">
                    Disabled projects reject new uploads.
                  </p>
                </div>
                <Controller
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <Switch
                      id="settings-enabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Project enabled"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-max-size">Max file size (MB)</Label>
                <Input
                  id="settings-max-size"
                  type="number"
                  min={1}
                  {...form.register("maxFileSizeMB", { valueAsNumber: true })}
                  aria-invalid={Boolean(form.formState.errors.maxFileSizeMB)}
                />
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  Currently {formatBytes(project.maxFileSize)}
                </p>
                {form.formState.errors.maxFileSizeMB ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.maxFileSizeMB.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-mime">Allowed MIME types</Label>
                <div className="flex gap-2">
                  <Input
                    id="settings-mime"
                    placeholder="image/png"
                    value={mimeDraft}
                    onChange={(event) => setMimeDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addMimeType();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addMimeType}>
                    <PlusIcon />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {mimeTypes.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No restrictions — any concrete type except executable web content.
                    </p>
                  ) : (
                    mimeTypes.map((mime) => (
                      <Badge key={mime} variant="secondary" className="gap-1 pr-1 font-mono">
                        {mime}
                        <button
                          type="button"
                          onClick={() => removeMimeType(mime)}
                          aria-label={`Remove ${mime}`}
                          className="rounded p-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <XIcon className="size-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-4">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving…" : "Save settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={effectiveStatus} />
              <p className="mt-3 text-xs text-muted-foreground">
                Status shown here reflects the local form until a project-update
                endpoint is available.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1.5 font-mono text-[11px]">
                  {project.publicKey}
                </code>
                <CopyButton value={project.publicKey} label="Copy" size="icon-sm" />
              </div>
              <p className="text-xs text-muted-foreground">
                Safe to use in client-side code. Secret keys are managed under API keys.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
