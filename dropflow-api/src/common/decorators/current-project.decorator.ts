import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './current-user.decorator.js';

export const CurrentProjectId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.projectId) throw new Error('Project context missing — guard not applied');
    return request.projectId;
  },
);
