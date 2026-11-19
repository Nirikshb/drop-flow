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

/* Reference: Framer's own navbar (64px, 12–14px labels, no top border) and
   InTheWork (76px). Three-column layout keeps the brand and actions balanced
   instead of leaving a large empty bar at tablet widths. */
const navLinkBase =
  "relative rounded-md px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
        "sticky top-0 z-40 w-full bg-background/95 transition-shadow [&_svg_rect]:fill-foreground",
        scrolled && "border-b shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="container-wide grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-[72px] lg:gap-8">
        <div className="flex min-w-0 items-center">
          <Logo large />
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center gap-0.5 min-[740px]:flex"
        >
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
                  className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-foreground"
                />
              )}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(navLinkBase, "group inline-flex items-center gap-1")}
            >
              Resources
              <ChevronDown className="size-3.5 transition-transform group-data-[popup-open]:rotate-180" />
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

        <div className="hidden items-center justify-end gap-2 min-[740px]:flex">
          <Button
            variant="ghost"
            className="hidden h-9 px-3 text-[13px] lg:inline-flex"
            render={<Link href="/login" />}
          >
            Log in
          </Button>
          <Button
            className="h-9 gap-1.5 rounded-full px-4 text-[13px]"
            render={<Link href="/signup" />}
          >
            Get started
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-end min-[740px]:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" className="size-4" />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
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
