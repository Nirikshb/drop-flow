# Dropflow API Contract (v1)

Base URL (local): `http://127.0.0.1:3001`. No global prefix. JSON bodies. Timestamps ISO-8601 UTC.

✅ implemented · 🗓 planned.

## Conventions

- Dashboard auth: `df_session` httpOnly cookie (`credentials: include`).
- Developer auth: `Authorization: Bearer df_public_…` or `df_secret_…`. **The two key types are not interchangeable:**
  - `df_public_…` is a publishable identifier. It may only initialize, start, complete and fail uploads for its own project. It cannot read, list or delete assets, and cannot manage projects or keys.
  - `df_secret_…` is for privileged server-side operations. It may do everything the public key can, plus list/read/delete assets and manage projects.
  - This is a deliberate change from earlier builds, where a public key authorized asset listing and deletion.
- Errors: `{ statusCode, code, message, path, details? }`.
- Lists: `{ data, nextCursor, hasMore }`.
- Rate limits: 120 requests/minute per client globally, plus per-route limits — register 5/min, login 10/min, forgot/reset password 5/min, upload init 30/min. `GET /health` is not throttled.
- CORS: the dashboard origin is allowed with credentials. Customer origins listed in a project's `allowedOrigins` are allowed **without** credentials, and only on `/v1/uploads*`.
- Validation: DTOs reject unknown fields centrally.

## Service ✅

`GET /` → `{ name, version, status }`
`GET /health` → Terminus result with a real PostgreSQL ping.

## Auth ✅

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | Creates user + default organization; sets session cookie |
| POST | `/auth/login` | Sets session cookie |
| POST | `/auth/logout` | Revokes session |
| POST | `/auth/verify-email` | HMAC token, single use |
| GET | `/auth/verify-email?token=` | Redirects to frontend |
| POST | `/auth/forgot-password` | Always 202-style success, no enumeration |
| POST | `/auth/reset-password` | Invalidates all sessions |
| GET | `/auth/me` | Current user |
| PATCH | `/auth/profile` | Name/email |
| GET | `/auth/sessions` | Active sessions |
| DELETE | `/auth/sessions/:id` | Revoke one session |
| POST | `/auth/account-deletion-request` | Records request timestamp |

## Organizations ✅

`POST /organizations` · `GET /organizations` · `GET /organizations/:id` · `PATCH /organizations/:id` · `GET/POST /organizations/:id/members` · `PATCH/DELETE /organizations/:id/members/:memberId` · `POST /organizations/:id/ownership`

## Projects & API keys ✅

`POST /projects` · `GET /projects` · `GET /projects/:id` · `PATCH /projects/:id` · `DELETE /projects/:id` (refuses live assets)
`POST /projects/:id/keys` (secret returned once) · `GET /projects/:id/keys` · `DELETE .../:keyId` · `POST .../:keyId/rotate`

## Developer API ✅

| Method | Path | Key | Notes |
|---|---|---|---|
| POST | `/v1/uploads` | public or secret | Validates key, project, size, MIME, account quota; returns a signed PUT URL whose length is bound to the declared size |
| POST | `/v1/uploads/:id/start` | public or secret | pending → uploading |
| POST | `/v1/uploads/:id/complete` | public or secret | Verifies object exists + size + type; idempotent; returns the asset with a signed download URL |
| POST | `/v1/uploads/:id/fail` | public or secret | Marks failed and deletes the stored object |
| GET | `/v1/assets` | **secret** or session | `projectId`, `search`, `mimeType`, `sort`, `limit`, `offset` |
| GET | `/v1/assets/:id` | **secret** or session | Project-isolated |
| DELETE | `/v1/assets/:id` | **secret** or session | Soft delete + storage removal + usage event |

Session auth is also accepted on `/v1/assets` with an explicit `projectId` query parameter. Session auth is never accepted on `/v1/uploads`; uploads are key-only.

Asset `url` values are **short-lived signed URLs (15 minutes)** pointing at a private bucket. The raw object key is not a public URL, and an unsigned request is rejected.

`PATCH /projects/:id` accepts `allowedMimeTypes` (concrete types only; active content must be named explicitly) and `allowedOrigins` (exact origins, no wildcards or paths).

## Usage ✅

`GET /projects/:id/usage` — storage, asset count, monthly uploads/volume, request count, plan limits, 6-month history.
`GET /projects/:id/activity` — recent derived activity.

## Internal admin ✅

Requires `x-admin-key` header matching `ADMIN_SECRET`. Customer sessions/keys are never accepted.

`GET /admin/overview` · `/admin/customers` · `/admin/organizations` · `/admin/projects` · `/admin/uploads/failures` · `/admin/suspicious`

## Planned 🗓

Billing/subscription endpoints (Phase 8); deployment health/metrics expansion.
