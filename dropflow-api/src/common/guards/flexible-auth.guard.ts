import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionAuthGuard } from './session-auth.guard.js';
import { SecretKeyGuard } from './secret-key.guard.js';

/**
 * Allows either a dashboard session or a **secret** developer API key.
 *
 * A public key is deliberately not accepted: it identifies a project for
 * browser uploads and carries no read or delete authority.
 */
@Injectable()
export class FlexibleAuthGuard implements CanActivate {
  constructor(
    private readonly sessionGuard: SessionAuthGuard,
    private readonly secretKeyGuard: SecretKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ cookies?: Record<string, string> }>();
    if (request.cookies?.['df_session']) {
      try {
        return await this.sessionGuard.canActivate(context);
      } catch {
        // Fall through to key auth — an expired cookie must not permanently
        // block a server-side integration using a valid key.
      }
    }
    return this.secretKeyGuard.canActivate(context);
  }
}
