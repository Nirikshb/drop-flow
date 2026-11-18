import type { Metadata } from "next";
import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Dropflow account and organization to start uploading files.",
};

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Set up your organization and get a project in minutes.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="rounded font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
