import type { Metadata } from "next";

import {
  LegalPage,
  type LegalSection,
} from "@/components/marketing/legal-page";

import { TemplatePages } from "../privacypolicynew/_components/template-pages";

export const metadata: Metadata = {
  title: "Cookie Notice (Draft)",
  description:
    "A substantial draft template for a future Dropflow cookie notice. Placeholder only — not legal advice and not a statement of a live tracking setup.",
};

const sections: LegalSection[] = [
  {
    heading: "About this draft",
    paragraphs: [
      "This page is a template for a future cookie notice for the Dropflow dashboard and marketing site. It explains the kinds of cookies a hosted application of this type would typically use and the controls a visitor could expect. It is not a description of a live tracking setup: no cookie inventory has been audited, and no consent mechanism is in force here.",
      "A finished notice should list real cookies by name, confirm their lifetimes through testing, and be reviewed by qualified counsel before it is published or relied on.",
    ],
  },
  {
    heading: "What cookies are",
    paragraphs: [
      "A cookie is a small text file that a website asks your browser to store on your device. It lets the site remember information between visits — for example, whether you are signed in or which layout you prefer. Similar technologies, such as local storage and pixels, can serve comparable purposes; a final notice would cover those as well where they are used.",
      "Cookies can be session cookies, which disappear when you close your browser, or persistent cookies, which remain until they expire or you delete them. They can also be first-party, set by the site you are visiting, or third-party, set by another domain embedded on that site.",
    ],
  },
  {
    heading: "Categories we would use",
    paragraphs: [
      "A production deployment would keep cookie use narrow and purpose-driven. The categories below illustrate what a completed notice would document; none is presented here as currently active.",
    ],
    bullets: [
      "Strictly necessary cookies for sign-in, session continuity and security",
      "Preference cookies that remember choices such as theme and dashboard layout",
      "Analytics cookies that measure aggregate usage and help improve the product",
      "No advertising or cross-site tracking cookies are contemplated by this template",
    ],
  },
  {
    heading: "The session cookie",
    paragraphs: [
      "An essential session cookie would keep a signed-in user authenticated while they move between pages and would expire when the session ends or the browser is closed. It would not be used for advertising and could not be switched off without breaking sign-in. A final notice would give the cookie's exact name, domain and lifetime.",
    ],
  },
  {
    heading: "Preference cookies",
    paragraphs: [
      "Preference cookies would remember non-sensitive choices so the dashboard behaves the same way on each visit — for example, a light or dark theme, a collapsed sidebar, a preferred table density or the last project selected. These would improve convenience but would not be required to use the core service.",
    ],
  },
  {
    heading: "Analytics cookies",
    paragraphs: [
      "If analytics were enabled, a cookie or similar identifier could help distinguish returning devices so that usage can be counted once per visitor. The intention would be to collect aggregated, de-identified information — such as which pages are visited and which features are used — rather than personal profiles. No data would be sold, and analytics would be opt-out wherever a preference control is offered. A completed notice would name the provider and describe any international transfers.",
    ],
  },
  {
    heading: "Third-party cookies",
    paragraphs: [
      "This template does not set any third-party cookies. A real deployment might embed a small number of providers — for example, an analytics service or an authentication provider — and the final notice would list each one, what it sets and why. Where a third party acts only on the operator's behalf, that relationship would be explained alongside the subprocessor list in the privacy notice.",
    ],
  },
  {
    heading: "How long cookies would last",
    paragraphs: [
      "Lifetimes would be kept as short as each purpose allows. Purely by way of illustration, a session cookie would last for the browser session, a preference cookie for around thirty days, and an analytics identifier for up to twelve months unless cleared sooner. A final notice would replace these examples with the actual expiry of every cookie the service sets.",
    ],
  },
  {
    heading: "How to manage cookies",
    paragraphs: [
      "Most browsers let you view, block or delete cookies through their settings, and clearing site data removes cookies already stored. Where the product offers a preference control, non-essential cookies could be declined without affecting the ability to sign in or upload files. Blocking strictly necessary cookies, however, would prevent sessions from working correctly.",
    ],
    bullets: [
      "Use your browser's privacy settings to block or delete cookies for this site",
      "Clear existing site data to remove cookies that were previously stored",
      "Decline non-essential categories through any preference control the product provides",
      "Opt out of analytics where an opt-out mechanism is made available",
      "Be aware that disabling essential cookies will break sign-in and session features",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "When a real cookie notice replaces this template, it would carry a revision date and describe material changes. If a new category of cookie were introduced, notice would be given before it was set where required.",
      "No support inbox is configured in this environment, so no contact address is provided here. A completed notice would include a monitored address for questions about cookies and similar technologies.",
    ],
  },
];

export default function CookiesNewPage() {
  return (
    <>
      <LegalPage
        title="Cookie Notice"
        description="This placeholder shows the intended structure of a future cookie notice. No cookie inventory has been audited and no consent mechanism is in force."
        updated="18 November 2026"
        intro="This draft explains the categories of cookies a file-upload and asset platform would typically use — the essential session cookie, saved preferences and optional analytics — along with how a visitor could manage them. It is a template only, not a verified inventory and not legal advice."
        sections={sections}
      />
      <TemplatePages />
    </>
  );
}
