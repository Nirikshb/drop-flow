# Phase 0 — Setup and Technical Foundation (COMPLETE)

Verified 2026-11-18.

## Environment findings

| Check | Result |
|---|---|
| Node.js | v24.13.0 |
| npm | 11.7.0 |
| pnpm | 10.14.0 (reused, not reinstalled) |
| Git | 2.38.0.windows.1 |
| PostgreSQL | 18.6 service running; system cluster on 5432 had no working credentials |
| Disk | ~94 GB free |
| Conflicting env vars | none found |

## Key decisions

1. **Isolated dev database.** System cluster SCRAM auth had no usable password (two stale `.env` credentials tested and rejected). Created a dedicated cluster on port 5434 with role `dropflow`, databases `dropflow_dev` / `dropflow_test`, and SCRAM password auth. The system `pg_hba.conf` was temporarily edited during investigation and **fully restored** (verified 8 SCRAM rules).
2. **Versions chosen deliberately, not "latest":** Next 16.4.6 / React 19.3 / Tailwind 4.3.3 / TS 5.9.3 in the web app (Next-compatible line); Nest 12.5 / TypeORM 0.3.31 / TS 6.0.3 in the API (Nest 12 toolchain, stable TypeORM line); Vitest for SDK & web, Nest CLI's Vitest for API.
3. **Three independent projects**, each with its own manifest, lockfile, env template, README. Parent Git repo belongs to an unrelated project, so `dropflow/` is its own Git repository.
4. **Secrets policy:** `.env`, `.env.*`, local DB data, build output and `node_modules` are gitignored; only `.env.example` files are committed.

## Exact initialization commands used

```powershell
# structure + git
mkdir dropflow-web, dropflow-api, dropflow-js-sdk, project-docs
git init

# web
pnpm dlx create-next-app@16.4.6 dropflow-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
pnpm dlx shadcn@4.23.0 init -d -y -f
pnpm add motion zod react-hook-form @hookform/resolvers @tanstack/react-query sonner next-themes
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/node@^24

# api
pnpm dlx @nestjs/cli@12.0.13 new dropflow-api --package-manager pnpm --skip-git --skip-install --strict
pnpm add @nestjs/config @nestjs/typeorm typeorm@0.3.31 pg class-validator class-transformer @nestjs/terminus cookie-parser zod
pnpm add -D @types/cookie-parser @types/pg

# sdk
pnpm add -D tsup typescript@5.9.3 vitest@5.1.0
```

## Verification evidence

| Check | Command | Result |
|---|---|---|
| API build | `pnpm build` | ✅ success |
| API unit test | `pnpm test` | ✅ 1 passed |
| API health | `curl /health` | ✅ `{ status: ok, database: up }` (real ping, 50 ms) |
| Web build | `pnpm build` | ✅ compiled, 4 static pages, TypeScript passed |
| Web dev | `pnpm dev` + `curl :3000` | ✅ HTTP 200 |
| SDK build | `pnpm build` | ✅ ESM + CJS + `.d.ts` emitted |

Errors encountered and fixed: Nest CLI `--linter` flag not supported (removed); shadcn `-b neutral` no longer valid (used defaults); stale CLI test expected `getHello` (rewrote tests); `pg_ctl reload` denied without admin (avoided via isolated cluster); vitest peer wanted newer `@types/node` (upgraded to 24).

## Phase 1 entry condition

All Phase 0 acceptance criteria are met. Phase 1 begins with the design system, then the marketing homepage and dashboard shell. Mock data must be isolated from real API services and never presented as working backend functionality.
