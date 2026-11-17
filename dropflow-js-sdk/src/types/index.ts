/**
 * Public type contracts for the Dropflow SDK.
 *
 * These interfaces describe the shape of configuration, options and returned
 * data. They exist only at development time — TypeScript erases them from the
 * emitted JavaScript. The runtime behaviour is implemented in Phase 4.
 */

export interface DropflowConfig {
  /** Project public key, e.g. `df_public_xxxx`. */
  publicKey: string;
  /** Base URL of the Dropflow API. Override for local development/testing. */
  baseUrl?: string;
  /** Request timeout in milliseconds. */
  timeout?: number;
}

export interface UploadProgress {
  /** Bytes uploaded so far. */
  loaded: number;
  /** Total bytes in the file. */
  total: number;
  /** Percentage complete, 0–100. */
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
  metadata?: Record<string, string>;
  retries?: number;
}

export interface Asset {
  id: string;
  projectId: string;
  url: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'expired' | 'deleted';
  createdAt: string;
}

export interface ListAssetsOptions {
  limit?: number;
  cursor?: string;
  mimeType?: string;
  search?: string;
}

export interface PaginatedAssets {
  data: Asset[];
  nextCursor: string | null;
  hasMore: boolean;
}
