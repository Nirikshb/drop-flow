"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormValues {
  name: string;
  email: string;
  company: string;
  teamSize: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const roleLabels: Record<string, string> = {
  "design-partner": "Design partner",
  enterprise: "Enterprise",
  partner: "Integration partner",
  "early-access": "Early access",
};

function friendlyRole(role: string) {
  return roleLabels[role] ?? role.replace(/[-_]/g, " ");
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function ContactSalesForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [values, setValues] = React.useState<FormValues>({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [passedValidation, setPassedValidation] = React.useState(false);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setPassedValidation(false);
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) {
      next.name = "Please enter your name (at least 2 characters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = "Enter a valid work email address.";
    }
    if (values.company.trim().length < 2) {
      next.company = "Please enter your company name.";
    }
    if (!values.teamSize) {
      next.teamSize = "Select a team size.";
    }
    if (values.message.trim().length < 10) {
      next.message = "Tell us a little more (at least 10 characters).";
    }
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setPassedValidation(Object.keys(nextErrors).length === 0);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {role && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <Badge variant="outline" className="border-primary/30 text-primary">
            Role
          </Badge>
          <span>
            You are applying as <span className="font-medium text-foreground">{friendlyRole(role)}</span>
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="sales-name">Full name</Label>
        <Input
          id="sales-name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "sales-name-error" : undefined}
        />
        <FieldError id="sales-name-error" message={errors.name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sales-email">Work email</Label>
        <Input
          id="sales-email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "sales-email-error" : undefined}
        />
        <FieldError id="sales-email-error" message={errors.email} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sales-company">Company</Label>
        <Input
          id="sales-company"
          placeholder="Acme Inc."
          autoComplete="organization"
          value={values.company}
          onChange={(event) => setField("company", event.target.value)}
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "sales-company-error" : undefined}
        />
        <FieldError id="sales-company-error" message={errors.company} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sales-team-size">Team size</Label>
        <Select
          value={values.teamSize}
          onValueChange={(value) => setField("teamSize", value ?? "")}
        >
          <SelectTrigger
            id="sales-team-size"
            className="w-full"
            aria-invalid={Boolean(errors.teamSize)}
            aria-describedby={errors.teamSize ? "sales-team-size-error" : undefined}
          >
            <SelectValue placeholder="Select team size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">Just me (1–10)</SelectItem>
            <SelectItem value="11-50">Small team (11–50)</SelectItem>
            <SelectItem value="51-200">Growing team (51–200)</SelectItem>
            <SelectItem value="201-1000">Large team (201–1,000)</SelectItem>
            <SelectItem value="1000+">Enterprise (1,000+)</SelectItem>
          </SelectContent>
        </Select>
        <FieldError id="sales-team-size-error" message={errors.teamSize} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sales-message">What are you building?</Label>
        <Textarea
          id="sales-message"
          rows={5}
          placeholder="Tell us about your upload use case, volume and timeline…"
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "sales-message-error" : undefined}
        />
        <FieldError id="sales-message-error" message={errors.message} />
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit">
          <Send aria-hidden="true" />
          Request a conversation
        </Button>
        <p className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          Preview form — connect your backend to receive submissions. Nothing is
          transmitted or stored by this page.
        </p>
        {passedValidation && (
          <p
            role="status"
            className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-primary"
          >
            All fields look good. This is a preview with no backend connected, so no
            request was sent and nothing was saved.
          </p>
        )}
      </div>
    </form>
  );
}
