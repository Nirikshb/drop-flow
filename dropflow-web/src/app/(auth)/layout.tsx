import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, UploadCloud } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-cyan-600"
        />
        <div
          aria-hidden="true"
          className="grid-pattern absolute inset-0 opacity-20"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 -bottom-20 size-80 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg viewBox="0 0 28 28" className="size-8" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="7" fill="white" fillOpacity="0.16" />
              <path
                d="M10 8.5H8.25v11H10M18 8.5h1.75v11H18"
                stroke="white"
                strokeOpacity="0.75"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8.75v8.5m0 0-3-3m3 3 3-3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold tracking-tight">dropflow</span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <UploadCloud className="size-8 opacity-90" aria-hidden="true" />
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight">
            Uploads that just work.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            One SDK for validation, direct-to-storage transfers, progress and
            asset management. Spend your time on the product, not the plumbing.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-sm">
            {[
              "Direct-to-storage transfers",
              "Progress, retries and cancellation",
              "Private by default",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-primary-foreground/70">
          <ShieldCheck className="size-4" aria-hidden="true" />
          SDK-first · Private by default
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-end px-6 py-6 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
