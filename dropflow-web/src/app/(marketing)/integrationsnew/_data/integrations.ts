export type IntegrationCategory =
  | "CMS"
  | "Ecommerce"
  | "Productivity"
  | "Automation";

export interface Integration {
  slug: string;
  name: string;
  category: IntegrationCategory;
  shortDescription: string;
  longDescription: string;
  /** Key used to look up a gradient palette in `_lib/visuals.ts`. */
  accent: string;
  /** Key used to look up a lucide icon in `_lib/visuals.ts`. */
  glyph: string;
  features: string[];
  setupSteps: string[];
  useCases: string[];
}

export const CATEGORIES = [
  "All",
  "CMS",
  "Ecommerce",
  "Productivity",
  "Automation",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

/**
 * CMS-ready integration catalogue. Replace this array with a fetch from your
 * CMS of choice — the pages and components only depend on the `Integration`
 * interface above.
 */
export const integrations: Integration[] = [
  {
    slug: "contentful",
    name: "Contentful",
    category: "CMS",
    accent: "sky",
    glyph: "Boxes",
    shortDescription:
      "Give editors a drop-in media library that uploads straight into Contentful entries.",
    longDescription:
      "Connect Dropflow to Contentful so your editors can drag files into a content entry without ever leaving the editor. Dropflow validates and stores the asset, then hands Contentful a stable delivery URL you can bind to any field. Assets stay consistent between your media library and your content model, and every upload carries the metadata your team needs for search and reuse.",
    features: [
      "Upload images and documents directly from the Contentful editor",
      "Map Dropflow asset metadata into Contentful fields automatically",
      "Enforce type and size limits per content type",
      "Serve optimized delivery URLs without a separate CDN setup",
      "Keep a single asset record in sync across locales",
    ],
    setupSteps: [
      "Create a Dropflow project and copy your public API key",
      "Install the Dropflow app in your Contentful space",
      "Add the Dropflow field to the content types that need media",
      "Map validation rules to your existing field constraints",
      "Publish an entry and confirm the asset URL resolves",
    ],
    useCases: [
      "Editorial teams publishing image-heavy articles",
      "Multilingual sites reusing one asset across locales",
      "Marketing sites with strict media governance",
    ],
  },
  {
    slug: "sanity",
    name: "Sanity",
    category: "CMS",
    accent: "rose",
    glyph: "Blocks",
    shortDescription:
      "Stream validated uploads into Sanity's asset pipeline with real-time progress.",
    longDescription:
      "Pair Dropflow with Sanity to give your studio a faster, more reliable upload experience. Dropflow handles validation, resumable uploads and progress callbacks before assets are registered in Sanity's asset pipeline. Your editors see immediate feedback, and your front end reads a single canonical asset reference — no custom upload proxy required.",
    features: [
      "Register Dropflow uploads as native Sanity assets",
      "Real-time progress bars inside custom studio input widgets",
      "Automatic retries on flaky studio connections",
      "Structured metadata carried into Sanity documents",
      "Programmatic asset cleanup that respects references",
    ],
    setupSteps: [
      "Create a Dropflow project and generate a public key",
      "Add the Dropflow input plugin to your Sanity studio",
      "Configure accepted MIME types and maximum file size",
      "Wire the plugin to your studio's asset field",
      "Upload a file in the studio and verify its reference",
    ],
    useCases: [
      "Custom Sanity studios needing richer upload UX",
      "Teams handling large media sets in real time",
      "Structured content with strict asset schemas",
    ],
  },
  {
    slug: "strapi",
    name: "Strapi",
    category: "CMS",
    accent: "emerald",
    glyph: "Leaf",
    shortDescription:
      "Add a managed upload layer to your self-hosted Strapi media library.",
    longDescription:
      "Connect Dropflow to Strapi to offload the messy parts of media handling while keeping content in your own infrastructure. Dropflow validates, stores and tracks each file, then exposes the asset through Strapi's media library API. You keep full control of the content layer while uploads stay fast, typed and observable.",
    features: [
      "Sync Dropflow assets into Strapi's media library",
      "Self-host friendly — no vendor lock-in for content",
      "Validation rules defined per Strapi collection",
      "Signed upload URLs keep credentials off the client",
      "Usage and storage visibility in one dashboard",
    ],
    setupSteps: [
      "Create a project in Dropflow and note the public key",
      "Install the Dropflow provider in your Strapi instance",
      "Set the provider as the default upload handler",
      "Define size and MIME constraints for each collection",
      "Upload from the Strapi admin panel to confirm the sync",
    ],
    useCases: [
      "Self-hosted content platforms",
      "Regulated teams that keep content in-house",
      "Multi-site setups sharing a media library",
    ],
  },
  {
    slug: "wordpress",
    name: "WordPress",
    category: "CMS",
    accent: "blue",
    glyph: "Globe2",
    shortDescription:
      "Modernize media uploads without replacing your editorial workflow.",
    longDescription:
      "Bring Dropflow's upload pipeline to the WordPress media library. Editors keep the familiar workflow they already know, while Dropflow validates files, stores them reliably and serves delivery URLs that your theme can use. Large media libraries stay responsive, and every upload is tracked with consistent metadata.",
    features: [
      "Drop-in media uploader for the WordPress editor",
      "Automatic image validation before publishing",
      "Offload storage while keeping the media library UI",
      "Consistent asset URLs across themes and plugins",
      "Track bandwidth and storage from the Dropflow dashboard",
    ],
    setupSteps: [
      "Create a Dropflow project and copy your public key",
      "Install the Dropflow plugin in WordPress",
      "Paste your project key in the plugin settings",
      "Choose which upload sizes and types to accept",
      "Add media to a post and confirm it appears in the library",
    ],
    useCases: [
      "Publishers with large image archives",
      "Agencies managing many client sites",
      "Editorial teams migrating to a managed asset layer",
    ],
  },
  {
    slug: "shopify",
    name: "Shopify",
    category: "Ecommerce",
    accent: "lime",
    glyph: "ShoppingBag",
    shortDescription:
      "Connect product imagery and customer uploads to a reliable asset store.",
    longDescription:
      "Use Dropflow alongside Shopify to keep product media, lookbook images and customer-generated uploads organized. Dropflow validates and stores each file, then exposes clean delivery URLs you can attach to products, sections or apps. Storefronts load fast, and your team gets one place to audit every asset that touches the shop.",
    features: [
      "Attach Dropflow-hosted media to Shopify products",
      "Validate customer uploads before they reach your store",
      "Serve responsive delivery URLs for fast storefronts",
      "Organize campaign assets by collection or season",
      "Monitor upload volume during peak sales events",
    ],
    setupSteps: [
      "Create a Dropflow project and generate a public key",
      "Install the Dropflow app on your Shopify store",
      "Choose the product fields that should accept uploads",
      "Set file size and type limits for customer submissions",
      "Upload a product image and verify it renders on the storefront",
    ],
    useCases: [
      "Stores with frequent product photography updates",
      "Brands collecting customer-generated content",
      "Seasonal campaigns with many campaign assets",
    ],
  },
  {
    slug: "notion",
    name: "Notion",
    category: "Productivity",
    accent: "slate",
    glyph: "Notebook",
    shortDescription:
      "Turn Notion pages into a home for validated, shareable files.",
    longDescription:
      "Connect Dropflow to Notion so teams can attach files to wikis, specs and project pages without pasting links from disparate tools. Dropflow stores each upload and returns a stable URL that Notion embeds inline. Files stay consistent, access stays intentional, and your docs remain the single source of truth for your team's knowledge.",
    features: [
      "Embed Dropflow file links in any Notion block",
      "Keep one canonical asset across many pages",
      "Validate file types before they enter your workspace",
      "Add structured metadata in page databases",
      "Share deliverable links with clients outside Notion",
    ],
    setupSteps: [
      "Create a Dropflow project and copy your public key",
      "Add the Dropflow integration to your Notion workspace",
      "Connect the databases that track deliverables",
      "Configure accepted file types and size limits",
      "Attach a file to a page and confirm the link resolves",
    ],
    useCases: [
      "Team wikis with shared references",
      "Client deliverables tracked in databases",
      "Specs that need versioned attachments",
    ],
  },
  {
    slug: "webflow",
    name: "Webflow",
    category: "CMS",
    accent: "indigo",
    glyph: "LayoutTemplate",
    shortDescription:
      "Feed Dropflow assets into Webflow's CMS and marketing pages.",
    longDescription:
      "Pair Dropflow with Webflow so designers can upload assets once and reuse them across the CMS and custom code. Dropflow handles the upload plumbing and returns delivery URLs that drop cleanly into image elements, background styles and collection fields. Marketing teams move faster because media is always ready, validated and sized appropriately.",
    features: [
      "Bind Dropflow URLs to Webflow CMS fields",
      "Serve sized delivery URLs for responsive layouts",
      "Validate assets before they enter a collection",
      "Reuse one asset across multiple pages and sites",
      "Keep media organized by collection and campaign",
    ],
    setupSteps: [
      "Create a Dropflow project and generate a public key",
      "Add the Dropflow embed to your Webflow site",
      "Connect the CMS collections that need media",
      "Map accepted file types to your design system",
      "Publish a collection item and verify the image loads",
    ],
    useCases: [
      "Marketing sites with frequent content updates",
      "Design systems that share a media library",
      "Landing pages with strict performance budgets",
    ],
  },
  {
    slug: "airtable",
    name: "Airtable",
    category: "Automation",
    accent: "amber",
    glyph: "Table2",
    shortDescription:
      "Automate asset intake by connecting Dropflow uploads to Airtable bases.",
    longDescription:
      "Use Dropflow with Airtable to build a lightweight asset workflow. Every upload can create or update a record with its URL, size, type and metadata, which your automations can route to the right reviewer or folder. Dropflow handles the file, Airtable handles the process — together they replace spreadsheets of broken links with a clean, queryable pipeline.",
    features: [
      "Create Airtable records automatically on upload",
      "Store asset URLs and metadata in structured fields",
      "Trigger automations when new files arrive",
      "Sync approval status back to your asset library",
      "Validate submissions from internal request forms",
    ],
    setupSteps: [
      "Create a Dropflow project and copy your public key",
      "Connect Dropflow to your Airtable base",
      "Map asset fields to columns in your table",
      "Define a trigger for new upload events",
      "Submit a test file and confirm the record appears",
    ],
    useCases: [
      "Creative request intake and review queues",
      "Asset inventories with approval workflows",
      "Operations teams coordinating media across tools",
    ],
  },
  {
    slug: "ghost",
    name: "Ghost",
    category: "CMS",
    accent: "violet",
    glyph: "Feather",
    shortDescription:
      "Give independent publishers a dependable upload layer for Ghost.",
    longDescription:
      "Connect Dropflow to Ghost so writers can focus on the story, not the file. Dropflow validates and stores images and downloadable assets, then provides stable URLs that Ghost themes render cleanly. It's a dependable media layer for newsletters and publications that publish on a schedule, with usage visibility that keeps costs predictable.",
    features: [
      "Attach validated images and downloads to posts",
      "Serve delivery URLs tuned for fast newsletters",
      "Keep a consistent media library across contributors",
      "Validate files before scheduled publishing",
      "Track storage and bandwidth by publication",
    ],
    setupSteps: [
      "Create a Dropflow project and generate a public key",
      "Install the Dropflow integration in your Ghost admin",
      "Add your project key to Ghost settings",
      "Set accepted file types for posts and pages",
      "Publish a post with an image to verify delivery",
    ],
    useCases: [
      "Independent newsletters and publications",
      "Multi-contributor editorial teams",
      "Membership sites with downloadable resources",
    ],
  },
];

export function getIntegration(slug: string): Integration | undefined {
  return integrations.find((item) => item.slug === slug);
}

/** Same-category integrations first, then fill the remaining slots. */
export function getRelatedIntegrations(slug: string, limit = 3): Integration[] {
  const current = getIntegration(slug);
  if (!current) return [];

  const related = integrations.filter((item) => item.slug !== slug);
  return [
    ...related.filter((item) => item.category === current.category),
    ...related.filter((item) => item.category !== current.category),
  ].slice(0, limit);
}
