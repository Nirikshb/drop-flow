import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module.js';
import { ApiKeysModule } from './api-keys/api-keys.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AssetsModule } from './assets/assets.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import { envSchema } from './config/env.validation.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { StorageModule } from './storage/storage.module.js';
import { UploadsModule } from './uploads/uploads.module.js';
import { UsageModule } from './usage/usage.module.js';
import { UsersModule } from './users/users.module.js';

const throttlerProvider: Provider = { provide: APP_GUARD, useClass: ThrottlerGuard };

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validationSchema: envSchema }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DatabaseModule,
    CommonModule,
    UsersModule,
    AuthModule,
    OrganizationsModule,
    ProjectsModule,
    ApiKeysModule,
    StorageModule.register(),
    UploadsModule,
    AssetsModule,
    UsageModule,
    HealthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, throttlerProvider],
})
export class AppModule {}
