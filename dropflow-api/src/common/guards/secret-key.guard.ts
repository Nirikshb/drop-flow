import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../../api-keys/api-key.entity.js';
import { Project } from '../../projects/project.entity.js';
import type { AuthenticatedRequest } from '../decorators/current-user.decorator.js';
import { authenticateProjectKey } from './api-key-auth.js';

/**
 * Accepts secret keys only. Used for asset listing, reading and deletion —
 * operations that a publishable project identifier must never authorise.
 */
@Injectable()
export class SecretKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(ApiKey) private readonly apiKeys: Repository<ApiKey>,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return authenticateProjectKey(request, this.projects, this.apiKeys, ['secret']);
  }
}
