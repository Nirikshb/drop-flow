import type { Metadata } from "next";

import {
  LegalPage,
  type LegalSection,
} from "@/components/marketing/legal-page";

import { TemplatePages } from "./_components/template-pages";

export const metadata: Metadata = {
  title: "Privacy Policy (Draft)",
  description:
    "A substantial draft template for a future Dropflow privacy notice. Placeholder only — not legal advice, not in force, and not a description of a live service.",
};

const sections: LegalSection[] = [
  {
    heading: "About this draft",
    paragraphs: [
      "This document is a structural template for a future privacy notice for Dropflow, an AI-native file upload and asset platform. It describes the categories of information such a service would typically handle, the purposes for which that information would be used, and the choices a customer would normally have.",
      "Nothing below is a representation about a live service. No privacy policy is currently in force, and no data practice described here is current or binding. Before publication, every section should be reviewed by qualified counsel and matched to the product's actual behaviour.",
    ],
  },
  {
    heading: "Information we would collect",
    paragraphs: [
      "A completed service would collect information that customers provide directly, information generated when the product is used, and a small amount of technical information sent automatically by the browser.",
    ],
    bullets: [
      "Account details such as name, work email address, a one-way password hash and organization name",
      "Project configuration, including allowed MIME types, maximum file sizes and API key prefixes",
      "Asset metadata such as filename, MIME type, byte size, checksum, storage key and upload timestamp",
      "Aggregated usage counters for uploads, stored bytes and API requests",
      "Support correspondence and any details a person chooses to include in a message",
      "Illustrative billing contact details, should paid plans ever be introduced — no payment is collected in this environment",
    ],
  },
  {
    heading: "Information collected automatically",
    paragraphs: [
      "Like most hosted applications, the dashboard would record basic request information to keep the service reliable and to investigate problems. A final policy would state exactly which signals are captured and for how long.",
    ],
    bullets: [
      "IP address and an approximate region derived from it",
      "Browser type, operating system and device class",
      "Request timestamps, requested URLs and response status codes",
      "Referrer and coarse interaction events used to understand feature usage in aggregate",
    ],
  },
  {
    heading: "How we would use information",
    paragraphs: [
      "Information would be used only for purposes connected with operating, securing and improving the service. A finished notice would enumerate each purpose together with its legal basis and any retention period attached to it.",
    ],
    bullets: [
      "Create and administer accounts, projects and organizations",
      "Accept, validate, store and serve files, and expose their metadata in the dashboard",
      "Enforce plan limits, calculate usage totals and prevent abuse of the platform",
      "Respond to support requests and send service or security notices",
      "Detect suspicious activity, investigate incidents and protect users and infrastructure",
      "Produce aggregated, de-identified statistics about how the product is used",
    ],
  },
  {
    heading: "File contents and asset metadata",
    paragraphs: [
      "A production deployment would keep uploaded file bytes in object storage associated with a project, while searchable metadata would be held in a separate database. Files would not be publicly listed: access would be granted through explicit, short-lived delivery URLs. A final notice would explain who can read a file, how long those URLs remain valid, and what happens to copies held in backups.",
    ],
  },
  {
    heading: "Cookies and similar technologies",
    paragraphs: [
      "The dashboard would rely on a small number of cookies for sign-in, security and saved preferences, and could use an analytics cookie to understand aggregate usage. A separate cookie notice would list each cookie, its purpose and its lifetime. No advertising or cross-site tracking cookies are contemplated by this template.",
    ],
  },
  {
    heading: "Sharing and subprocessors",
    paragraphs: [
      "Running a hosted platform involves third-party providers. A completed notice would publish a current list of subprocessors together with the categories of information each one receives and the purpose of the sharing.",
    ],
    bullets: [
      "Cloud infrastructure and object-storage providers hosting the application and its files",
      "Transactional email providers used for account and security messages",
      "Analytics providers receiving aggregated, de-identified usage events",
      "Payment processors, only if billing is introduced in a future version",
    ],
  },
  {
    heading: "Retention and deletion",
    paragraphs: [
      "Information would be kept only for as long as needed for the purposes described above. A final policy would state concrete periods for every category. Purely as an illustration, account data might be retained for the life of the account plus thirty days, operational logs for ninety days, and uploaded assets until the customer deletes them or closes the account. Backup copies could persist for a short additional window before being overwritten on the normal backup cycle.",
    ],
  },
  {
    heading: "Security",
    paragraphs: [
      "A production service would apply sensible technical and organisational safeguards. This template makes no claim that any particular control is currently in place, and no certification or compliance status is asserted here.",
    ],
    bullets: [
      "Transport encryption for traffic between browsers, the API and storage",
      "Encryption at rest for stored objects and application databases",
      "API keys stored as hashes and displayed only once at creation time",
      "Short-lived, scoped signed URLs issued for individual uploads",
      "Project isolation so that keys, limits and assets do not cross boundaries",
      "Role-based access controls and audit logging for administrative actions",
    ],
  },
  {
    heading: "Your rights and choices",
    paragraphs: [
      "Customers would normally be able to review and correct account details, rotate or revoke keys, export asset metadata, and delete assets or an entire account. Where information is processed on behalf of an organization, that organization would typically act as the controller and the platform as processor, so requests would be routed to the appropriate party. A finished notice would explain how to submit a request, what verification might be required, and the expected response window.",
    ],
    bullets: [
      "Access, correct or export information associated with your account",
      "Delete assets or close an account, subject to any legal retention obligations",
      "Rotate or revoke API keys at any time from the dashboard",
      "Opt out of non-essential analytics where a preference control is offered",
      "Withdraw consent where processing is based on consent",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Dropflow is a developer tool intended for business use and is not directed at children. A final notice would state the applicable minimum age and the steps that would be taken if a child's information were discovered.",
    ],
  },
  {
    heading: "Changes and contact",
    paragraphs: [
      "When a real privacy notice replaces this template, the updated version would carry a revision date and a short summary of material changes. Significant changes would be communicated through the dashboard or by email before taking effect where appropriate.",
      "No support inbox is configured in this environment, so no contact address is provided here. A completed notice would include a monitored address for privacy questions and a postal address where required.",
    ],
  },
];

export default function PrivacyPolicyNewPage() {
  return (
    <>
      <LegalPage
        title="Privacy Policy"
        description="This placeholder exists to show the intended structure of a future privacy notice. No policy is in force and no data practice described here is binding."
        updated="18 November 2026"
        intro="This draft sets out the categories of information a file-upload and asset platform would typically handle, how that information might be used, and the controls a customer would normally expect. It is a template only — a real notice must be written against the finished product and reviewed by counsel before it is published or relied on."
        sections={sections}
      />
      <TemplatePages />
    </>
  );
}
