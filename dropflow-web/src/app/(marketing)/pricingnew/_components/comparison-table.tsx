import { Fragment } from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

type Row = {
  label: string;
  free: string;
  pro: string;
  business: string;
};

type Group = {
  category: string;
  rows: Row[];
};

const groups: Group[] = [
  {
    category: "Uploads",
    rows: [
      { label: "Uploads / month", free: "10,000", pro: "250,000", business: "2,000,000" },
      { label: "Max file size", free: "10 MB", pro: "100 MB", business: "1 GB" },
      { label: "Concurrent uploads", free: "2", pro: "8", business: "32" },
      { label: "Resumable uploads", free: "—", pro: "✓", business: "✓" },
    ],
  },
  {
    category: "Storage",
    rows: [
      { label: "Storage included", free: "5 GB", pro: "50 GB", business: "250 GB" },
      { label: "Projects", free: "2", pro: "10", business: "Unlimited" },
      { label: "Asset history", free: "30 days", pro: "1 year", business: "Unlimited" },
    ],
  },
  {
    category: "Security",
    rows: [
      { label: "Custom MIME allowlist", free: "—", pro: "✓", business: "✓" },
      { label: "Signed URLs", free: "✓", pro: "✓", business: "✓" },
      { label: "Audit log", free: "—", pro: "—", business: "✓" },
      { label: "SSO / SAML", free: "—", pro: "—", business: "✓" },
    ],
  },
  {
    category: "Integrations",
    rows: [
      { label: "API access", free: "✓", pro: "✓", business: "✓" },
      { label: "Client SDKs", free: "✓", pro: "✓", business: "✓" },
      { label: "Webhooks", free: "—", pro: "✓", business: "✓" },
      { label: "Slack notifications", free: "—", pro: "—", business: "✓" },
    ],
  },
  {
    category: "Support",
    rows: [
      { label: "Community documentation", free: "✓", pro: "✓", business: "✓" },
      { label: "Email support", free: "—", pro: "✓", business: "✓" },
      { label: "Priority support", free: "—", pro: "—", business: "✓" },
      { label: "Dedicated success manager", free: "—", pro: "—", business: "✓" },
    ],
  },
];

function Cell({ value, highlighted }: { value: string; highlighted?: boolean }) {
  return (
    <td
      className={cn(
        "px-5 py-3 text-center align-middle",
        highlighted && "bg-primary/[0.03]",
      )}
    >
      {value === "✓" ? (
        <Check className="mx-auto size-4 text-primary" aria-label="Included" />
      ) : value === "—" ? (
        <Minus
          className="mx-auto size-4 text-muted-foreground/60"
          aria-label="Not included"
        />
      ) : (
        <span className="text-foreground">{value}</span>
      )}
    </td>
  );
}

const headerClass =
  "sticky top-0 z-20 border-b bg-muted px-5 py-3.5 text-sm font-semibold";

export function ComparisonTable() {
  return (
    <div className="mt-10 max-h-[38rem] overflow-auto rounded-xl border bg-card shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <caption className="sr-only">
          Illustrative feature comparison across the Free, Pro and Business
          plans. Final pricing has not been published.
        </caption>
        <thead>
          <tr>
            <th scope="col" className={cn(headerClass, "min-w-[240px] text-left")}>
              Feature
            </th>
            <th scope="col" className={cn(headerClass, "text-center")}>
              Free
            </th>
            <th
              scope="col"
              className={cn(headerClass, "bg-primary/10 text-center text-primary")}
            >
              Pro
              <span className="mt-0.5 block text-[10px] font-medium tracking-wide uppercase">
                Most popular
              </span>
            </th>
            <th scope="col" className={cn(headerClass, "text-center")}>
              Business
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {groups.map((group) => (
            <Fragment key={group.category}>
              <tr className="bg-muted/40">
                <th
                  colSpan={4}
                  scope="colgroup"
                  className="px-5 py-2.5 text-left text-[11px] font-semibold tracking-wider text-primary uppercase"
                >
                  {group.category}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={`${group.category}-${row.label}`} className="hover:bg-muted/30">
                  <th
                    scope="row"
                    className="px-5 py-3 text-left font-normal text-muted-foreground"
                  >
                    {row.label}
                  </th>
                  <Cell value={row.free} />
                  <Cell value={row.pro} highlighted />
                  <Cell value={row.business} />
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
