import Link from "next/link";
import { LayoutTemplate } from "lucide-react";

import { cn } from "@/lib/utils";

const templatePages = [
  { label: "Home", href: "/homenew" },
  { label: "Pricing", href: "/pricingnew" },
  { label: "Integrations", href: "/integrationsnew" },
  { label: "Careers", href: "/careersnew" },
  { label: "Resources", href: "/resourcesnew" },
  { label: "Changelog", href: "/changelognew" },
  { label: "About", href: "/aboutnew" },
  { label: "Contact sales", href: "/contact-salesnew" },
  { label: "Privacy", href: "/privacypolicynew" },
  { label: "Terms", href: "/termsnew" },
  { label: "Cookies", href: "/cookiesnew" },
  { label: "Log in", href: "/loginnew" },
  { label: "Sign up", href: "/signupnew" },
];

/**
 * A compact navigation strip that links every page in this template set.
 * Kept local to the Careers routes so the shared header/footer stay untouched.
 */
export function TemplatePagesStrip({ current }: { current?: string }) {
  return (
    <nav
      aria-label="Template pages"
      className="border-y bg-muted/30 py-3"
    >
      <div className="container-wide flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <LayoutTemplate className="size-3.5" aria-hidden="true" />
          Template pages
        </span>
        {templatePages.map((page) => {
          const active = current === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-1.5 py-0.5 text-xs transition-colors",
                active
                  ? "font-semibold text-primary underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {page.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
