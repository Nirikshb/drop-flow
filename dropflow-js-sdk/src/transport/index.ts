import type { DropflowConfig } from '../types/index.js';
import { fromApiError, NetworkError } from '../errors/index.js';

export const DEFAULT_BASE_URL = 'https://api.dropflow.dev';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/** Thin JSON transport. All API calls go through this one class. */
export class Transport {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(private readonly config: DropflowConfig) {
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeout = config.timeout ?? 30_000;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutSignal = AbortSignal.timeout(this.timeout);
    const signal = options.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.publicKey}`,
          Accept: 'application/json',
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal,
      });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      throw new NetworkError(`Could not reach Dropflow: ${String(error)}`);
    }

    const body = (await response.json().catch(() => ({}))) as {
      code?: string; message?: string | string[];
    };
    if (!response.ok) throw fromApiError(response.status, body);
    return body as T;
  }
}

export interface InitUploadResponse {
  id: string;
  objectKey: string;
  uploadUrl: string;
  method: 'PUT';
  headers: Record<string, string>;
  expiresAt: string;
}
