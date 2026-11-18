import { Fragment } from "react";
import Link from "next/link";

const pages = [
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

export function TemplatePages() {
  return (
    <nav aria-label="Template pages" className="border-t bg-muted/30">
      <div className="container-wide flex flex-wrap items-center gap-x-2.5 gap-y-2 py-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Template pages</span>
        <span aria-hidden="true" className="text-border">
          /
        </span>
        {pages.map((page, index) => (
          <Fragment key={page.href}>
            <Link
              href={page.href}
              className="transition-colors hover:text-primary hover:underline hover:underline-offset-4"
            >
              {page.label}
            </Link>
            {index < pages.length - 1 && (
              <span aria-hidden="true" className="text-border">
                ·
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
