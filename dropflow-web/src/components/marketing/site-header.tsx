"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  GitBranch,
  Mail,
  Menu,
} from "lucide-react";

import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/features", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/docs", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
];

/* Compact, machine-like navigation label: small, mono, tracked, neutral. */
const navLabel =
  "font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground";
const navLinkBase = cn(
  "relative px-2.5 py-2 transition-colors hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  navLabel,
);

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background [&_svg_rect]:fill-foreground">
      <div className="container-wide flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Logo />
          <span aria-hidden="true" className="hidden h-4 w-px bg-border lg:block" />
          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(navLinkBase, isActive(link.href) && "text-foreground")}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 -bottom-px h-px bg-foreground"
                  />
                )}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(navLinkBase, "group inline-flex items-center gap-1")}
              >
                Resources
                <ChevronDown className="size-3 transition-transform group-data-[popup-open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-md">
                <DropdownMenuLabel className={cn(navLabel, "text-foreground")}>
                  Resources
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/contact" className="gap-2" />}>
                  <Mail aria-hidden="true" className="size-3.5" />
                  Contact
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Activity aria-hidden="true" className="size-3.5" />
                  Status
                  <span className={cn("ml-auto", navLabel)}>Soon</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <GitBranch aria-hidden="true" className="size-3.5" />
                  GitHub
                  <span className={cn("ml-auto", navLabel)}>Soon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className={cn(navLabel, "h-8 px-2.5")}
            render={<Link href="/login" />}
          >
            Log in
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 rounded-md px-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em]"
            render={<Link href="/signup" />}
          >
            Get started
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-md md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" className="size-4" />
          </Button>
          <SheetContent side="right" className="w-[85%] rounded-none sm:max-w-xs">
            <SheetHeader>
              <SheetTitle className="font-mono text-xs uppercase tracking-[0.16em]">
                Menu
              </SheetTitle>
              <SheetDescription className="font-mono text-[10px] uppercase tracking-[0.14em]">
                Navigate Dropflow
              </SheetDescription>
            </SheetHeader>
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col divide-y divide-border px-4"
            >
              {mainLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors hover:text-foreground",
                        isActive(link.href)
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="ml-auto h-px w-5 bg-foreground" />
                      )}
                    </Link>
                  }
                />
              ))}
              <p className={cn("pt-5", navLabel, "text-foreground")}>Resources</p>
              <SheetClose
                render={
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="size-3.5" aria-hidden="true" />
                    Contact
                  </Link>
                }
              />
              <div className="flex items-center gap-2 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
                <Activity className="size-3.5" aria-hidden="true" />
                Status <span className="ml-auto text-[9px]">Soon</span>
              </div>
              <div className="flex items-center gap-2 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
                <GitBranch className="size-3.5" aria-hidden="true" />
                GitHub <span className="ml-auto text-[9px]">Soon</span>
              </div>
            </nav>
            <SheetFooter className="flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-md font-mono text-[10px] uppercase tracking-[0.14em]"
                render={<Link href="/login" />}
              >
                Log in
              </Button>
              <Button
                className="flex-1 rounded-md font-mono text-[10px] uppercase tracking-[0.14em]"
                render={<Link href="/signup" />}
              >
                Get started
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
