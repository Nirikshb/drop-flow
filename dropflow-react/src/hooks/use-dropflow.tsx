"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Dropflow, type DropflowConfig } from "@dropflow/sdk";

const DropflowContext = createContext<Dropflow | null>(null);

/** Shares one configured client across a component subtree. */
export function DropflowProvider({
  config,
  client,
  children,
}: {
  config?: DropflowConfig;
  client?: Dropflow;
  children: ReactNode;
}) {
  const value: Dropflow = useMemo(
    () => client ?? new Dropflow(config as DropflowConfig),
    [client, config],
  );
  return <DropflowContext.Provider value={value}>{children}</DropflowContext.Provider>;
}

export function useDropflow(): Dropflow {
  const client = useContext(DropflowContext);
  if (!client) {
    throw new Error("useDropflow must be used inside <DropflowProvider> or given a client");
  }
  return client;
}
