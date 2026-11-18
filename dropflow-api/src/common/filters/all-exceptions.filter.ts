import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppError } from '../errors.js';

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  details?: Record<string, unknown>;
}

/** One consistent error envelope for every route. Never leaks stack traces. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'internal_error';
    let message: string | string[] = 'An unexpected error occurred';
    let details: Record<string, unknown> | undefined;

    if (exception instanceof AppError) {
      status = exception.status;
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      code = status === 400 ? 'validation_error' : status === 404 ? 'not_found' : 'http_error';
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object') {
        const record = body as Record<string, unknown>;
        message = (record['message'] as string | string[]) ?? exception.message;
      }
    } else if (this.isUniqueViolation(exception)) {
      status = HttpStatus.CONFLICT;
      code = 'conflict';
      message = 'A resource with this value already exists';
    } else {
      this.logger.error(
        `Unhandled error on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorBody = { statusCode: status, code, message, path: request.url };
    if (details) body.details = details;
    response.status(status).json(body);
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === '23505'
    );
  }
}
