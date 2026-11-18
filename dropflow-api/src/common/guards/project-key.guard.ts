import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../api-keys/api-key.entity.js';
import { Project } from '../../projects/project.entity.js';
import type { AuthenticatedRequest } from '../decorators/current-user.decorator.js';
import { authenticateProjectKey } from './api-key-auth.js';

/**
 * Authenticates developer API requests that may be made from a browser.
 *
 * Both scopes are accepted because the route decides what it needs. Upload
 * initiation is the only browser-safe operation and records `keyScope` so
 * downstream code can tell the two apart.
 */
@Injectable()
export class ProjectKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(ApiKey) private readonly apiKeys: Repository<ApiKey>,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return authenticateProjectKey(request, this.projects, this.apiKeys, ['public', 'secret']);
  }
}
