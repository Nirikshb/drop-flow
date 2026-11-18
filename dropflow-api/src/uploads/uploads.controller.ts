import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentProjectId } from '../common/decorators/current-project.decorator.js';
import { ProjectKeyGuard } from '../common/guards/project-key.guard.js';
import { CompleteUploadDto, InitUploadDto } from './dto/upload.dto.js';
import { UploadsService } from './uploads.service.js';

@Controller('v1/uploads')
@UseGuards(ProjectKeyGuard)
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  init(@CurrentProjectId() projectId: string, @Body() dto: InitUploadDto) {
    return this.uploads.init(projectId, dto);
  }

  @Post(':id/start')
  async start(@CurrentProjectId() projectId: string, @Param('id') id: string) {
    await this.uploads.start(projectId, id);
    return { success: true };
  }

  @Post(':id/complete')
  complete(
    @CurrentProjectId() projectId: string,
    @Param('id') id: string,
    @Body() dto: CompleteUploadDto,
  ) {
    return this.uploads.complete(projectId, id, dto.checksum);
  }

  @Post(':id/fail')
  async fail(@CurrentProjectId() projectId: string, @Param('id') id: string) {
    await this.uploads.fail(projectId, id);
    return { success: true };
  }
}
