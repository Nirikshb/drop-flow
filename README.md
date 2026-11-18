# Dropflow

Developer-focused file upload and asset management SaaS.

## Projects

| Directory | Stack | Purpose |
|---|---|---|
| `dropflow-web/` | Next.js 16, React 19, Tailwind 4, shadcn/ui, Motion | Marketing site + customer dashboard |
| `dropflow-api/` | NestJS 12, TypeORM, PostgreSQL | REST API and upload infrastructure |
| `dropflow-js-sdk/` | TypeScript, tsup, Vitest | `@dropflow/sdk` npm package |
| `dropflow-react/` | React 19, tsup | `@dropflow/react` convenience hooks/components |
| `project-docs/` | Markdown | Architecture, API, DB, environment, deployment docs |

Each project has its own `package.json`, lockfile, environment template and README. No monorepo workspace.

## What works today

- Register / log in; cookie sessions, hashed passwords and tokens.
- Create organizations, projects and API keys (secret shown once).
- Install `@dropflow/sdk` and upload a file: signed URL → direct storage PUT → verified completion → asset row → usage accounting.
- Browse/search/delete assets and view usage in the dashboard.
- Real browser uploads from the dashboard Uploads page.
- Internal admin endpoints behind a separate credential.

Demo account (after running `node test/seed-dev.mjs` in `dropflow-api`): `demo@dropflow.dev` / `demo12345`.

## Quick start

See `project-docs/LOCAL_DEVELOPMENT.md`.

```powershell
scripts/start-local-db.ps1
scripts/restart-api.ps1        # API + migrations on :3001
scripts/restart-web.ps1        # Next dev on :3000
scripts/verify-all.ps1         # builds, typechecks, tests, integration checks
```

## Status & caveats

See `PROJECT_STATUS.md`. Cloudflare R2 credentials and an email provider are the only external configuration still required for a production customer trial; local development uses the included storage adapter.
