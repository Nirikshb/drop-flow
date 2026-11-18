import { Controller, Delete, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { FlexibleAuthGuard } from '../common/guards/flexible-auth.guard.js';
import type { AuthenticatedRequest } from '../common/decorators/current-user.decorator.js';
import { Errors } from '../common/errors.js';
import { ProjectsService } from '../projects/projects.service.js';
import { AssetsService } from './assets.service.js';

@Controller('v1/assets')
@UseGuards(FlexibleAuthGuard)
export class AssetsController {
  constructor(
    private readonly assets: AssetsService,
    private readonly projects: ProjectsService,
  ) {}

  private async resolveProjectId(request: AuthenticatedRequest, provided?: string): Promise<string> {
    if (request.user) {
      if (!provided) throw Errors.validation('projectId is required for session access');
      await this.projects.getForUser(request.user.id, provided);
      return provided;
    }
    if (!request.projectId) throw Errors.unauthorized();
    return request.projectId;
  }

  @Get()
  async list(
    @Req() request: AuthenticatedRequest,
    @Query('projectId') projectId: string | undefined,
    @Query('search') search: string | undefined,
    @Query('mimeType') mimeType: string | undefined,
    @Query('sort') sort: 'newest' | 'oldest' | 'largest' | 'name' | undefined,
    @Query('limit') limit: string | undefined,
    @Query('offset') offset: string | undefined,
  ) {
    const resolved = await this.resolveProjectId(request, projectId);
    return this.assets.list({
      projectId: resolved,
      search,
      mimeType,
      sort,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get(':id')
  async get(
    @Req() request: AuthenticatedRequest,
    @Query('projectId') projectId: string | undefined,
    @Param('id') id: string,
  ) {
    const resolved = await this.resolveProjectId(request, projectId);
    return this.assets.get(resolved, id);
  }

  @Delete(':id')
  async remove(
    @Req() request: AuthenticatedRequest,
    @Query('projectId') projectId: string | undefined,
    @Param('id') id: string,
  ) {
    const resolved = await this.resolveProjectId(request, projectId);
    return this.assets.delete(resolved, id);
  }
}
