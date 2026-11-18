import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Delivery boundary for transactional email.
 *
 * No SMTP/email-provider credential is configured in this environment. In
 * development links are written to the application log so the flow can be
 * exercised locally. In production only the delivery failure is logged — a
 * verification or reset token must never reach production logs, because log
 * readers would then be able to take over accounts.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');

  constructor(private readonly config: ConfigService) {}

  private get frontendUrl(): string {
    return this.config.getOrThrow<string>('FRONTEND_URL');
  }

  private get isProduction(): boolean {
    return this.config.get<string>('NODE_ENV') === 'production';
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    if (this.isProduction) {
      this.logger.error(
        'Email provider not configured — verification email NOT delivered (token withheld from logs)',
      );
      return;
    }
    if (this.config.get<string>('NODE_ENV') !== 'development') return;
    const link = `${this.frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
    this.logger.warn(`[DEV] Verification link for ${email}: ${link}`);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    if (this.isProduction) {
      this.logger.error(
        'Email provider not configured — password reset email NOT delivered (token withheld from logs)',
      );
      return;
    }
    if (this.config.get<string>('NODE_ENV') !== 'development') return;
    const link = `${this.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    this.logger.warn(`[DEV] Password reset link for ${email}: ${link}`);
  }
}
