import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Errors } from '../common/errors.js';
import { slugify } from '../common/utilities/crypto.js';
import { User } from '../users/user.entity.js';
import { Organization } from './organization.entity.js';
import { OrganizationMember, OrganizationRole } from './organization-member.entity.js';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly organizations: Repository<Organization>,
    @InjectRepository(OrganizationMember) private readonly members: Repository<OrganizationMember>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, name: string, slug?: string): Promise<Organization> {
    const organizationSlug = slugify(slug ?? name);
    if (await this.organizations.findOne({ where: { slug: organizationSlug } })) {
      throw Errors.conflict('That organization slug is already taken');
    }

    return this.dataSource.transaction(async (manager) => {
      const organization = manager.create(Organization, { name: name.trim(), slug: organizationSlug });
      const saved = await manager.save(organization);
      await manager.save(manager.create(OrganizationMember, {
        organizationId: saved.id,
        userId,
        role: 'owner',
      }));
      return saved;
    });
  }

  async listForUser(userId: string): Promise<Organization[]> {
    const memberships = await this.members.find({
      where: { userId },
      relations: { organization: true },
      order: { createdAt: 'ASC' },
    });
    return memberships.map((membership) => membership.organization);
  }

  async getMemberRole(userId: string, organizationId: string): Promise<OrganizationRole | null> {
    const membership = await this.members.findOne({
      where: { userId, organizationId },
    });
    return membership?.role ?? null;
  }

  async assertMember(userId: string, organizationId: string): Promise<Organization> {
    const role = await this.getMemberRole(userId, organizationId);
    if (!role) throw Errors.forbidden('You are not a member of this organization');
    const organization = await this.organizations.findOne({ where: { id: organizationId } });
    if (!organization) throw Errors.notFound('Organization not found');
    return organization;
  }

  async assertAdmin(userId: string, organizationId: string): Promise<void> {
    const role = await this.getMemberRole(userId, organizationId);
    if (role !== 'owner' && role !== 'admin') {
      throw Errors.forbidden('Owner or admin role required');
    }
  }

  async assertOwner(userId: string, organizationId: string): Promise<void> {
    const role = await this.getMemberRole(userId, organizationId);
    if (role !== 'owner') throw Errors.forbidden('Owner role required');
  }

  async getForUser(userId: string, organizationId: string): Promise<Organization> {
    return this.assertMember(userId, organizationId);
  }

  async update(userId: string, organizationId: string, name: string): Promise<Organization> {
    await this.assertAdmin(userId, organizationId);
    const organization = await this.organizations.findOne({ where: { id: organizationId } });
    if (!organization) throw Errors.notFound('Organization not found');
    organization.name = name.trim();
    return this.organizations.save(organization);
  }

  async listMembers(userId: string, organizationId: string): Promise<OrganizationMember[]> {
    await this.assertMember(userId, organizationId);
    return this.members.find({
      where: { organizationId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });
  }

  /** Adds an already-registered user to the organization. */
  async addMember(
    userId: string,
    organizationId: string,
    email: string,
    role: OrganizationRole,
  ): Promise<OrganizationMember> {
    await this.assertAdmin(userId, organizationId);
    if (role === 'owner') throw Errors.validation('Ownership can only be transferred explicitly');

    const usersRepository = this.dataSource.getRepository(User);
    const user = await usersRepository.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) throw Errors.notFound('No registered user with that email');

    const existing = await this.members.findOne({
      where: { organizationId, userId: user.id },
    });
    if (existing) throw Errors.conflict('User is already a member');

    return this.members.save(this.members.create({ organizationId, userId: user.id, role }));
  }

  async updateMemberRole(
    userId: string,
    organizationId: string,
    memberId: string,
    role: OrganizationRole,
  ): Promise<void> {
    await this.assertOwner(userId, organizationId);
    if (role === 'owner') throw Errors.validation('Use ownership transfer instead');
    const member = await this.members.findOne({ where: { id: memberId, organizationId } });
    if (!member) throw Errors.notFound('Member not found');
    member.role = role;
    await this.members.save(member);
  }

  async removeMember(userId: string, organizationId: string, memberId: string): Promise<void> {
    await this.assertAdmin(userId, organizationId);
    const member = await this.members.findOne({ where: { id: memberId, organizationId } });
    if (!member) throw Errors.notFound('Member not found');
    if (member.role === 'owner') throw Errors.forbidden('The owner cannot be removed');
    if (member.userId === userId) throw Errors.forbidden('You cannot remove yourself');
    await this.members.remove(member);
  }

  async transferOwnership(
    userId: string,
    organizationId: string,
    newOwnerMemberId: string,
  ): Promise<void> {
    await this.assertOwner(userId, organizationId);
    const newOwner = await this.members.findOne({
      where: { id: newOwnerMemberId, organizationId },
    });
    if (!newOwner) throw Errors.notFound('Member not found');

    await this.dataSource.transaction(async (manager) => {
      const current = await manager.findOne(OrganizationMember, {
        where: { userId, organizationId },
      });
      if (current) {
        current.role = 'admin';
        await manager.save(current);
      }
      newOwner.role = 'owner';
      await manager.save(newOwner);
    });
  }

  /** Returns an organization the user can administrate, for bootstrap flows. */
  async findDefaultAdminOrganization(userId: string): Promise<Organization | null> {
    const membership = await this.members.findOne({
      where: { userId, role: 'owner' },
      relations: { organization: true },
    });
    return membership?.organization ?? null;
  }

  async countMembers(organizationId: string): Promise<number> {
    return this.members.count({ where: { organizationId } });
  }
}
