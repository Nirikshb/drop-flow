# Dropflow — Production Remediation Plan

**Companion to:** `PRODUCTION_READINESS_AUDIT.md`
**Date:** 2026-11-18
**Status:** APPROVED SCOPE IMPLEMENTED — Phase 0 items 0.1–0.11 are implemented and verified locally. Phase 1 items are **not** implemented except where noted below.
**Rule:** No work starts without explicit approval. No product features, no architecture changes beyond what a finding requires.

> **Scope of the implementation:** the critical finding (C-01) and all ten high findings (H-01 … H-10). Nothing from Phase 1 or Phase 2 was changed except three incidental items that the high findings could not be fixed without: M-02 (email change re-verification), M-05 (scheduled upload reaper), and M-06 (safe `lastUsedAt` update). No production infrastructure was configured; no R2 credentials were created; git operations were out of scope.

---

## How to read this plan

Items are ordered by **severity**, then by **dependency** (a later phase assumes the earlier phases are done).

| Phase | Gate | Contents |
|---|---|---|
| Phase 0 | **Blocks production infrastructure configuration** | Critical + the high findings that make R2/DB/proxy unsafe |
| Phase 1 | **Blocks external beta** | Remaining high + all medium |
| Phase 2 | Blocks public launch / paid plans | Low + operational hardening |
| Phase 3 | Needs live infrastructure | Verification that cannot be done locally |

Each item names the finding ID from the audit so the two documents stay in sync.

---

## Implementation record (2026-11-18)

All Phase 0 items are implemented. Evidence below is reproducible on this machine: API unit tests (28 tests / 7 files), `pnpm build`, web `pnpm typecheck`, and four live integration scripts run against a real database and real object storage (`test/integration-smoke.mjs`, `test/authz-check.mjs`, `test/security-regressions.mjs`, `test/rate-limit-check.mjs`). All are wired into `scripts/verify-all.ps1`, which has 15 steps.

| Item | Status | Where it lives | Regression evidence |
|---|---|---|---|
| 0.1 / C-01 key scopes | Done | `src/common/guards/api-key-auth.ts`, `project-key.guard.ts`, `secret-key.guard.ts`, `flexible-auth.guard.ts` | `security-regressions.mjs` (public key → 403 on list/get/delete; secret still 200), `authz-check.mjs`, `api-key-auth.spec.ts` |
| 0.2 / H-01 storage-bound size | Done | `src/uploads/uploads.service.ts`, `src/storage/local-storage.service.ts`, `src/storage/r2-storage.service.ts` | `security-regressions.mjs` (oversized PUT rejected, completion refused, zero bytes stored) |
| 0.3 / H-02 atomic account quotas | Done | `src/uploads/uploads.service.ts` (org row lock), `src/projects/projects.service.ts` (project limit), `PLAN_LIMITS` | `projects.service.spec.ts`, `security-regressions.mjs` |
| 0.4 / H-03 no local storage in prod | Done | `src/storage/storage.module.ts` (`@Global`, gated), `src/main.ts` (raw parser gated), `src/config/env.validation.ts` | `local-storage.service.spec.ts`, server boot log shows one `/v1/local-storage` mapping |
| 0.5 / H-04 MIME policy | Done | `src/common/mime-policy.ts`, `uploads.service.ts`, `projects.service.ts` | `mime-policy.spec.ts` (8 cases), `security-regressions.mjs` (wildcard, HTML, SVG, `image/*` policy, exact-type rule) |
| 0.6 / H-10 delivery model | Done — **Option A** (private bucket + signed GET) | `StorageService.createSignedDownloadUrl`, `r2-storage.service.ts`, `local-storage.service.ts` | `security-regressions.mjs` (signed URL serves bytes; unsigned read rejected; forged token rejected) |
| 0.7 / H-09 origin model | Done — **customer sites supported** | `src/main.ts` custom CORS, `projects.allowed_origins`, project DTO validation | `security-regressions.mjs` (wildcard origin rejected, concrete origin accepted) |
| 0.8 / H-05 token logging | Done | `src/common/mail.service.ts` | `mail.service.spec.ts` |
| 0.9 / H-06 project deletion | Done | `src/projects/projects.service.ts` | `security-regressions.mjs` (delete project after soft-deleting its assets; project gone) |
| 0.10 / H-07 truthful dashboard | Done | `dropflow-web/src/services/index.ts` + settings / project / keys pages, header, dashboard | web `pnpm typecheck`, manual flow against the live API |
| 0.11 / H-08 rate limiting | Done | `src/main.ts` (`TRUST_PROXY`), `@Throttle` on auth + upload-init routes, `@SkipThrottle()` on health | `rate-limit-check.mjs` |

**Decisions taken during implementation** (these were open questions in the plan and are now settled):

- **0.6 delivery:** Option A. R2 buckets are private; every asset URL returned by the API is a 15-minute signed URL. Deletion stops future URL issuance immediately and existing links die at expiry.
- **0.7 audience:** external customer-site browser integrations remain first-class. A public key authorizes uploads only. Privileged reads (asset listing, asset detail, deletion, project management) need a secret key or a dashboard session.
- **0.5 new-project default:** an empty allowlist means "any concrete type except active content". Active types (HTML/XHTML/SVG/XML/JS/RSS/Atom) are denied unless that exact type is explicitly allowlisted. Wildcards are never accepted as either a declaration or a policy.

**Migration:** `1763489000000-ProductionHardening` adds `organizations.plan`, `projects.allowed_origins` and supporting indexes. It is additive only.

**Deliberately not done** (unchanged from Phase 1/2, still open): organization ownership invariants (M-01), role checks on key management (M-03), server-side checksum verification (M-04), malformed-input hardening (M-10/L-01), SDK upload timeouts (M-11), dependency/lint gate (M-12), re-completing a deleted upload (M-13), request-count tracking (M-14), audit log and admin hardening (M-08), per-account brute-force limits (M-09). No production database, R2 bucket, proxy, or email provider was configured.

---

## Phase 0 — Must be fixed before touching production infrastructure

> **Status: all eleven items are implemented and verified locally.** Each item below is kept in its original planning form; the implementation record above maps it to code and evidence. Remaining "Done when" clauses were all satisfied except the ones that require live infrastructure (a real proxy hop count, a shared throttle store, real R2 credentials) — those are listed as residual risks in the audit.

These are the items where configuring R2, a production database, or a public proxy would immediately create exploitable exposure or unrecoverable infrastructure states.

### 0.1 — Introduce key scopes and restrict destructive routes (C-01)

**Why first:** Every other storage decision is unsafe until a browser-visible credential cannot delete data. If R2 is connected first, the public key becomes a production data-destruction tool.

- Add an explicit `scope` context to the auth result (`public` | `secret`) rather than inferring from the guard.
- `POST /v1/uploads`, `POST /v1/uploads/:id/start`, `POST /v1/uploads/:id/complete`, `POST /v1/uploads/:id/fail`: allow `public` + `secret`.
- `GET /v1/assets`, `GET /v1/assets/:id`, `DELETE /v1/assets/:id`: require `secret` or a dashboard session.
- Reject `df_public_*` on admin/usage/keys routes explicitly (not by accident of guard choice).
- Split the guard into `PublicUploadGuard` and `SecretKeyGuard`; keep `FlexibleAuthGuard` only for session-or-secret paths.
- Update `API_CONTRACT.md` and both SDK READMEs so the public key's reduced power is documented.
- Rewrite the integration smoke test that currently uses a public key for the whole flow (`test/integration-smoke.mjs`) to use a secret key, and add public-key negative assertions.

**Done when:** public key → 403 on list/get/delete; secret key still passes the full flow; authz check asserts both.

---

### 0.2 — Enforce upload bounds at the storage boundary and clean up failures (H-01)

- Add a size condition the storage layer enforces: R2/S3 POST policy with `content-length-range`, or a presigned PUT restricted by expected length.
- Local adapter: reject `Content-Length` that does not match the session's expected size before writing; delete partial files on mismatch/abort.
- On `complete` failure (size or content-type mismatch), delete the object immediately and mark the session `failed`.
- On session expiry, delete the object.
- Record the pending reservation so quota accounting includes in-flight uploads (see 0.3).

**Done when:** oversized PUT is rejected or removed; a failed completion leaves zero bytes in storage; the existing smoke test still passes with a correct-size upload.

---

### 0.3 — Make quotas account-wide and atomic (H-02)

- Move quota ownership from `project_id` to `organization_id` (or to an account-level subscription row).
- Enforce `PLAN_LIMITS.projects` when creating a project.
- Reserve bytes at `init` inside a transaction with a row lock (or an atomic counter row), release on fail/expire.
- Resolve limits from a persisted plan field, not the hardcoded `free`.

**Dependency:** needs 0.2's reservation concept to be meaningful.
**Done when:** N concurrent `init` calls cannot exceed the allowance; a 4th project on free plan is refused; per-org storage is enforced.

---

### 0.4 — Remove the local storage HTTP surface from production (H-03)

- Register `LocalStorageController` and the `express.raw` parser only when the local adapter is selected **and** `NODE_ENV !== 'production'`.
- Lower the raw body limit from 100 MB to the project's max file size, and reject before buffering where possible.
- Remove or authenticate `GET /v1/local-storage`; it must never serve bytes without a signature.
- Add `X-Content-Type-Options: nosniff` and `Content-Disposition: attachment` to any dev download response.

**Done when:** production module graph contains no `/v1/local-storage` routes; dev upload flow still works.

---

### 0.5 — Content-type policy and inline-serving safety (H-04)

- Reject any declared MIME type containing `*`.
- Always compare the stored object's content type against the resolved allowlist; never skip on wildcard.
- Default-deny active types (`text/html`, `image/svg+xml`, `application/javascript`, `text/xml`) unless a project explicitly opts in.
- Serve objects with `nosniff` + attachment disposition, or from a cookie-less origin.
- Decide and document the default allowlist for new projects (currently "allow everything").

**Dependency:** interacts with 0.6 (delivery model). Do them together.

---

### 0.6 — Decide and implement the object delivery model (H-10, and the CORS half of H-09)

This is a **product decision** that must be made before R2 is configured; both options are viable, but the code differs.

**Option A — private bucket + signed GET (recommended for a file platform)**
- Add `getSignedDownloadUrl(key, expiresIn)` to `StorageService`.
- Asset URLs become short-lived signed URLs; never return a raw bucket URL.
- Deleting an asset makes its URL stop working at expiry.
- Browser SDK still needs a CORS decision (0.7).

**Option B — deliberately public bucket**
- Keep a separate public domain, cookie-less, with content restrictions from 0.5.
- Document that any URL is permanent and that deletion only removes the index entry.

Whichever is chosen: remove the ambiguity in `r2-storage.service.ts:86-89` so a private bucket cannot silently return a 403 URL.

---

### 0.7 — Resolve the browser SDK origin model (H-09)

Depends on 0.1 (scopes) and 0.6 (delivery).

- If the SDK is dashboard-only: say so in `docs`, the READMEs, and the marketing examples; remove the "browser-safe" claim from `API_CONTRACT.md`.
- If customer sites are supported: add a per-project `allowed_origins` list (new column + admin UI or API), allow those origins with `credentials: false` on upload-only routes, and keep session CORS locked to `FRONTEND_URL`.
- Never use `origin: '*'` with `credentials: true`.

---

### 0.8 — Stop logging tokens in production (H-05)

- Delete the production branches that log verification/reset links (`mail.service.ts:24-27, 34-37`).
- Choose one: (a) configure a real email provider, or (b) fail closed with an explicit operational error and no token in logs.
- If a manual-delivery escape hatch is required, write to a restricted channel, not stdout.

---

### 0.9 — Fix project deletion (H-06)

- In one transaction: clean storage for soft-deleted assets, hard-delete their rows, then delete the project.
- Return a typed `409 conflict` when live assets still exist; never a 500.
- Add a migration only if the chosen lifecycle needs one (e.g. changing the FK). Prefer application-level cleanup first, since a migration here is destructive.

---

### 0.10 — Make the dashboard tell the truth (H-07)

This is the only Phase 0 item that is purely frontend, but it is a Phase 0 item because it makes every other operational action untrustworthy.

- Extend `DashboardService` with `updateProject`, `deleteProject`, `revokeApiKey`, `updateProfile`, `updateOrganization`, `rotateApiKey`.
- Wire settings, project settings, project status/delete, and key revoke to the real endpoints.
- Load the signed-in user from `GET /auth/me`; delete `SESSION_NAME = "Alex"` and all "demo environment / no backend change" copy.
- Remove `src/mock/*` or keep it clearly out of the production import graph.
- Add a 401 → redirect-to-login handler (also covers M-07).

---

### 0.11 — Proxy-aware rate limiting (H-08)

- Configure `trust proxy` for the actual platform (exact hop count or known proxy CIDR).
- Add per-route limits for login, register, forgot-password, and admin.
- Exempt `/health` from the global throttler.
- Use a shared store if more than one instance will run.

**Done when:** staging behind the real proxy shows distinct client IPs; `/health` is not throttled; login has its own limit.

---

## Phase 1 — Must be fixed before external beta

All Phase 0 items are prerequisites. These are the remaining highs and every medium.

> **Status: not implemented, with three exceptions.** M-02 (email change re-verification), M-05 (scheduled upload reaper) and M-06 (targeted `lastUsedAt` update) were required by the Phase 0 storage fixes and are done. Everything else in this phase remains open and is a blocker for external beta.

### 1.1 — Organization ownership invariant (M-01)
Reject self-demotion unless another owner exists; make transfer atomic; add a test.

### 1.2 — Email change invalidates verification (M-02)
Clear `emailVerifiedAt`, issue a new token bound to the new address, require re-verification. Consider requiring the current password.

### 1.3 — Role enforcement on API keys (M-03)
Require `admin`/`owner` for create/rotate/revoke; members may list prefixes only.

### 1.4 — Checksum verification (M-04)
Verify SHA-256 server-side, or remove `checksum` from the API and docs until it is real. Do not store unverified claims.

### 1.5 — Scheduled reaper (M-05)
Add `@nestjs/schedule` (or a queue job) with a single-instance lock: expire sessions, delete unreferenced objects, log counts. Add R2 lifecycle rules as defence in depth.

### 1.6 — Safe `lastUsedAt` update (M-06)
Replace full-entity `save` in the auth path with a targeted `update({ id }, { lastUsedAt })`; use a conditional update for revocation.

### 1.7 — Malformed input handling (M-10, L-01)
Validate UUID params/queries and pagination at the boundary; return 400 not 500. Add a DTO for ownership transfer. Add tests for each previously-500 case.

### 1.8 — Upload timeout in the SDK (M-11)
Apply the configured timeout to XHR and fetch uploads; abort and surface a retryable error.

### 1.9 — Dependency and lint gate (M-12)
Move `shadcn` to devDependencies; update transitive tooling; fix the four React Compiler lint errors; add lint + audit + React tests to `verify-all.ps1`.

### 1.10 — Re-completing a deleted upload (M-13)
Filter `deletedAt: IsNull()` in the idempotency lookup; return 410/404 for a deleted asset.

### 1.11 — Plan resolution (M-14)
Persist plan per organization; enforce project and request limits; either record request events or remove the metric from the UI.

### 1.12 — Dashboard auth gate (M-07)
Covered structurally by 0.10; verify redirect behaviour explicitly and add tests.

### 1.13 — Audit log and admin hardening (M-08)
Append-only audit table for key/member/project/account-deletion events; per-operator admin credentials, rotation, IP allowlist.

### 1.14 — Brute-force controls (M-09)
Per-account and per-IP limits on auth routes; check duplicate email before bcrypt; shared store.

### 1.15 — Email verification policy (L-08)
Decide: gate key creation/uploads on verification, or document that it is informational. If gated, update onboarding.

---

## Phase 2 — Launch hardening

- **L-02** Security headers (helmet or platform equivalent), wire `LOG_LEVEL`, redact query strings in logs, `Cache-Control: no-store` on auth/API responses.
- **L-03** Reduce signed-URL TTL and re-verify object metadata on read; document the overwrite window.
- **L-04** Generate docs from the real SDK surface; document every env var including `NEXT_PUBLIC_DROPFLOW_KEY` (or remove the reference).
- **L-05** Reject `df_secret_` keys in browser entry points, or add an explicit server-only option.
- **L-06** React tests; replace `file:` dependency before publishing (or mark private).
- **L-07** Remove `pgcrypto` if `gen_random_uuid()` is native on the target; add reaper and usage indexes.
- **L-08** See 1.15.

---

## Phase 3 — Verification that needs live infrastructure

Do these only after Phase 0 is merged and a staging environment exists.

| Check | Finding | How |
|---|---|---|
| R2 content-type enforcement on presigned PUT | R-02 | PUT with a mismatched `Content-Type`, inspect stored metadata |
| R2 bucket CORS for browser PUT | R-03 | Configure, then upload from an allowed and a denied origin |
| Private-bucket download behaviour | H-10 / R-06 | Anonymous GET, signed GET, expired signed GET |
| Client IP behind the real proxy | H-08 / R-04 | Compare throttle behaviour and logged IPs; spoof `X-Forwarded-For` |
| Database TLS | R-05 | Force `sslmode=verify-full` with the provider CA |
| Email provider | R-07 | Sandbox send, bounce handling, per-account limits |
| CSRF posture | R-01 | Cross-site form + sibling-subdomain test |
| Multi-instance throttle | R-09 | Two instances, shared store |
| Backup/restore and migration rollback | DEPLOYMENT.md | Restore into staging, run the prior image |

---

## What is explicitly **not** in this plan

- No new product features.
- No framework or architecture rewrite.
- No billing provider integration (Phase 8 stays preparation-only).
- No test weakening to make the suite pass.
- No git operations.

---

## Suggested execution order (if approved)

```
0.1  key scopes            ← unblocks everything security-related
0.2  upload bounds         ┐
0.4  local surface         ├ storage correctness cluster
0.5  content policy        ┘
0.3  quotas                ← depends on 0.2
0.9  project deletion
0.10 dashboard truthfulness
0.8  token logging
0.6 + 0.7 delivery/CORS    ← product decision required first
0.11 proxy/throttle        ← needs target platform chosen
--- Phase 0 gate: re-run audit probes, expect all negative ---
Phase 1 (1.1 → 1.15)
--- Phase 1 gate: external beta readiness review ---
Phase 2, then Phase 3 against staging
```

Two items need a decision from you before implementation can start:

1. **Delivery model** (0.6): private bucket with signed GET, or intentionally public bucket? This changes the storage interface, the asset DTO, and the SDK contract.
2. **SDK audience** (0.7): dashboard-only, or customer-site browser embeds? This changes CORS, keys, and documentation.

---

## Approval requested

Nothing has been changed. Reply with either:

- **"Approve Phase 0"** — implement the Phase 0 items in the order above, with tests, then re-run the audit probes.
- **A subset** (e.g. "0.1, 0.2, 0.4, 0.9") plus answers to the two decisions above.
- **Questions** — I will go deeper on any finding before proposing code.
