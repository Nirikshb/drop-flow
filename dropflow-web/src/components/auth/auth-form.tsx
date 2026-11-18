"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ApiError, authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  mode: "login" | "signup";
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z.object({
  name: z.string().min(2, "Enter your name (at least 2 characters)."),
  organizationName: z
    .string()
    .min(2, "Enter your organization name (at least 2 characters)."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

function PasswordInput({
  id,
  invalid,
  describedBy,
  registration,
}: {
  id: string;
  invalid: boolean;
  describedBy?: string;
  registration: UseFormRegisterReturn;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        className="pr-10"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

function SubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <Button type="submit" className="w-full" disabled={busy}>
      {busy && <Loader2 className="animate-spin" aria-hidden="true" />}
      {busy ? "Please wait…" : label}
    </Button>
  );
}

function describeError(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "Could not reach the server. Check your connection and try again.";
}

function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    try {
      await authService.login({
        email: values.email,
        password: values.password,
      });
      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(describeError(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="login-email-error" message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">Password</Label>
        <PasswordInput
          id="login-password"
          invalid={Boolean(errors.password)}
          describedBy={errors.password ? "login-password-error" : undefined}
          registration={register("password")}
        />
        <FieldError id="login-password-error" message={errors.password?.message} />
      </div>

      <SubmitButton busy={isSubmitting} label="Log in" />
    </form>
  );
}

function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      organizationName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    try {
      await authService.register({
        name: values.name,
        organizationName: values.organizationName,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created");
      router.push("/dashboard");
    } catch (error) {
      toast.error(describeError(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name">Your name</Label>
        <Input
          id="signup-name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "signup-name-error" : undefined}
          {...register("name")}
        />
        <FieldError id="signup-name-error" message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-organization">Organization name</Label>
        <Input
          id="signup-organization"
          placeholder="Acme Inc."
          autoComplete="organization"
          aria-invalid={Boolean(errors.organizationName)}
          aria-describedby={
            errors.organizationName ? "signup-organization-error" : undefined
          }
          {...register("organizationName")}
        />
        <FieldError
          id="signup-organization-error"
          message={errors.organizationName?.message}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="signup-email-error" message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <PasswordInput
          id="signup-password"
          invalid={Boolean(errors.password)}
          describedBy={errors.password ? "signup-password-error" : undefined}
          registration={register("password")}
        />
        <FieldError id="signup-password-error" message={errors.password?.message} />
        <p className="text-[11px] text-muted-foreground">
          Use at least 8 characters.
        </p>
      </div>

      <SubmitButton busy={isSubmitting} label="Create account" />
    </form>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  return mode === "login" ? <LoginForm /> : <SignupForm />;
}
