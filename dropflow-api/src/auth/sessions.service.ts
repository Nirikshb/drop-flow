import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SESSION_COOKIE } from '../common/guards/session-auth.guard.js';
import { randomToken, sha256 } from '../common/utilities/crypto.js';
import { UserSession } from '../users/user-session.entity.js';

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(UserSession) private readonly sessions: Repository<UserSession>,
  ) {}

  /** Returns the raw token once; only its hash is persisted. */
  async create(userId: string): Promise<string> {
    const token = randomToken(32);
    await this.sessions.save(
      this.sessions.create({
        userId,
        sessionTokenHash: sha256(token),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        revokedAt: null,
      }),
    );
    return token;
  }

  async revoke(rawToken: string): Promise<void> {
    await this.sessions.update(
      { sessionTokenHash: sha256(rawToken), revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.sessions.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async revokeById(userId: string, sessionId: string): Promise<void> {
    const session = await this.sessions.findOne({
      where: { id: sessionId, userId, revokedAt: IsNull() },
    });
    if (!session) return;
    session.revokedAt = new Date();
    await this.sessions.save(session);
  }

  listActive(userId: string): Promise<UserSession[]> {
    return this.sessions.find({
      where: { userId, revokedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  static cookieOptions(isProduction: boolean) {
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: SESSION_TTL_MS,
    };
  }

  static readonly cookieName = SESSION_COOKIE;
}
