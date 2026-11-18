import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailService } from './mail.service.js';

function service(nodeEnv: string) {
  const config = {
    get: vi.fn((key: string) => (key === 'NODE_ENV' ? nodeEnv : undefined)),
    getOrThrow: vi.fn(() => 'http://127.0.0.1:3000'),
  };
  return new MailService(config as never);
}

const TOKEN = 'super-secret-verification-token';

afterEach(() => vi.restoreAllMocks());

describe('MailService token logging', () => {
  it('never writes a verification token to production logs', async () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    await service('production').sendVerificationEmail('user@example.com', TOKEN);

    expect(warn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalled();
    expect(JSON.stringify(warn.mock.calls)).not.toContain(TOKEN);
    expect(JSON.stringify(error.mock.calls)).not.toContain(TOKEN);
  });

  it('prints the development link outside production', async () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    await service('development').sendVerificationEmail('user@example.com', TOKEN);
    expect(warn).toHaveBeenCalled();
    expect(JSON.stringify(warn.mock.calls)).toContain(TOKEN);
  });

  it('stays quiet in test environments', async () => {
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    await service('test').sendPasswordResetEmail('user@example.com', TOKEN);
    expect(warn).not.toHaveBeenCalled();
  });
});
