# Remediation Work Summary

This document records the work completed for the approved security remediation of the Dropflow project. It is a factual record of the request, what was delivered, verification evidence, files changed, decisions, and residual risks.

## 1. The request

**Objective**

- Implement the approved remediation for all confirmed critical/high findings (C-01, H-01 through H-10) in the Dropflow project.
- Verify each fix with tests and exploit reproductions.
- Stop after the critical/high findings and produce a new factual audit report.

**Constraints**

- Fix root causes, not symptoms.
- Preserve working functionality.
- Add regression tests for every confirmed vulnerability.
- Never weaken or remove existing tests.
- Keep public vs. secret key permissions explicitly separated.
- Account quotas must be atomic under concurrent uploads.
- No orphaned objects from failed or abandoned uploads.
- Dashboard must never claim success without a persistent change.
- Do NOT configure production R2 credentials or infrastructure.
- Git operations were originally out of scope (a push has since been separately requested by the user).
- Document breaking SDK changes and update SDK docs/examples.
- After each logical group: run relevant tests, add missing tests, run the full `scripts/verify-all.ps1`, reproduce the original exploit, and document files changed + evidence.
- Update `PRODUCTION_READINESS_AUDIT.md` and `PRODUCTION_REMEDIATION_PLAN.md` with actual results.
- Stop after critical/high findings.

**Decisions made**

- Private R2 bucket with short-lived signed GET URLs (no public bucket).
- External customer-site browser SDK integrations remain first-class.
- Secret key is required for privileged server-side operations.
- Origin restrictions are not authentication.
- Approved scope is C-01 plus H-01 through H-10 only.

## 2. What was delivered

### C-01 — Explicit key scope / public vs. secret separation

- Added an explicit `keyScope` field on `AuthenticatedRequest`.
- Added a shared guard at `common/guards/api-key-auth.ts`.
- `ProjectKeyGuard` now accepts public + secret keys and records the scope.
- Added `SecretKeyGuard`, which rejects public keys with HTTP 403.
- `FlexibleAuthGuard` now uses `SecretKeyGuard`.
- `lastUsedAt` updates use a targeted `apiKeys.update({ id }, …)` call.

### H-01 — Signed upload integrity and abandoned-upload cleanup

- `createSignedUploadUrl(..., contentLength)` now binds content length.
- R2 presigned PUT includes `ContentLength`.
- Local token binds purpose, key, expiry, content type, and content length.
- Local PUT validates `Content-Length`, actual body length, and content type.
- `discard()` deletes the object before marking the session failed/expired.
- `reapExpiredSessions()` uses `FOR UPDATE SKIP LOCKED`.
- `UploadReaperService` runs a 60-second, unref'd, overlap-guarded timer.

### H-02 — Atomic, org-wide quota enforcement

- Org-wide quota counting and reservation happen under an organization row lock in `UploadsService.init`.
- The plan is read from `organizations.plan`.
- `PLAN_LIMITS.projects` is enforced in `ProjectsService.create`.
- Added migration `1763489000000-ProductionHardening` (organizations.plan, projects.allowed_origins, indexes).

### H-03 — Storage module / controller hardening

- `StorageModule.register()` is `@Global()` / `global: true` and registered once in `AppModule` only.
- Removed StorageModule from uploads, assets, and projects modules.
- Controller and raw body parser are mounted only when there is no R2 env and `NODE_ENV !== production`.
- `import 'dotenv/config'` is first in `main.ts`.
- Removed the unauthenticated local GET path.

### H-04 — MIME / active-content policy

- Added shared `common/mime-policy.ts`.
- Any `*` is rejected in declared upload types.
- `application/*`, `*`, and `*/*` are rejected as project patterns.
- Active content (HTML/SVG/JS/XML/RSS/Atom) is denied unless the exact type is allowlisted.
- Final content type is rechecked on completion.
- Local download sends `nosniff`, `Content-Disposition`, and `no-store`.

### H-05 — Token leakage in logs

- `MailService` withholds tokens in production logs and is silent in test.

### H-06 — Project deletion consistency

- Project deletion removes usage events and all asset rows (including soft-deleted rows), then the project.
- FK violation maps to HTTP 409.
- Storage objects are deleted after commit, with logging.

### H-07 — Real web actions (no fake success)

- Implemented real `getCurrentUser`, `updateProfile`, `updateOrganization`, `updateProject`, `deleteProject`, and `revokeApiKey` in the web service layer.
- Wired these into settings, project-settings, projects, and api-keys pages with pending states.
- Header and dashboard greeting use `/auth/me`.
- Removed demo / success-fake copy.
- 401 responses redirect to `/login?expired=1`.
- API organization DTO now includes plan + role.

### H-08 — Rate limiting and proxy trust

- `TRUST_PROXY` env plus `app.set('trust proxy', …)`.
- Per-route `@Throttle`: register 5/min, login 10/min, forgot/reset 5/min, upload init 30/min.
- `@SkipThrottle` on `/health`.

### H-09 — Origin policy / CORS

- Added per-project `allowedOrigins`.
- Custom CORS middleware: frontend origin with credentials; customer origins only on `/v1/uploads*` without credentials; 30-second DB cache; fail closed.
- DTO rejects wildcards and paths in origins.

### H-10 — Signed download URLs

- Added `createSignedDownloadUrl` to the storage interface.
- R2 presigned `GetObject` implementation.
- Local signed download endpoint.
- Asset DTOs and completion response return 15-minute signed URLs.

### Incidental medium fixes required by the above

- **M-02:** Email change re-issues verification and clears the verification flag.
- **M-05:** Scheduled reaper.
- **M-06:** Targeted `lastUsedAt` update.

### Regression tests and live exploit scripts

- Unit/regression tests added: `api-key-auth.spec.ts`, `mime-policy.spec.ts`, `local-storage.service.spec.ts`, `mail.service.spec.ts`, `projects.service.spec.ts`, plus auth email-change tests.
- Live exploit scripts: `test/security-regressions.mjs` (C-01, H-01, H-02, H-03, H-04, H-06, H-09, H-10), `test/integration-smoke.mjs`, `test/authz-check.mjs`, `test/rate-limit-check.mjs`.
- Test-harness fixes: public-key checks in smoke/authz/security scripts now use cookie-less helpers; the H-06 security test creates a dedicated key bound to the doomed project.
- `scripts/verify-all.ps1` extended from 13 to 15 steps (added security regressions + rate limiting).

## 3. Verification evidence

All of the following were verified locally:

- API unit tests: `pnpm test` — **28 tests / 7 files passing**.
- API build: passes.
- Web typecheck: passes.
- Full verification gate: `scripts/verify-all.ps1` — **15 steps**, all passing.
- Live integration suites: all four pass — `test/security-regressions.mjs`, `test/integration-smoke.mjs`, `test/authz-check.mjs`, `test/rate-limit-check.mjs`.
- Original exploits reproduced and confirmed blocked for the findings covered by `test/security-regressions.mjs` (C-01, H-01, H-02, H-03, H-04, H-06, H-09, H-10).
- SDK built-package consumer check rewritten and passing: provisions a disposable account/project/keys; uses a secret key for get/list/delete; verifies a public key can upload but receives 403 on list; reads `API_URL` as a fallback to `DROPFLOW_API_URL`.

## 4. Files changed

### API

- `common/guards/api-key-auth.ts` — new shared guard module (ProjectKeyGuard, SecretKeyGuard, FlexibleAuthGuard, key scope).
- `common/mime-policy.ts` — new shared MIME / active-content policy.
- `UploadsService` — org-wide quota reservation under row lock; content-length binding.
- `ProjectsService` — `PLAN_LIMITS.projects` enforcement; deletion cleanup.
- `StorageModule` — global registration; `createSignedUploadUrl(..., contentLength)` and `createSignedDownloadUrl` in the interface; R2 presigned PUT/GET; local PUT validation + signed download endpoint; `discard()` object deletion; `reapExpiredSessions()` with `FOR UPDATE SKIP LOCKED`; `UploadReaperService` timer.
- `AppModule` — single StorageModule registration.
- `main.ts` — `dotenv/config` first, `trust proxy` setting.
- `MailService` — production log token withholding.
- `Auth` layer — email-change verification re-issue and flag clearing (M-02); per-route throttles + `/health` skip; custom CORS middleware; `TRUST_PROXY` support.
- Organization DTO — includes plan + role.
- Asset DTOs and upload completion response — 15-minute signed URLs.
- Migration `1763489000000-ProductionHardening` — organizations.plan, projects.allowed_origins, indexes.

### Web

- Web service layer — real `getCurrentUser`, `updateProfile`, `updateOrganization`, `updateProject`, `deleteProject`, `revokeApiKey`.
- Settings, project-settings, projects, and api-keys pages — wired to real actions with pending states.
- Header + dashboard greeting — use `/auth/me`.
- 401 handling — redirect to `/login?expired=1`.
- Removed demo / fake-success copy.

### SDK

- `dropflow-js-sdk/README.md` — key permission table.
- `dropflow-js-sdk/.env.example` — consumer check self-provisions; no hardcoded key.
- SDK built-package consumer check — rewritten as described in Section 3.

### Tests / scripts

- `api-key-auth.spec.ts`, `mime-policy.spec.ts`, `local-storage.service.spec.ts`, `mail.service.spec.ts`, `projects.service.spec.ts`.
- Auth email-change tests.
- `test/security-regressions.mjs`, `test/integration-smoke.mjs`, `test/authz-check.mjs`, `test/rate-limit-check.mjs`.
- `scripts/verify-all.ps1` — extended 13 → 15 steps.

### Docs

- `PRODUCTION_REMEDIATION_PLAN.md` — status changed to implemented-for-approved-scope; implementation record table and decisions.
- `PRODUCTION_READINESS_AUDIT.md` — verdict, remediation summary, post-fix verification, per-finding fix notes, findings summary statuses, residual risks.
- `API_CONTRACT.md` — key scopes, CORS, rate limits, signed URLs.
- `project-docs/ENVIRONMENT.md` — consumer check self-provisions; no hardcoded key.
- `project-docs/REMEDIATION_WORK_SUMMARY.md` — this document.

## 5. Decisions taken and breaking changes

- **Public key scope:** Public keys are restricted to upload-only operations. Privileged server-side operations (get/list/delete) now require a secret key and return 403 for public keys. The SDK consumer check was updated because its prior use of a hardcoded public key for list/get/delete is intentionally forbidden.
- **Signed URLs:** Downloads use short-lived signed GET URLs against a private R2 bucket (no public bucket). Uploads use presigned PUTs with bound content length/content type. Asset DTOs and completion responses emit 15-minute signed URLs.
- **Origin policy:** Per-project `allowedOrigins` govern browser uploads. Customer origins are allowed only on `/v1/uploads*` without credentials; the frontend origin is allowed with credentials. Origin restrictions are explicitly not authentication.
- **External customer-site SDK integrations:** Remain first-class under the above origin policy.
- **Production credentials:** No production R2 credentials or infrastructure were configured.

## 6. Residual risks / explicitly out of scope

- Phase 1 / Phase 2 items outside the approved C-01 + H-01…H-10 scope remain open and were not addressed.
- No production infrastructure was configured (no production R2 bucket, credentials, or deployment changes).
- Rate limiting uses an in-memory throttle store; it is not shared across multiple instances / processes.
- R2 itself was not exercised; R2 paths were verified at the code and local-signature level only.
- Port 3001 is occupied by an unrelated Next.js dev server, so API verification used `127.0.0.1:3011`.
- Local Postgres runs on `127.0.0.1:5434` (database `dropflow_dev`) and occasionally needs a restart via `scripts/start-local-db.ps1` or `pg_ctl`. Credentials are in the ignored local `.env`, never in this document.

## 7. Current status of the canonical verification gate

- The canonical gate is `scripts/verify-all.ps1`.
- It has been extended from 13 to 15 steps, adding security regressions and rate-limit checks.
- As of this record, all 15 steps pass locally, alongside the API test suite (28 tests / 7 files), API build, web typecheck, and all four live integration/exploit suites.
- Work is complete for the approved critical/high scope; critical/high findings have been remediated and verified. Phase 1/2 items and production infrastructure remain explicitly out of scope.
