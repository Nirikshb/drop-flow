export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StorageObjectMetadata {
  key: string;
  size: number;
  contentType: string;
  etag: string | null;
}

export interface SignedUpload {
  url: string;
  method: 'PUT';
  headers: Record<string, string>;
  expiresAt: Date;
}

export interface SignedDownload {
  url: string;
  expiresAt: Date;
}

/**
 * Business logic depends only on this interface — never on individual S3/R2
 * calls. Adapters can be swapped or faked in tests.
 *
 * Buckets are private. Every read goes through a short-lived signed URL, so a
 * copied `objectKey` is never sufficient to fetch bytes.
 */
export interface StorageService {
  readonly driver: 'r2' | 'local';
  /** `contentLength` is bound into the signature so storage rejects other sizes. */
  createSignedUploadUrl(
    objectKey: string,
    contentType: string,
    expiresInSeconds: number,
    contentLength: number,
  ): Promise<SignedUpload>;
  createSignedDownloadUrl(
    objectKey: string,
    expiresInSeconds: number,
    options?: { responseContentType?: string; downloadFilename?: string },
  ): Promise<SignedDownload>;
  headObject(objectKey: string): Promise<StorageObjectMetadata | null>;
  deleteObject(objectKey: string): Promise<void>;
}
