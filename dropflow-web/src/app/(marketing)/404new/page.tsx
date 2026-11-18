import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CircleDollarSign,
  FileQuestion,
  Home,
  Mail,
  Newspaper,
  PlugZap,
  Users,
} from "lucide-react";

import { Eyebrow } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TemplatePages } from "../privacypolicynew/_components/template-pages";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That Dropflow page could not be found. Head back to the homepage or jump to one of the template pages.",
};

const quickLinks = [
  {
    href: "/homenew",
    label: "Home",
    description: "What Dropflow does and why it exists.",
    icon: Home,
  },
  {
    href: "/pricingnew",
    label: "Pricing",
    description: "Illustrative plans and a full feature comparison.",
    icon: CircleDollarSign,
  },
  {
    href: "/integrationsnew",
    label: "Integrations",
    description: "Connect uploads to the tools you already use.",
    icon: PlugZap,
  },
  {
    href: "/resourcesnew",
    label: "Resources",
    description: "Guides and references for building with Dropflow.",
    icon: BookOpen,
  },
  {
    href: "/changelognew",
    label: "Changelog",
    description: "See what has shipped and what is coming next.",
    icon: Newspaper,
  },
  {
    href: "/careersnew",
    label: "Careers",
    description: "Open roles and how the team works.",
    icon: BriefcaseBusiness,
  },
  {
    href: "/aboutnew",
    label: "About",
    description: "The people and ideas behind the platform.",
    icon: Users,
  },
  {
    href: "/contact-salesnew",
    label: "Contact sales",
    description: "Talk through a plan for your team.",
    icon: Mail,
  },
];

export default function NotFoundPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div
          aria-hidden="true"
          className="grid-pattern mask-fade-b pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 size-[24rem] rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div className="container-wide relative flex flex-col items-center py-18 text-center sm:py-24">
          <Eyebrow>
            <FileQuestion className="size-3" aria-hidden="true" />
            Error 404
          </Eyebrow>
          <p
            className="text-gradient mt-5 text-[7.5rem] leading-[0.85] font-bold tracking-[-0.08em] sm:text-[10rem] lg:text-[12rem]"
            aria-label="404"
            role="img"
          >
            404
          </p>
          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            This page went missing in transit
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            The link may be out of date, or the page may have moved. The good
            news: your uploads are safe. Pick a destination below and keep
            building.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-11 px-5"
              render={<Link href="/homenew" />}
            >
              <ArrowLeft aria-hidden="true" />
              Back to homepage
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-5"
              render={<Link href="/resourcesnew" />}
            >
              Browse resources
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <section className="container-wide py-14 sm:py-20">
        <div className="max-w-2xl">
          <Eyebrow>Keep exploring</Eyebrow>
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Useful places to go
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            These pages are part of the Dropflow template. Pick one to get
            back on track.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="h-full transition-colors group-hover:bg-accent/50 group-hover:ring-primary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <ArrowRight
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <CardTitle className="mt-3">{link.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {link.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <TemplatePages />
    </>
  );
}
