import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  compact?: boolean;
}

/** Original Dropflow wordmark: a geometric bracket + downward arrow/droplet mark. */
export function Logo({ className, href = "/", compact = false }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Dropflow home"
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <svg
        viewBox="0 0 28 28"
        className="size-7 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="7" className="fill-primary" />
        <path
          d="M10 8.5H8.25v11H10M18 8.5h1.75v11H18"
          stroke="white"
          strokeOpacity="0.72"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 8.75v8.5m0 0-3-3m3 3 3-3"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-semibold tracking-[-0.035em] text-foreground">
          dropflow
        </span>
      )}
    </Link>
  );
}
