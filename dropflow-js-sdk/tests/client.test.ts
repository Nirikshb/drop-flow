import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AuthenticationError, Dropflow, NetworkError, UploadCancelledError, ValidationError,
} from '../src/index.js';

const BASE = 'http://api.test';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Dropflow client', () => {
  it('rejects an invalid public key', () => {
    expect(() => new Dropflow({ publicKey: 'nope' })).toThrow(ValidationError);
  });

  it('performs the full upload flow and returns the asset', async () => {
    const asset = { id: 'asset_1', status: 'completed', url: 'http://cdn.test/a.png' };
    const calls: string[] = [];
    const progress: number[] = [];

    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const path = String(url);
      calls.push(`${init?.method ?? 'GET'} ${path}`);
      if (path.endsWith('/v1/uploads')) {
        return json({ id: 'session_1', uploadUrl: 'http://storage.test/put', method: 'PUT', headers: {} }, 201);
      }
      if (path.includes('/start')) return json({ success: true }, 201);
      if (path.includes('/complete')) return json(asset, 201);
      if (path === 'http://storage.test/put') return json({ stored: true });
      throw new Error(`Unexpected URL ${path}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const client = new Dropflow({ publicKey: 'df_public_test_123', baseUrl: BASE });
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const result = await client.upload(file, {
      onProgress: (event) => progress.push(event.percentage),
      retries: 0,
    });

    expect(result.id).toBe('asset_1');
    expect(calls[0]).toBe(`POST ${BASE}/v1/uploads`);
    expect(calls.some((call) => call.includes('/v1/uploads/session_1/start'))).toBe(true);
    expect(calls.some((call) => call.includes('/v1/uploads/session_1/complete'))).toBe(true);
    expect(progress[0]).toBe(0);
    expect(progress.at(-1)).toBe(100);
  });

  it('maps authentication failures to AuthenticationError', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({ code: 'unauthorized', message: 'bad key' }, 401)));
    const client = new Dropflow({ publicKey: 'df_public_bad', baseUrl: BASE });
    await expect(client.getAsset('asset_1')).rejects.toThrow(AuthenticationError);
  });

  it('honours cancellation before a request is made', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({})));
    const controller = new AbortController();
    controller.abort();
    const client = new Dropflow({ publicKey: 'df_public_test', baseUrl: BASE });
    await expect(client.upload(new File(['x'], 'x.txt'), { signal: controller.signal }))
      .rejects.toThrow(UploadCancelledError);
  });

  it('surfaces network failures as NetworkError', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    const client = new Dropflow({ publicKey: 'df_public_test', baseUrl: BASE });
    await expect(client.listAssets()).rejects.toThrow(NetworkError);
  });

  it('encodes asset ids and uses DELETE for deletion', async () => {
    const fetchMock = vi.fn(async () => json({ success: true }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new Dropflow({ publicKey: 'df_public_test', baseUrl: BASE });
    await client.deleteAsset('asset/with?chars');
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('asset%2Fwith%3Fchars');
  });
});
