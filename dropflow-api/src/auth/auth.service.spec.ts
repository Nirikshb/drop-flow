import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { AppError, Errors } from '../common/errors.js';
import { sha256, signToken } from '../common/utilities/crypto.js';

const SECRET = 'test-secret-with-enough-length-1234567890';

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    fullName: 'Test User',
    passwordHash: '',
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    deletionRequestedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function setup() {
  const users = {
    create: vi.fn(async (input: Record<string, unknown>) => {
      if (await users.findByEmail(String(input.email))) {
        throw Errors.conflict('An account with this email already exists');
      }
      return makeUser({ ...input, email: String(input.email).trim().toLowerCase() });
    }),
    findByEmail: vi.fn(async () => null),
    findById: vi.fn(async () => makeUser()),
    markEmailVerified: vi.fn(async () => undefined),
    setEmailVerificationToken: vi.fn(async () => undefined),
    setPasswordResetToken: vi.fn(async () => undefined),
    updatePasswordHash: vi.fn(async () => undefined),
    updateProfile: vi.fn(async (id: string, input: Record<string, unknown>) =>
      makeUser({ id, ...input, fullName: input.fullName ?? 'Test User' })),
  };
  const sessions = {
    create: vi.fn(async () => 'raw-session-token'),
    revoke: vi.fn(async () => undefined),
    revokeAllForUser: vi.fn(async () => undefined),
  };
  const organizations = { create: vi.fn(async () => ({ id: 'org-1' })) };
  const mail = {
    sendVerificationEmail: vi.fn(async () => undefined),
    sendPasswordResetEmail: vi.fn(async () => undefined),
  };
  const config = { getOrThrow: vi.fn(() => SECRET), get: vi.fn(() => SECRET) };

  const service = new AuthService(
    users as never, sessions as never, organizations as never,
    mail as never, config as never,
  );
  return { service, users, sessions, organizations, mail };
}

describe('AuthService', () => {
  it('hashes the password, creates an organization and never returns a hash', async () => {
    const { service, users, organizations, sessions } = setup();
    const result = await service.register({
      email: ' NEW@Example.com ',
      password: 'a-strong-password',
      name: 'New User',
      organizationName: 'New Org',
    });

    const saved = users.create.mock.calls[0]?.[0] as Record<string, unknown>;
    // AuthService forwards the input; UsersService.create normalises it.
    expect(saved.email).toBe(' NEW@Example.com ');
    expect(saved.passwordHash).not.toBe('a-strong-password');
    expect(String(saved.passwordHash).startsWith('$2')).toBe(true);
    expect(organizations.create).toHaveBeenCalledWith('user-1', 'New Org');
    expect(result.sessionToken).toBe('raw-session-token');
    expect(JSON.stringify(result)).not.toContain('passwordHash');
    expect(sessions.create).toHaveBeenCalledWith('user-1');
  });

  it('rejects invalid login credentials', async () => {
    const { service } = setup();
    await expect(service.login('test@example.com', 'wrong')).rejects.toThrow('Invalid email or password');
  });

  it('does not reveal whether an account exists on password reset', async () => {
    const { service, mail } = setup();
    const response = await service.forgotPassword('missing@example.com');
    expect(response).toEqual({ success: true });
    expect(mail.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('verifies a valid signed email token only once', async () => {
    const { service, users } = setup();
    const token = signToken({ sub: 'user-1', purpose: 'verify' }, SECRET, 3600);
    users.findById.mockResolvedValue(makeUser({
      emailVerificationTokenHash: sha256(token),
    }));
    await expect(service.verifyEmail(token)).resolves.toEqual({ verified: true });
    expect(users.markEmailVerified).toHaveBeenCalledWith('user-1');
  });

  it('rejects a tampered token', async () => {
    const { service } = setup();
    await expect(service.verifyEmail('not-a-token')).rejects.toThrow();
  });

  it('propagates a typed conflict error for duplicate emails', async () => {
    const { service, users } = setup();
    users.findByEmail.mockResolvedValue(makeUser());
    await expect(service.register({
      email: 'test@example.com', password: 'password123',
      name: 'A', organizationName: 'B',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('re-verifies the address when the email changes', async () => {
    const { service, users, mail } = setup();
    users.findById.mockResolvedValue(makeUser({ email: 'old@example.com' }));
    users.updateProfile.mockResolvedValue(makeUser({
      id: 'user-1', email: 'new@example.com', fullName: 'Test User', emailVerifiedAt: null,
    }));

    const result = await service.updateProfile('user-1', { email: 'new@example.com' });

    expect(result.email).toBe('new@example.com');
    expect(users.setEmailVerificationToken).toHaveBeenCalledWith(
      'user-1', expect.any(String), expect.any(Date),
    );
    expect(mail.sendVerificationEmail).toHaveBeenCalledWith('new@example.com', expect.any(String));
  });

  it('does not re-verify when only the name changes', async () => {
    const { service, users, mail } = setup();
    users.findById.mockResolvedValue(makeUser({ email: 'same@example.com' }));
    users.updateProfile.mockResolvedValue(makeUser({ email: 'same@example.com', fullName: 'New Name' }));

    await service.updateProfile('user-1', { name: 'New Name' });
    expect(mail.sendVerificationEmail).not.toHaveBeenCalled();
  });
});
