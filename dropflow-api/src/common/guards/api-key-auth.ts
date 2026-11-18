import { IsNull, Repository } from 'typeorm';
import { ApiKey } from '../../api-keys/api-key.entity.js';
import { Project } from '../../projects/project.entity.js';
import type {
  AuthenticatedRequest,
  ProjectKeyScope,
} from '../decorators/current-user.decorator.js';
import { Errors } from '../errors.js';
import { sha256 } from '../utilities/crypto.js';

/**
 * Shared project-key authentication.
 *
 * The caller decides which scopes are acceptable. A public key is only ever a
 * publishable project identifier: it can start uploads, and nothing else. A
 * secret key authenticates privileged server-side operations.
 */
export async function authenticateProjectKey(
  request: AuthenticatedRequest,
  projects: Repository<Project>,
  apiKeys: Repository<ApiKey>,
  allowedScopes: readonly ProjectKeyScope[],
): Promise<boolean> {
  const header = request.headers.authorization ?? request.headers['x-dropflow-key'];
  const token = Array.isArray(header) ? header[0] : header;
  const key = token?.replace(/^Bearer\s+/i, '').trim();
  if (!key) throw Errors.unauthorized('A project API key is required');

  if (key.startsWith('df_public_')) {
    if (!allowedScopes.includes('public')) {
      // Authenticated (the key is well-formed) but not authorised.
      throw Errors.forbidden('This operation requires a secret API key');
    }
    const project = await projects.findOne({ where: { publicKey: key } });
    if (!project) throw Errors.unauthorized('Invalid public key');
    if (project.status !== 'active') throw Errors.projectInactive();
    request.projectId = project.id;
    request.keyScope = 'public';
    return true;
  }

  if (key.startsWith('df_secret_')) {
    if (!allowedScopes.includes('secret')) {
      throw Errors.forbidden('This operation does not accept secret keys');
    }
    const apiKey = await apiKeys.findOne({
      where: { keyHash: sha256(key), revokedAt: IsNull() },
    });
    if (!apiKey) throw Errors.unauthorized('Invalid or revoked secret key');

    const project = await projects.findOne({ where: { id: apiKey.projectId } });
    if (!project) throw Errors.unauthorized('Project not found');
    if (project.status !== 'active') throw Errors.projectInactive();

    // Targeted update: never save a stale entity over concurrent revocation.
    await apiKeys.update({ id: apiKey.id }, { lastUsedAt: new Date() });

    request.projectId = project.id;
    request.apiKeyId = apiKey.id;
    request.keyScope = 'secret';
    return true;
  }

  throw Errors.unauthorized('Unrecognised API key format');
}
