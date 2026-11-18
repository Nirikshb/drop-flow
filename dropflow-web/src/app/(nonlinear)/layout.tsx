import type { ReactNode } from "react";

import "./nonlinear.css";

/** Standalone dark layout — deliberately separate from the marketing layout. */
export default function NonlinearLayout({ children }: { children: ReactNode }) {
  return <div className="nl-page">{children}</div>;
}
