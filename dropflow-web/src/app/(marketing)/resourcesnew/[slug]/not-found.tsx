import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { Eyebrow } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

import { TemplatePagesStrip } from "../_components/template-pages-strip";

export default function ResourceNotFound() {
  return (
    <section className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border bg-primary/5 text-primary">
        <FileQuestion className="size-6" aria-hidden="true" />
      </div>
      <Eyebrow className="mt-6">404</Eyebrow>
      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        That resource doesn’t exist
      </h1>
      <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        The link may be outdated, or the article may have been moved. Browse the
        library to find what you were looking for.
      </p>
      <Button className="mt-7" render={<Link href="/resourcesnew" />}>
        <ArrowLeft aria-hidden="true" />
        Back to resources
      </Button>
      <TemplatePagesStrip className="mt-10 w-full max-w-3xl text-left" />
    </section>
  );
}
