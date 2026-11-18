# @dropflow/sdk

Framework-free JavaScript / TypeScript client for Dropflow.

```bash
npm install @dropflow/sdk
```

```ts
import { Dropflow } from '@dropflow/sdk';

const dropflow = new Dropflow({ publicKey: 'df_public_xxxx' });
const asset = await dropflow.upload(file);
console.log(asset.url);
```

## Key permissions

`publicKey` accepts either key type, but they are **not interchangeable**:

| Operation | `df_public_…` | `df_secret_…` |
|---|---|---|
| `upload()` | yes | yes |
| `getAsset()`, `listAssets()`, `deleteAsset()` | no — 403 | yes |

A public key is safe to ship in a customer page because it can only create uploads for its own project. Asset reads and deletes need a secret key, which must stay on a server. `asset.url` is a signed URL that expires after 15 minutes; request the asset again for a fresh one.

Allowed browser origins are configured per project (`allowedOrigins`) and apply only to upload endpoints, without cookies.

## Options

```ts
const controller = new AbortController();

const asset = await dropflow.upload(file, {
  signal: controller.signal,
  retries: 2,
  metadata: { checksum: 'sha256:…' },
  onProgress({ loaded, total, percentage }) {
    console.log(`${Math.round(percentage)}%`);
  },
});
```

- **Progress** uses `XMLHttpRequest` upload events in browsers and a fetch fallback in Node.
- **Cancellation** uses `AbortController`; cancelling the browser request never deletes an already-completed object.
- **Retries** are bounded (max 5) with exponential backoff and only apply to network/5xx/429/expired-URL failures — never to validation, auth or quota errors.
- Base URL is configurable for local development: `new Dropflow({ publicKey, baseUrl: 'http://127.0.0.1:3001' })`.

## Methods

`upload(file, options)`, `getAsset(id)`, `listAssets({ limit, cursor, mimeType, search })`, `deleteAsset(id)`.

## Errors

`DropflowError` base plus `AuthenticationError`, `ValidationError`, `QuotaExceededError`, `UploadCancelledError`, `NetworkError`, `StorageError`, `NotFoundError`. Each has a stable `code`, `status` and `retryable` flag.

## Packaging & verification

ESM (`dist/index.js`), CommonJS (`dist/index.cjs`) and TypeScript declarations (`dist/index.d.ts`). Exports map is configured for both module systems.

```bash
pnpm build
pnpm test
node tests/consumer-check.mjs   # imports the BUILT package and exercises a live API
```
