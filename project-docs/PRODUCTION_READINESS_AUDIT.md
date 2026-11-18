# Dropflow — Production Readiness & Security Audit

**Date:** 2026-11-18 (audit), 2026-11-18 (remediation results appended)  
**Scope:** audit of the existing implementation, followed by the approved remediation of C-01 and H-01 … H-10 only  
**Environment:** local Windows host, Node 24.13.0, pnpm 10.14.0, local PostgreSQL on port 5434, web on `127.0.0.1:3000`. The API was on `127.0.0.1:3001` at audit time and on `127.0.0.1:3011` during remediation (port 3001 was occupied by an unrelated project).  
**Method:** source inspection of all five packages, migrations, tests, scripts, env contract and docs, plus live HTTP probes against the running API. The original audit modified no tests; the remediation section documents the tests that were added or corrected afterwards.

---

## 1. Verdict

> **The approved remediation scope is implemented and verified locally. Production infrastructure configuration remains gated by the unstarted Phase 1 items.**

Original verdict at audit time: **NOT READY for production infrastructure configuration.** That verdict was driven by one critical authorization flaw and ten high-impact defects. All eleven are now fixed:

- **C-01** — public keys are identifiers only. They can initialize and complete uploads for their own project; asset listing, asset detail, asset deletion and all project management require a secret key or a dashboard session. Reproduced as a regression: the same public-key calls that previously returned 200/201 now return 403, and the asset survives.
- **H-01 … H-10** — upload size is enforced at the storage boundary, in-flight and abandoned objects are cleaned up, quotas are account-wide and atomic, the dev storage surface and 100 MB body parser are gone, active content is denied by default, tokens are no longer logged, project deletion no longer returns 500, the dashboard writes through to real endpoints, client IPs and per-route limits work, customer origins are configurable, and asset URLs are short-lived signed URLs against a private bucket.

Local verification after the fixes: **API 28 unit tests / 7 files pass**, `pnpm build` passes, web `pnpm typecheck` passes, and four live integration suites pass against a real PostgreSQL database and real object storage (`integration-smoke`, `authz-check`, `security-regressions`, `rate-limit-check`). `scripts/verify-all.ps1` now has 15 steps.

**What this does not mean.** No production database, R2 bucket, reverse proxy or email provider was configured, so nothing here proves production behaviour. Phase 1 items that block external beta — ownerless organizations (M-01), member key management (M-03), unverified checksums (M-04), 500s on malformed input (M-10), and the failed lint/dependency gate (M-12) — are still open. The honest status is:

| Gate | Status |
|---|---|
| Configure production infrastructure (R2, DB, proxy) | **Unblocked by the critical/high findings** — remaining blockers are Phase 1 and operational, not these defects |
| External beta | **Still blocked** — Phase 1 |
| Public launch / paid plans | **Blocked** — Phase 1 + 2 |

The detailed evidence for each fix is in section 1a and in each finding below.

---

## 1a. Remediation summary

| ID | Was | Now | Evidence |
|---|---|---|---|
| C-01 | Public key could list/delete assets | Public key uploads only; 403 on list/get/delete | `test/security-regressions.mjs`, `test/authz-check.mjs` |
| H-01 | No size bound; orphans forever | `ContentLength` on signed PUT; local token binds size/type; `discard()` deletes the object; expiry reaper | `security-regressions.mjs` (oversized PUT rejected, zero bytes stored) |
| H-02 | Per-project, hardcoded free plan, racy | Organization-wide totals under a `FOR UPDATE` row lock; pending reservations; project limit enforced; plan read from `organizations.plan` | `projects.service.spec.ts`, `security-regressions.mjs` |
| H-03 | Dev storage routes + 100 MB parser active | `StorageModule` registered once, only when local storage is selected outside production; raw parser only in that case; unauthenticated GET removed | boot log, `local-storage.service.spec.ts` |
| H-04 | Active content allowed; wildcard bypass | Shared MIME policy; any `*` rejected as a declaration; active types denied unless exactly allowlisted; `nosniff` + attachment on download | `mime-policy.spec.ts` (8 tests), `security-regressions.mjs` |
| H-05 | Tokens logged in production | Tokens are withheld; test env is silent | `mail.service.spec.ts` |
| H-06 | Deleting a project after soft-delete → 500 | Ordered cleanup in one transaction; FK violation → 409; storage removed after commit | `security-regressions.mjs` |
| H-07 | Simulated dashboard writes | Real `getCurrentUser`, `updateProfile`, `updateOrganization`, `updateProject`, `deleteProject`, `revokeApiKey`; pending states; 401 → login | web `pnpm typecheck`, live flow |
| H-08 | No client IP; global throttle only | `TRUST_PROXY` + `app.set('trust proxy', …)`; per-route limits (register 5/min, login 10/min, reset 5/min, upload init 30/min); `/health` skipped | `rate-limit-check.mjs` |
| H-09 | Single-origin CORS | Per-project `allowedOrigins`; frontend origin keeps credentials, customer origins only on `/v1/uploads*` without credentials; fail-closed | `security-regressions.mjs` |
| H-10 | Unsigned or permanently public URLs | Private bucket + 15-minute signed GET URLs (R2 presign, local signed endpoint) | `security-regressions.mjs` (signed URL works, unsigned read and forged token rejected) |

Three medium findings were fixed because the high findings depended on them: **M-02** (email change clears/re-issues verification), **M-05** (60 s upload reaper with `SKIP LOCKED` and an overlap guard), **M-06** (targeted `lastUsedAt` update). All other medium and low findings are unchanged.

---

## 2. What was inspected

| Area | Files / artefacts inspected |
|---|---|
| API | `dropflow-api/src/**` — auth, sessions, guards, users, organizations, projects, API keys, uploads, assets, storage (R2 + local), usage, admin, health, config, filters, migrations, `main.ts` |
| Web | `dropflow-web/src/**` — dashboard layout/pages, services boundary, auth client, uploads page, settings, project settings, API keys, marketing SDK examples, `next.config.ts`, env files |
| SDK | `dropflow-js-sdk/src/**` — client, transport, uploader, errors, types; tests and built-package consumer check |
| React | `dropflow-react/src/**` — provider, hooks, components, package manifest |
| Database | Both migrations, entities, FK/index/constraint definitions, transaction and locking behaviour |
| Tests / scripts | `scripts/verify-all.ps1`, `test/integration-smoke.mjs`, `test/authz-check.mjs`, `test/seed-dev.mjs`, unit tests, React/web test scripts |
| Config / docs | `.env.example` files, `project-docs/*`, `PROJECT_STATUS.md`, `README.md`, package manifests, lockfiles |
| Runtime | Live API/web/DB; production boot guard; CORS; throttle; malformed input; dependency audit |

---

## 3. Commands run and results

Sections 3.1 and 3.2 are the **audit-time** baseline, kept unchanged so the before/after comparison is honest. Section 3.3 is the post-remediation run.

### 3.1 Canonical verification (audit time)

`powershell -File scripts/verify-all.ps1` → **ALL VERIFICATION STEPS PASSED**

| Step | Result |
|---|---|
| API build | PASS |
| API unit tests | PASS — 7 tests |
| API migrations | PASS — no pending migrations |
| API integration smoke | PASS — 19/19 checks |
| API authorization checks | PASS — 7/7 checks |
| Web typecheck | PASS |
| Web unit tests | PASS — 6 tests |
| Web build | PASS — 20 routes |
| SDK build | PASS |
| SDK unit tests | PASS — 6 tests |
| SDK built-package consumer | PASS — live API upload |
| React typecheck | PASS |
| React build | PASS |

### 3.2 Additional checks performed for this audit

_These are the pre-fix probe results. The corresponding post-fix results are in 3.3._

| Check | Result |
|---|---|
| `pnpm lint` (API) | PASS with 3 warnings |
| `pnpm lint` (web) | **FAIL** — 4 errors, 19 problems (React Compiler rules) |
| `pnpm test` (React) | **FAIL** — no test files found, exit 1 |
| `pnpm audit --prod` (API) | 2 moderate transitive advisories |
| `pnpm audit --prod` (web) | 1 high (`picomatch`), 1 moderate (`minimatch`), both via `shadcn` |
| `pnpm audit --prod` (SDK / React) | 0 |
| Production boot without R2 | **Fails closed as designed** — `R2 credentials are required in production` |
| Public-key authorization probes | **FAIL** — full list/upload/delete access |
| Oversized signed upload probe | **FAIL** — 2 MiB accepted for a 5-byte declaration; object retained |
| Unauthenticated local-storage GET | **FAIL** — 200 with bytes and attacker-selected content type |
| MIME wildcard probe | **FAIL** — `image/*` declaration accepted `text/html` body |
| Project deletion after soft-delete | **FAIL** — HTTP 500 |
| Owner self-demotion probe | **FAIL** — organization left with no owner |
| Profile email-change probe | **FAIL** — verification flag retained |
| Malformed UUID / pagination probes | **FAIL** — HTTP 500 in 4/4 cases |
| Global throttle probe | 120 × 200, then 429 (works, but see H-08) |
| CORS preflight from foreign origin | Dashboard origin returned; browser blocks (see H-09) |

---

### 3.3 Post-remediation verification

Run against a live API on `127.0.0.1:3011` (port 3001 was occupied by an unrelated project on this host), local PostgreSQL 18 on `127.0.0.1:5434`, and the local storage adapter.

| Step | Result |
|---|---|
| `pnpm build` (API) | PASS |
| `pnpm test` (API) | PASS — **28 tests / 7 files** (`api-key-auth`, `mime-policy`, `local-storage.service`, `mail.service`, `projects.service`, auth email-change, + existing) |
| `pnpm migration:run` | PASS — `ProductionHardening` applied |
| `test/integration-smoke.mjs` | PASS — 25/25 checks, secret key end-to-end, public-key negatives |
| `test/authz-check.mjs` | PASS — 8/8 checks |
| `test/security-regressions.mjs` | PASS — **ALL SECURITY REGRESSIONS PASSED** — 31/31 checks (C-01, H-01, H-02, H-03, H-04, H-06, H-09, H-10) |
| `test/rate-limit-check.mjs` | PASS — **ALL RATE LIMIT CHECKS PASSED** |
| `pnpm typecheck` (web) | PASS |
| `scripts/verify-all.ps1` | 15 steps, all passing |

Re-run of the original exploit probes:

| Pre-fix probe | Post-fix result |
|---|---|
| Public-key `GET /v1/assets` | **403** |
| Public-key `GET /v1/assets/:id` | **403** |
| Public-key `DELETE /v1/assets/:id` | **403**; asset still readable with the secret key |
| Public-key `POST /v1/uploads` | 201 — still allowed, by design |
| Oversized PUT against a 5-byte declaration | **rejected by storage**; no object written; completion refused |
| `GET /v1/local-storage` without a signature | **rejected** (unauthenticated route removed) |
| Forged local signed-download token | **rejected** |
| `image/*` declared upload type | **400** |
| `text/html` / `image/svg+xml` upload | **denied** unless exactly allowlisted |
| Project deletion after soft-deleting its assets | **200**, project gone |
| Wildcard project origin | **rejected**; concrete origin accepted |
| Per-route login limit | **11th rapid login rate limited** |

Not re-run: the malformed-UUID, owner-self-demotion, checksum and lint/audit probes. Those findings are unchanged, so the audit-time results still stand.

---

## 4. Findings summary

Legend for **status**:
- **Fixed** — remediated and re-verified after the audit (see 3.3 and the finding detail).
- **Verified** — reproduced against the running system at audit time; still open.
- **Code-confirmed** — deterministic from source; not reproduced at runtime; still open.
- **Needs verification** — depends on deployment/provider behaviour.

| ID | Severity | Status | Area | Finding |
|---|---|---|---|---|
| C-01 | Critical | **Fixed** | Authorization | Public key could list, upload and delete project assets |
| H-01 | High | **Fixed** | Uploads | Signed URL had no size cap; failed uploads left orphans forever |
| H-02 | High | **Fixed** | Quotas | Quotas were per project; project/org limits unenforced; check was non-atomic |
| H-03 | High | **Fixed** | Storage | Dev-only local storage surface was active in production; GET was unauthenticated; 100 MB body parser |
| H-04 | High | **Fixed** | Uploads / XSS | Active content accepted by default and inline-served; wildcard MIME bypass |
| H-05 | High | **Fixed** | Auth | Production logs full verification/reset tokens when email is unconfigured |
| H-06 | High | **Fixed** | Database | Projects could not be deleted after any asset was soft-deleted (HTTP 500) |
| H-07 | High | **Fixed** | Frontend | Dashboard mutations were simulated with “no backend change” success toasts |
| H-08 | High | **Fixed** | Operations | No `trust proxy`/client-IP handling; global throttle collapsed behind a load balancer |
| H-09 | High | **Fixed** | SDK / CORS | Browser SDK was blocked outside the dashboard by single-origin CORS |
| H-10 | High | **Fixed** | Storage | R2 delivery was unsigned: broken for private buckets or permanently public |
| M-01 | Medium | Verified | Authorization | Owner can demote themselves, leaving the organization ownerless |
| M-02 | Medium | **Fixed** | Auth | Changing email kept the old verified status and did not re-verify |
| M-03 | Medium | Code-confirmed | Authorization | Any organization member can mint/rotate/revoke secret API keys |
| M-04 | Medium | Verified | Uploads | Client checksum is stored but never verified |
| M-05 | Medium | **Fixed** | Uploads | No scheduled reaper for expired sessions or orphan objects |
| M-06 | Medium | **Fixed** | API keys | Concurrent `lastUsedAt` save could resurrect a revoked key |
| M-07 | Medium | Code-confirmed | Frontend | No dashboard auth gate; `/auth/me` is never used |
| M-08 | Medium | Code-confirmed | Operations | No audit log; admin is one static shared secret with no rotation/network restriction |
| M-09 | Medium | Code-confirmed | Auth | No per-account brute-force protection; duplicate registrations burn bcrypt CPU |
| M-10 | Medium | Verified | API | Malformed UUIDs/pagination return HTTP 500 |
| M-11 | Medium | Code-confirmed | SDK | Storage upload has no timeout in XHR/fetch |
| M-12 | Medium | Verified | Dependencies | Web lint fails; production dependency tree carries high/moderate advisories |
| M-13 | Medium | Code-confirmed | Uploads | Re-completing a deleted upload returns a deleted asset with a dead URL |
| M-14 | Medium | Code-confirmed | Billing | Plan limits are hardcoded to free; project/request limits are unused |
| L-01 | Low | Code-confirmed | Authorization | Ownership-transfer body is not DTO-validated |
| L-02 | Low | Code-confirmed | Hardening | No security headers/CSP; `LOG_LEVEL` ignored; auth responses not marked no-store |
| L-03 | Low | Code-confirmed | Storage | Signed PUT URL remains valid after completion (bytes can be replaced) |
| L-04 | Low | Verified | Docs | SDK docs show methods that do not exist; env docs omit a referenced variable |
| L-05 | Low | Code-confirmed | SDK | SDK accepts `df_secret_` keys in browser code without warning |
| L-06 | Low | Verified | React | No React tests; test script fails; `file:` dependency blocks publishing |
| L-07 | Low | Code-confirmed | Database | `pgcrypto` needs elevated rights; missing indexes for reaper/monthly queries |
| L-08 | Low | Code-confirmed | Auth | Email verification is never required; registration is fully open |

Counts at audit time: **1 critical, 10 high, 14 medium, 8 low** (33 findings).
Counts now: **11 fixed** (1 critical, 10 high), **3 fixed incidentally** (M-02, M-05, M-06), **11 medium and 8 low still open**.

---

## 5. Confirmed findings — detail

### C-01 — Public key grants destructive project access

- **Severity:** Critical
- **Status:** **Fixed** (was Verified)
- **Fix (2026-11-18):** Key authentication now records an explicit scope. `ProjectKeyGuard` accepts both key types and stamps `AuthenticatedRequest.keyScope`; `SecretKeyGuard` rejects `public` with 403 and backs every asset and project-management route; `FlexibleAuthGuard` (session or secret) uses it. `lastUsedAt` is written with a targeted `apiKeys.update({ id }, …)`.
- **Verification:** public key → 403 on list/get/delete, asset still readable with the secret key, public key still allowed on `POST /v1/uploads`; `test/security-regressions.mjs` and `test/authz-check.mjs` pass; `api-key-auth.spec.ts` covers the scope logic.
- **App:** API (`dropflow-api`)
- **Locations:**
  - `dropflow-api/src/common/guards/project-key.guard.ts:30-36` — a `df_public_*` key sets `request.projectId` and succeeds.
  - `dropflow-api/src/uploads/uploads.controller.ts:7-9` — the same guard protects all upload endpoints.
  - `dropflow-api/src/assets/assets.controller.ts:8-10` — the same guard protects list/get/delete.
  - `dropflow-api/src/assets/assets.service.ts:78-107` — deletion performs a soft delete plus storage removal.
  - `project-docs/API_CONTRACT.md:10` documents public keys as “browser-safe”.
- **What is wrong:** There is no scope distinction between public and secret keys. A public key is allowed to list all assets (filenames, sizes, object URLs), initialize uploads, and delete assets. The guard comment says secret keys authorize “privileged server-side operations”, but no route enforces that.
- **Evidence (live):**
  ```
  GET  /v1/assets          (public key) -> 200
  POST /v1/uploads         (public key) -> 201, signed URL returned
  POST /v1/uploads/:id/complete (public key) -> 201, asset created
  DELETE /v1/assets/:id    (public key) -> 200 {"success":true}
  ```
  Stronger cross-credential proof on a disposable project:
  ```
  asset created WITH SECRET key -> 201
  SAME asset deleted WITH PUBLIC key -> 200
  secret-key GET after public-key delete -> 404
  ```
- **Impact:** Any visitor to a customer site that embeds the public key can enumerate and destroy that project’s assets, and consume its upload quota. This is a public destructive credential.
- **Reproduction:**
  1. Obtain a project’s `publicKey` from `GET /projects` or the customer bundle.
  2. `GET /v1/assets` with `Authorization: Bearer df_public_…`.
  3. `DELETE /v1/assets/<id>` with the same header.
- **Recommended correction:** Add an explicit key scope to the request (`public` vs `secret`). Public keys may only initialize/complete uploads for their own project (and even there, apply stricter limits). Asset list/get/delete must require a secret key or a dashboard session. Add a route-level decorator/guard rather than reusing a generic guard.
- **Tests needed:** Public key cannot list/get/delete assets; public key can only perform the allowed upload flow; secret key can manage assets; disabled project rejects both; session path remains project-scoped.

---

### H-01 — Signed upload URL has no size bound; failed uploads leave orphans

- **Severity:** High
- **Status:** **Fixed** (was Verified)
- **Fix (2026-11-18):** `createSignedUploadUrl(…, contentLength)` passes `ContentLength` to the R2 presigned PUT. The local adapter's upload token binds purpose, key, expiry, content type and length, and the PUT handler compares `Content-Length`, the actual body length and the content type before writing. `discard()` deletes the object before marking the session failed/expired. `UploadReaperService` sweeps expired sessions every 60 s using `FOR UPDATE SKIP LOCKED`.
- **Verification:** oversized PUT rejected by storage, completion refused, zero bytes written; abandoned upload's object removed; `security-regressions.mjs` H-01/H-02 groups pass.
- **App:** API + storage
- **Locations:**
  - `dropflow-api/src/uploads/uploads.service.ts:66-116` — `init` checks the *declared* size only; the signed URL has no size condition.
  - `dropflow-api/src/storage/r2-storage.service.ts:41-58` — presigned `PutObject` without `ContentLength`/POST policy conditions.
  - `dropflow-api/src/storage/local-storage.controller.ts:15-31` — PUT body accepted without a size cap.
  - `dropflow-api/src/uploads/uploads.service.ts:147-159` — size/type are checked only at `complete`.
  - `dropflow-api/src/uploads/uploads.service.ts:36-41` — stale-session handling only flips status; it never deletes the object.
- **What is wrong:** A caller can declare `size: 5`, upload an arbitrarily large body to the signed URL, and then call `complete`. Completion rejects the mismatch, but the object stays in storage and is never referenced or cleaned up. The same applies to abandoned uploads and repeated SDK retries.
- **Evidence (live):**
  ```
  init declared size=5 -> 201
  signed PUT of 2 MiB -> 200
  complete -> 400 {"code":"upload_invalid","message":"Size mismatch: expected 5 bytes, found 2097152"}
  unauthenticated GET of the object -> 200, 2,097,152 bytes
  the 2 MiB file was still present on disk after the failed completion
  ```
- **Impact:** Direct storage/disk and egress cost abuse, memory pressure (see H-03), and no upper bound on what an attacker can write. It violates the stated constraint “no unlimited uploads”.
- **Recommended correction:** Enforce size at the storage boundary (S3 POST policy `content-length-range`, or reject/delete on length mismatch), verify `Content-Length` on the local adapter, record pending reservations, and delete objects when a session fails/expires or verification fails. Add a scheduled reaper for unreferenced objects.
- **Tests needed:** Oversized PUT is rejected or cleaned up; failed completion leaves no object; abandoned session reaper removes objects; retry does not accumulate orphans.

---

### H-02 — Quotas are per project, project limits are unenforced, and checks are non-atomic

- **Severity:** High
- **Status:** **Fixed** (was Code-confirmed)
- **Fix (2026-11-18):** `UploadsService.init` locks the organization row (`FOR UPDATE`), sums usage organization-wide, counts monthly uploads org-wide, includes pending/uploading `expected_size` as a reservation, and resolves limits from `organizations.plan`. `ProjectsService.create` enforces `PLAN_LIMITS.projects` under the same lock.
- **Verification:** `projects.service.spec.ts` covers the project limit; `security-regressions.mjs` exercises the quota path against the live database.
- **App:** API
- **Locations:**
  - `dropflow-api/src/uploads/uploads.service.ts:43-51` — storage total is scoped to one `project_id`.
  - `dropflow-api/src/uploads/uploads.service.ts:80-88` — always uses `PLAN_LIMITS.free`; checks `currentBytes + dto.size`.
  - `dropflow-api/src/projects/projects.service.ts:20-31` — no project-count check.
  - `dropflow-api/src/usage/plan-limits.ts:16-38` — `projects` and `requestCount` limits are defined but unused.
  - `dropflow-api/src/organizations/organizations.service.ts:18-34` — no organization/account limit.
- **What is wrong:** Every new project receives its own 5 GB allowance and 5,000 monthly uploads. A user can create unlimited projects (and unlimited organizations), each with a fresh quota. Simultaneous `init` calls also read the same `currentBytes` before any reservation, so a burst can exceed the allowance by a multiple of `maxFileSize`.
- **Impact:** Unbounded free storage and cost abuse even for an authenticated user; the paid-plan model cannot be enforced.
- **Reproduction:** Register, create 100 projects, upload up to 5 GB per project. For the race, issue concurrent `init` calls with large declared sizes and complete them.
- **Recommended correction:** Move storage/upload counting to the organization/account boundary, enforce `PLAN_LIMITS.projects`, and reserve quota transactionally (row lock or counter row) before issuing a signed URL. Release reservation on fail/expiry.
- **Tests needed:** Project-count limit; per-organization storage limit; concurrent init cannot exceed quota; downgrade/upgrade behaviour.

---

### H-03 — Development local-storage surface is active in production

- **Severity:** High
- **Status:** **Fixed** (was Verified / Code-confirmed)
- **Fix (2026-11-18):** `StorageModule.register()` is a `@Global()` dynamic module registered exactly once, in `AppModule`. It includes `LocalStorageController` only when no R2 env is present **and** `NODE_ENV !== 'production'`; `main.ts` mounts the raw body parser (110 MB) only in that case. The unauthenticated `GET /v1/local-storage` was replaced by a signed download endpoint. `import 'dotenv/config'` is first in `main.ts` so the module sees the env at definition time.
- **Verification:** boot log shows a single `/v1/local-storage` mapping; unsigned and forged-token reads are rejected; `local-storage.service.spec.ts` passes.
- **App:** API
- **Locations:**
  - `dropflow-api/src/storage/storage.module.ts:8-10` — `LocalStorageController` is always registered.
  - `dropflow-api/src/storage/local-storage.controller.ts:52-62` — `GET /v1/local-storage?key=…` has no authentication or signature check.
  - `dropflow-api/src/main.ts:19-22` — `express.raw({ type: '*/*', limit: '100mb' })` is always attached to that path.
  - `dropflow-api/src/storage/local-storage.controller.ts:15-31` — PUT validates a token but buffers the whole body first.
- **What is wrong:** The “dev-only” adapter’s HTTP surface remains mounted even when the R2 adapter is selected. The GET route serves any object under the local directory without authentication, and the raw parser buffers up to 100 MB per request before the controller checks the token. The production boot guard prevents the *local adapter* from being selected, but it does not remove the controller or parser.
- **Evidence (live):**
  ```
  GET /v1/local-storage?key=projects/.../... -> 200, 2,097,152 bytes
  Content-Type reflected from the stored sidecar (text/plain, text/html, …)
  ```
  `NODE_ENV=production` without R2 fails startup as designed, but the route registration is unconditional in `StorageModule`.
- **Impact:** In production: unauthenticated reads of any local object if the directory exists, plus a memory-exhaustion vector via 100 MB bodies at 120 requests/minute. In development: any local file under `.local-storage` is readable by key.
- **Recommended correction:** Register the local controller and raw parser only when the local adapter is active and `NODE_ENV !== 'production'`. Add a much smaller body limit, authenticate GETs (or remove them), and set `Content-Disposition: attachment` / `X-Content-Type-Options: nosniff`.
- **Tests needed:** Production module graph does not include local routes; unauthenticated GET is 404/401; oversized body is rejected before buffering; dev flow still works.

---

### H-04 — Active content accepted and served inline; wildcard MIME bypass

- **Severity:** High (conditional on storage origin)
- **Status:** **Fixed** (was Verified)
- **Fix (2026-11-18):** Shared `common/mime-policy.ts`. Any `*` in a declared upload type is rejected, so `image/*` can no longer be signed. Project policy patterns still accept a concrete major wildcard (`image/*`), but `application/*`, `*` and `*/*` are rejected. Active types (HTML/XHTML/SVG/XML/RSS/Atom/JS) are denied unless that exact type is allowlisted, and the final stored content type is re-checked on completion. Local downloads send `nosniff`, `Content-Disposition` and `Cache-Control: private, no-store`.
- **Verification:** `mime-policy.spec.ts` (8 tests incl. `isWildcardMimeType`); `security-regressions.mjs` H-04 group passes (wildcard, major wildcard, HTML, SVG, `image/*` policy, exact-type rule).
- **App:** API + storage
- **Locations:**
  - `dropflow-api/src/projects/projects.service.ts:28` — new projects default to `allowedMimeTypes: []` (allow all).
  - `dropflow-api/src/uploads/uploads.service.ts:28-34` — a literal declaration equal to a wildcard pattern matches (`image/*` matches `image/*`).
  - `dropflow-api/src/uploads/uploads.service.ts:154-159` — content-type verification is skipped whenever the declared type ends in `/*`.
  - `dropflow-api/src/storage/local-storage.controller.ts:58-61` — the stored content type is sent back inline.
  - `dropflow-api/src/storage/local-storage.service.ts:73-76` — content type is taken from the PUT header.
- **What is wrong:** A caller can declare `mimeType: "image/*"`, upload an HTML body, and completion stores `text/html` as the asset MIME type. The object is then served inline with `Content-Type: text/html`, so script executes on the serving origin. Even without the wildcard trick, the default empty allowlist accepts HTML/SVG, which are active content.
- **Evidence (live):**
  ```
  PATCH allowedMimeTypes=["image/*"] -> 200
  POST /v1/uploads { mimeType: "image/*" } -> 201
  PUT body "<!doctype html><script>…" with Content-Type: text/html -> 200
  complete -> 201, stored mimeType=text/html
  unauthenticated GET -> 200, Content-Type: text/html, body starts with <!doctype html><script>
  ```
- **Impact:** Stored XSS / content hosting on the storage origin. In development this is the API origin; in production the impact depends on whether the R2 public domain shares an origin or is proxied under the app domain. Same-origin delivery would expose authenticated API behaviour.
- **Recommended correction:** Reject declarations containing `*`; validate the actual content type against the resolved allowlist; never skip verification on wildcard; default-deny active types (`text/html`, `image/svg+xml`, scripts) unless explicitly allowed; serve with `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`, and a separate cookie-less origin/CSP.
- **Tests needed:** Wildcard declaration rejected; HTML upload rejected by default; SVG policy; served headers; cross-origin isolation.

---

### H-05 — Production logs full verification and password-reset tokens

- **Severity:** High
- **Status:** **Fixed** (was Code-confirmed)
- **Fix (2026-11-18):** `MailService` withholds tokens in production logs and is silent in the test environment. Dev keeps the `[DEV]` link so local flows still work.
- **Verification:** `mail.service.spec.ts`.
- **App:** API
- **Locations:**
  - `dropflow-api/src/auth/mail.service.ts:24-27` — production branch logs the full verification link.
  - `dropflow-api/src/auth/mail.service.ts:34-37` — production branch logs the full password-reset link.
  - `dropflow-api/src/auth/auth.service.ts:46-52, 93-99` — the links contain HMAC-signed, single-use tokens.
- **What is wrong:** When no email provider is configured, production explicitly logs the token-bearing URL to stdout. Anyone with log access (operators, log aggregation, support tooling) can verify arbitrary accounts or reset any known user’s password. This is the current production configuration.
- **Impact:** Account takeover via reset tokens; verification bypass.
- **Reproduction:** Run with `NODE_ENV=production` and no email provider, call `POST /auth/forgot-password`, inspect the log. (Not executed in this audit because production boot requires R2; the branch is unconditional once booted.)
- **Recommended correction:** Never log tokens. Fail closed or return an explicit “email is not configured” operational error; deliver via a real provider. If manual delivery is truly needed, write the token to a restricted, audited channel, not stdout.
- **Tests needed:** Production mail path never contains the token; forgot-password does not leak the link; provider failure is observable.

---

### H-06 — Project deletion returns HTTP 500 after any asset was deleted

- **Severity:** High
- **Status:** **Fixed** (was Verified)
- **Fix (2026-11-18):** Project deletion now removes usage events and **all** asset rows (including soft-deleted) before deleting the project, inside one transaction. A remaining FK violation maps to `409 conflict`, not 500. Storage objects are deleted after commit and failures are logged.
- **Verification:** `security-regressions.mjs` H-06 group deletes a project whose asset was soft-deleted; deletion succeeds and the project is gone.
- **App:** API / database
- **Locations:**
  - `dropflow-api/src/projects/projects.service.ts:78-95` — only live assets are checked; usage events are deleted; project is deleted.
  - `dropflow-api/src/database/migrations/1763472000000-InitialSchema.ts:123-124` — `assets.project_id` FK is `ON DELETE RESTRICT`.
  - `dropflow-api/src/assets/assets.service.ts:84-96` — asset deletion is a soft delete.
- **What is wrong:** Soft-deleted asset rows remain in `assets`. The delete transaction removes usage events but not those rows, so the `RESTRICT` FK blocks the project delete. The global filter converts the database error into a generic 500.
- **Evidence (live):**
  ```
  create project -> upload asset -> DELETE asset (200) -> DELETE project
  -> 500 {"statusCode":500,"code":"internal_error"}
  ```
- **Impact:** Customers can never delete a project that ever contained a file. Blocks cleanup, GDPR workflows and the UI’s delete action.
- **Recommended correction:** In one transaction, remove/hard-delete soft-deleted asset rows after storage cleanup, or change the ownership/lifecycle model (e.g., `ON DELETE CASCADE` only after explicit asset cleanup). Return a typed conflict/validation error, not 500, for blocked deletes.
- **Tests needed:** Delete project with no assets; with live assets (409); with only soft-deleted assets (success + storage cleanup); idempotent repeat delete.

---

### H-07 — Dashboard mutations are simulated with success toasts

- **Severity:** High
- **Status:** **Fixed** (was Code-confirmed)
- **Fix (2026-11-18):** `DashboardService` now implements real `getCurrentUser`, `updateProfile`, `updateOrganization`, `updateProject`, `deleteProject` and `revokeApiKey`. Settings, project settings, projects and API-keys pages call the API with pending and error states. The header and dashboard greeting read `/auth/me`. `SESSION_NAME` and all demo-success copy are gone. A 401 redirects to `/login?expired=1`. The API now returns `plan` and `role` on the organization DTO.
- **Verification:** web `pnpm typecheck` passes; the live flow was exercised against the API on 3011 (profile, organization, project update/delete, key revoke).
- **App:** Web
- **Locations:**
  - `dropflow-web/src/app/(dashboard)/dashboard/settings/page.tsx:43-46` — hardcoded `SESSION_NAME = "Alex"` and `localSave()` toast “no backend change was made”.
  - Same file `:203` (account), `:251` (organization), `:364` (project restrictions), `:462` (notifications) — all submit via `localSave()`.
  - `dropflow-web/src/components/dashboard/project-settings.tsx:85-90` — fake project save.
  - `dropflow-web/src/app/(dashboard)/dashboard/projects/page.tsx:141-157` — status toggle and project delete only mutate local state.
  - `dropflow-web/src/app/(dashboard)/dashboard/api-keys/page.tsx:126-133` — revoke only marks a local ID; toast says “no backend change”.
  - `dropflow-web/src/components/dashboard/header.tsx:54, 126, 288-294` — hardcoded user name and “demo view” sign-out warning.
  - `dropflow-web/src/app/(dashboard)/dashboard/page.tsx:40, 130` — hardcoded greeting name.
  - `dropflow-web/src/services/types.ts:5-15` — the service interface has no update/delete/revoke methods, so these calls cannot be real.
- **What is wrong:** Several visible dashboard actions report success while persisting nothing. The backend already exposes most of the needed endpoints (`PATCH /projects/:id`, `DELETE /projects/:id`, `DELETE /projects/:id/keys/:keyId`, `PATCH /auth/profile`, `PATCH /organizations/:id`), but the UI does not call them. The signed-in user is always displayed as “Alex”. The settings page also renders `organization.role`, which the API does not return.
- **Impact:** Users believe settings, project status, project deletion and key revocation succeeded when they did not. This violates “real product behaviour only, no fake success” and is a security-relevant trust failure (a “revoked” key remains valid).
- **Reproduction:** Sign in, change a project restriction, toggle a project status, delete a project, or revoke a key; refresh the page or query the API — nothing changed.
- **Recommended correction:** Wire each action to the existing API, show real errors, load the current user from `GET /auth/me`, remove the hardcoded name/demo copy, and add `updateProject`/`deleteProject`/`revokeApiKey` to the service boundary. If an endpoint is genuinely missing, disable the control rather than claiming success.
- **Tests needed:** E2E per mutation (account, org, restrictions, notifications, project status/delete, key revoke) asserts API state after refresh; key revocation actually returns 401 on the next request.

---

### H-08 — No client-IP handling; global throttle collapses behind a proxy

- **Severity:** High (deployment-dependent)
- **Status:** **Fixed** (was Code-confirmed; rate behaviour verified locally)
- **Fix (2026-11-18):** `TRUST_PROXY` env drives `app.set('trust proxy', …)`. Per-route `@Throttle` limits: register 5/min, login 10/min, forgot/reset 5/min, upload init 30/min. `/health` is `@SkipThrottle()`.
- **Verification:** `rate-limit-check.mjs` passes (11th rapid login is limited); health is no longer throttled.
- **Residual:** the throttle store is still in-memory — a multi-instance deployment needs a shared store. No production proxy exists yet, so the hop count is untested.
- **App:** API
- **Locations:**
  - `dropflow-api/src/app.module.ts:27` — one global in-memory throttler: 120 requests/minute.
  - `dropflow-api/src/main.ts:9-49` — no `app.set('trust proxy', …)` and no proxy-aware IP configuration anywhere in `src`.
  - `dropflow-api/src/health/health.controller.ts:17-21` — `/health` is under the same global guard.
- **What is wrong:** Nest’s throttler keys on the socket IP. Behind a load balancer, reverse proxy or CDN, every user shares the proxy IP, so the entire customer base gets one 120/min budget. Health probes also consume it. The throttler’s default storage is in-memory, so multiple API instances each allow 120/min and the effective limit multiplies.
- **Evidence (live):** 130 rapid `GET /health` calls → 120 × 200 and 10 × 429. Works as configured on a direct connection; the proxy collapse is a deployment consequence of the missing configuration.
- **Impact:** Service-wide 429s once deployed behind a proxy; health checks can mark the service unhealthy; login/abuse limits are ineffective across instances.
- **Recommended correction:** Configure the exact trusted proxy hops for the chosen platform, derive the client IP only from trusted headers, add per-route limits (login, register, forgot-password, admin), exempt health/liveness probes, and use a shared throttle store (Redis) for multi-instance deployments.
- **Tests needed:** Simulated `X-Forwarded-For` with trusted/untrusted proxies; per-account login limit; health probe exemption; multi-instance shared counter.

---

### H-09 — Browser SDK is blocked outside the dashboard by CORS

- **Severity:** High (product/SDK readiness)
- **Status:** **Fixed** (was Verified preflight / Code-confirmed)
- **Fix (2026-11-18):** Projects carry `allowedOrigins` (migration `projects.allowed_origins`); the DTO rejects wildcards and paths. A custom CORS middleware keeps the frontend origin with credentials and allows listed customer origins **only** on `/v1/uploads*` with `credentials: false`. Origins are cached for 30 s and the policy fails closed.
- **Verification:** `security-regressions.mjs` H-09 group (wildcard origin rejected, concrete origin accepted).
- **Decision:** customer-site browser integrations remain supported; the public key still cannot list or delete (C-01).
- **App:** API + SDK + docs
- **Locations:**
  - `dropflow-api/src/main.ts:24-30` — CORS allows exactly one `FRONTEND_URL` with credentials.
  - `project-docs/API_CONTRACT.md:10` — public keys described as browser-safe.
  - `dropflow-js-sdk/README.md:9-15` and marketing examples (`dropflow-web/src/components/marketing/sdk-tabs.tsx:9`) show browser use.
- **What is wrong:** The SDK is presented as a browser client for customer sites, but the API only allows Dropflow’s own dashboard origin. Any other origin receives no matching `Access-Control-Allow-Origin`, so the browser blocks the upload. Only the dashboard at `FRONTEND_URL` works.
- **Evidence (live):** `OPTIONS /auth/login` with `Origin: https://evil.example` returned `Access-Control-Allow-Origin: http://127.0.0.1:3000`. The browser compares values and blocks the foreign origin. This is correct security behaviour but proves no customer origin is supported.
- **Impact:** The published SDK cannot be used from a customer’s browser, which is its stated purpose. Fixing it by allowing `*` would expose the C-01 destructive public key to every origin.
- **Recommended correction:** Decide the product model. Either (a) SDK is dashboard-only and docs must say so, or (b) add an explicit customer-origin allowlist per project and a separate upload-only public endpoint that never permits list/delete, with `credentials: false`.
- **Tests needed:** Allowed customer origin succeeds; unlisted origin fails; public upload endpoint cannot list/delete; preflight for required headers.

---

### H-10 — R2 object delivery is unsigned: broken private buckets or permanent public URLs

- **Severity:** High (production delivery)
- **Status:** **Fixed** (was Code-confirmed; needs R2 verification)
- **Fix (2026-11-18):** **Option A — private bucket + signed GET.** `createSignedDownloadUrl` is part of `StorageService`; R2 presigns `GetObjectCommand`; the local adapter exposes a signed, expiring download endpoint. Asset DTOs and upload completion return 15-minute signed URLs.
- **Verification:** `security-regressions.mjs` proves the signed URL serves the bytes, an unsigned read is rejected, and a forged token is rejected. Real R2 presigning was **not** exercised — no production credentials were configured.
- **App:** API / storage
- **Locations:**
  - `dropflow-api/src/storage/r2-storage.service.ts:86-89` — `getObjectUrl` returns a plain endpoint/bucket/key URL, or a public base URL.
  - `dropflow-api/src/storage/storage.interface.ts:21-30` — no signed-GET method exists.
  - `project-docs/DEPLOYMENT.md:15` — full R2 configuration required; no delivery decision documented.
- **What is wrong:** Uploads are signed, but downloads are not. With a private bucket (the code comment says “private bucket by default”), the generated URL is not authorized and returns 403. With `R2_PUBLIC_BASE_URL`, every asset becomes permanently readable by URL, including after sharing/leakage, and active content is served inline.
- **Impact:** Either the core “asset URL” feature is broken in production, or all customer files are public forever. There is no tenant-scoped download authorization or expiry.
- **Recommended correction:** Choose and document a delivery model: presigned GET with short TTL, a private bucket plus an authenticated proxy, or a deliberately public bucket with a separate cookie-less domain and content restrictions. Add `expiresIn` to the storage interface and tests.
- **Tests needed:** Private bucket returns 403 without a signature; signed GET works and expires; deleted asset URL stops working; public-domain isolation.

---

### M-01 — Owner can demote themselves, leaving the organization ownerless

- **Severity:** Medium
- **Status:** Verified
- **App:** API
- **Locations:** `dropflow-api/src/organizations/organizations.service.ts:115-127`; DTO allows only `admin|member` at `organizations/dto/organization.dto.ts:28-31`.
- **What is wrong:** The owner can PATCH their own membership to `admin`. There is no check that another owner exists, and transfer is the only way to create one.
- **Evidence (live):** New organization with one owner → PATCH own member role to `admin` → member list shows only `admin`. Ownership transfer and owner-only actions are now impossible.
- **Recommended correction:** Reject self-demotion unless another owner exists, or require an atomic ownership transfer. Add a DB invariant if feasible.
- **Tests needed:** Owner cannot self-demote; owner can demote another owner only when a replacement exists; transfer preserves exactly one owner.

---

### M-02 — Changing email keeps the verified flag and does not re-verify

- **Severity:** Medium
- **Status:** **Fixed** (was Verified)
- **Fix (2026-11-18):** An email change clears `emailVerifiedAt` and re-issues a verification token bound to the new address.
- **Verification:** auth email-change unit tests. Done because the storage/quota fixes depend on reliable account identity.
- **App:** API
- **Locations:** `dropflow-api/src/users/users.service.ts:58-69`; `dropflow-api/src/auth/auth.service.ts:127-129`; `auth/dto/auth.dto.ts:50-59`.
- **What is wrong:** `updateProfile` changes `email` but leaves `emailVerifiedAt` and any existing verification token untouched. A user can verify their own address, switch to an address they do not control, and the account remains “verified”. The old token is bound to the user ID, not the address, so it can verify the new address.
- **Evidence (live):** Set `email_verified_at`, PATCH `/auth/profile` to a new address → `GET /auth/me` still returns `emailVerifiedAt`; the token hash is unchanged.
- **Recommended correction:** Clear `emailVerifiedAt`, issue a new token for the new address, and require re-verification. Consider requiring the current password for email changes.
- **Tests needed:** Email change clears verification; old token cannot verify the new address; new token works; duplicate email returns 409.

---

### M-03 — Any organization member can mint/revoke secret API keys

- **Severity:** Medium
- **Status:** Code-confirmed
- **App:** API
- **Locations:** `dropflow-api/src/api-keys/api-keys.service.ts:16-30, 32-38, 40-46` — all use `projects.getForUser`; `organizations.service.ts:52-58` asserts membership only. Controllers use session auth only (`api-keys.controller.ts:9-11`).
- **What is wrong:** A read-only `member` can create, rotate and revoke project secret keys. Secret keys authorize destructive asset operations, so this bypasses the role model.
- **Recommended correction:** Require `admin`/`owner` for key creation/rotation/revocation; allow members to list prefixes only if the product requires it.
- **Tests needed:** Member gets 403 on create/rotate/revoke; admin/owner succeed; cross-org remains 403.

---

### M-04 — Client checksum is stored but never verified

- **Severity:** Medium
- **Status:** Verified
- **App:** API
- **Locations:** `dropflow-api/src/uploads/dto/upload.dto.ts:17-19`; `uploads.service.ts:129, 180`. Integration smoke sends `checksum: 'sha256:smoke'` and completion succeeds (`test/integration-smoke.mjs:99-106`).
- **What is wrong:** The checksum is accepted as an opaque string, stored on the asset, and never compared to the object bytes/ETag. A caller can claim any checksum.
- **Impact:** Integrity claims are false; consumers cannot trust `asset.checksum`.
- **Recommended correction:** Compute/verify SHA-256 server-side (or use S3 checksum headers), or remove the field until implemented.
- **Tests needed:** Matching checksum succeeds; wrong checksum rejects and cleans up; checksum length/format bounded.

---

### M-05 — No scheduled reaper for expired sessions or orphan objects

- **Severity:** Medium
- **Status:** **Fixed** (was Code-confirmed)
- **Fix (2026-11-18):** `UploadReaperService` runs every 60 s (unref'd timer, overlap-guarded). `reapExpiredSessions()` claims rows with `FOR UPDATE SKIP LOCKED`, deletes each object, then marks the session expired.
- **Verification:** observed in the API log (`Reaped 1 expired upload session(s)`); abandoned-upload object removal is asserted in `security-regressions.mjs`.
- **Residual:** R2 lifecycle rules are not configured (no production bucket).
- **App:** API
- **Locations:** `uploads.service.ts:36-41` (lazy expiry only on `init`); no `@nestjs/schedule`/queue in the module graph; `assets.service.ts:101-105` deletes storage only on explicit asset delete.
- **What is wrong:** Expired pending/uploading sessions are marked expired only when another upload starts. Their objects (and any failed/mismatched objects) are never deleted. If traffic stops, stale rows and bytes persist indefinitely.
- **Recommended correction:** Add a scheduled job (single-instance lock) to expire sessions and delete unreferenced objects; add object-lifecycle rules in R2 as defence in depth.
- **Tests needed:** Reaper marks only expired sessions; deletes only unreferenced objects; completed assets are untouched; runs idempotently.

---

### M-06 — Concurrent `lastUsedAt` save can resurrect a revoked key

- **Severity:** Medium
- **Status:** **Fixed** (was Code-confirmed)
- **Fix (2026-11-18):** The auth path uses a targeted `apiKeys.update({ id }, { lastUsedAt })` instead of saving the full entity, so a stale `revokedAt: null` cannot overwrite a revocation.
- **Verification:** covered by the key-scope/auth tests (`api-key-auth.spec.ts`).
- **App:** API
- **Locations:** `dropflow-api/src/common/guards/project-key.guard.ts:48-49` loads the entity and calls `save(apiKey)`; `api-keys.service.ts:40-46` also loads and saves `revokedAt`.
- **What is wrong:** `save` writes the full entity. If a request is authenticating with a key while another request revokes it, the guard’s stale `revokedAt: null` can overwrite the revocation. The key becomes valid again.
- **Recommended correction:** Use a targeted `update({ id }, { lastUsedAt })` (and optionally throttle the write) and use a conditional update for revocation. Never `save` a full key entity in the auth path.
- **Tests needed:** Concurrent authenticate/revoke leaves the key revoked; lastUsedAt updates without touching other columns.

---

### M-07 — No dashboard auth gate; `/auth/me` is never used

- **Severity:** Medium (UX/security posture)
- **Status:** Code-confirmed
- **App:** Web
- **Locations:** `dropflow-web/src/app/(dashboard)/layout.tsx:10-26` renders the shell unconditionally; `dropflow-web/src/services/auth.ts:56-58` defines `me()` but it has no callers; no route middleware.
- **What is wrong:** Unauthenticated visitors can open every dashboard route. API calls return 401 and pages show errors/empty states instead of redirecting to login. The UI also displays a hardcoded identity.
- **Impact:** Confusing exposure of the authenticated UI; no session bootstrap/refresh; users are not redirected after expiry.
- **Recommended correction:** Add a server/client auth gate that calls `/auth/me` once, redirects to `/login`, and clears cached queries on 401. Use the real user everywhere.
- **Tests needed:** Unauthenticated route redirects; expired session redirects; login returns to the requested page.

---

### M-08 — No audit log; admin is one static shared secret

- **Severity:** Medium
- **Status:** Code-confirmed
- **App:** API
- **Locations:** `dropflow-api/src/admin/admin.guard.ts:15-26`; `admin/admin.controller.ts:6-16`; no audit table in either migration.
- **What is wrong:** Key creation/revocation, member/role changes, project deletion and account-deletion requests are not recorded. The admin surface uses one `ADMIN_SECRET` with no rotation, per-operator identity, IP restriction or 2FA. PII (emails, org/project counts) is exposed to anyone holding it.
- **Recommended correction:** Add an append-only audit log for security-relevant actions; replace the shared secret with operator accounts or at minimum per-operator keys, rotation, IP allowlist and alerting. Restrict admin at the network layer.
- **Tests needed:** Audit rows for each sensitive action; admin key rotation; revoked admin credential rejected; no customer session/key accepted.

---

### M-09 — No per-account brute-force protection; duplicate registrations burn bcrypt CPU

- **Severity:** Medium
- **Status:** Code-confirmed; global throttle verified
- **App:** API
- **Locations:** `dropflow-api/src/app.module.ts:27` (global only); `auth/auth.controller.ts:30-42` (no route-level throttle); `auth/auth.service.ts:38` (hash before uniqueness check); `auth/dto/auth.dto.ts:7-10` (minimum 8 characters, no complexity).
- **What is wrong:** Login/registration/forgot-password share the global IP limit. There is no per-email/account counter or lockout, so a distributed attacker is not slowed. Registration hashes the password with bcrypt cost 12 *before* checking whether the email already exists, so repeated duplicate registrations consume CPU.
- **Recommended correction:** Add per-account and per-IP route limits, check duplicates before hashing, consider a breached-password check, and use a shared store.
- **Tests needed:** Per-account lockout/backoff; duplicate registration does not hash; distributed simulation across IPs is limited by account key.

---

### M-10 — Malformed UUIDs and pagination return HTTP 500

- **Severity:** Medium (robustness / monitoring)
- **Status:** Verified
- **App:** API
- **Locations:** `assets/assets.controller.ts:27-35` and `:47-55` (raw query/param strings); `assets/assets.service.ts:30-32` (`Number()` may be `NaN`); `projects/projects.controller.ts:24-26` (raw UUID param).
- **What is wrong:** UUID params are not validated, and pagination is coerced without checking `Number.isFinite`. Postgres cast errors and invalid `skip/take` values become generic 500s.
- **Evidence (live):**
  ```
  GET /projects/not-a-uuid -> 500
  GET /v1/assets?projectId=not-a-uuid -> 500
  GET /v1/assets?projectId=<valid>&limit=abc -> 500
  GET /v1/assets/not-a-uuid?projectId=<valid> -> 500
  ```
- **Impact:** 500-level noise masks real outages, pollutes error monitoring, and makes client bugs look like server faults.
- **Recommended correction:** Use DTO/Standard Schema validation for params/queries (`@Param('id', { schema })`), validate UUIDs, and clamp pagination with finite-number checks.
- **Tests needed:** Invalid UUID returns 400/404; `limit=abc` returns 400; negative/zero limits clamped; valid requests unchanged.

---

### M-11 — Storage upload has no timeout

- **Severity:** Medium (reliability)
- **Status:** Code-confirmed
- **App:** SDK
- **Locations:** `dropflow-js-sdk/src/uploads/uploader.ts:92-110` — `xhr.timeout` is never set despite a timeout listener; `:26-53` — fetch upload has no timeout; `transport/index.ts:22-27` — timeout applies only to JSON requests.
- **What is wrong:** A stalled storage connection can hang an upload indefinitely; cancellation is the only escape. Mobile networks commonly stall.
- **Recommended correction:** Apply the configured timeout to XHR/fetch uploads, abort on timeout, and surface a retryable `NetworkError`/`StorageError`.
- **Tests needed:** Timed-out upload rejects and can be retried; abort still wins; no unhandled rejection.

---

### M-12 — Web lint fails; production dependency tree carries advisories

- **Severity:** Medium
- **Status:** Verified
- **App:** Web / dependencies
- **Locations:** `dropflow-web/package.json` (`shadcn` is in `dependencies`); `dropflow-web/src/app/(dashboard)/dashboard/api-keys/page.tsx:89`, `dashboard/page.tsx:73`, `uploads/page.tsx:60,115` (lint errors).
- **What is wrong:** `pnpm lint` fails with 4 errors (React Compiler setState-in-effect and memoization rules). `pnpm audit --prod` reports `picomatch` high (ReDoS) and `minimatch` moderate, both pulled through the `shadcn` CLI, which is installed as a runtime dependency. API has 2 moderate advisories (`glob`, `minimatch`) via TypeORM.
- **Impact:** A CI gate would fail; unnecessary CLI code is shipped/installed in production; known ReDoS code is present (not currently reachable from the web runtime).
- **Recommended correction:** Move `shadcn` to `devDependencies`, update transitive tooling, fix the React Compiler violations, and add lint/audit to verification.
- **Tests needed:** Lint exits 0 in CI; audit has no high/critical production findings.

---

### M-13 — Re-completing a deleted upload returns a deleted asset

- **Severity:** Medium (correctness)
- **Status:** Code-confirmed
- **App:** API
- **Locations:** `uploads/uploads.service.ts:133-136` and `:168-171` — `assets.findOne` does not filter `deletedAt`.
- **What is wrong:** After an asset is soft-deleted, calling `complete` again for the same session returns the deleted asset with status `deleted` and a URL whose object has been removed. The client receives a success-shaped response for an unusable asset.
- **Recommended correction:** Filter `deletedAt: IsNull()` in the idempotency lookup and return a typed 410/404 when the asset is gone. Optionally clear `assetId` on deletion.
- **Tests needed:** Complete after delete returns 410/404; duplicate complete before delete remains idempotent.

---

### M-14 — Plan limits are hardcoded; project/request limits are unused

- **Severity:** Medium (billing readiness)
- **Status:** Code-confirmed
- **App:** API
- **Locations:** `usage/plan-limits.ts:16-38`; `uploads/uploads.service.ts:80` (`PLAN_LIMITS.free`); `usage/usage.service.ts:41-43` (counts `request` events); no writer for `eventType: 'request'` anywhere.
- **What is wrong:** Every project is on the free plan. `PLAN_LIMITS.projects` and `requestCount` are never enforced. The usage page exposes `requestCount` but it is always zero because request events are never written.
- **Impact:** No paid-plan enforcement and a misleading usage metric. Phase 8 cannot be activated without redesigning quota ownership (see H-02).
- **Recommended correction:** Persist plan/subscription per organization, resolve limits from it, enforce project and request limits, and either record request events or remove the metric.
- **Tests needed:** Plan resolution per org; project limit; request counting; downgrade behaviour.

---

### L-01 — Ownership-transfer body is not validated

- **Severity:** Low
- **Status:** Code-confirmed
- **App:** API
- **Location:** `organizations/organizations.controller.ts:88-95` — `@Body() body: { memberId: string }` has no DTO, so the global whitelist cannot validate it.
- **What is wrong:** Missing/invalid `memberId` reaches `findOne` and can produce 500s or an unintended match depending on TypeORM semantics.
- **Recommended correction:** Add a DTO with `@IsUUID()` and validate that the target is a member of the same organization.

---

### L-02 — Hardening gaps: headers, log level, cache control

- **Severity:** Low
- **Status:** Code-confirmed
- **App:** API / web
- **Locations:** `dropflow-api/src/main.ts` (no helmet/security headers); `dropflow-api/src/main.ts:10-12` hardcodes logger levels; `env.validation.ts:29` defines `LOG_LEVEL` but it is unused; `all-exceptions.filter.ts:55-58` logs `request.url` including query strings; `auth.controller.ts:58-62` puts the token in a redirect URL.
- **What is wrong:** No HSTS/nosniff/frame/CSP baseline; `LOG_LEVEL` is decorative; unhandled-error logs and redirects can capture token-bearing URLs; auth responses lack `Cache-Control: no-store`.
- **Recommended correction:** Add `helmet`/equivalent, wire `LOG_LEVEL`, redact query strings in logs, mark auth/API responses `no-store`, and add a CSP at the web/CDN layer.

---

### L-03 — Signed PUT URL remains valid after completion

- **Severity:** Low
- **Status:** Code-confirmed
- **App:** API / storage
- **Locations:** `uploads/uploads.service.ts:15` (15-minute TTL); `storage/r2-storage.service.ts:41-58`; `storage/local-storage.service.ts:53-67`.
- **What is wrong:** The signed URL cannot be revoked. For up to 15 minutes after completion, the uploader can overwrite the object with different bytes/size, while the asset row keeps the old metadata.
- **Recommended correction:** Use short TTLs, conditional writes/versioning, and/or re-verify on read; invalidate the session/URL after completion where the provider allows.

---

### L-04 — SDK documentation does not match the implementation

- **Severity:** Low
- **Status:** Verified
- **App:** Docs / web
- **Locations:** `dropflow-web/src/app/(marketing)/docs/page.tsx:30-44` (`dropflow.assets.list`, `dropflow.assets.remove`, `dropflow.usage.summary` do not exist); `project-docs/ENVIRONMENT.md:25-32` omits `NEXT_PUBLIC_DROPFLOW_KEY`, which the docs page references.
- **What is wrong:** A customer following the documentation gets runtime errors. This is a trust/onboarding issue for a developer product.
- **Recommended correction:** Generate examples from the real SDK surface and document every referenced env var.

---

### L-05 — SDK accepts secret keys in browser code

- **Severity:** Low
- **Status:** Code-confirmed
- **App:** SDK / React
- **Locations:** `dropflow-js-sdk/src/client/dropflow.ts:41-44` accepts `df_secret_…`; `dropflow-react/src/hooks/use-dropflow.tsx` is `"use client"`; README shows only public keys.
- **What is wrong:** Nothing prevents a customer from passing a secret key to a browser bundle. The contract says secret keys are server-side only, but the SDK does not warn or reject them for browser builds.
- **Recommended correction:** Either reject `df_secret_` in browser-oriented entry points or add an explicit `allowSecretKey` server-only option and loud documentation. Never ship a secret key in a `NEXT_PUBLIC_*` variable.

---

### L-06 — React package has no tests and is not publishable as-is

- **Severity:** Low
- **Status:** Verified
- **App:** React
- **Locations:** `dropflow-react/package.json` (`test` script, `"@dropflow/sdk": "file:../dropflow-js-sdk"`); no test files.
- **What is wrong:** `pnpm test` exits 1 with “No test files found”. The `file:` dependency is a local path and would be rewritten on publish, so consumers of the package cannot resolve the SDK version.
- **Recommended correction:** Add hook/component tests, use a semver dependency for publishing (or mark private), and include React tests in verification.

---

### L-07 — Database portability and index gaps

- **Severity:** Low
- **Status:** Code-confirmed
- **App:** Database
- **Locations:** `database/migrations/1763472000000-InitialSchema.ts:8` (`CREATE EXTENSION pgcrypto`); indexes at `:153-154` and `:170-171`.
- **What is wrong:** `pgcrypto` may require elevated rights on managed Postgres (though `gen_random_uuid()` is built in on modern versions). There is no index tailored to the reaper (`status`, `expires_at`) or monthly usage queries (`project_id`, `event_type`, `created_at`).
- **Recommended correction:** Remove the extension if unnecessary, and add composite/partial indexes for the operational queries.

---

### L-08 — Email verification is never required

- **Severity:** Low
- **Status:** Code-confirmed
- **App:** API
- **Locations:** `auth/auth.service.ts:32-56` (session issued immediately); `:58-67` (login ignores `emailVerifiedAt`).
- **What is wrong:** Unverified accounts have full product access. Combined with open registration and per-project quotas, this enables disposable-account abuse.
- **Recommended correction:** Gate sensitive actions (key creation, uploads, invites) on verification, or document that verification is informational. Add per-account abuse controls.

---

## 6. Potential risks needing verification

These were **not** confirmed as exploitable; they depend on deployment/provider configuration. Status notes reflect the remediation.

| ID | Risk | Why it is unverified | What to check | Status after remediation |
|---|---|---|---|---|
| R-01 | CSRF on state-changing dashboard requests | `SameSite=Lax` blocks cross-site POST cookies, but there is no CSRF token. Same-site subdomain attacks and login/logout CSRF remain possible. | Browser test with a sibling subdomain and a cross-site form; decide whether a CSRF token is required. | Open |
| R-02 | R2 Content-Type signature behaviour | The presigned URL includes `ContentType`; whether R2 enforces it as a signed header determines whether a type swap at the storage boundary is possible. | Live R2 test: PUT with a different `Content-Type` and inspect stored metadata. | **Mitigated, still unverified on R2** — completion re-checks the stored content type against policy, so a swap cannot produce an allowed-asset mismatch; R2 enforcement itself is untested. |
| R-03 | R2 CORS for browser PUT | No bucket CORS configuration exists in the repo. Browser uploads will fail without it. | Configure/test `AllowedOrigins`, `AllowedMethods`, `AllowedHeaders`, expose `ETag`. | Open — application CORS is now correct, bucket CORS is not configured |
| R-04 | Proxy/XFF trust | `TRUST_PROXY` is now configurable, but no production proxy exists to validate the hop count. Incorrect trust settings can also allow IP spoofing. | Verify client IP in staging behind the real load balancer; test spoofed headers. | **Partially closed** — code supports it; value must be set per platform and verified |
| R-05 | Database TLS | `DATABASE_URL` is passed to `pg` with no SSL options. Managed Postgres may reject or silently use plaintext. | Enforce `sslmode=verify-full` and test the provider’s CA. | Open |
| R-06 | Public/private storage exposure | Whether asset URLs are public forever or 403 depends on the bucket/public-domain choice. | Decide and test anonymous access, deletion behaviour, and domain isolation. | **Closed by decision** — private bucket, signed GET (H-10) |
| R-07 | Email deliverability and abuse | No provider is configured; once added, forgot-password can be used for email bombing. | Provider sandbox test, per-account/per-IP limits, bounce handling. | Open — route limits added, provider still absent |
| R-08 | Malware/active content policy | No scanning or content sanitization exists. | Define policy for HTML/SVG/archives; integrate scanning if files are redistributed. | **Reduced** — active content is denied by default; no scanning |
| R-09 | Multi-instance throttling | In-memory throttler state is per instance. | Deploy two instances and verify shared limits (or add Redis). | Open |
| R-10 | Browser compatibility of `AbortSignal.any` | Requires modern runtimes; no polyfill. | Test target browsers; add fallback if needed. | Open |

---

## 7. What passed (and what that does not prove)

### At audit time

The 13-step verification suite passed and was useful evidence that the happy paths work, but it did **not** prove production safety because:

- The integration smoke test uploaded with a **public key** and treated that as expected (`integration-smoke.mjs:73-106`), so it blessed C-01 instead of catching it.
- Authorization checks covered cross-organization isolation but not public-vs-secret scope (`authz-check.mjs:39-67`).
- No test asserted that a public key cannot delete or list assets.
- No test covered oversized uploads, orphan cleanup, quota concurrency, wildcard MIME, project deletion, owner self-demotion, email-change verification, checksum failure, malformed input, or R2.
- `verify-all.ps1` did not run web lint, React tests, dependency audit, or a production boot check.

### After remediation

The gate now has 15 steps and the previously missing exploit reproductions exist:

- `test/security-regressions.mjs` covers public-key scope, declared-size enforcement, object cleanup on failure, wildcard/active MIME policy, project deletion with soft-deleted assets, origin policy, and signed-download forgery.
- `test/authz-check.mjs` and `test/integration-smoke.mjs` use cookie-less helpers for public-key negatives, so a session cookie can no longer mask a broken key scope.
- `test/rate-limit-check.mjs` proves the per-route login limit.
- The SDK consumer check provisions its own account and proves that a public key can upload but cannot list assets.

This is stronger evidence, but it still does **not** prove: R2 behaviour (no credentials were configured), multi-instance rate limiting (in-memory store), proxy/client-IP behaviour (no real proxy), web lint/dependency audits (still failing, M-12), or the untested medium/low findings.

---

## 8. Test coverage gaps (explicit)

| Area | Status after remediation |
|---|---|
| Key authorization | **Covered** — public key cannot list/get/delete; secret can; scope unit tests |
| Uploads | **Covered locally** — oversized PUT, failed completion cleanup, abandoned-session cleanup. Concurrency race is not load-tested. |
| Quotas | **Partly covered** — organization totals, reservations and project count; plan changes and R2 not exercised |
| MIME/content | **Covered locally** — wildcard declaration, HTML/SVG default denial, served headers |
| Project lifecycle | **Partly covered** — delete with soft-deleted assets and storage cleanup; re-completing a deleted upload (M-13) still open |
| Organizations | **Still missing** — owner self-demotion, transfer atomicity, member removal rules |
| Auth | **Partly covered** — email-change verification, token logging; per-account throttling and reset replay still open |
| API keys | **Partly covered** — revoke/authenticate race via the targeted update; member role enforcement still open |
| Frontend | **Still missing** — E2E for every mutation, 401 redirect, real identity persistence (typecheck only) |
| SDK | **Partly covered** — public-key scope and built-package flow; timeout and orphan retry behaviour still open |
| React | **Still missing** — hooks/components (none today) |
| Storage | **Local adapter only** — no R2 integration test |
| Ops | **Still missing** — production module graph, proxy/IP, security headers, backup/restore |

---

## 9. Answers to the required questions

### 9.1 What was inspected?
All five packages, both migrations, all tests/scripts, env contract, deployment/status docs, and the live API/web/DB. See §2.

### 9.2 Which commands passed?
At audit time, all 13 steps in `scripts/verify-all.ps1` passed; API lint passed with warnings; production boot correctly failed without R2. After remediation, API `pnpm test` passes 28 tests / 7 files, API build and web typecheck pass, and the four live integration suites pass. See §3 for the full tables, including the pre-fix failures.

### 9.3 Confirmed issues?
C-01, H-01 … H-10, M-01 … M-14 and L-01 … L-08 were confirmed at audit time (details in §5). **C-01 and H-01 … H-10 are now fixed and re-verified**; M-02, M-05 and M-06 were fixed as dependencies. The rest remain open.

### 9.4 Unverified risks?
R-01 through R-10 in §6. None of these should be described as confirmed. R-06 is closed by the private-bucket decision and R-04 is partly addressed by `TRUST_PROXY`, but neither has been tested against real infrastructure.

### 9.5 What must be fixed before configuring R2?
The critical/high items in this report — C-01 scoping, H-01/H-02/H-03/H-04 upload size, quota, local surface and MIME policy, H-05 token logging, H-06 project deletion, H-07 truthful dashboard, H-08 client-IP handling, H-09/H-10 delivery and CORS — are **done locally**. What remains before actually configuring R2 is operational work, not code defects: bucket CORS (R-03), R2 content-type verification (R-02), TLS for the managed database (R-05), a shared rate-limit store if multi-instance (R-09), and the `TRUST_PROXY` value for the chosen platform (R-04). No credentials or infrastructure were configured as part of this remediation.

### 9.6 What must be fixed before external beta?
All Phase 1 items in `PRODUCTION_REMEDIATION_PLAN.md` that are still open: M-01, M-03, M-04, M-07 (structural part), M-08, M-09, M-10, M-11, M-12, M-13, M-14 and L-01, plus the lint/audit gate. M-02, M-05 and M-06 are already done.

### 9.7 Is it ready for production infrastructure configuration?
**The critical/high code defects that previously made that unsafe are fixed.** The codebase is ready for a staging exercise against real infrastructure, but not for customer traffic: Phase 1 remains open and the infrastructure-dependent risks in §6 are unverified. It is not ready to point at production R2, a real database, or real customer traffic until those items are closed and the deployment decisions (proxy hops, bucket CORS, DB TLS, email provider, throttle store) are made and tested.

---

## 10. Things that are genuinely in good shape

- Password hashing uses bcrypt cost 12; session tokens are random and stored only as SHA-256 hashes.
- Session cookies are `httpOnly`, `sameSite=lax`, `secure` in production, host-only, with a 7-day expiry.
- Password reset revokes all sessions and clears the reset hash; forgot-password does not enumerate accounts.
- API secret keys are hashed, shown once, and never returned in list responses.
- Cross-organization isolation for session-based reads/writes passed the existing checks.
- Upload completion verifies object existence, exact size, and content type, and uses a row lock for idempotency.
- Storage is behind an interface with a real R2 adapter and a local adapter; production refuses to boot without R2.
- The SDK has bounded retries, cancellation, typed errors, and a built-package consumer test.
- Migrations are explicit, with `synchronize: false` and no boot-time migrations.
- No committed secrets were found: `.env` is gitignored, `.env.example` files are empty templates, and no secret key is embedded in the web bundle.

---

## 11. Audit hygiene and change record

**At audit time** (kept for the record): no source file, test, migration or configuration had been changed; probe data was cleaned up; git operations were out of scope.

**During remediation:**

- Source files, tests, a migration, API contract docs and SDK docs were changed; every confirmed critical/high finding has a regression test or a live exploit reproduction.
- No existing test was deleted or weakened. Tests that produced false passes because they carried a session cookie were corrected to use cookie-less key clients, and the stale SDK consumer check was rewritten to match the now-documented key contract.
- The remediation was split at the approved boundary: only C-01 and H-01 … H-10 (plus three dependencies) were changed. No Phase 1/2 finding was quietly fixed.
- No production R2 credentials, production database, proxy, or email provider was configured. All work used the local dev environment.
- Disposable accounts/projects created by the live scripts remain in the local dev database; no production data was touched.
- `scripts/verify-all.ps1` was extended to 15 steps. Final run: **ALL VERIFICATION STEPS PASSED**.
- A separate work summary is in `project-docs/REMEDIATION_WORK_SUMMARY.md`.
- Git operations were not part of the original remediation scope; the user subsequently requested a push to GitHub as a separate task.
