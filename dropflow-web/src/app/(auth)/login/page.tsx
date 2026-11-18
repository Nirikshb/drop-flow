import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Dropflow account to manage projects and assets.",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Log in to manage your projects and assets.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Local development account</p>
        <p className="mt-1">Email: <code className="font-mono">demo@dropflow.dev</code></p>
        <p>Password: <code className="font-mono">demo12345</code></p>
        <p className="mt-1">Run <code className="font-mono">node test/seed-dev.mjs</code> in dropflow-api to create it.</p>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Dropflow?{" "}
        <Link
          href="/signup"
          className="rounded font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
