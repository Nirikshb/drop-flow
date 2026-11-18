import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Errors } from '../common/errors.js';
import type {
  SignedDownload,
  SignedUpload,
  StorageObjectMetadata,
  StorageService,
} from './storage.interface.js';

/** Cloudflare R2 through its S3-compatible API. Private bucket by default. */
@Injectable()
export class R2StorageService implements StorageService {
  readonly driver = 'r2' as const;
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(config: ConfigService) {
    const accountId = config.getOrThrow<string>('R2_ACCOUNT_ID');
    const endpoint = config.getOrThrow<string>('R2_ENDPOINT');
    this.bucket = config.getOrThrow<string>('R2_BUCKET_NAME');
    this.endpoint = endpoint;

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
    void accountId; // endpoint already encodes the account id
  }

  async createSignedUploadUrl(
    objectKey: string,
    contentType: string,
    expiresInSeconds: number,
    contentLength: number,
  ): Promise<SignedUpload> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: contentType,
      ContentLength: contentLength,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    return {
      url,
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
  }

  async createSignedDownloadUrl(
    objectKey: string,
    expiresInSeconds: number,
    options?: { responseContentType?: string; downloadFilename?: string },
  ): Promise<SignedDownload> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ResponseContentType: options?.responseContentType,
      ResponseContentDisposition: options?.downloadFilename
        ? `attachment; filename*=UTF-8''${encodeURIComponent(options.downloadFilename)}`
        : undefined,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
    return { url, expiresAt: new Date(Date.now() + expiresInSeconds * 1000) };
  }

  async headObject(objectKey: string): Promise<StorageObjectMetadata | null> {
    try {
      const result = await this.client.send(new HeadObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
      }));
      return {
        key: objectKey,
        size: result.ContentLength ?? 0,
        contentType: result.ContentType ?? 'application/octet-stream',
        etag: result.ETag ?? null,
      };
    } catch (error) {
      if (this.isNotFound(error)) return null;
      throw Errors.storage('Could not inspect uploaded object');
    }
  }

  async deleteObject(objectKey: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: objectKey }));
    } catch {
      throw Errors.storage('Could not delete object');
    }
  }

  private isNotFound(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const record = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    return record.name === 'NotFound' || record.$metadata?.httpStatusCode === 404;
  }
}
