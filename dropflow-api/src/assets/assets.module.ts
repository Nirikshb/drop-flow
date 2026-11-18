import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { AssetsController } from './assets.controller.js';
import { Asset } from './asset.entity.js';
import { AssetsService } from './assets.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, UsageEvent]),
    CommonModule,
    ProjectsModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
