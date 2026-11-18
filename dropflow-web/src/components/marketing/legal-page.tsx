import { TriangleAlert } from "lucide-react";

import { Eyebrow } from "@/components/marketing/section";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalPageProps {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({
  title,
  description,
  updated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <>
      <section className="border-b bg-muted/20">
        <div className="container-wide py-16 sm:py-20">
          <div className="max-w-3xl">
            <Eyebrow>Legal placeholder</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Draft · Last updated {updated}
            </p>
          </div>
        </div>
      </section>

      <div className="container-wide py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div
            role="note"
            className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">Draft — not legal advice</p>
              <p className="mt-1 text-xs leading-relaxed opacity-90">
                This page is a placeholder for a future document. It is not
                legal advice, is not complete, and should not be relied on for
                any decision.
              </p>
            </div>
          </div>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            {intro}
          </p>

          <div className="mt-10 flex flex-col gap-10">
            {sections.map((section, index) => (
              <section key={section.heading} className="scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-tight">
                  {index + 1}. {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t pt-6 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}
