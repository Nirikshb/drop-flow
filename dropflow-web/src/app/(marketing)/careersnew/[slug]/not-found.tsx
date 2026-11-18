import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";

import { TemplatePagesStrip } from "../_components/template-pages-strip";
import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/marketing/section";

export default function JobNotFound() {
  return (
    <>
      <Section className="min-h-[55vh]">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full border bg-primary/5 text-primary">
            <BriefcaseBusiness className="size-6" aria-hidden="true" />
          </span>
          <Eyebrow className="mt-6">404 · Role not found</Eyebrow>
          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            That role is not on the board
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            The opening may have been filled or the link may be out of date.
            Browse the current list to see what is open right now.
          </p>
          <Button className="mt-7" render={<Link href="/careersnew#open-roles" />}>
            <ArrowLeft aria-hidden="true" />
            See all open roles
          </Button>
        </div>
      </Section>
      <TemplatePagesStrip current="/careersnew" />
    </>
  );
}
