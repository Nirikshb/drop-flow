import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy (Draft)",
  description:
    "Draft placeholder privacy notice for Dropflow. Not legal advice and not a complete policy.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This placeholder exists to show the intended structure of a future privacy notice. No policy is in force."
      updated="18 November 2026"
      intro="This draft outlines the categories of information a file-upload service would typically handle. It is a template only. No data practices are described here as current or binding."
      sections={[
        {
          heading: "Information we would collect",
          paragraphs: [
            "A completed service would collect account details such as name, email address and organization name, along with technical metadata about files uploaded through the platform.",
          ],
          bullets: [
            "Account and organization profile information",
            "Project configuration, API key prefixes and usage totals",
            "Asset metadata such as filename, MIME type, size and checksum",
            "Basic request logs needed to operate and debug the service",
          ],
        },
        {
          heading: "How information would be used",
          paragraphs: [
            "Information would be used to provide the service, enforce limits, surface usage in the dashboard, and respond to support requests. A final policy would describe each purpose precisely.",
          ],
        },
        {
          heading: "File contents and storage",
          paragraphs: [
            "File bytes would be stored in object storage associated with a project. Asset metadata would be kept separately so that files can be listed and managed without downloading them.",
          ],
        },
        {
          heading: "Sharing and processors",
          paragraphs: [
            "A final policy would list infrastructure providers and any subprocessors. No such list is provided in this draft.",
          ],
        },
        {
          heading: "Retention and deletion",
          paragraphs: [
            "A final policy would state retention periods for account data, assets and logs, and explain how deletion requests are handled.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "Account holders would normally be able to update profile information, rotate keys and delete assets. The mechanics of data access and deletion requests would be set out in a completed notice.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "No support inbox is configured in this environment. A real notice would include a working contact address.",
          ],
        },
      ]}
    />
  );
}
