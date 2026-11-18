import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import type { User } from '../users/user.entity.js';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto.js';
import { Project } from './project.entity.js';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
@UseGuards(SessionAuthGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateProjectDto) {
    return this.projects.create(user.id, dto.organizationId, dto.name).then(toProjectDto);
  }

  @Get()
  list(@CurrentUser() user: User) {
    return this.projects.listForUser(user.id).then((items) => items.map(toProjectDto));
  }

  @Get(':id')
  async get(@CurrentUser() user: User, @Param('id') id: string) {
    return toProjectDto(await this.projects.getForUser(user.id, id));
  }

  @Patch(':id')
  update(@CurrentUser() user: User, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(user.id, id, dto).then(toProjectDto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    await this.projects.remove(user.id, id);
    return { success: true };
  }
}

export function toProjectDto(project: Project) {
  return {
    id: project.id,
    organizationId: project.organizationId,
    name: project.name,
    publicKey: project.publicKey,
    status: project.status,
    maxFileSize: Number(project.maxFileSize),
    allowedMimeTypes: project.allowedMimeTypes,
    allowedOrigins: project.allowedOrigins,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
