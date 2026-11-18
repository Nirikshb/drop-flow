import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import type { User } from '../users/user.entity.js';
import {
  AddMemberDto, CreateOrganizationDto, UpdateMemberDto, UpdateOrganizationDto,
} from './dto/organization.dto.js';
import { Organization } from './organization.entity.js';
import { OrganizationMember, OrganizationRole } from './organization-member.entity.js';
import { OrganizationsService } from './organizations.service.js';

@Controller('organizations')
@UseGuards(SessionAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrganizationDto) {
    return this.organizations.create(user.id, dto.name, dto.slug)
      .then((organization) => toOrganizationDto(organization, 'owner'));
  }

  @Get()
  async list(@CurrentUser() user: User) {
    const organizations = await this.organizations.listForUser(user.id);
    return Promise.all(organizations.map(async (organization) =>
      toOrganizationDto(
        organization,
        await this.organizations.getMemberRole(user.id, organization.id),
      )));
  }

  @Get(':id')
  async get(@CurrentUser() user: User, @Param('id') id: string) {
    const organization = await this.organizations.getForUser(user.id, id);
    return toOrganizationDto(
      organization,
      await this.organizations.getMemberRole(user.id, id),
    );
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    const organization = await this.organizations.update(user.id, id, dto.name);
    return toOrganizationDto(
      organization,
      await this.organizations.getMemberRole(user.id, id),
    );
  }

  @Get(':id/members')
  async listMembers(@CurrentUser() user: User, @Param('id') id: string) {
    const members = await this.organizations.listMembers(user.id, id);
    return members.map(toMemberDto);
  }

  @Post(':id/members')
  addMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.organizations.addMember(user.id, id, dto.email, dto.role).then(toMemberDto);
  }

  @Patch(':id/members/:memberId')
  updateMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.organizations.updateMemberRole(user.id, id, memberId, dto.role).then(() => ({
      success: true,
    }));
  }

  @Delete(':id/members/:memberId')
  async removeMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    await this.organizations.removeMember(user.id, id, memberId);
    return { success: true };
  }

  @Post(':id/ownership')
  async transfer(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { memberId: string },
  ) {
    await this.organizations.transferOwnership(user.id, id, body.memberId);
    return { success: true };
  }
}

function toOrganizationDto(
  organization: Organization,
  role: OrganizationRole | null,
) {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    plan: organization.plan,
    role: role ?? 'member',
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  };
}

function toMemberDto(member: OrganizationMember) {
  return {
    id: member.id,
    organizationId: member.organizationId,
    userId: member.userId,
    email: member.user?.email ?? null,
    fullName: member.user?.fullName ?? null,
    role: member.role,
    createdAt: member.createdAt,
  };
}
