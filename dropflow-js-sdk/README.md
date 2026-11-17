# @dropflow/sdk

JavaScript / TypeScript client for Dropflow. Framework-free — no React dependency.

> **Status: Phase 0.** The package currently publishes its configuration and data **type contracts** only. The `Dropflow` client and upload engine are implemented in Phase 4. This README describes the intended API so consumers can plan integration; it does not claim the upload flow works yet.

## Install (once released)

```bash
npm install @dropflow/sdk
```

## Intended usage

```ts
import { Dropflow } from '@dropflow/sdk';

const dropflow = new Dropflow({ publicKey: 'df_public_xxxx' });
const asset = await dropflow.upload(file);
console.log(asset.url);
```

Cancellation and progress are part of the contract:

```ts
const controller = new AbortController();
await dropflow.upload(file, {
  signal: controller.signal,
  onProgress: ({ percentage }) => console.log(percentage),
});
```

## Exported types (available now)

`DropflowConfig`, `UploadProgress`, `UploadOptions`, `Asset`, `ListAssetsOptions`, `PaginatedAssets`.

## Commands

```powershell
pnpm install
pnpm build     # ESM + CJS + .d.ts via tsup
pnpm test
pnpm typecheck
```

The built package (`dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`) is tested from a separate consumer project before release.
