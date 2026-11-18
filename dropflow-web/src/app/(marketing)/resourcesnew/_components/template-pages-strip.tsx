import Link from "next/link";
import { LayoutTemplate } from "lucide-react";

import { cn } from "@/lib/utils";

/** Compact navigation for the alternate template pages used in this demo. */
const templatePages = [
  { href: "/homenew", label: "Home" },
  { href: "/pricingnew", label: "Pricing" },
  { href: "/integrationsnew", label: "Integrations" },
  { href: "/careersnew", label: "Careers" },
  { href: "/resourcesnew", label: "Resources" },
  { href: "/changelognew", label: "Changelog" },
  { href: "/aboutnew", label: "About" },
  { href: "/contact-salesnew", label: "Contact sales" },
  { href: "/privacypolicynew", label: "Privacy policy" },
  { href: "/termsnew", label: "Terms" },
  { href: "/cookiesnew", label: "Cookies" },
  { href: "/loginnew", label: "Log in" },
  { href: "/signupnew", label: "Sign up" },
];

export function TemplatePagesStrip({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Template pages"
      className={cn(
        "rounded-xl border bg-muted/30 px-4 py-4 sm:px-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          <LayoutTemplate className="size-3.5" aria-hidden="true" />
          Template pages
        </span>
        {templatePages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {page.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
