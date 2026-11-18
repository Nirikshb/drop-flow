import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../assets/asset.entity.js';
import { CommonModule } from '../common/common.module.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { UploadSession } from './upload-session.entity.js';
import { UploadsController } from './uploads.controller.js';
import { UploadReaperService } from './upload-reaper.service.js';
import { UploadsService } from './uploads.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadSession, Asset, UsageEvent]),
    ProjectsModule,
    CommonModule,
  ],
  controllers: [UploadsController],
  providers: [UploadsService, UploadReaperService],
  exports: [UploadsService],
})
export class UploadsModule {}
