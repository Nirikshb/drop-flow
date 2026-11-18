import { describe, expect, it, vi } from 'vitest';
import { LocalStorageService } from './local-storage.service.js';

function setup() {
  const config = {
    getOrThrow: vi.fn(() => 'test-secret-with-enough-length-1234567890'),
    get: vi.fn((key: string) => (key === 'PORT' ? 3001 : undefined)),
  };
  return new LocalStorageService(config as never);
}

describe('LocalStorageService signatures', () => {
  it('binds the declared byte length into an upload signature', async () => {
    const storage = setup();
    const signed = await storage.createSignedUploadUrl('projects/p/object', 'text/plain', 60, 5);
    const url = new URL(signed.url);
    const expires = Number(url.searchParams.get('expires'));
    const token = url.searchParams.get('token') ?? '';

    expect(storage.verifyUploadToken('projects/p/object', expires, token, 'text/plain', 5)).toBe(true);
    expect(storage.verifyUploadToken('projects/p/object', expires, token, 'text/plain', 6)).toBe(false);
  });

  it('does not accept a download token as an upload token', async () => {
    const storage = setup();
    const download = await storage.createSignedDownloadUrl('projects/p/object', 60);
    const url = new URL(download.url);
    const expires = Number(url.searchParams.get('expires'));
    const token = url.searchParams.get('token') ?? '';

    expect(storage.verifyDownloadToken('projects/p/object', expires, token)).toBe(true);
    expect(storage.verifyUploadToken('projects/p/object', expires, token, 'text/plain', 5)).toBe(false);
  });

  it('rejects expired signatures', async () => {
    const storage = setup();
    const signed = await storage.createSignedUploadUrl('projects/p/object', 'text/plain', -1, 5);
    const url = new URL(signed.url);
    expect(storage.verifyUploadToken(
      'projects/p/object',
      Number(url.searchParams.get('expires')),
      url.searchParams.get('token') ?? '',
      'text/plain',
      5,
    )).toBe(false);
  });

  it('refuses path traversal in object keys', async () => {
    const storage = setup();
    await expect(storage.deleteObject('../outside')).rejects.toThrow('Invalid object key');
    expect(await storage.headObject('../outside')).toBeNull();
  });
});
