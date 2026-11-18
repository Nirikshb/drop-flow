/** Base class for every error thrown by the SDK. */
export class DropflowError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class AuthenticationError extends DropflowError {
  constructor(message = 'Invalid or missing API key') {
    super(message, 'authentication_error', 401, false);
  }
}

export class ValidationError extends DropflowError {
  constructor(message: string, readonly details?: Record<string, unknown>) {
    super(message, 'validation_error', 400, false);
  }
}

export class QuotaExceededError extends DropflowError {
  constructor(message = 'Storage or upload allowance exceeded') {
    super(message, 'quota_exceeded', 413, false);
  }
}

export class UploadCancelledError extends DropflowError {
  constructor() {
    super('Upload was cancelled', 'upload_cancelled', undefined, false);
  }
}

export class NetworkError extends DropflowError {
  constructor(message = 'Network request failed') {
    super(message, 'network_error', undefined, true);
  }
}

export class StorageError extends DropflowError {
  constructor(message = 'Storage provider rejected the upload') {
    super(message, 'storage_error', undefined, true);
  }
}

export class NotFoundError extends DropflowError {
  constructor(message = 'Resource not found') {
    super(message, 'not_found', 404, false);
  }
}

/** Translates an API error envelope into a typed SDK error. */
export function fromApiError(status: number, body: { code?: string; message?: string | string[] }): DropflowError {
  const message = Array.isArray(body.message)
    ? body.message.join(', ')
    : body.message ?? 'Request failed';

  switch (body.code ?? status) {
    case 401:
    case 'unauthorized':
    case 'invalid_credentials': return new AuthenticationError(message);
    case 404:
    case 'not_found': return new NotFoundError(message);
    case 413:
    case 'quota_exceeded': return new QuotaExceededError(message);
    case 400:
    case 422:
    case 'validation_error':
    case 'upload_invalid': return new ValidationError(message);
    case 'storage_error': return new StorageError(message);
    case 410:
    case 'upload_expired': return new StorageError(message);
    default:
      if (status >= 500) return new NetworkError(message);
      return new DropflowError(message, body.code ?? 'api_error', status, status === 429);
  }
}
