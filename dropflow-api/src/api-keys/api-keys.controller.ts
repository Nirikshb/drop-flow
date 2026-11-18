import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import type { User } from '../users/user.entity.js';
import { ApiKeysService } from './api-keys.service.js';
import { CreateApiKeyDto } from './dto/api-key.dto.js';
import { ApiKey } from './api-key.entity.js';

@Controller('projects/:id/keys')
@UseGuards(SessionAuthGuard)
export class ApiKeysController {
  constructor(private readonly keys: ApiKeysService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Param('id') projectId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    const { key, secret } = await this.keys.create(user.id, projectId, dto.name);
    // The secret is returned exactly once and is never persisted in plaintext.
    return { key: toKeyDto(key), secret };
  }

  @Get()
  async list(@CurrentUser() user: User, @Param('id') projectId: string) {
    const keys = await this.keys.list(user.id, projectId);
    return keys.map(toKeyDto);
  }

  @Delete(':keyId')
  async revoke(
    @CurrentUser() user: User,
    @Param('id') projectId: string,
    @Param('keyId') keyId: string,
  ) {
    await this.keys.revoke(user.id, projectId, keyId);
    return { success: true };
  }

  @Post(':keyId/rotate')
  async rotate(
    @CurrentUser() user: User,
    @Param('id') projectId: string,
    @Param('keyId') keyId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    const { key, secret } = await this.keys.rotate(user.id, projectId, keyId, dto.name);
    return { key: toKeyDto(key), secret };
  }
}

function toKeyDto(key: ApiKey) {
  return {
    id: key.id,
    projectId: key.projectId,
    name: key.name,
    keyPrefix: key.keyPrefix,
    lastUsedAt: key.lastUsedAt,
    revokedAt: key.revokedAt,
    createdAt: key.createdAt,
  };
}
