# dropflow-api

NestJS 12 REST API for Dropflow. Modular monolith: controllers handle HTTP, services own business logic, storage will sit behind an interface.

## Stack

- NestJS 12.5 · TypeScript 6.0 (Nest 12 toolchain) · ESM (`nodenext`)
- TypeORM 0.3.31 (stable line supported by `@nestjs/typeorm@12`) + PostgreSQL 18
- Zod Standard Schema validation for env and (later) DTOs
- `@nestjs/terminus` health checks · `@nestjs/config` · cookie-parser
- Vitest + Supertest

Relative imports end in `.js`; there is no `__dirname` (use `import.meta.dirname`). See `AGENTS.md` and the [Nest docs](https://docs.nestjs.com/llms.txt).

## Commands

```powershell
pnpm install
pnpm start:dev   # http://127.0.0.1:3001
pnpm build
pnpm start:prod
pnpm test
pnpm test:e2e
pnpm lint
```

## Environment

Copy `.env.example` to `.env`. The committed `.env` in this workspace points at the isolated local dev cluster (port 5434) and is gitignored. Required values are validated at startup; invalid config aborts bootstrap. See [`../project-docs/ENVIRONMENT.md`](../project-docs/ENVIRONMENT.md).

## Implemented now

- `GET /` — service info
- `GET /health` — liveness + real PostgreSQL ping

Auth, organizations, projects, keys, uploads, assets and usage arrive in Phases 2–3. See [`../project-docs/API_CONTRACT.md`](../project-docs/API_CONTRACT.md).
