import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { ApiKeysController } from './api-keys.controller.js';
import { ApiKey } from './api-key.entity.js';
import { ApiKeysService } from './api-keys.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey]), ProjectsModule, CommonModule],
  controllers: [ApiKeysController],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
