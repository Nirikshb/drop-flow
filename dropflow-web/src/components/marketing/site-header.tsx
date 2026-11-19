"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";

import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/features", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/docs", label: "Documentation" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resourcesnew", label: "Resources" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36 };

  const panelVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.22, staggerChildren: reduceMotion ? 0 : 0.035 },
    },
    exit: { opacity: 0, y: -8, transition: { duration: reduceMotion ? 0 : 0.16 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent bg-background/95 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 [&_svg_rect]:fill-foreground",
        scrolled && "border-border/70 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.45)]",
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <div className="flex shrink-0 items-center">
          <Logo large />
        </div>

        {/* Desktop: floating segmented capsule with a single sliding indicator. */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 rounded-full border bg-muted/40 p-1 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="relative flex min-h-9 items-center rounded-full px-3.5 py-2 text-[clamp(12px,0.95vw,13px)] font-medium text-muted-foreground transition-[color,transform] hover:text-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isActive(link.href) && (
                <motion.span
                  layoutId="df-nav-active"
                  className="absolute inset-0 rounded-full bg-background shadow-sm ring-1 ring-border/60"
                  transition={spring}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <Button
            variant="ghost"
            className="h-9 px-3 text-[clamp(12px,0.95vw,13px)] transition-transform active:scale-[0.98]"
            render={<Link href="/login" />}
          >
            Log in
          </Button>
          <Button
            className="h-9 gap-1.5 rounded-full px-4 text-[clamp(12px,0.95vw,13px)] transition-transform active:scale-[0.98]"
            render={<Link href="/signup" />}
          >
            Get started
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
        </div>

        {/* Mobile: a morphing two-line trigger, not the desktop capsule. */}
        <button
          type="button"
          className="relative flex size-11 items-center justify-center rounded-full border bg-background transition-transform active:scale-95 lg:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <motion.span
            aria-hidden="true"
            className="absolute h-px w-4 bg-foreground"
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute h-px w-4 bg-foreground"
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            key="mobile-nav"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-x-0 top-full border-b bg-background shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="container-wide py-4">
              {navLinks.map((link, index) => (
                <motion.div key={link.href} variants={rowVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-4 border-b py-3 text-[clamp(17px,4.6vw,19px)] font-medium tracking-tight transition-colors last:border-b-0",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="font-mono text-[10px] font-normal text-muted-foreground/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                    {isActive(link.href) && (
                      <span className="ml-auto size-1.5 rounded-full bg-foreground" />
                    )}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={rowVariants} className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-full text-[clamp(12px,3.5vw,13px)] transition-transform active:scale-[0.98]"
                  render={<Link href="/login" />}
                >
                  Log in
                </Button>
                <Button
                  className="h-11 flex-1 gap-1.5 rounded-full text-[clamp(12px,3.5vw,13px)] transition-transform active:scale-[0.98]"
                  render={<Link href="/signup" />}
                >
                  Get started <ArrowRight aria-hidden="true" className="size-3.5" />
                </Button>
              </motion.div>

              <motion.div
                variants={rowVariants}
                className="mt-4 flex min-h-11 items-center gap-2 font-mono text-[clamp(10px,2.8vw,11px)] uppercase tracking-wider text-muted-foreground"
              >
                <Mail aria-hidden="true" className="size-3.5" />
                <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-foreground">
                  Contact sales
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
