import type { Metadata } from "next";

import {
  LegalPage,
  type LegalSection,
} from "@/components/marketing/legal-page";

import { TemplatePages } from "../privacypolicynew/_components/template-pages";

export const metadata: Metadata = {
  title: "Terms of Service (Draft)",
  description:
    "A substantial draft template for future Dropflow terms of service. Placeholder only — not legal advice, not an offer, and not a binding agreement.",
};

const sections: LegalSection[] = [
  {
    heading: "About this draft",
    paragraphs: [
      "This document is a structural template for a future terms of service agreement covering the use of Dropflow, an AI-native file upload and asset platform. It sketches the topics a finished agreement would need to address so that reviewers can see the intended shape early.",
      "Nothing here is an offer, an acceptance, or a binding agreement. No service is being provided on these terms, and the text is not legal advice. Every clause should be rewritten against the final product and reviewed by qualified counsel before publication.",
    ],
  },
  {
    heading: "Accounts and eligibility",
    paragraphs: [
      "A completed agreement would define who may open an account, what information must be accurate at sign-up, and the responsibilities that come with maintaining credentials. It would set a minimum age and state that accounts may not be transferred without permission.",
    ],
    bullets: [
      "Applicants would need to be old enough to form a binding contract in their jurisdiction",
      "Registration details would have to be accurate and kept up to date",
      "Account holders would be responsible for activity that occurs under their credentials",
      "Suspension or closure rights would be described in a final version",
    ],
  },
  {
    heading: "Organizations and members",
    paragraphs: [
      "Dropflow is designed around organizations and projects. A final agreement would describe organization ownership, the difference between owner and member roles, and who has authority to invite users, create keys, change limits or close the account. It would also explain that an organization — rather than an individual — is usually the customer for billing purposes.",
    ],
  },
  {
    heading: "Projects, API keys and credentials",
    paragraphs: [
      "A finished agreement would distinguish between public keys, which are safe to include in browser code, and private credentials, which must be kept on a server. It would state that keys are hashed at rest and shown only once at creation, and that a customer is responsible for rotating a key promptly if it is exposed.",
    ],
  },
  {
    heading: "Acceptable use",
    paragraphs: [
      "Acceptable-use rules would be set out in full in a final agreement. The list below illustrates the kinds of restrictions such a section would contain; it is not currently enforceable.",
    ],
    bullets: [
      "Do not use the service for unlawful, infringing or harmful content",
      "Do not upload malware, or files designed to attack other systems or users",
      "Do not attempt to bypass project limits, rate limits or access controls",
      "Do not probe, scan or disrupt the platform or the networks behind it",
      "Do not use the service to send unsolicited bulk messages or facilitate fraud",
      "Do not resell raw platform access in a way that circumvents plan boundaries",
    ],
  },
  {
    heading: "Files, assets and ownership",
    paragraphs: [
      "A completed agreement would confirm that customers retain ownership of the files they upload and grant the platform only the limited rights needed to store, transmit and display those files as part of providing the service. It would set out permitted file types, maximum sizes, the meaning of an asset's lifecycle state, and the consequences of exceeding a plan's allowances.",
    ],
  },
  {
    heading: "Illustrative fees and billing",
    paragraphs: [
      "The figures shown on the pricing preview are illustrative examples only. They are not an offer, no invoice is generated, and no payment is collected anywhere in this application. A final agreement would state actual fees, billing frequency, renewal and cancellation mechanics, taxes, and any refund policy before any charge could be made.",
    ],
    bullets: [
      "Free — $0 forever, intended for side projects and evaluation",
      "Pro — $29 per month, positioned for products with real users",
      "Business — $99 per month, positioned for teams operating at scale",
      "Usage above a plan's allowances would be governed by limits agreed in a final contract",
    ],
  },
  {
    heading: "Availability, support and service levels",
    paragraphs: [
      "A final document would define any uptime commitment, maintenance windows and support channels, together with the remedies that apply if a commitment is missed. No service-level commitment is made in this draft, and the support experience described on other pages of this template is illustrative.",
    ],
  },
  {
    heading: "Intellectual property and confidentiality",
    paragraphs: [
      "The platform, SDK, documentation and design are the intellectual property of their respective owners. A completed agreement would grant customers a limited, revocable licence to use them for the intended purpose, and would prohibit copying or reverse engineering except where the law expressly allows it. It would also cover feedback: suggestions voluntarily provided could be used without obligation. Mutual confidentiality obligations — particularly around private credentials and non-public information — would be specified in the final text.",
    ],
  },
  {
    heading: "Warranties and limitation of liability",
    paragraphs: [
      "A finished agreement would state any warranties precisely and would describe the extent to which the service is provided on an as-is basis. It would also set out limitations on liability, including exclusions for indirect or consequential loss and any cap on aggregate claims, together with the exceptions that law does not permit a party to exclude. No such terms are established by this draft.",
    ],
  },
  {
    heading: "Termination",
    paragraphs: [
      "A completed agreement would explain how either party may end the relationship: how an account may be closed, what notice is required, what happens to stored assets and keys after closure, and which provisions survive termination. It would also describe the process for appealing a suspension and for exporting data before an account is deleted.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "The operator of a real service would reserve the right to update its terms, with a revision date, a summary of material changes, and advance notice where appropriate. Continued use after an update would be addressed explicitly in the final text.",
      "No support inbox is configured in this environment, so no contact address is given here. A real agreement would include a valid contact address and any required statutory details.",
    ],
  },
];

export default function TermsNewPage() {
  return (
    <>
      <LegalPage
        title="Terms of Service"
        description="This placeholder shows the intended structure of future terms. No agreement is offered or accepted here."
        updated="18 November 2026"
        intro="The sections below are a template for a future terms of service document. They cover the topics a real agreement would need — accounts, acceptable use, illustrative billing, ownership, liability and termination — but they are not an offer, are not binding, and should not be interpreted as legal advice."
        sections={sections}
      />
      <TemplatePages />
    </>
  );
}
