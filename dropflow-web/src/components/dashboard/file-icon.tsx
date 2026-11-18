import {
  ArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import { fileKind, type FileKind } from "./format";
import { cn } from "@/lib/utils";

const STYLES: Record<FileKind, { icon: LucideIcon; tone: string }> = {
  image: { icon: ImageIcon, tone: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" },
  video: { icon: VideoIcon, tone: "bg-fuchsia-500/12 text-fuchsia-600 dark:text-fuchsia-400" },
  audio: { icon: MusicIcon, tone: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
  pdf: { icon: FileTextIcon, tone: "bg-rose-500/12 text-rose-600 dark:text-rose-400" },
  archive: { icon: ArchiveIcon, tone: "bg-orange-500/12 text-orange-600 dark:text-orange-400" },
  text: { icon: FileSpreadsheetIcon, tone: "bg-sky-500/12 text-sky-600 dark:text-sky-400" },
  other: { icon: FileIcon, tone: "bg-muted text-muted-foreground" },
};

export function FileIconBadge({
  mimeType,
  className,
  iconClassName,
}: {
  mimeType: string;
  className?: string;
  iconClassName?: string;
}) {
  const { icon: Icon, tone } = STYLES[fileKind(mimeType)];
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
        tone,
        className,
      )}
      aria-hidden="true"
    >
      <Icon className={cn("size-4", iconClassName)} />
    </span>
  );
}
