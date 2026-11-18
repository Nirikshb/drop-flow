import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { Errors } from '../common/errors.js';
import { timingSafeEqualStrings } from '../common/utilities/crypto.js';

/**
 * Internal-only guard. Customer session cookies and project keys are never
 * accepted here — a separate operator secret is required.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = this.config.get<string>('ADMIN_SECRET');
    if (!expected) throw Errors.forbidden('Admin surface is not configured');

    const provided = request.headers['x-admin-key'];
    const value = Array.isArray(provided) ? provided[0] : provided;
    if (!value || !timingSafeEqualStrings(value, expected)) {
      throw Errors.unauthorized('Invalid admin credential');
    }
    return true;
  }
}
