import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity.js';
import { AppError, Errors } from '../common/errors.js';
import { baseMimeType, isWildcardMimePattern } from '../common/mime-policy.js';
import { randomToken } from '../common/utilities/crypto.js';
import { Organization } from '../organizations/organization.entity.js';
import { OrganizationsService } from '../organizations/organizations.service.js';
import { STORAGE_SERVICE, type StorageService } from '../storage/storage.interface.js';
import { PLAN_LIMITS, type Plan } from '../usage/plan-limits.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { Project, ProjectStatus } from './project.entity.js';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectsService');

  constructor(
    @InjectRepository(Project) private readonly projects: Repository<Project>,
    @InjectRepository(Asset) private readonly assets: Repository<Asset>,
    @InjectRepository(UsageEvent) private readonly usageEvents: Repository<UsageEvent>,
    private readonly organizations: OrganizationsService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async create(userId: string, organizationId: string, name: string): Promise<Project> {
    await this.organizations.assertAdmin(userId, organizationId);

    // The plan allowance is account-level: count inside a transaction that
    // locks the organization so parallel creates cannot exceed the limit.
    return this.projects.manager.transaction(async (manager) => {
      const organization = await manager.getRepository(Organization).findOne({
        where: { id: organizationId },
        lock: { mode: 'pessimistic_write' },
      });
      const plan: Plan = organization?.plan ?? 'free';
      const existing = await manager.count(Project, { where: { organizationId } });
      if (existing >= PLAN_LIMITS[plan].projects) {
        throw Errors.quota(
          `The ${plan} plan allows ${PLAN_LIMITS[plan].projects} projects`,
        );
      }

      const project = manager.create(Project, {
        organizationId,
        name: name.trim(),
        publicKey: `df_public_${randomToken(16)}`,
        status: 'active',
        maxFileSize: '52428800',
        allowedMimeTypes: [],
        allowedOrigins: [],
      });
      return manager.save(project);
    });
  }

  async listForUser(userId: string): Promise<Project[]> {
    const organizations = await this.organizations.listForUser(userId);
    if (organizations.length === 0) return [];
    return this.projects.find({
      where: organizations.map((organization) => ({ organizationId: organization.id })),
      order: { createdAt: 'DESC' },
    });
  }

  async findById(projectId: string): Promise<Project | null> {
    return this.projects.findOne({ where: { id: projectId } });
  }

  async getForUser(userId: string, projectId: string): Promise<Project> {
    const project = await this.findById(projectId);
    if (!project) throw Errors.notFound('Project not found');
    await this.organizations.assertMember(userId, project.organizationId);
    return project;
  }

  async update(
    userId: string,
    projectId: string,
    input: {
      name?: string;
      status?: ProjectStatus;
      maxFileSize?: number;
      allowedMimeTypes?: string[];
      allowedOrigins?: string[];
    },
  ): Promise<Project> {
    const project = await this.getForUser(userId, projectId);
    await this.organizations.assertAdmin(userId, project.organizationId);

    if (input.name !== undefined) project.name = input.name.trim();
    if (input.status !== undefined) project.status = input.status;
    if (input.maxFileSize !== undefined) project.maxFileSize = String(input.maxFileSize);
    if (input.allowedMimeTypes !== undefined) {
      const normalized = input.allowedMimeTypes.map(baseMimeType);
      if (normalized.some(isWildcardMimePattern)) {
        throw Errors.validation('Wildcard MIME patterns are not accepted');
      }
      project.allowedMimeTypes = [...new Set(normalized)];
    }
    if (input.allowedOrigins !== undefined) {
      project.allowedOrigins = [...new Set(input.allowedOrigins.map(normalizeOrigin))];
    }
    return this.projects.save(project);
  }

  /**
   * Deletion removes every asset row (soft-deleted included) before the
   * project, so foreign keys cannot turn a valid request into a 500.
   */
  async remove(userId: string, projectId: string): Promise<void> {
    const project = await this.getForUser(userId, projectId);
    await this.organizations.assertOwner(userId, project.organizationId);

    const liveAssets = await this.assets.count({
      where: { projectId, deletedAt: IsNull() },
    });
    if (liveAssets > 0) {
      throw Errors.conflict(
        'Delete or move all assets before deleting this project',
      );
    }

    const storedObjects = await this.assets.find({
      where: { projectId },
      select: { id: true, objectKey: true },
    });

    try {
      await this.projects.manager.transaction(async (manager: EntityManager) => {
        await manager.delete(UsageEvent, { projectId });
        await manager.delete(Asset, { projectId });
        await manager.delete(Project, { id: projectId });
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (isForeignKeyViolation(error)) {
        throw Errors.conflict(
          'This project still has related records and could not be deleted',
        );
      }
      throw error;
    }

    for (const asset of storedObjects) {
      try {
        await this.storage.deleteObject(asset.objectKey);
      } catch (error) {
        this.logger.error(
          `Failed to remove object ${asset.objectKey} after project deletion`,
          String(error),
        );
      }
    }
  }
}

export function normalizeOrigin(origin: string): string {
  const trimmed = origin.trim().replace(/\/$/, '');
  if (!/^https?:\/\/[^/\s]+$/i.test(trimmed)) {
    throw Errors.validation(`Invalid origin: ${origin}`);
  }
  return trimmed.toLowerCase();
}

function isForeignKeyViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  return (error as { code?: string }).code === '23503';
}
