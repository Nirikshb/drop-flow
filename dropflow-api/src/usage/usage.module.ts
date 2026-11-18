import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from '../assets/asset.entity.js';
import { CommonModule } from '../common/common.module.js';
import { OrganizationsModule } from '../organizations/organizations.module.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { UsageController } from './usage.controller.js';
import { UsageEvent } from './usage-event.entity.js';
import { UsageService } from './usage.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, UsageEvent]),
    CommonModule,
    ProjectsModule,
    OrganizationsModule,
  ],
  controllers: [UsageController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
