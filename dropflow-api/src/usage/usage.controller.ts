import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import type { User } from '../users/user.entity.js';
import { UsageService } from './usage.service.js';

@Controller('projects/:id')
@UseGuards(SessionAuthGuard)
export class UsageController {
  constructor(private readonly usage: UsageService) {}

  @Get('usage')
  getUsage(@CurrentUser() user: User, @Param('id') projectId: string) {
    return this.usage.getUsage(user.id, projectId);
  }

  @Get('activity')
  getActivity(@CurrentUser() user: User, @Param('id') projectId: string) {
    return this.usage.getActivity(user.id, projectId);
  }
}
