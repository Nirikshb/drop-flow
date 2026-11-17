# Dropflow API Contract (v1)

Base URL (local): `http://127.0.0.1:3001`. No global path prefix. JSON bodies. Timestamps are ISO-8601 UTC.

Status: ✅ implemented in Phase 0 · 🗓 planned in a later phase.

## Conventions

- Auth for dashboard endpoints: `session` cookie (httpOnly, secure in production).
- Auth for developer endpoints: `Authorization: Bearer df_public_…` (public key identifies project).
- Errors: `{ "statusCode": number, "code": string, "message": string | string[], "details"?: object }`.
- Lists: `{ "data": T[], "nextCursor": string | null, "hasMore": boolean }`.
- Write operations are idempotent where a client may retry (notably upload completion).

## Health ✅

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/health` | none | `{ status, info: { database }, error, details }` |

## Service info ✅

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/` | none | `{ name, version, status }` |

## Authentication 🗓 Phase 2

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | Creates user + initial organization |
| POST | `/auth/login` | Sets session cookie |
| POST | `/auth/logout` | Revokes session |
| POST | `/auth/verify-email` | Token verification |
| POST | `/auth/forgot-password` | Always 202; no account enumeration |
| POST | `/auth/reset-password` | Single-use reset token |
| GET | `/auth/me` | Current user |

## Organizations 🗓 Phase 2

`POST /organizations` · `GET /organizations` · `GET /organizations/:id` · `PATCH /organizations/:id`

## Projects 🗓 Phase 2

`POST /projects` · `GET /projects` · `GET /projects/:id` · `PATCH /projects/:id` · `DELETE /projects/:id`

## API keys 🗓 Phase 2

`POST /projects/:id/keys` (returns the secret **once**) · `GET /projects/:id/keys` (metadata only) · `DELETE /projects/:id/keys/:keyId`

## Developer API (versioned) 🗓 Phase 3

| Method | Path | Notes |
|---|---|---|
| POST | `/v1/uploads` | Initialize upload, returns signed URL + upload session id |
| POST | `/v1/uploads/:id/complete` | Idempotent verification + asset finalization |
| GET | `/v1/assets` | Filter/sort/paginate |
| GET | `/v1/assets/:id` | Project-isolated |
| DELETE | `/v1/assets/:id` | Soft delete + usage adjustment |

## Usage 🗓 Phase 7

`GET /projects/:id/usage`
