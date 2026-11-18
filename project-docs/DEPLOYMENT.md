# Deployment Notes

Frontend and backend are deployed independently. There is no shared runtime.

## Backend (`dropflow-api`)

Runtime: Node.js 20+ (Node 24 tested). Build: `pnpm build`. Start: `pnpm start:prod`.

Required production environment:
- `NODE_ENV=production`
- `DATABASE_URL` (PostgreSQL 14+)
- `FRONTEND_URL` (exact origin for CORS)
- `SESSION_SECRET` (≥32 chars, random)
- `ADMIN_SECRET` (≥16 chars, internal only)
- Full `R2_*` set — startup throws if absent in production

Database:
- Apply migrations explicitly: `pnpm migration:run`. **Never** enable `synchronize`.
- No automatic destructive migration on boot (`migrationsRun: false`).
- Take a backup before any migration; keep the previous image for rollback.

Health: `GET /health` pings PostgreSQL. Wire this into the platform health check.

Logging/error monitoring: structured Nest logs on stdout. No external provider is configured; add one before customer trial.

## Frontend (`dropflow-web`)

Build: `pnpm build`. Start: `pnpm start`. Set `NEXT_PUBLIC_API_URL` at build time — these values are embedded in the client bundle. Never place secrets in `NEXT_PUBLIC_*`.

## Cookies & CORS

- Session cookie: httpOnly, `sameSite=lax`, `secure=true` in production, path `/`.
- CORS allows only `FRONTEND_URL` with credentials.
- Serve both apps over HTTPS.

## Rollback

Redeploy the previous container/image and restore the previous database backup if a migration was applied. Do not roll back application code while leaving newer schema columns in place without checking compatibility first.
