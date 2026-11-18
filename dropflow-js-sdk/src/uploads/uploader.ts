import { NetworkError, StorageError, UploadCancelledError } from '../errors/index.js';
import type { UploadProgress } from '../types/index.js';
import type { InitUploadResponse } from '../transport/index.js';

interface UploadToStorageInput {
  session: InitUploadResponse;
  file: Blob;
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

/**
 * Uploads bytes directly to the signed storage URL.
 *
 * Browsers use XMLHttpRequest because fetch does not expose upload progress
 * events consistently. In Node (no XMLHttpRequest) we fall back to fetch —
 * progress callbacks simply have no byte-level granularity there.
 */
export function uploadToStorage(input: UploadToStorageInput): Promise<void> {
  if (typeof XMLHttpRequest !== 'undefined') {
    return uploadWithXhr(input);
  }
  return uploadWithFetch(input);
}

function uploadWithFetch(input: UploadToStorageInput): Promise<void> {
  const { session, file, onProgress, signal } = input;
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });

  onProgress?.({ loaded: 0, total: file.size, percentage: 0 });
  return fetch(session.uploadUrl, {
    method: 'PUT',
    headers: session.headers,
    body: file,
    signal: controller.signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw response.status >= 500
          ? new StorageError(`Storage returned ${response.status}`)
          : new NetworkError(`Storage rejected the upload (${response.status})`);
      }
      onProgress?.({ loaded: file.size, total: file.size, percentage: 100 });
    })
    .catch((error: unknown) => {
      if (signal?.aborted || controller.signal.aborted) throw new UploadCancelledError();
      if (error instanceof StorageError || error instanceof NetworkError) throw error;
      throw new NetworkError(`Upload failed: ${String(error)}`);
    })
    .finally(() => signal?.removeEventListener('abort', onAbort));
}

function uploadWithXhr(input: UploadToStorageInput): Promise<void> {
  const { session, file, onProgress, signal } = input;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener('abort', onAbort);
      xhr.upload.removeEventListener('progress', onUploadProgress);
      if (error) reject(error);
      else resolve();
    };

    const onAbort = () => {
      xhr.abort();
      finish(new UploadCancelledError());
    };

    const onUploadProgress = (event: ProgressEvent) => {
      const loaded = event.loaded;
      const total = event.lengthComputable ? event.total : file.size;
      onProgress?.({
        loaded,
        total,
        percentage: total > 0 ? Math.min(100, (loaded / total) * 100) : 0,
      });
    };

    signal?.addEventListener('abort', onAbort, { once: true });
    if (signal?.aborted) {
      onAbort();
      return;
    }

    xhr.open(session.method, session.uploadUrl, true);
    for (const [key, value] of Object.entries(session.headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.upload.addEventListener('progress', onUploadProgress);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({ loaded: file.size, total: file.size, percentage: 100 });
        finish();
      } else if (xhr.status === 403 || xhr.status === 410) {
        finish(new StorageError('Signed upload URL expired'));
      } else {
        finish(new NetworkError(`Storage returned ${xhr.status}`));
      }
    });
    xhr.addEventListener('error', () => finish(new NetworkError('Network error during upload')));
    xhr.addEventListener('timeout', () => finish(new NetworkError('Upload timed out')));
    xhr.addEventListener('abort', () => finish(new UploadCancelledError()));
    xhr.send(file);
  });
}
