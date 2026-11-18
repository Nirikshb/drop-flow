import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../api-keys/api-key.entity.js';
import { Asset } from '../assets/asset.entity.js';
import { Organization } from '../organizations/organization.entity.js';
import { Project } from '../projects/project.entity.js';
import { UploadSession } from '../uploads/upload-session.entity.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { User } from '../users/user.entity.js';
import { AdminController } from './admin.controller.js';
import { AdminGuard } from './admin.guard.js';
import { AdminService } from './admin.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([
    User, Organization, Project, Asset, UploadSession, ApiKey, UsageEvent,
  ])],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
