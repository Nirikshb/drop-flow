import { createHmac, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Errors } from '../common/errors.js';
import type {
  SignedDownload,
  SignedUpload,
  StorageObjectMetadata,
  StorageService,
} from './storage.interface.js';

interface Sidecar {
  contentType: string;
  etag: string;
}

interface SignedFields {
  purpose: 'put' | 'get';
  objectKey: string;
  expires: number;
  contentType: string;
  contentLength: number | null;
}

/**
 * Development adapter implementing the same contract as R2. Signed URLs point
 * back at a local HTTP endpoint so SDK/CLI/E2E tests exercise the full
 * init → PUT → complete flow without cloud credentials.
 *
 * Download URLs are signed too: the dev server must never be an unauthenticated
 * object store. Both the expected byte length and content type are bound into
 * upload signatures.
 */
@Injectable()
export class LocalStorageService implements StorageService {
  readonly driver = 'local' as const;
  private readonly baseDir = path.resolve(process.cwd(), '.local-storage');
  private readonly secret: string;
  private readonly apiUrl: string;

  constructor(config: ConfigService) {
    this.secret = config.getOrThrow<string>('SESSION_SECRET');
    const port = config.get<number>('PORT') ?? 3001;
    this.apiUrl = `http://127.0.0.1:${port}`;
  }

  private resolveKey(objectKey: string): string {
    if (!/^[A-Za-z0-9/_-]+$/.test(objectKey) || objectKey.includes('..') || objectKey.startsWith('/')) {
      throw Errors.validation('Invalid object key');
    }
    return path.join(this.baseDir, objectKey);
  }

  private sign(fields: SignedFields): string {
    return createHmac('sha256', this.secret)
      .update([
        fields.purpose,
        fields.objectKey,
        String(fields.expires),
        fields.contentType,
        fields.contentLength === null ? '' : String(fields.contentLength),
      ].join(':'))
      .digest('base64url');
  }

  private verify(fields: SignedFields, token: string): boolean {
    if (!Number.isFinite(fields.expires) || fields.expires < Date.now()) return false;
    const expected = this.sign(fields);
    const left = Buffer.from(expected);
    const right = Buffer.from(token ?? '');
    return left.length === right.length && timingSafeEqual(left, right);
  }

  verifyUploadToken(
    objectKey: string,
    expires: number,
    token: string,
    contentType: string,
    contentLength: number,
  ): boolean {
    return this.verify({ purpose: 'put', objectKey, expires, contentType, contentLength }, token);
  }

  verifyDownloadToken(objectKey: string, expires: number, token: string): boolean {
    return this.verify({
      purpose: 'get', objectKey, expires, contentType: '', contentLength: null,
    }, token);
  }

  async createSignedUploadUrl(
    objectKey: string,
    contentType: string,
    expiresInSeconds: number,
    contentLength: number,
  ): Promise<SignedUpload> {
    const expires = Date.now() + expiresInSeconds * 1000;
    const token = this.sign({ purpose: 'put', objectKey, expires, contentType, contentLength });
    const url = `${this.apiUrl}/v1/local-storage?key=${encodeURIComponent(objectKey)}` +
      `&expires=${expires}&mime=${encodeURIComponent(contentType)}` +
      `&size=${contentLength}&token=${token}`;
    return {
      url,
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      expiresAt: new Date(expires),
    };
  }

  async createSignedDownloadUrl(objectKey: string, expiresInSeconds: number): Promise<SignedDownload> {
    const expires = Date.now() + expiresInSeconds * 1000;
    const token = this.sign({
      purpose: 'get', objectKey, expires, contentType: '', contentLength: null,
    });
    return {
      url: `${this.apiUrl}/v1/local-storage?key=${encodeURIComponent(objectKey)}` +
        `&expires=${expires}&token=${token}`,
      expiresAt: new Date(expires),
    };
  }

  async writeObject(objectKey: string, body: Buffer, contentType: string): Promise<void> {
    const target = this.resolveKey(objectKey);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body);
    await writeFile(`${target}.meta.json`, JSON.stringify({
      contentType,
      etag: `"${body.length.toString(16)}-${body.subarray(0, 8).toString('hex')}"`,
    } satisfies Sidecar));
  }

  async readObject(objectKey: string): Promise<{ body: Buffer; contentType: string }> {
    try {
      const target = this.resolveKey(objectKey);
      const [body, meta] = await Promise.all([
        readFile(target),
        readFile(`${target}.meta.json`, 'utf8'),
      ]);
      return { body, contentType: (JSON.parse(meta) as Sidecar).contentType };
    } catch {
      throw Errors.notFound('Object not found');
    }
  }

  async headObject(objectKey: string): Promise<StorageObjectMetadata | null> {
    try {
      const target = this.resolveKey(objectKey);
      const info = await stat(target);
      const meta = JSON.parse(await readFile(`${target}.meta.json`, 'utf8')) as Sidecar;
      return {
        key: objectKey,
        size: info.size,
        contentType: meta.contentType,
        etag: meta.etag,
      };
    } catch {
      return null;
    }
  }

  async deleteObject(objectKey: string): Promise<void> {
    const target = this.resolveKey(objectKey);
    await unlink(target).catch(() => undefined);
    await unlink(`${target}.meta.json`).catch(() => undefined);
  }
}
