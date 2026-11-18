import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module.js';
import { OrganizationsModule } from '../organizations/organizations.module.js';
import { UserSession } from '../users/user-session.entity.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { MailService } from './mail.service.js';
import { SessionsService } from './sessions.service.js';

@Module({
  imports: [UsersModule, OrganizationsModule, CommonModule, TypeOrmModule.forFeature([UserSession])],
  controllers: [AuthController],
  providers: [AuthService, SessionsService, MailService],
  exports: [AuthService, SessionsService],
})
export class AuthModule {}
