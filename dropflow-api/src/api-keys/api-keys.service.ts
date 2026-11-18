import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Errors } from '../common/errors.js';
import { randomToken, sha256 } from '../common/utilities/crypto.js';
import { ProjectsService } from '../projects/projects.service.js';
import { ApiKey } from './api-key.entity.js';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey) private readonly keys: Repository<ApiKey>,
    private readonly projects: ProjectsService,
  ) {}

  async create(userId: string, projectId: string, name: string): Promise<{
    key: ApiKey; secret: string;
  }> {
    await this.projects.getForUser(userId, projectId);

    const secret = `df_secret_${randomToken(32)}`;
    const key = await this.keys.save(this.keys.create({
      projectId,
      name: name.trim(),
      keyPrefix: secret.slice(0, 19),
      keyHash: sha256(secret),
      revokedAt: null,
    }));
    return { key, secret };
  }

  async list(userId: string, projectId: string): Promise<ApiKey[]> {
    await this.projects.getForUser(userId, projectId);
    return this.keys.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async revoke(userId: string, projectId: string, keyId: string): Promise<void> {
    await this.projects.getForUser(userId, projectId);
    const key = await this.keys.findOne({ where: { id: keyId, projectId, revokedAt: IsNull() } });
    if (!key) throw Errors.notFound('Active API key not found');
    key.revokedAt = new Date();
    await this.keys.save(key);
  }

  async rotate(userId: string, projectId: string, keyId: string, name: string): Promise<{
    key: ApiKey; secret: string;
  }> {
    await this.revoke(userId, projectId, keyId);
    return this.create(userId, projectId, name);
  }
}
