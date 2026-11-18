# @dropflow/react

Optional React convenience layer for `@dropflow/sdk`. It owns UI state only; the upload protocol remains entirely in the core SDK.

```tsx
import { DropflowProvider, DropflowUploader } from '@dropflow/react';

<DropflowProvider config={{ publicKey: 'df_public_xxxx' }}>
  <DropflowUploader />
</DropflowProvider>
```

Hooks: `useDropflow`, `useUpload` (`upload`, `cancel`, `reset`, `progress`, `status`, `error`, `asset`), `useDropzone`.
Components: `DropflowUploader`, `DropflowDropzone`, `DropflowUploadList` (presentational).

```bash
pnpm install
pnpm build
pnpm typecheck
```
