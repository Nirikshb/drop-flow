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

const navLinkBase =
  "relative rounded-md px-3 py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-background transition-shadow [&_svg_rect]:fill-foreground",
        scrolled && "border-b shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
      )}
    >
      <div className="container-wide flex h-[68px] items-center justify-between gap-6 md:h-[76px] lg:h-[88px]">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Logo large />
          <span aria-hidden="true" className="hidden h-6 w-px bg-border lg:block" />
          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
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
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-foreground"
                  />
                )}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(navLinkBase, "group inline-flex items-center gap-1.5")}
              >
                Resources
                <ChevronDown className="size-4 transition-transform group-data-[popup-open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-lg">
                <DropdownMenuLabel>Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/contact" className="gap-2" />}>
                  <Mail aria-hidden="true" />
                  Contact
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Activity aria-hidden="true" />
                  Status
                  <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <GitBranch aria-hidden="true" />
                  GitHub
                  <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" className="h-10 px-4" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button className="h-11 gap-2 px-5" render={<Link href="/signup" />}>
            Get started
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-md md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" className="size-5" />
          </Button>
          <SheetContent side="right" className="w-[85%] rounded-none sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigate Dropflow</SheetDescription>
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
                        "flex items-center gap-2 py-3.5 text-sm font-medium transition-colors hover:text-foreground",
                        isActive(link.href)
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="ml-auto h-0.5 w-6 bg-foreground" />
                      )}
                    </Link>
                  }
                />
              ))}
              <p className="pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resources
              </p>
              <SheetClose
                render={
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Contact
                  </Link>
                }
              />
              <div className="flex items-center gap-2 py-3.5 text-sm text-muted-foreground/60">
                <Activity className="size-4" aria-hidden="true" />
                Status <span className="ml-auto text-xs">Soon</span>
              </div>
              <div className="flex items-center gap-2 py-3.5 text-sm text-muted-foreground/60">
                <GitBranch className="size-4" aria-hidden="true" />
                GitHub <span className="ml-auto text-xs">Soon</span>
              </div>
            </nav>
            <SheetFooter className="flex-row gap-2">
              <Button
                variant="outline"
                className="h-10 flex-1"
                render={<Link href="/login" />}
              >
                Log in
              </Button>
              <Button className="h-10 flex-1" render={<Link href="/signup" />}>
                Get started
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
