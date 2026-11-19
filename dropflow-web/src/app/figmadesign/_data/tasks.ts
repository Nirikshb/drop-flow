export type Progress = "Ongoing" | "Completed" | "In review" | "Pending";
export type Urgency = "Critical" | "Moderate" | "Minor";

export interface Person {
  id: string;
  name: string;
  initials: string;
  tone: string;
}

export interface Task {
  id: string;
  key: string;
  title: string;
  progress: Progress;
  urgency: Urgency;
  assignees: string[];
  comments: number;
  selected: boolean;
}

export const PEOPLE: Person[] = [
  { id: "priya", name: "Priya", initials: "P", tone: "bg-orange-200 text-orange-900" },
  { id: "david", name: "David Lee", initials: "DL", tone: "bg-emerald-200 text-emerald-900" },
  { id: "sam", name: "Sam", initials: "S", tone: "bg-violet-200 text-violet-900" },
  { id: "ines", name: "Ines", initials: "I", tone: "bg-sky-200 text-sky-900" },
  { id: "maya", name: "Maya", initials: "M", tone: "bg-rose-200 text-rose-900" },
];

// Exact content from Figma frame 1:64, verified via REST.
export const TASKS: Task[] = [
  { id: "1", key: "TSK-8", title: "Improve Navigation & Menu Organization", progress: "Ongoing", urgency: "Moderate", assignees: ["priya"], comments: 0, selected: true },
  { id: "2", key: "TSK-20", title: "Enhance Search Functionality", progress: "Completed", urgency: "Critical", assignees: ["priya", "sam"], comments: 6, selected: false },
  { id: "3", key: "TSK-22", title: "Dark Mode Implementation", progress: "In review", urgency: "Minor", assignees: ["ines", "david"], comments: 0, selected: false },
  { id: "4", key: "TSK-6", title: "Optimize Mobile Responsiveness", progress: "Ongoing", urgency: "Moderate", assignees: ["priya", "david"], comments: 0, selected: false },
  { id: "5", key: "TSK-6", title: "Redesign Checkout Flow", progress: "Ongoing", urgency: "Critical", assignees: ["priya", "david"], comments: 0, selected: false },
  { id: "6", key: "TSK-10", title: "Speed Optimization for Home Page", progress: "Ongoing", urgency: "Critical", assignees: ["sam", "priya"], comments: 0, selected: false },
  { id: "7", key: "TSK-40", title: "Reduce Load Time for Large Data Sets", progress: "Pending", urgency: "Minor", assignees: ["sam", "priya"], comments: 0, selected: false },
  { id: "8", key: "TSK-12", title: "Optimize Image Compression for Faster Loading", progress: "In review", urgency: "Moderate", assignees: ["priya", "david"], comments: 0, selected: false },
  { id: "9", key: "TSK-18", title: "Introduce AI-powered Task Prioritization", progress: "Completed", urgency: "Moderate", assignees: ["priya"], comments: 4, selected: true },
  { id: "10", key: "TSK-12", title: "Multi-language Support Implementation", progress: "Completed", urgency: "Critical", assignees: ["priya", "ines"], comments: 1, selected: true },
  { id: "11", key: "TSK-12", title: "Missing Tooltip on Product Images", progress: "Completed", urgency: "Moderate", assignees: ["priya", "david"], comments: 0, selected: true },
  { id: "12", key: "TSK-22", title: "Integrate Third-party Calendar Sync", progress: "Completed", urgency: "Critical", assignees: ["priya", "sam"], comments: 4, selected: true },
  { id: "13", key: "TSK-14", title: "Enhance User Authentication with 2FA", progress: "Pending", urgency: "Minor", assignees: ["ines"], comments: 0, selected: false },
  { id: "14", key: "TSK-27", title: "GDPR Compliance Updates", progress: "Pending", urgency: "Minor", assignees: ["ines"], comments: 0, selected: false },
  { id: "15", key: "TSK-18", title: "Data Encryption for Sensitive Information", progress: "In review", urgency: "Minor", assignees: ["priya"], comments: 3, selected: false },
];

export const PRIMARY_NAV = [
  { label: "Home", icon: "home" },
  { label: "Inbox", icon: "inbox" },
  { label: "Saved items", icon: "bookmark" },
] as const;

export const WORKSPACE_NAV = [
  { label: "My tasks", icon: "user-plus" },
  { label: "Projects", icon: "folder" },
  { label: "Calendar", icon: "calendar" },
  { label: "Roadmaps", icon: "columns" },
] as const;

export const CHANNELS = [
  { label: "Engineering", nested: ["Docs", "Teams", "Initiatives", "Active sprint"] },
  { label: "Design", nested: [] },
  { label: "Marketing", nested: [] },
] as const;

export const DETAILS = {
  properties: [
    { label: "Progress", value: "Ongoing", icon: "progress" },
    { label: "Category", value: "API Documentation", icon: "file" },
    { label: "Task owner", value: "Priya", icon: "avatar" },
    { label: "Urgency", value: "Critical", icon: "urgency" },
    { label: "Department", value: "Engineering", icon: "department" },
    { label: "Date added", value: "March 15, 2025", icon: "calendar" },
    { label: "Deadline", value: "May 15, 2025", icon: "calendar" },
  ],
  tags: [
    { label: "Features", tone: "blue" },
    { label: "Bugs", tone: "orange" },
    { label: "Improvements", tone: "green" },
  ],
  attachments: [
    { name: "Client_Proposal.xls", meta: "Today  ·  4 MB", icon: "sheet" },
    { name: "PRD.docx", meta: "Yesterday  ·  Google Docs", icon: "doc" },
  ],
  discussion: [
    { name: "David Lee", text: "Have you considered AI-driven task prioritization?", initials: "DL", tone: "bg-emerald-200 text-emerald-900" },
    { name: "Priya Sharma", text: "Don't forget to add accessibility features in the design phase.", initials: "PS", tone: "bg-orange-200 text-orange-900" },
  ],
} as const;
