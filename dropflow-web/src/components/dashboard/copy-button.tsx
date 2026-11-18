"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  toastMessage?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "xs" | "icon" | "icon-sm" | "icon-xs";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CopyButton({
  value,
  label = "Copy",
  toastMessage = "Copied to clipboard",
  className,
  variant = "ghost",
  size = "sm",
  onClick,
}: CopyButtonProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(toastMessage);
    } catch {
      toast.error("Could not access the clipboard. Copy it manually instead.");
    }
  }

  const iconOnly =
    size === "icon" || size === "icon-sm" || size === "icon-xs";

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) void copy();
      }}
      aria-label={iconOnly ? label : undefined}
      className={cn(className)}
      title={label}
    >
      <CopyIcon />
      {!iconOnly && <span>{label}</span>}
    </Button>
  );
}

export function CopiedText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
      <CheckIcon className="size-3" />
      {children}
    </span>
  );
}
