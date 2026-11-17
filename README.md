# Dropflow

Developer-focused file upload and asset management SaaS.

This repository root is a local container for three **independent** projects:

| Directory | Stack | Purpose |
|---|---|---|
| [`dropflow-web/`](./dropflow-web) | Next.js 16, React 19, Tailwind 4, shadcn/ui, Motion | Marketing site + customer dashboard |
| [`dropflow-api/`](./dropflow-api) | NestJS 12, TypeORM, PostgreSQL | REST API and upload infrastructure |
| [`dropflow-js-sdk/`](./dropflow-js-sdk) | TypeScript, tsup, Vitest | `@dropflow/sdk` npm package |
| [`project-docs/`](./project-docs) | Markdown | Architecture, API, DB, environment docs |

They do not share a package manager workspace. Each has its own `package.json`, lockfile, environment template and README.

## Current status

**Phase 0 (foundation) complete and verified.** Core product functionality starts in Phase 1 (frontend) and Phase 2 (backend). See [`project-docs/PHASE_0.md`](./project-docs/PHASE_0.md).

## Quick start

See [`project-docs/LOCAL_DEVELOPMENT.md`](./project-docs/LOCAL_DEVELOPMENT.md).

```powershell
# verify the stack
curl http://127.0.0.1:3001/health     # → { "status": "ok", "info": { "database": { "status": "up" } } }
curl http://127.0.0.1:3000            # → 200
```
