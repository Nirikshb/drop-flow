import {
  AuthenticationError, DropflowError, NetworkError, QuotaExceededError,
  StorageError, UploadCancelledError, ValidationError,
} from '../errors/index.js';
import { Transport, type InitUploadResponse } from '../transport/index.js';
import type {
  Asset, DropflowConfig, ListAssetsOptions, PaginatedAssets, UploadOptions,
} from '../types/index.js';
import { uploadToStorage } from '../uploads/uploader.js';

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new UploadCancelledError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new UploadCancelledError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function isRetryable(error: unknown): boolean {
  if (error instanceof UploadCancelledError || error instanceof ValidationError ||
      error instanceof AuthenticationError || error instanceof QuotaExceededError) return false;
  if (error instanceof NetworkError || error instanceof StorageError) return true;
  if (error instanceof DropflowError) return error.status === 429 || (error.status ?? 0) >= 500;
  return false;
}

/** Main SDK entry point. Framework-free and safe to construct once per app. */
export class Dropflow {
  private readonly transport: Transport;

  constructor(config: DropflowConfig) {
    if (!config.publicKey || !/^df_(public|secret)_/.test(config.publicKey)) {
      throw new ValidationError('publicKey must be a Dropflow key (df_public_… or df_secret_…)');
    }
    this.transport = new Transport(config);
  }

  async upload(file: Blob, options: UploadOptions = {}): Promise<Asset> {
    if (options.signal?.aborted) throw new UploadCancelledError();
    const maxRetries = Math.min(Math.max(options.retries ?? 2, 0), 5);
    let attempt = 0;

    while (true) {
      try {
        const session = await this.transport.request<InitUploadResponse>('/v1/uploads', {
          method: 'POST',
          signal: options.signal,
          body: {
            originalFilename: (file as File).name ?? 'upload.bin',
            size: file.size,
            mimeType: file.type || 'application/octet-stream',
            ...(options.metadata?.checksum ? { checksum: options.metadata.checksum } : {}),
          },
        });

        await this.transport.request(`/v1/uploads/${session.id}/start`, {
          method: 'POST',
          signal: options.signal,
          body: {},
        });

        await uploadToStorage({
          session,
          file,
          onProgress: options.onProgress,
          signal: options.signal,
        });

        return await this.transport.request<Asset>(`/v1/uploads/${session.id}/complete`, {
          method: 'POST',
          signal: options.signal,
          body: options.metadata?.checksum ? { checksum: options.metadata.checksum } : {},
        });
      } catch (error) {
        if (options.signal?.aborted) throw new UploadCancelledError();
        const retryable = isRetryable(error);
        if (!retryable || attempt >= maxRetries) throw error;
        attempt += 1;
        // Bounded exponential backoff: 300ms, 600ms, 1200ms …
        await delay(300 * 2 ** (attempt - 1), options.signal);
      }
    }
  }

  getAsset(assetId: string): Promise<Asset> {
    return this.transport.request<Asset>(`/v1/assets/${encodeURIComponent(assetId)}`);
  }

  listAssets(options: ListAssetsOptions = {}): Promise<PaginatedAssets> {
    const params = new URLSearchParams();
    if (options.limit) params.set('limit', String(options.limit));
    if (options.cursor) params.set('offset', options.cursor);
    if (options.mimeType) params.set('mimeType', options.mimeType);
    if (options.search) params.set('search', options.search);
    const query = params.size > 0 ? `?${params.toString()}` : '';
    return this.transport.request<PaginatedAssets>(`/v1/assets${query}`);
  }

  async deleteAsset(assetId: string): Promise<void> {
    await this.transport.request(`/v1/assets/${encodeURIComponent(assetId)}`, { method: 'DELETE' });
  }
}
