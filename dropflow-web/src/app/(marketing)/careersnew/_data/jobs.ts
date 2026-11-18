/**
 * Local, CMS-shaped content for the Careers template.
 *
 * The shape mirrors what a headless CMS would return so this module can be
 * swapped for a real content source without touching the pages. Every field
 * here is illustrative template content for Dropflow.
 */

export type WorkArrangement = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Contract";

export interface Job {
  slug: string;
  title: string;
  department: string;
  location: string;
  workArrangement: WorkArrangement;
  employmentType: EmploymentType;
  compensation: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  team: string;
}

export const jobs: Job[] = [
  {
    slug: "senior-backend-engineer",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    workArrangement: "Remote",
    employmentType: "Full-time",
    compensation: "$165,000 – $205,000",
    summary:
      "Own the services behind signed uploads, asset metadata and usage accounting. You will design APIs that developers trust and keep them fast as volume grows from thousands to millions of uploads a week.",
    responsibilities: [
      "Design and ship Go and TypeScript services for upload orchestration, asset metadata and webhooks.",
      "Improve the reliability of high-throughput paths with thoughtful retries, idempotency and observability.",
      "Partner with the SDK team to keep client and server behaviour consistent across edge cases.",
      "Review designs early, mentor engineers and raise the bar for backend quality across the team.",
    ],
    requirements: [
      "6+ years building and operating production backend services at scale.",
      "Strong fluency in Go, TypeScript or a comparable language, plus SQL and relational data modelling.",
      "Experience with object storage, signed URLs or content delivery systems.",
      "Comfort with on-call ownership and a bias toward simple, well-instrumented systems.",
    ],
    niceToHave: [
      "You have built a developer-facing API or SDK before.",
      "Familiarity with multi-region data stores and eventual consistency trade-offs.",
    ],
    team:
      "The Platform team owns the core upload pipeline and the data model behind every asset. We are a small, senior group that values written design docs, async collaboration and a high bar for correctness.",
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    workArrangement: "Hybrid",
    employmentType: "Full-time",
    compensation: "$140,000 – $175,000",
    summary:
      "Shape the end-to-end experience of Dropflow, from the first upload in an SDK to the dashboard a team uses every day. You will turn developer workflows into interfaces that feel obvious rather than clever.",
    responsibilities: [
      "Own product design for the dashboard, onboarding and documentation surfaces.",
      "Run lightweight research with developers and translate findings into clear interaction patterns.",
      "Prototype and test flows for uploads, asset management and project settings before they ship.",
      "Contribute to and evolve a small, consistent design system shared across product and marketing.",
    ],
    requirements: [
      "5+ years designing B2B or developer-facing products with a strong portfolio of shipped work.",
      "Comfort working in code-adjacent environments and reasoning about technical constraints.",
      "Fluency with Figma, prototyping and modern design-system practice.",
      "Clear written communication and the ability to defend a decision with evidence.",
    ],
    niceToHave: [
      "You have designed a dashboard with dense data and complex states.",
      "Basic HTML and CSS literacy so you can collaborate closely with engineers.",
    ],
    team:
      "Design sits inside the product group rather than a separate studio. You will pair daily with engineering and product, with direct access to customers and room to influence the roadmap.",
  },
  {
    slug: "developer-advocate",
    title: "Developer Advocate",
    department: "Developer Relations",
    location: "Remote — North America",
    workArrangement: "Remote",
    employmentType: "Full-time",
    compensation: "$135,000 – $170,000",
    summary:
      "Be the developer voice inside Dropflow. You will write the tutorials, build the examples and answer the hard questions that help someone go from an empty project to a working upload in minutes.",
    responsibilities: [
      "Create practical guides, sample apps and short walkthroughs for the SDK and API.",
      "Turn recurring support questions into better documentation and clearer product behaviour.",
      "Represent Dropflow in community spaces, office hours and conference talks.",
      "Work with product to make first-run experiences genuinely self-serve.",
    ],
    requirements: [
      "3+ years in developer relations, technical writing or a developer-focused product role.",
      "You can read a TypeScript codebase and ship a working example without hand-holding.",
      "Excellent technical writing and comfort presenting to an engineering audience.",
      "A track record of public work — articles, talks, repositories or documentation.",
    ],
    niceToHave: [
      "Experience with file uploads, media pipelines or storage platforms.",
      "You have maintained an open-source project or a documentation site.",
    ],
    team:
      "Developer Relations is a team of three working across docs, examples and community. We treat documentation as a product surface and measured time-to-first-success as a real metric.",
  },
  {
    slug: "account-executive",
    title: "Account Executive",
    department: "Sales",
    location: "Austin, TX",
    workArrangement: "On-site",
    employmentType: "Full-time",
    compensation: "$110,000 – $180,000 OTE",
    summary:
      "Run consultative sales cycles with engineering and product leaders who care about reliability, not jargon. You will qualify honestly, bring in technical teammates when it helps and build a book of business that lasts.",
    responsibilities: [
      "Own the full cycle from discovery through security review and close for mid-market accounts.",
      "Run technical discovery alongside solutions engineering and write clear mutual action plans.",
      "Maintain accurate pipeline hygiene and forecast with discipline.",
      "Feed market patterns back to product and marketing with specificity.",
    ],
    requirements: [
      "4+ years of B2B SaaS sales, ideally selling technical or developer infrastructure products.",
      "You can hold a credible conversation about APIs, storage and security with an engineering buyer.",
      "A consistent record of hitting quota with a consultative, no-pressure approach.",
      "Strong written follow-up and comfort running a structured process.",
    ],
    niceToHave: [
      "You have sold into startups scaling from hundreds to millions of users.",
      "Experience with MEDDIC or a similar qualification framework.",
    ],
    team:
      "Sales is a small, senior team based in Austin with shared technical resources. We reward clear qualification and long-term customer fit over aggressive tactics.",
  },
  {
    slug: "customer-success-manager",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote — US",
    workArrangement: "Remote",
    employmentType: "Full-time",
    compensation: "$95,000 – $125,000",
    summary:
      "Help teams get real value out of Dropflow after they sign up. You will guide onboarding, watch usage patterns and act as the trusted point of contact when something needs attention.",
    responsibilities: [
      "Run onboarding for new Business customers and drive time-to-first-production-upload.",
      "Monitor account health and reach out with concrete, useful recommendations.",
      "Coordinate with support and engineering on escalations with clear, calm communication.",
      "Identify expansion opportunities grounded in actual usage rather than scripts.",
    ],
    requirements: [
      "3+ years in customer success or technical account management at a SaaS company.",
      "Comfort reading dashboards, usage data and API logs to understand an account.",
      "Excellent written communication and genuine curiosity about customer workflows.",
      "A calm, ownership-first approach to ambiguity and escalation.",
    ],
    niceToHave: [
      "You have supported a developer platform or infrastructure product.",
      "Experience running onboarding programmes at a small team.",
    ],
    team:
      "Customer Success works closely with Support and Engineering in one shared Slack channel per account. We keep portfolios small enough that you can actually know your customers.",
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    department: "Engineering",
    location: "Remote — EU",
    workArrangement: "Remote",
    employmentType: "Full-time",
    compensation: "$150,000 – $190,000",
    summary:
      "Build the reliable data foundation behind usage reporting, billing accuracy and product insight. You will turn raw event streams into models that the whole company can trust without a spreadsheet export.",
    responsibilities: [
      "Design and maintain batch and streaming pipelines for upload, storage and billing events.",
      "Build tested, documented models that power dashboards and customer-facing usage views.",
      "Own data quality checks and make anomalies visible before they reach a customer invoice.",
      "Partner with backend teams to evolve event schemas without breaking downstream consumers.",
    ],
    requirements: [
      "5+ years of data engineering with SQL, Python and a modern warehouse such as Snowflake or BigQuery.",
      "Experience with orchestration tools and dbt-style transformation workflows.",
      "Strong grasp of data modelling, late-arriving data and idempotent pipeline design.",
      "A habit of writing tests and documentation for data you ship.",
    ],
    niceToHave: [
      "You have worked on usage-based billing or metering systems.",
      "Familiarity with event streaming tools such as Kafka or Kinesis.",
    ],
    team:
      "The Data team is part of Platform and serves everyone from Finance to Product. We favour boring, observable pipelines and a single source of truth over clever one-off jobs.",
  },
  {
    slug: "security-engineer",
    title: "Security Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    workArrangement: "Hybrid",
    employmentType: "Full-time",
    compensation: "$160,000 – $200,000",
    summary:
      "Protect the upload path that millions of files move through. You will harden our credential model, build security into the SDK by default and make the right choice the easy one for customers.",
    responsibilities: [
      "Own threat modelling for uploads, signed URLs and asset delivery across the platform.",
      "Run a pragmatic security review process that ships fixes rather than just findings.",
      "Build automated checks into CI for secrets, dependencies and access control regressions.",
      "Prepare evidence and documentation for enterprise security reviews and future audits.",
    ],
    requirements: [
      "5+ years in application or infrastructure security with hands-on cloud experience.",
      "Deep understanding of authn/authz, short-lived credentials and object-storage permissions.",
      "Ability to read and change production code, not only write reports.",
      "Clear, non-alarmist communication with engineers and customers.",
    ],
    niceToHave: [
      "You have taken a SaaS product through SOC 2 or ISO 27001.",
      "Experience with supply-chain security and dependency provenance.",
    ],
    team:
      "Security is embedded in Platform, with a direct line to the founders. We treat security as an engineering discipline and keep reviews proportional to real risk.",
  },
  {
    slug: "technical-writer",
    title: "Technical Writer",
    department: "Marketing",
    location: "Remote — US",
    workArrangement: "Remote",
    employmentType: "Contract",
    compensation: "$85 – $110 per hour",
    summary:
      "Make Dropflow's documentation a place developers actually want to land. You will turn rough API notes into clear reference pages, tutorials and conceptual guides that hold up under real use.",
    responsibilities: [
      "Write and maintain SDK reference pages, quickstarts and conceptual guides.",
      "Test every code sample against the current API and keep examples accurate.",
      "Restructure navigation so common tasks are reachable in one or two clicks.",
      "Collaborate with engineers to clarify behaviour before documenting it.",
    ],
    requirements: [
      "3+ years writing developer documentation with strong samples of shipped work.",
      "You can work from source code and an API spec without needing a full walkthrough.",
      "Precision with code samples, terminology and version differences.",
      "Comfort working async with a distributed engineering team.",
    ],
    niceToHave: [
      "Experience with Docs-as-Code, MDX or a static documentation site.",
      "Background in file uploads, media or developer tooling.",
    ],
    team:
      "Documentation is part of the Developer Relations group and is treated as a first-class product. This is a six-month contract with a strong possibility of extension.",
  },
  {
    slug: "growth-marketer",
    title: "Growth Marketer",
    department: "Marketing",
    location: "London, UK",
    workArrangement: "Hybrid",
    employmentType: "Full-time",
    compensation: "£80,000 – £105,000",
    summary:
      "Own the experiments that turn developer interest into active projects. You will work close to the product, run small measurable tests and build a growth motion that respects a technical audience.",
    responsibilities: [
      "Design and run experiments across onboarding, lifecycle email and in-product prompts.",
      "Build simple funnels and report on them with honesty about what did not work.",
      "Write product-minded copy for pages and campaigns with help from Design.",
      "Coordinate with Developer Relations on launches, examples and community programmes.",
    ],
    requirements: [
      "4+ years in growth or product marketing, ideally for a developer or B2B product.",
      "Comfort with analytics tooling and a clear grasp of funnel metrics and attribution limits.",
      "Strong copywriting and the judgement to avoid growth tactics that erode trust.",
      "A structured approach to testing, with written hypotheses and results.",
    ],
    niceToHave: [
      "You have grown a self-serve developer product from early to meaningful scale.",
      "Basic SQL so you can answer your own questions.",
    ],
    team:
      "Marketing is a lean group shared across growth, content and product marketing. Decisions are made from small, well-instrumented experiments rather than large campaigns.",
  },
  {
    slug: "people-ops-lead",
    title: "People Ops Lead",
    department: "People",
    location: "Remote — US",
    workArrangement: "Hybrid",
    employmentType: "Full-time",
    compensation: "$130,000 – $165,000",
    summary:
      "Build the people foundations of a distributed company: fair compensation, clear policies and a hiring process candidates respect. You will make the operating rhythm work across time zones without adding ceremony.",
    responsibilities: [
      "Own recruiting operations, onboarding and the candidate experience end to end.",
      "Run a compensation and levelling framework that is transparent and defensible.",
      "Maintain compliant, humane policies across the US and EU where we have teammates.",
      "Partner with managers on performance cycles, feedback and team health.",
    ],
    requirements: [
      "6+ years in people operations, with time at a growing remote-first company.",
      "Working knowledge of US employment practice and comfort with multi-jurisdiction complexity.",
      "Strong process design paired with genuine empathy and discretion.",
      "Data literacy — you can work with headcount, compensation and attrition numbers confidently.",
    ],
    niceToHave: [
      "You have built a levelling or compensation framework from scratch.",
      "Experience supporting a distributed engineering-heavy organisation.",
    ],
    team:
      "People is a function of two, working closely with the founders and team leads. We keep policies light, written and easy to find — and we measure the candidate and employee experience like any other product.",
  },
];

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug);
}

/** Same-department roles first, then fill up to `limit` with other openings. */
export function getRelatedJobs(slug: string, limit = 3): Job[] {
  const current = getJobBySlug(slug);
  if (!current) return [];

  const others = jobs.filter((job) => job.slug !== slug);
  const sameDepartment = others.filter(
    (job) => job.department === current.department,
  );
  const rest = others.filter((job) => job.department !== current.department);

  return [...sameDepartment, ...rest].slice(0, limit);
}

export function getFilterOptions() {
  return {
    departments: Array.from(new Set(jobs.map((job) => job.department))).sort(),
    locations: Array.from(new Set(jobs.map((job) => job.location))).sort(),
    arrangements: Array.from(new Set(jobs.map((job) => job.workArrangement))).sort(),
  };
}
