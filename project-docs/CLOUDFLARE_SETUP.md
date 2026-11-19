# Cloudflare setup (frontend)

This repository is prepared to deploy `dropflow-web` to **Cloudflare Workers** using OpenNext. No account credentials or production resources are configured here.

## What was configured

- Added dev dependencies in `dropflow-web`: `@opennextjs/cloudflare`, `wrangler`.
- Added `wrangler.jsonc` — Worker name `dropflow-web`, `.open-next/worker.js`, assets binding, `nodejs_compat` and `global_fetch_strictly_public`, compatibility date `2026-11-19`.
- Added `open-next.config.ts` using `defineCloudflareConfig({})` (default in-memory incremental cache; no R2 cache bucket).
- Added `.dev.vars` (`NEXTJS_ENV=development`) — ignored by Git.
- Added `public/_headers` for immutable `/_next/static/*` caching.
- Added `initOpenNextCloudflareForDev()` to `next.config.ts` for local binding emulation.
- Added scripts: `preview:cf`, `deploy:cf`, `upload:cf`, `cf:typegen`.
- Added `.npmrc` with `node-linker=hoisted` — required on Windows to avoid symlink/permission errors in the OpenNext bundle.
- Ignored `.open-next/`, `cloudflare-env.d.ts`, and `.dev.vars` in the root `.gitignore`.

## Verified locally

- `pnpm typecheck` — passed.
- `pnpm build` — passed.
- `pnpm exec opennextjs-cloudflare build` — passed; `Worker saved in .open-next/worker.js`.
- `pnpm dev` — works and reports `Using secrets defined in .dev.vars`.

## Deploying (needs your credentials)

From `dropflow-web`:

```powershell
# Login once
pnpm exec wrangler login

# Dry-run the Worker locally
pnpm preview:cf

# Deploy
pnpm deploy:cf
```

You can also connect the GitHub repo `https://github.com/Nirikshb/drop-flow` to Cloudflare with:

- Branch: `main`
- Root directory: `dropflow-web`
- Build command: `pnpm install --frozen-lockfile && pnpm exec opennextjs-cloudflare build`
- Deploy command / output: Wrangler with `wrangler.jsonc` (Worker deployment, not Pages static output)

Set `NEXT_PUBLIC_API_URL` as a build-time variable; it is embedded in the client bundle. Never put secrets in `NEXT_PUBLIC_*`.

## Still required before this is a production deployment

The frontend alone is not a working product. The API still needs hosting (container/VM/Node platform), a managed PostgreSQL database with TLS, R2 credentials and bucket CORS, a proxy with `TRUST_PROXY`, a shared rate-limit store, and an email provider. See `CURRENT_PRODUCTION_READINESS_STATUS.md` — production configuration is gated and was **not** performed here.
