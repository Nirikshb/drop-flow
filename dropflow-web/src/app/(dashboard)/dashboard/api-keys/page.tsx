"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  KeyRoundIcon,
  PlusIcon,
  ShieldAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import type { ApiKey } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CopyButton } from "@/components/dashboard/copy-button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ErrorState } from "@/components/dashboard/error-state";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { formatDate, formatRelativeTime, truncateMiddle } from "@/components/dashboard/format";

const createKeySchema = z.object({
  name: z.string().trim().min(2, "Give the key a descriptive name"),
});
type CreateKeyValues = z.infer<typeof createKeySchema>;

export default function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [oneTimeSecret, setOneTimeSecret] = useState<{
    secret: string;
    name: string;
  } | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });

  const projects = projectsQuery.data ?? [];

  useEffect(() => {
    if (!selectedProjectId && projects[0]) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const activeProject = projects.find((project) => project.id === selectedProjectId);

  const keysQuery = useQuery({
    queryKey: ["api-keys", selectedProjectId],
    queryFn: () => dashboardService.listApiKeys(selectedProjectId),
    enabled: Boolean(selectedProjectId),
  });

  const form = useForm<CreateKeyValues>({
    resolver: zodResolver(createKeySchema),
    defaultValues: { name: "" },
  });

  const createMutation = useMutation({
    mutationFn: ({ name }: CreateKeyValues) =>
      dashboardService.createApiKey(selectedProjectId, name),
    onSuccess: ({ key, secret }) => {
      setOneTimeSecret({ secret, name: key.name });
      setCreateOpen(false);
      form.reset({ name: "" });
      toast.success("API key created — copy the secret now");
      void queryClient.invalidateQueries({
        queryKey: ["api-keys", selectedProjectId],
      });
    },
    onError: () => toast.error("Could not create the API key. Please try again."),
  });

  const keys = (keysQuery.data ?? []).map((key) => ({
    ...key,
    revoked: Boolean(key.revokedAt),
  }));

  const revokeMutation = useMutation({
    mutationFn: (key: ApiKey) => dashboardService.revokeApiKey(selectedProjectId, key.id),
    onSuccess: (_result, key) => {
      toast.success(`“${key.name}” revoked`);
      setKeyToRevoke(null);
      void queryClient.invalidateQueries({ queryKey: ["api-keys", selectedProjectId] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not revoke the key"),
  });

  function confirmRevoke() {
    if (!keyToRevoke) return;
    revokeMutation.mutate(keyToRevoke);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="API keys"
        description="Public keys identify your project. Secret keys authenticate server-side requests."
        actions={
          <Button onClick={() => setCreateOpen(true)} disabled={!selectedProjectId}>
            <PlusIcon />
            Create key
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Label htmlFor="project-selector" className="text-muted-foreground">
          Project
        </Label>
        <Select
          value={selectedProjectId}
          onValueChange={(value) => setSelectedProjectId(value ?? "")}
        >
          <SelectTrigger id="project-selector" className="w-full sm:w-72">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projectsQuery.isLoading ? (
            <LoadingState variant="rows" count={1} />
          ) : activeProject ? (
            <>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-3 py-2 font-mono text-xs">
                  {activeProject.publicKey}
                </code>
                <CopyButton
                  value={activeProject.publicKey}
                  label="Copy"
                  variant="outline"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This key is safe to include in browser code. It can only upload files
                that pass your project&apos;s validation rules.
              </p>
            </>
          ) : (
            <EmptyState
              compact
              icon={KeyRoundIcon}
              title="No project selected"
              description="Select a project to see its public key and secret keys."
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <div className="space-y-1">
            <CardTitle>Secret keys</CardTitle>
            <p className="text-xs text-muted-foreground">
              Server-side credentials for {activeProject?.name ?? "this project"}
            </p>
          </div>
          <Badge variant="secondary" className="tabular-nums">
            {keys.filter((key) => !key.revoked).length} active
          </Badge>
        </CardHeader>
        <CardContent className="px-0">
          {keysQuery.isLoading ? (
            <LoadingState variant="table" count={3} className="px-4" />
          ) : keysQuery.isError ? (
            <ErrorState className="m-4" onRetry={() => void keysQuery.refetch()} />
          ) : keys.length === 0 ? (
            <EmptyState
              icon={KeyRoundIcon}
              title="No secret keys yet"
              description="Create a key for each server or CI pipeline that talks to Dropflow."
              action={<Button onClick={() => setCreateOpen(true)}>Create key</Button>}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Prefix</TableHead>
                  <TableHead className="hidden md:table-cell">Last used</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="font-mono text-[11px]">
                        {truncateMiddle(key.keyPrefix, 12, 4)}…
                      </code>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {key.lastUsedAt ? formatRelativeTime(key.lastUsedAt) : "Never"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {formatDate(key.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={key.revoked ? "revoked" : "active"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={key.revoked}
                        onClick={() => setKeyToRevoke(key)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Alert>
        <ShieldAlertIcon />
        <div className="space-y-1">
          <AlertTitle>Keep secrets on your server</AlertTitle>
          <AlertDescription>
            Secret keys are shown in full only once, at creation. Store them in your
            secret manager and never ship them to the browser.
          </AlertDescription>
        </div>
      </Alert>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) form.reset({ name: "" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create secret key</DialogTitle>
            <DialogDescription>
              Give this credential a name that describes where it will be used.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="key-name">Key name</Label>
              <Input
                id="key-name"
                placeholder="Production web server"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating…" : "Create key"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(oneTimeSecret)}
        onOpenChange={(open) => {
          if (!open) setOneTimeSecret(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your secret key</DialogTitle>
            <DialogDescription>
              Copy it now and store it somewhere safe.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <TriangleAlertIcon />
            <div className="space-y-1">
              <AlertTitle>One-time display</AlertTitle>
              <AlertDescription>
                This is the only time this secret will be shown. After you close this
                dialog it cannot be retrieved again.
              </AlertDescription>
            </div>
          </Alert>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{oneTimeSecret?.name}</p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded-md bg-muted p-3 font-mono text-xs">
                {oneTimeSecret?.secret}
              </code>
              <CopyButton
                value={oneTimeSecret?.secret ?? ""}
                label="Copy secret"
                variant="outline"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOneTimeSecret(null)}>I&apos;ve saved it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(keyToRevoke)}
        onOpenChange={(open) => !open && setKeyToRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke {keyToRevoke?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Revoked keys stop working immediately. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmRevoke}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending ? "Revoking…" : "Revoke key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
