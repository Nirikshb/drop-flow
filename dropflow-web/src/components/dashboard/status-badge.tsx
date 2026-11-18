import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  ClockIcon,
  KeyRoundIcon,
  Trash2Icon,
  UploadCloudIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ActivityEvent } from "@/types";
import { cn } from "@/lib/utils";

const STATUSES: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; tone?: string }
> = {
  active: { label: "Active", variant: "default", tone: "bg-emerald-600" },
  completed: { label: "Completed", variant: "default", tone: "bg-emerald-600" },
  enabled: { label: "Enabled", variant: "default", tone: "bg-emerald-600" },
  pending: { label: "Pending", variant: "secondary", tone: "bg-amber-500" },
  uploading: { label: "Uploading", variant: "secondary", tone: "bg-sky-500" },
  queued: { label: "Queued", variant: "secondary", tone: "bg-sky-500" },
  expired: { label: "Expired", variant: "outline", tone: "bg-muted-foreground" },
  cancelled: { label: "Cancelled", variant: "outline", tone: "bg-muted-foreground" },
  disabled: { label: "Disabled", variant: "secondary", tone: "bg-muted-foreground" },
  suspended: { label: "Suspended", variant: "destructive", tone: "bg-destructive" },
  failed: { label: "Failed", variant: "destructive", tone: "bg-destructive" },
  deleted: { label: "Deleted", variant: "destructive", tone: "bg-destructive" },
  revoked: { label: "Revoked", variant: "destructive", tone: "bg-destructive" },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const config = STATUSES[status] ?? {
    label: status,
    variant: "outline" as const,
  };
  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      <span
        className={cn("size-1.5 rounded-full bg-current", config.tone)}
        aria-hidden="true"
      />
      {label ?? config.label}
    </Badge>
  );
}

const ACTIVITY_ICONS: Record<ActivityEvent["type"], LucideIcon> = {
  "upload.completed": UploadCloudIcon,
  "asset.deleted": Trash2Icon,
  "key.created": KeyRoundIcon,
  "project.created": CheckCircle2Icon,
  "member.invited": CircleDashedIcon,
};

export function ActivityIcon({
  type,
  className,
}: {
  type: ActivityEvent["type"];
  className?: string;
}) {
  const Icon = ACTIVITY_ICONS[type] ?? ClockIcon;
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}


