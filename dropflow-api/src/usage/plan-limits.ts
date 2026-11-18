export type Plan = 'free' | 'pro' | 'business';

export interface PlanLimits {
  storageBytes: number;
  monthlyUploads: number;
  maxFileSize: number;
  projects: number;
  requestCount: number;
}

/**
 * Illustrative configuration-based allowances. No payment gateway is wired;
 * these values are intentionally centralised rather than hardcoded in
 * controllers. Exact commercial pricing has not been published.
 */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    storageBytes: 5_000_000_000,
    monthlyUploads: 5_000,
    maxFileSize: 52_428_800,
    projects: 3,
    requestCount: 100_000,
  },
  pro: {
    storageBytes: 50_000_000_000,
    monthlyUploads: 100_000,
    maxFileSize: 536_870_912,
    projects: 25,
    requestCount: 2_000_000,
  },
  business: {
    storageBytes: 250_000_000_000,
    monthlyUploads: 1_000_000,
    maxFileSize: 5_368_709_120,
    projects: 200,
    requestCount: 20_000_000,
  },
};
