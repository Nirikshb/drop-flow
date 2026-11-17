# Environment Variables

`.env` files are gitignored. Only `.env.example` files are committed. Actual secrets must be injected by the deployment platform in production.

## dropflow-api

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | no | `development` | `development \| production \| test` |
| `PORT` | no | `3001` | HTTP listen port |
| `DATABASE_URL` | **yes** | — | PostgreSQL connection string |
| `FRONTEND_URL` | no | `http://127.0.0.1:3000` | Allowed CORS origin |
| `SESSION_SECRET` | production only | dev-only value in `.env` | Cookie/session signing (min 32 chars) |
| `R2_ACCOUNT_ID` | Phase 3 | — | Cloudflare account id |
| `R2_ACCESS_KEY_ID` | Phase 3 | — | R2 API token id |
| `R2_SECRET_ACCESS_KEY` | Phase 3 | — | R2 API token secret |
| `R2_BUCKET_NAME` | Phase 3 | — | Private bucket name |
| `R2_ENDPOINT` | Phase 3 | — | `https://<account>.r2.cloudflarestorage.com` |
| `R2_PUBLIC_BASE_URL` | Phase 3 | — | Optional public delivery domain |
| `LOG_LEVEL` | no | `log` | Structured log verbosity |

Validation happens at bootstrap via a Zod Standard Schema in `src/config/env.validation.ts`. Missing/invalid values stop startup with a clear message.

## dropflow-web

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Canonical site URL, used in metadata/redirects |
| `NEXT_PUBLIC_API_URL` | API base URL used by the browser API client |

`NEXT_PUBLIC_*` values are embedded in client bundles. Never put secrets in them.

## dropflow-js-sdk

`.env.example` is optional and only used by local integration tests (`DROPFLOW_API_URL`, `DROPFLOW_TEST_PUBLIC_KEY`). The SDK has no build-time environment requirements.
