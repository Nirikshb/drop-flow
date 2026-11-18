import { HttpStatus } from '@nestjs/common';

export type ErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'quota_exceeded'
  | 'invalid_credentials'
  | 'project_inactive'
  | 'upload_expired'
  | 'upload_invalid'
  | 'storage_error'
  | 'rate_limited'
  | 'internal_error';

/** Application error with a stable machine-readable code. */
export class AppError extends Error {
  constructor(
    message: string,
    readonly status: HttpStatus,
    readonly code: ErrorCode,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  validation: (message: string, details?: Record<string, unknown>) =>
    new AppError(message, HttpStatus.BAD_REQUEST, 'validation_error', details),
  unauthorized: (message = 'Authentication required') =>
    new AppError(message, HttpStatus.UNAUTHORIZED, 'unauthorized'),
  forbidden: (message = 'You do not have access to this resource') =>
    new AppError(message, HttpStatus.FORBIDDEN, 'forbidden'),
  notFound: (message = 'Resource not found') =>
    new AppError(message, HttpStatus.NOT_FOUND, 'not_found'),
  conflict: (message: string) => new AppError(message, HttpStatus.CONFLICT, 'conflict'),
  quota: (message: string) =>
    new AppError(message, HttpStatus.PAYLOAD_TOO_LARGE, 'quota_exceeded'),
  invalidCredentials: () =>
    new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED, 'invalid_credentials'),
  projectInactive: () =>
    new AppError('This project is not active', HttpStatus.FORBIDDEN, 'project_inactive'),
  uploadExpired: () =>
    new AppError('This upload session has expired', HttpStatus.GONE, 'upload_expired'),
  uploadInvalid: (message: string) =>
    new AppError(message, HttpStatus.BAD_REQUEST, 'upload_invalid'),
  storage: (message: string) =>
    new AppError(message, HttpStatus.BAD_GATEWAY, 'storage_error'),
};
