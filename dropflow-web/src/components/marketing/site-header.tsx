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
  "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-7">
          <Logo />
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
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/contact" className="gap-2" />}
                >
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

        <div className="hidden items-center gap-1.5 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            Log in
          </Button>
          <Button
            size="sm"
            render={<Link href="/signup" />}
            className="shadow-sm"
          >
            Get started
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" />
          </Button>
          <SheetContent side="right" className="w-[85%] sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navigate Dropflow</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4">
              {mainLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        isActive(link.href) && "bg-accent text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  }
                />
              ))}
              <p className="mt-5 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Resources
              </p>
              <SheetClose
                render={
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    Contact
                  </Link>
                }
              />
              <div className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground/60">
                <Activity className="size-4" aria-hidden="true" />
                Status <span className="ml-auto text-xs">Soon</span>
              </div>
              <div className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground/60">
                <GitBranch className="size-4" aria-hidden="true" />
                GitHub <span className="ml-auto text-xs">Soon</span>
              </div>
            </nav>
            <SheetFooter className="flex-row gap-2">
              <Button variant="outline" className="flex-1" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button className="flex-1" render={<Link href="/signup" />}>
                Get started
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
