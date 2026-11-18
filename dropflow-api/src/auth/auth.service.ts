import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import { Errors } from '../common/errors.js';
import { sha256, signToken, verifyToken } from '../common/utilities/crypto.js';
import { OrganizationsService } from '../organizations/organizations.service.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { MailService } from './mail.service.js';
import { SessionsService } from './sessions.service.js';

const VERIFY_TTL = 24 * 60 * 60;
const RESET_TTL = 60 * 60;

type VerificationPayload = { sub: string; purpose: 'verify' };
type ResetPayload = { sub: string; purpose: 'reset' };

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly sessions: SessionsService,
    private readonly organizations: OrganizationsService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  private get secret(): string {
    return this.config.getOrThrow<string>('SESSION_SECRET');
  }

  async register(input: {
    email: string;
    password: string;
    name: string;
    organizationName: string;
  }): Promise<{ user: ReturnType<typeof toUserDto>; sessionToken: string }> {
    const passwordHash = await hash(input.password, 12);
    const user = await this.users.create({
      email: input.email,
      passwordHash,
      fullName: input.name,
    });
    await this.organizations.create(user.id, input.organizationName);

    const token = signToken<VerificationPayload>(
      { sub: user.id, purpose: 'verify' }, this.secret, VERIFY_TTL,
    );
    await this.users.setEmailVerificationToken(
      user.id, sha256(token), new Date(Date.now() + VERIFY_TTL * 1000),
    );
    await this.mail.sendVerificationEmail(user.email, token);

    const sessionToken = await this.sessions.create(user.id);
    return { user: toUserDto(user), sessionToken };
  }

  async login(email: string, password: string): Promise<{
    user: ReturnType<typeof toUserDto>; sessionToken: string;
  }> {
    const user = await this.users.findByEmail(email);
    if (!user || !(await compare(password, user.passwordHash))) {
      throw Errors.invalidCredentials();
    }
    const sessionToken = await this.sessions.create(user.id);
    return { user: toUserDto(user), sessionToken };
  }

  async logout(sessionToken: string): Promise<void> {
    await this.sessions.revoke(sessionToken);
  }

  async verifyEmail(token: string): Promise<{ verified: boolean }> {
    const payload = verifyToken<VerificationPayload>(token, this.secret);
    if (!payload || payload.purpose !== 'verify') throw Errors.validation('Invalid verification token');

    const user = await this.users.findById(payload.sub);
    if (!user || !user.emailVerificationTokenHash) {
      throw Errors.validation('Verification token is no longer valid');
    }
    // In JavaScript `===` on strings compares value; hashing both sides keeps
    // comparison independent of token encoding and avoids storing raw tokens.
    if (sha256(token) !== user.emailVerificationTokenHash) {
      throw Errors.validation('Verification token is no longer valid');
    }
    await this.users.markEmailVerified(user.id);
    return { verified: true };
  }

  async forgotPassword(email: string): Promise<{ success: boolean }> {
    const user = await this.users.findByEmail(email);
    if (user) {
      const token = signToken<ResetPayload>(
        { sub: user.id, purpose: 'reset' }, this.secret, RESET_TTL,
      );
      await this.users.setPasswordResetToken(
        user.id, sha256(token), new Date(Date.now() + RESET_TTL * 1000),
      );
      await this.mail.sendPasswordResetEmail(user.email, token);
    }
    // Always the same response: no account enumeration.
    return { success: true };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    const payload = verifyToken<ResetPayload>(token, this.secret);
    if (!payload || payload.purpose !== 'reset') throw Errors.validation('Invalid reset token');

    const user = await this.users.findById(payload.sub);
    if (!user || !user.passwordResetTokenHash || sha256(token) !== user.passwordResetTokenHash) {
      throw Errors.validation('Reset token is no longer valid');
    }

    const passwordHash = await hash(newPassword, 12);
    await this.users.updatePasswordHash(user.id, passwordHash);
    await this.users.setPasswordResetToken(user.id, null, null);
    await this.sessions.revokeAllForUser(user.id);
    return { success: true };
  }

  async me(userId: string): Promise<ReturnType<typeof toUserDto>> {
    const user = await this.users.findById(userId);
    if (!user) throw Errors.unauthorized();
    return toUserDto(user);
  }

  async updateProfile(userId: string, input: { name?: string; email?: string }) {
    const before = await this.users.findById(userId);
    const user = await this.users.updateProfile(userId, input).then(toUserDto);

    if (before && input.email && user.email !== before.email) {
      const token = signToken<VerificationPayload>(
        { sub: user.id, purpose: 'verify' }, this.secret, VERIFY_TTL,
      );
      await this.users.setEmailVerificationToken(
        user.id, sha256(token), new Date(Date.now() + VERIFY_TTL * 1000),
      );
      await this.mail.sendVerificationEmail(user.email, token);
    }
    return user;
  }

  async listSessions(userId: string) {
    const sessions = await this.sessions.listActive(userId);
    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  }

  async revokeSession(userId: string, sessionId: string): Promise<{ success: boolean }> {
    await this.sessions.revokeById(userId, sessionId);
    return { success: true };
  }

  async requestAccountDeletion(userId: string): Promise<{ success: boolean }> {
    await this.users.requestDeletion(userId);
    // Sessions stay active until an operator completes the deletion request.
    return { success: true };
  }
}

export function toUserDto(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
  };
}
