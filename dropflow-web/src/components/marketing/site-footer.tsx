import Link from "next/link";
import { Code2, Heart } from "lucide-react";

import { Logo } from "@/components/marketing/logo";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "SDK reference", href: "/docs#sdk" },
      { label: "API", href: "/docs#api" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "Contact", href: "/contact" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/25">
      <div className="container-wide py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              File upload infrastructure for teams that would rather ship product
              than maintain storage pipelines.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-[11px] text-muted-foreground">
              <Code2 className="size-3" aria-hidden="true" />
              SDK-first · Private by default
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold tracking-wider text-foreground uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li className="flex items-center gap-2">
                <Link
                  href="/privacy"
                  className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Privacy
                </Link>
                <span className="rounded border border-dashed px-1 py-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Draft
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Link
                  href="/terms"
                  className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Terms
                </Link>
                <span className="rounded border border-dashed px-1 py-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Draft
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Dropflow. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Built for developers
            <Heart className="size-3" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
