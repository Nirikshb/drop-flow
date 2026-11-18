import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '../../users/user.entity.js';

/**
 * Scope of the project key that authenticated the request.
 * `public` identifies a project for browser-safe uploads only; `secret`
 * authorises privileged server-side operations. Never infer privilege from
 * the mere presence of a project id.
 */
export type ProjectKeyScope = 'public' | 'secret';

export interface AuthenticatedRequest extends Request {
  user?: User;
  projectId?: string;
  apiKeyId?: string;
  keyScope?: ProjectKeyScope;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User | undefined => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
