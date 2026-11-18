import { z } from 'zod';

/**
 * Environment contract.
 *
 * `@nestjs/config` accepts any Standard Schema and validates process.env at
 * bootstrap. Validation failures abort startup instead of surfacing later as
 * confusing runtime errors. Coercion turns env strings into real numbers.
 */
export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    DATABASE_URL: z.string().min(1),
    FRONTEND_URL: z.string().url().default('http://127.0.0.1:3000'),

    // Number of trusted proxy hops, or a comma-separated address list. Unset
    // means no proxy headers are trusted for rate limiting.
    TRUST_PROXY: z.string().optional(),

    // Required in production; a documented, non-secret development fallback
    // keeps local setup frictionless. Never reuse it outside development.
    SESSION_SECRET: z.string().min(32).optional(),

    // R2 credentials become required in Phase 3 when storage is wired in.
    R2_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_NAME: z.string().optional(),
    R2_ENDPOINT: z.string().url().optional(),
    R2_PUBLIC_BASE_URL: z.string().url().optional(),

    LOG_LEVEL: z.enum(['error', 'warn', 'log', 'debug', 'verbose']).default('log'),

    // Internal admin surface. Never expose this value to customers.
    ADMIN_SECRET: z.string().min(16).optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && !env.SESSION_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['SESSION_SECRET'],
        message: 'SESSION_SECRET is required in production (min 32 characters)',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;
