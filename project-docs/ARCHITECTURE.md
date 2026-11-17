# Dropflow — Architecture Overview

## Three independent applications

Dropflow is deliberately split into three deployable/versionable projects inside one parent directory:

```
dropflow/
├── dropflow-web/       Next.js 16 marketing site + customer dashboard
├── dropflow-api/       NestJS 12 REST API (modular monolith)
├── dropflow-js-sdk/    @dropflow/sdk — framework-free JS/TS client
└── project-docs/       This documentation
```

There is **no** shared root `package.json` and **no** workspace linking between them. Each project installs and builds on its own. This keeps the SDK publishable independently, lets the API deploy as a container/process, and lets the frontend deploy to an edge/hosting provider without dragging backend code along.

## Request flows

### Dashboard (cookie session)

```
Browser → dropflow-web (Next.js Server/Client Components)
        → dropflow-api /auth, /organizations, /projects, ... (credentials: include)
        → PostgreSQL
```

Sessions are stored as hashed tokens in `user_sessions`; the browser only ever holds an opaque cookie.

### SDK upload (public project key)

```
Customer app → @dropflow/sdk
  1. POST /v1/uploads            → API validates key, project, quota, file rules
  2. API → R2: create signed PUT URL, create upload_session row
  3. SDK → R2: PUT file directly (progress via XMLHttpRequest)
  4. POST /v1/uploads/:id/complete → API HEADs the object, verifies size,
     marks asset completed, records usage (idempotent)
  5. SDK returns completed Asset
```

The API never proxies file bytes. The browser never receives secret keys.

## Backend module map (Phase 0 foundation → Phase 2+)

| Module | Responsibility |
|---|---|
| `config` | Load + validate env at bootstrap (Zod Standard Schema) |
| `database` | Single TypeORM connection, migrations policy |
| `health` | Liveness/dependency check (`GET /health`) |
| `common` | Guards, decorators, filters, interceptors (Phase 2) |
| `auth`, `users` | Identity, sessions, password reset (Phase 2) |
| `organizations`, `projects` | Tenancy and authorization boundaries (Phase 2) |
| `api-keys` | Public/secret key lifecycle (Phase 2) |
| `uploads`, `assets`, `storage`, `usage` | Core product (Phase 3) |
| Admin surface | Separate, non-customer module (Phase 7) |

Controllers own HTTP concerns; services own business logic; storage sits behind an interface so R2 can be swapped or faked in tests.

## Security boundaries

- Organization membership is checked in service/guard code — never only in the UI.
- Every project-scoped query is filtered by the caller's authorized project IDs.
- R2 object keys are server-generated UUIDs; customer filenames are metadata only.
- Private bucket by default; public delivery is an explicit per-asset/project decision.
- `synchronize` and automatic migration execution are disabled.
