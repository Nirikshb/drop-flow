import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from './admin.guard.js';
import { AdminService } from './admin.service.js';

/** Internal operator endpoints. Never reachable with a customer session. */
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('overview') overview() { return this.admin.overview(); }
  @Get('customers') customers() { return this.admin.customers(); }
  @Get('organizations') organizations() { return this.admin.organizations(); }
  @Get('projects') projects() { return this.admin.projects(); }
  @Get('uploads/failures') uploadFailures() { return this.admin.uploadFailures(); }
  @Get('suspicious') suspicious() { return this.admin.suspiciousActivity(); }
}
