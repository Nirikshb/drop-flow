import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Dropflow workspace to manage projects, assets and usage.",
};

const templatePages = [
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

function TemplatePagesStrip() {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Template pages
      </p>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
        {templatePages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded text-[11px] text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Good to see you again</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Log in to pick up where your team left off — projects, assets and usage in
        one place.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Dropflow?{" "}
        <Link
          href="/signupnew"
          className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Create an account
        </Link>
      </p>
      <div className="mt-8">
        <TemplatePagesStrip />
      </div>
    </div>
  );
}
