import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../errors.js';
import { authenticateProjectKey } from './api-key-auth.js';

function setup(options: {
  publicProject?: Record<string, unknown> | null;
  apiKey?: Record<string, unknown> | null;
  project?: Record<string, unknown> | null;
} = {}) {
  const projects = {
    findOne: vi.fn(async ({ where }: { where: Record<string, unknown> }) =>
      ('publicKey' in where ? options.publicProject : options.project) ?? null),
  };
  const apiKeys = {
    findOne: vi.fn(async () => options.apiKey ?? null),
    update: vi.fn(async () => undefined),
  };
  return { projects, apiKeys };
}

const activeProject = { id: 'project-1', status: 'active' };

describe('authenticateProjectKey', () => {
  it('accepts a public key only where public scope is allowed', async () => {
    const { projects, apiKeys } = setup({ publicProject: activeProject });
    const request: { headers: Record<string, string>; projectId?: string; keyScope?: string } = {
      headers: { authorization: 'Bearer df_public_abc' },
    };

    await expect(authenticateProjectKey(request as never, projects as never, apiKeys as never, ['secret']))
      .rejects.toMatchObject({ status: 403 });

    await expect(authenticateProjectKey(request as never, projects as never, apiKeys as never, ['public', 'secret']))
      .resolves.toBe(true);
    expect(request.projectId).toBe('project-1');
    expect(request.keyScope).toBe('public');
  });

  it('accepts a secret key and updates lastUsedAt with a targeted write', async () => {
    const { projects, apiKeys } = setup({
      apiKey: { id: 'key-1', projectId: 'project-1' },
      project: activeProject,
    });
    const request: { headers: Record<string, string>; projectId?: string; apiKeyId?: string; keyScope?: string } = {
      headers: { 'x-dropflow-key': 'df_secret_abc' },
    };

    await authenticateProjectKey(request as never, projects as never, apiKeys as never, ['secret']);
    expect(request.keyScope).toBe('secret');
    expect(request.apiKeyId).toBe('key-1');
    expect(apiKeys.update).toHaveBeenCalledWith(
      { id: 'key-1' },
      { lastUsedAt: expect.any(Date) },
    );
  });

  it('never treats a public key as a secret', async () => {
    const { projects, apiKeys } = setup({ publicProject: activeProject });
    const error = await authenticateProjectKey(
      { headers: { authorization: 'df_public_abc' } } as never,
      projects as never,
      apiKeys as never,
      ['secret'],
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).code).toBe('forbidden');
  });

  it('rejects missing and unknown keys', async () => {
    const { projects, apiKeys } = setup();
    await expect(authenticateProjectKey(
      { headers: {} } as never, projects as never, apiKeys as never, ['public', 'secret'],
    )).rejects.toMatchObject({ status: 401 });

    await expect(authenticateProjectKey(
      { headers: { authorization: 'Bearer nope' } } as never,
      projects as never, apiKeys as never, ['public', 'secret'],
    )).rejects.toMatchObject({ status: 401 });
  });

  it('rejects keys for a disabled project', async () => {
    const { projects, apiKeys } = setup({ publicProject: { id: 'p', status: 'disabled' } });
    await expect(authenticateProjectKey(
      { headers: { authorization: 'df_public_abc' } } as never,
      projects as never, apiKeys as never, ['public'],
    )).rejects.toMatchObject({ code: 'project_inactive' });
  });
});
