import Link from "next/link";

const templatePages = [
  { href: "/homenew", label: "Home" },
  { href: "/pricingnew", label: "Pricing" },
  { href: "/integrationsnew", label: "Integrations" },
  { href: "/careersnew", label: "Careers" },
  { href: "/resourcesnew", label: "Resources" },
  { href: "/changelognew", label: "Changelog" },
  { href: "/aboutnew", label: "About" },
  { href: "/contact-salesnew", label: "Contact sales" },
  { href: "/privacypolicynew", label: "Privacy" },
  { href: "/termsnew", label: "Terms" },
  { href: "/cookiesnew", label: "Cookies" },
  { href: "/loginnew", label: "Log in" },
  { href: "/signupnew", label: "Sign up" },
];

/** Compact cross-link strip shown on template pages only. */
export function TemplatePagesStrip() {
  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3.5">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Template pages
        </span>
        <nav
          aria-label="Template pages"
          className="flex flex-wrap items-center gap-x-4 gap-y-1.5"
        >
          {templatePages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {page.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
