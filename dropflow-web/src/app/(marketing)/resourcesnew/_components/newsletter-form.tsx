"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setError("Enter your email address to continue.");
      setValidated(false);
      return;
    }
    if (!emailPattern.test(value)) {
      setError("That doesn’t look like a valid email address.");
      setValidated(false);
      return;
    }

    setError(null);
    setValidated(true);
    // No network request and no persistence: this is a local preview only.
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="newsletter-email">Work email</Label>
        <Input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
            setValidated(false);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : "newsletter-note"}
        />
        {error && (
          <p id="newsletter-error" role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <Button type="submit">
        Subscribe
        <ArrowRight aria-hidden="true" />
      </Button>

      {validated && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-300"
        >
          <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Email format looks good. Nothing was submitted or stored — this form is a
          local preview.
        </p>
      )}

      <div
        id="newsletter-note"
        className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground"
      >
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          <span className="font-semibold text-foreground">
            Preview form — connect your backend.
          </span>{" "}
          Validation runs locally; no address is sent anywhere. Wire this form to
          your email service before using it in production.
        </p>
      </div>
    </form>
  );
}
