# Dropflow — Project Status

_Living document. Updated after each milestone. Git is out of scope by instruction._

## Current stage
**Integrated product implemented and verified.** Phases 0–7 and 9 core work complete; Phase 8 (billing) remains preparation-only by design.

## Completed features (verified)

### Frontend
- Marketing site: homepage (10 sections), features, how-it-works, pricing, docs, contact, privacy (DRAFT), terms (DRAFT), login, signup. Responsive, semantic, Motion used sparingly.
- Dashboard shell with sidebar, org/project selectors, notifications, user menu, mobile sheet.
- Pages: overview, projects (+ detail), assets (grid/list, search, filters, sorting, preview, delete), uploads (**real SDK uploads** with progress, cancel and retry), API keys (one-time secret display), usage, settings.
- Real API client replaced Phase 1 mocks; all dashboard data now comes from the backend with cookie sessions.

### Backend
- NestJS modular monolith: auth, users, organizations, projects, api-keys, uploads, assets, storage, usage, health, admin, common.
- Registration, login/logout, secure session cookies, bcrypt (cost 12), hashed session tokens, email verification + password reset (HMAC tokens), profile/session management, account-deletion request flag.
- Organizations with owner/admin/member roles, membership checks, role changes, ownership transfer, member removal.
- Projects with restrictions, status, safe deletion.
- Public + secret API keys; secret hashing and one-time display; revocation and rotation.
- Storage abstraction with Cloudflare R2 (S3) adapter and a local signed-URL adapter for credential-free development.
- Upload flow: init → validation (size, MIME, quota) → signed URL → direct PUT → start → completion with real object HEAD verification → asset + usage event. Idempotent completion via row lock.
- Assets: list/search/filter/sort/paginate, project-isolated get/delete with soft delete and storage cleanup.
- Usage computed from persisted rows; monthly chart data, plan limits.
- Admin endpoints behind a separate `x-admin-key` credential.
- Global exception filter, validation pipe, throttling, structured logging, CORS.

### SDK + React
- `@dropflow/sdk`: ESM + CJS + declarations, XHR progress in browsers/fetch fallback in Node, AbortController cancellation, bounded backoff retries, typed errors, all four core methods.
- `@dropflow/react`: `useDropflow`, `useUpload`, `useDropzone` and three optional components — thin layer over the SDK.

### Database
- Two TypeORM migrations (initial schema + account deletion flag). Explicit indexes, unique constraints, FKs with deliberate RESTRICT/CASCADE/SET NULL behaviour. No auto-synchronize.

## Files created / modified (high level)
- `dropflow-web/src/app/(marketing)`, `(auth)`, `(dashboard)`; `src/components/{marketing,auth,dashboard,ui}`; `src/services/{index,auth,types}`; `src/types`, `src/mock` (isolated, unused by production services).
- `dropflow-api/src/{admin,api-keys,assets,auth,common,config,database,health,organizations,projects,storage,uploads,usage,users}`; `test/{integration-smoke,authz-check,seed-dev}.mjs`.
- `dropflow-js-sdk/src/{client,uploads,errors,transport,types,index}`; `tests/{client.test.ts,consumer-check.mjs}`.
- `dropflow-react/src/{hooks,components,index}`.
- `scripts/{start-local-db,restart-api,restart-web,start-web-prod}.ps1`; `project-docs/*`.

## Dependencies installed
- Web: Next 16.4.6, React 19.3, Tailwind 4, shadcn/ui, Motion 14, RHF, Zod 4, TanStack Query 5, sonner, Vitest 5 + Testing Library.
- API: Nest 12.5, TypeORM 0.3.31, pg, Zod, bcryptjs, AWS S3 SDK, @nestjs/config/typeorm/terminus/throttler, tsx, Vitest 4 + Supertest.
- SDK: tsup 8.5, TypeScript 5.9, Vitest 5.
- React package: React 19 peer, tsup, local `file:` dependency on SDK.

## Database changes
- Migrations applied: `InitialSchema1763472000000`, `AccountDeletion1763481000000`.
- Demo data seeded via the real API (`test/seed-dev.mjs`): demo user `demo@dropflow.dev` / `demo12345`, two projects, keys, 10 assets.

## Tests executed & verification results
- API unit tests: **7 passed**.
- API integration smoke: **19/19 passed** (auth, keys, signed upload, object verification, idempotency, usage, deletion).
- Authorization checks: **7/7 passed** (cross-org isolation, invalid key, disabled project).
- SDK unit tests: **6 passed**; built-package consumer check: **passed** against live API.
- Web unit tests: **6 passed**.
- Web build: 20 routes compiled. API build: clean. SDK + React builds: clean. Typechecks: clean.
- Browser: login with real credentials → dashboard loaded real persisted assets/usage (screenshot captured); dashboard upload reached 100% and produced a usable asset URL.

## Known issues / blockers
- Cloudflare R2 credentials are not configured. The R2 adapter is implemented and selected automatically when env vars are present; local adapter is used otherwise. **Production must supply R2 credentials.**
- Email provider is not configured. Verification/reset links are logged in development; production logs an explicit undelivered warning.
- Pricing numbers are illustrative; no payment provider is wired (Phase 8 preparation only).
- Dashboard "Uploads" page now uses the real SDK; verified in a browser (100% progress, stored asset, asset URL).
- Next 16 dev server needs `allowedDevOrigins` for `127.0.0.1` (added to `next.config.ts`).

## Remaining work
- Phase 8: choose billing provider/prices; add subscription records and invoices.
- Email delivery provider configuration for production.
- Deployment manifests / ops runbook; backups and rollback strategy.
- Additional E2E coverage for every dashboard interaction.
