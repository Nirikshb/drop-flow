import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../assets/asset.entity.js';
import { CommonModule } from '../common/common.module.js';
import { OrganizationsModule } from '../organizations/organizations.module.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { ProjectsController } from './projects.controller.js';
import { Project } from './project.entity.js';
import { ProjectsService } from './projects.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Asset, UsageEvent]),
    CommonModule,
    OrganizationsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
