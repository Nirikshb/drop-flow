import type { ReactNode } from "react";
import { QueryProvider } from "@/components/dashboard/query-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

// Dashboard pages fetch live, session-scoped data on the client. Opt out of
// Next 16's static-shell validation for this authenticated subtree.
export const instant = false;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex h-dvh min-h-0 overflow-hidden bg-background">
        <aside className="hidden w-60 shrink-0 border-r border-sidebar-border lg:block">
          <Sidebar />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="container-wide py-6 pb-16 lg:py-8">{children}</div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
