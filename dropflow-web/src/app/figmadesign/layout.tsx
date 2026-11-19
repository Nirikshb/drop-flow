import type { ReactNode } from "react";
import { QueryProvider } from "@/components/dashboard/query-provider";

// This route reuses the dashboard's data-fetching infrastructure without the
// dashboard chrome (sidebar/header), because the Figma layout supplies its own.
// Authentication is enforced by the API service layer (401 -> /login).
export const instant = false;

export default function FigmadesignLayout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
