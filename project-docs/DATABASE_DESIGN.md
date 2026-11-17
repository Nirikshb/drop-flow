# Database Design

PostgreSQL 18. UUID primary keys (`uuid` with `gen_random_uuid()`). All money/size values are integers (bytes). `timestamptz` everywhere.

## SQL concepts used (before the ORM)

- **Primary key (PK):** unique row identity. UUIDs avoid leaking sequential counts and work across services.
- **Foreign key (FK):** enforces that a referenced row exists. `ON DELETE RESTRICT` for customer data — never cascade-delete files.
- **One-to-many:** organization → projects; project → assets.
- **Many-to-many:** users ↔ organizations via `organization_members` (a join table with a role column).
- **Unique constraint:** `users.email`, `organizations.slug`, `projects.public_key`, `api_keys.key_hash`.
- **Index:** speeds reads on `project_id`, `created_at`, and search columns; costs write time, so only index what we query.
- **Transaction:** a unit of work that commits fully or rolls back — used for upload completion (session → asset → usage event).
- **Migration:** versioned, reviewable schema change. `synchronize` and auto-migration are disabled.
- **Normalization:** usage is derived from immutable `usage_events`, not a mutable counter that can drift.

## Tables (Phase 2 migrations)

| Table | Key columns | Notes |
|---|---|---|
| `users` | id, email (unique), password_hash, email_verified_at, created_at, updated_at | No plaintext passwords |
| `user_sessions` | id, user_id FK, session_token_hash (unique), expires_at, revoked_at, created_at | Store hash, not raw token |
| `organizations` | id, name, slug (unique), created_at, updated_at | Tenant root |
| `organization_members` | id, organization_id FK, user_id FK, role (`owner\|admin\|member`), created_at | Unique (org, user) |
| `projects` | id, organization_id FK, name, public_key (unique), status, max_file_size, allowed_mime_types (jsonb), created_at, updated_at | Restrictions live here |
| `api_keys` | id, project_id FK, name, key_prefix, key_hash (unique), last_used_at, revoked_at, created_at | Secret shown once |
| `assets` | id, project_id FK, object_key (unique), original_filename, mime_type, size_bytes, status, checksum, created_at, deleted_at | Soft delete |
| `upload_sessions` | id, project_id FK, asset_id FK nullable, object_key, expected_size, declared_mime_type, status, expires_at, created_at, completed_at | State machine |
| `usage_events` | id, project_id FK, asset_id FK nullable, event_type, size_bytes, created_at | Append-only accounting |

## Upload session states

`pending → uploading → completed`; alternatives: `failed`, `expired`, `deleted`. Completion is idempotent: a second call with the same session id returns the same asset without double-counting usage.

## Deletion policy

- Deleting an asset sets `deleted_at` and removes the R2 object, then appends a negative/correction usage event in the same transaction.
- Deleting a project is refused while it has live assets (safe conditions), or requires an explicit destructive-confirmation flow.
- FKs use `RESTRICT` so an accidental parent delete cannot silently erase customer files.
