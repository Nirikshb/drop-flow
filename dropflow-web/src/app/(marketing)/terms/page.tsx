import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service (Draft)",
  description:
    "Draft placeholder terms of service for Dropflow. Not legal advice and not a binding agreement.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="This placeholder shows the intended structure of future terms. No agreement is offered or accepted here."
      updated="18 November 2026"
      intro="The sections below are a structural template for a future terms of service document. They are not an offer, are not binding, and should not be interpreted as legal advice."
      sections={[
        {
          heading: "Scope",
          paragraphs: [
            "A completed agreement would define the service, who may use it, and the relationship between the operator and the customer. None of those terms are established by this draft.",
          ],
        },
        {
          heading: "Accounts and organizations",
          paragraphs: [
            "A final document would describe account eligibility, organization ownership, member roles and the responsibilities associated with each role.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "Acceptable-use rules would be set out here, including restrictions on unlawful content, abuse of the service and attempts to bypass project limits.",
          ],
        },
        {
          heading: "Projects, keys and credentials",
          paragraphs: [
            "A completed agreement would explain that public keys are intended for browser use while private credentials must be protected server-side, and that key compromise is the customer's responsibility.",
          ],
        },
        {
          heading: "Files and assets",
          paragraphs: [
            "Terms would cover ownership of uploaded content, permitted file types, size limits, and the consequences of exceeding a plan's allowances.",
          ],
        },
        {
          heading: "Fees and billing",
          paragraphs: [
            "All figures currently shown on the pricing page are illustrative. A final agreement would state actual fees, billing frequency and any refund policy before charges begin.",
          ],
        },
        {
          heading: "Availability and support",
          paragraphs: [
            "A final document would define any service-level commitments and support channels. No such commitments are made in this draft.",
          ],
        },
        {
          heading: "Termination",
          paragraphs: [
            "A completed agreement would describe how accounts may be closed, what happens to assets after termination, and which provisions survive.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "No support inbox is configured in this environment. A real agreement would include a valid contact address.",
          ],
        },
      ]}
    />
  );
}
