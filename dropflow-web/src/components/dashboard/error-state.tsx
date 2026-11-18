"use client";

import { RefreshCwIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorState({
  message = "Something went wrong while loading this data.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Alert variant="destructive" className={cn("items-start", className)}>
      <TriangleAlertIcon />
      <div className="space-y-2">
        <AlertTitle>Couldn&apos;t load this section</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        {onRetry ? (
          <Button type="button" size="sm" variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            Retry
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}
