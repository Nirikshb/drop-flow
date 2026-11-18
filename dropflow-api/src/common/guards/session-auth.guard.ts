import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserSession } from '../../users/user-session.entity.js';
import { Errors } from '../errors.js';
import type { AuthenticatedRequest } from '../decorators/current-user.decorator.js';

export const SESSION_COOKIE = 'df_session';

/** Authenticates dashboard requests via an opaque, hashed session cookie. */
@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessions: Repository<UserSession>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const rawToken = request.cookies?.[SESSION_COOKIE];
    if (!rawToken) throw Errors.unauthorized();

    // Hash is imported lazily to keep this guard's dependency surface tiny.
    const { sha256 } = await import('../utilities/crypto.js');
    const session = await this.sessions.findOne({
      where: {
        sessionTokenHash: sha256(rawToken),
        revokedAt: IsNull(),
      },
      relations: { user: true },
    });

    if (!session || session.expiresAt.getTime() <= Date.now() || session.revokedAt) {
      throw Errors.unauthorized('Session expired or revoked');
    }

    request.user = session.user;
    return true;
  }
}
