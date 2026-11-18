import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ApiKey } from '../api-keys/api-key.entity.js';
import { Asset } from '../assets/asset.entity.js';
import { Organization } from '../organizations/organization.entity.js';
import { Project } from '../projects/project.entity.js';
import { UploadSession } from '../uploads/upload-session.entity.js';
import { User } from '../users/user.entity.js';
import { UsageEvent } from '../usage/usage-event.entity.js';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Asset) private readonly assets: Repository<Asset>,
    @InjectRepository(UploadSession) private readonly sessions: Repository<UploadSession>,
    @InjectRepository(ApiKey) private readonly keys: Repository<ApiKey>,
    @InjectRepository(UsageEvent) private readonly events: Repository<UsageEvent>,
  ) {}

  async overview() {
    const [userCount, organizationCount, projectCount, assetCount, failures] = await Promise.all([
      this.userRepo.count(),
      this.orgRepo.count(),
      this.projectRepo.count(),
      this.assets.count(),
      this.sessions.count({ where: { status: 'failed' } }),
    ]);
    const storage = await this.assets
      .createQueryBuilder('asset')
      .select('COALESCE(SUM(asset.size_bytes), 0)', 'total')
      .where('asset.deleted_at IS NULL')
      .getRawOne<{ total: string }>();
    return {
      users: userCount,
      organizations: organizationCount,
      projects: projectCount,
      assets: assetCount,
      failedUploads: failures,
      storageBytes: Number(storage?.total ?? 0),
    };
  }

  async customers() {
    const users = await this.userRepo.find({ order: { createdAt: 'DESC' }, take: 200 });
    return Promise.all(users.map(async (user) => {
      const storage = await this.assets
        .createQueryBuilder('asset')
        .select('COUNT(*)', 'count')
        .addSelect('COALESCE(SUM(asset.size_bytes), 0)', 'bytes')
        .innerJoin('asset.project', 'project')
        .innerJoin('organization_members', 'member', 'member.organization_id = project.organization_id')
        .where('member.user_id = :userId', { userId: user.id })
        .getRawOne<{ count: string; bytes: string }>();
      return {
        id: user.id,
        email: user.email,
        name: user.fullName,
        emailVerified: Boolean(user.emailVerifiedAt),
        createdAt: user.createdAt,
        assetCount: Number(storage?.count ?? 0),
        storageBytes: Number(storage?.bytes ?? 0),
      };
    }));
  }

  async organizations() {
    const organizations = await this.orgRepo.find({ order: { createdAt: 'DESC' }, take: 200 });
    return Promise.all(organizations.map(async (organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      createdAt: organization.createdAt,
      projectCount: await this.projectRepo.count({ where: { organizationId: organization.id } }),
    })));
  }

  async projects() {
    const projects = await this.projectRepo.find({ order: { createdAt: 'DESC' }, take: 200 });
    return Promise.all(projects.map(async (project) => ({
      id: project.id,
      name: project.name,
      organizationId: project.organizationId,
      status: project.status,
      publicKeyPrefix: project.publicKey.slice(0, 16),
      createdAt: project.createdAt,
      assetCount: await this.assets.count({ where: { projectId: project.id } }),
    })));
  }

  async uploadFailures() {
    const sessions = await this.sessions.find({
      where: [{ status: 'failed' }, { status: 'expired' }],
      order: { createdAt: 'DESC' },
      take: 200,
    });
    return sessions.map((session) => ({
      id: session.id,
      projectId: session.projectId,
      originalFilename: session.originalFilename,
      expectedSize: Number(session.expectedSize),
      status: session.status,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  }

  async suspiciousActivity() {
    const revokedKeys = await this.keys.count({ where: { revokedAt: IsNull() } });
    const failures = await this.sessions.count({ where: { status: 'failed' } });
    const events = await this.events.count({ where: { eventType: 'asset.deleted' } });
    return {
      activeKeys: revokedKeys,
      failedUploads: failures,
      assetDeletions: events,
      note: 'Counts are derived from persisted rows; no behavioural profiling is performed.',
    };
  }
}
