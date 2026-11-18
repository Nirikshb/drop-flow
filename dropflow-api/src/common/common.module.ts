import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../api-keys/api-key.entity.js';
import { Project } from '../projects/project.entity.js';
import { UserSession } from '../users/user-session.entity.js';
import { FlexibleAuthGuard } from './guards/flexible-auth.guard.js';
import { ProjectKeyGuard } from './guards/project-key.guard.js';
import { SecretKeyGuard } from './guards/secret-key.guard.js';
import { SessionAuthGuard } from './guards/session-auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession, Project, ApiKey])],
  providers: [SessionAuthGuard, ProjectKeyGuard, SecretKeyGuard, FlexibleAuthGuard],
  exports: [
    TypeOrmModule,
    SessionAuthGuard,
    ProjectKeyGuard,
    SecretKeyGuard,
    FlexibleAuthGuard,
  ],
})
export class CommonModule {}
