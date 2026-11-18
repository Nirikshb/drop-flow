import type { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string = "unknown_error",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new ApiError(
      typeof body.message === "string" ? body.message : "Request failed",
      response.status,
      typeof body.code === "string" ? body.code : "unknown_error",
    );
  }
  return body as T;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  organizationName: string;
}

export const authService = {
  register(input: RegisterInput) {
    return request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  login(input: { email: string; password: string }) {
    return request<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  logout() {
    return request<{ success: boolean }>("/auth/logout", { method: "POST" });
  },
  me() {
    return request<User>("/auth/me");
  },
};
