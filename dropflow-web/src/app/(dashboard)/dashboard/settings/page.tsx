"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BellIcon,
  Building2Icon,
  FolderKanbanIcon,
  PlusIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { dashboardService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { ErrorState } from "@/components/dashboard/error-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { initials } from "@/components/dashboard/format";

const accountSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
});
type AccountValues = z.infer<typeof accountSchema>;

const organizationSchema = z.object({
  name: z.string().trim().min(2, "Organization name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
});
type OrganizationValues = z.infer<typeof organizationSchema>;

const restrictionsSchema = z.object({
  maxFileSizeMB: z.number().min(1, "At least 1 MB").max(10_000),
  allowedMimeTypes: z.array(z.string().trim().min(1)),
});
type RestrictionsValues = z.infer<typeof restrictionsSchema>;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-destructive">{message}</p> : null;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => dashboardService.getCurrentUser(),
  });
  const organizationsQuery = useQuery({
    queryKey: ["organizations"],
    queryFn: () => dashboardService.listOrganizations(),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => dashboardService.listProjects(),
  });

  const me = meQuery.data;
  const displayName = me?.name ?? "Your account";
  const organization = organizationsQuery.data?.[0];
  const project = projectsQuery.data?.[0];

  const accountForm = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "", email: "" },
  });

  const organizationForm = useForm<OrganizationValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "", slug: "" },
  });

  const restrictionsForm = useForm<RestrictionsValues>({
    resolver: zodResolver(restrictionsSchema),
    defaultValues: { maxFileSizeMB: 50, allowedMimeTypes: [] },
  });

  const [orgReady, setOrgReady] = useState(false);
  const [restrictionsReady, setRestrictionsReady] = useState(false);

  useEffect(() => {
    if (me) accountForm.reset({ name: me.name, email: me.email });
  }, [me, accountForm]);

  const accountMutation = useMutation({
    mutationFn: (values: AccountValues) =>
      dashboardService.updateProfile({ name: values.name, email: values.email }),
    onSuccess: () => {
      toast.success("Account updated");
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update the account"),
  });

  const organizationMutation = useMutation({
    mutationFn: (values: OrganizationValues) =>
      dashboardService.updateOrganization(organization!.id, { name: values.name }),
    onSuccess: () => {
      toast.success("Organization updated");
      void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not update the organization"),
  });

  const restrictionsMutation = useMutation({
    mutationFn: (values: RestrictionsValues) =>
      dashboardService.updateProject(project!.id, {
        maxFileSize: Math.round(values.maxFileSizeMB * 1_048_576),
        allowedMimeTypes: values.allowedMimeTypes,
      }),
    onSuccess: () => {
      toast.success("Project restrictions saved");
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not save the restrictions"),
  });

  useEffect(() => {
    if (organization) {
      organizationForm.reset({
        name: organization.name,
        slug: organization.slug,
      });
      setOrgReady(true);
    }
  }, [organization, organizationForm]);

  useEffect(() => {
    if (project) {
      restrictionsForm.reset({
        maxFileSizeMB: Math.max(1, Math.round(project.maxFileSize / 1_048_576)),
        allowedMimeTypes: project.allowedMimeTypes,
      });
      setRestrictionsReady(true);
    }
  }, [project, restrictionsForm]);

  const [mimeDraft, setMimeDraft] = useState("");
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    uploadComplete: true,
    weeklyDigest: false,
    securityAlerts: true,
  });

  const mimeTypes = restrictionsForm.watch("allowedMimeTypes");

  function addMimeType() {
    const value = mimeDraft.trim();
    if (!value || mimeTypes.includes(value)) return;
    restrictionsForm.setValue("allowedMimeTypes", [...mimeTypes, value]);
    setMimeDraft("");
  }

  const notificationItems: {
    key: keyof typeof notifications;
    label: string;
    description: string;
  }[] = [
    {
      key: "productUpdates",
      label: "Product updates",
      description: "News about new Dropflow features and improvements.",
    },
    {
      key: "uploadComplete",
      label: "Upload completed",
      description: "Get notified when a background upload finishes.",
    },
    {
      key: "weeklyDigest",
      label: "Weekly usage digest",
      description: "A summary of uploads, assets and requests every Monday.",
    },
    {
      key: "securityAlerts",
      label: "Security alerts",
      description: "Important notices about keys, sign-ins and account changes.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, organization, project defaults and notifications."
      />

      <Tabs defaultValue="account">
        <TabsList className="flex-wrap">
          <TabsTrigger value="account">
            <UserIcon />
            Account
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building2Icon />
            Organization
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderKanbanIcon />
            Projects
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellIcon />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="pt-4">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={accountForm.handleSubmit((values) => accountMutation.mutate(values))}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="account-name">Name</Label>
                  <Input
                    id="account-name"
                    {...accountForm.register("name")}
                    aria-invalid={Boolean(accountForm.formState.errors.name)}
                  />
                  <FieldError message={accountForm.formState.errors.name?.message} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email</Label>
                  <Input
                    id="account-email"
                    type="email"
                    placeholder="you@example.com"
                    {...accountForm.register("email")}
                    aria-invalid={Boolean(accountForm.formState.errors.email)}
                  />
                  <FieldError message={accountForm.formState.errors.email?.message} />
                </div>
                <div className="flex justify-end border-t border-border pt-4">
                  <Button type="submit" disabled={accountMutation.isPending}>
                    {accountMutation.isPending ? "Saving…" : "Save account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="pt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent>
                {organizationsQuery.isLoading || (organization && !orgReady) ? (
                  <LoadingState variant="rows" count={2} />
                ) : organizationsQuery.isError ? (
                  <ErrorState onRetry={() => void organizationsQuery.refetch()} />
                ) : !organization ? (
                  <p className="text-sm text-muted-foreground">
                    No organization data available to edit.
                  </p>
                ) : (
                  <form
                    onSubmit={organizationForm.handleSubmit((values) => organizationMutation.mutate(values))}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Name</Label>
                      <Input
                        id="org-name"
                        {...organizationForm.register("name")}
                        aria-invalid={Boolean(organizationForm.formState.errors.name)}
                      />
                      <FieldError message={organizationForm.formState.errors.name?.message} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org-slug">Slug</Label>
                      <Input
                        id="org-slug"
                        disabled
                        {...organizationForm.register("slug")}
                        aria-invalid={Boolean(organizationForm.formState.errors.slug)}
                      />
                      <FieldError message={organizationForm.formState.errors.slug?.message} />
                      <p className="text-xs text-muted-foreground">
                        Slugs cannot be changed after creation.
                      </p>
                    </div>
                    <div className="flex justify-end border-t border-border pt-4">
                      <Button type="submit" disabled={organizationMutation.isPending}>
                        {organizationMutation.isPending ? "Saving…" : "Save organization"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                </CardHeader>
                <CardContent>
                  {organization ? (
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{initials(displayName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          Your account in {organization.name}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {organization.role}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No organization data available.
                    </p>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    Member management is not available in this view yet.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invite member</CardTitle>
                </CardHeader>
                <CardContent>
                  <fieldset disabled className="space-y-4 opacity-60">
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email address</Label>
                      <Input id="invite-email" type="email" placeholder="teammate@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select defaultValue="member">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" disabled>
                      <PlusIcon />
                      Send invite
                    </Button>
                  </fieldset>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Invitations will be enabled when the members API is wired up.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="pt-4">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Project restrictions</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsQuery.isLoading || (project && !restrictionsReady) ? (
                <LoadingState variant="rows" count={3} />
              ) : projectsQuery.isError ? (
                <ErrorState onRetry={() => void projectsQuery.refetch()} />
              ) : !project ? (
                <p className="text-sm text-muted-foreground">
                  Create a project before configuring default restrictions.
                </p>
              ) : (
                <form
                  onSubmit={restrictionsForm.handleSubmit((values) => restrictionsMutation.mutate(values))}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="restrictions-size">Default max file size (MB)</Label>
                    <Input
                      id="restrictions-size"
                      type="number"
                      min={1}
                      {...restrictionsForm.register("maxFileSizeMB", {
                        valueAsNumber: true,
                      })}
                      aria-invalid={Boolean(restrictionsForm.formState.errors.maxFileSizeMB)}
                    />
                    <FieldError
                      message={restrictionsForm.formState.errors.maxFileSizeMB?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restrictions-mime">Allowed MIME types</Label>
                    <div className="flex gap-2">
                      <Input
                        id="restrictions-mime"
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
                          No MIME type restrictions.
                        </p>
                      ) : (
                        mimeTypes.map((mime) => (
                          <Badge key={mime} variant="secondary" className="gap-1 pr-1 font-mono">
                            {mime}
                            <button
                              type="button"
                              aria-label={`Remove ${mime}`}
                              onClick={() =>
                                restrictionsForm.setValue(
                                  "allowedMimeTypes",
                                  mimeTypes.filter((item) => item !== mime),
                                )
                              }
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
                    <Button type="submit" disabled={restrictionsMutation.isPending}>
                      {restrictionsMutation.isPending ? "Saving…" : "Save restrictions"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-4">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <p className="text-xs text-muted-foreground">
                Notification delivery is not configured yet, so these switches are not persisted.
              </p>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {notificationItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <Label>{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => {
                      setNotifications((current) => ({
                        ...current,
                        [item.key]: checked,
                      }));
                    }}
                    aria-label={item.label}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
