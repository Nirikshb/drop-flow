import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity.js';
import { toAssetDto } from '../assets/asset.dto.js';
import { Errors } from '../common/errors.js';
import {
  baseMimeType,
  isMimeAllowed,
  isWildcardMimeType,
} from '../common/mime-policy.js';
import { randomToken } from '../common/utilities/crypto.js';
import { Organization } from '../organizations/organization.entity.js';
import { Project } from '../projects/project.entity.js';
import { ProjectsService } from '../projects/projects.service.js';
import { STORAGE_SERVICE, type StorageService } from '../storage/storage.interface.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { PLAN_LIMITS, type Plan } from '../usage/plan-limits.js';
import { UploadSession } from './upload-session.entity.js';
import type { InitUploadDto } from './dto/upload.dto.js';

const SESSION_TTL_SECONDS = 15 * 60;
const DOWNLOAD_URL_TTL_SECONDS = 15 * 60;
const REAP_BATCH_SIZE = 100;

@Injectable()
export class UploadsService {
  private readonly logger = new Logger('UploadsService');

  constructor(
    @InjectRepository(UploadSession) private readonly sessions: Repository<UploadSession>,
    @InjectRepository(Asset) private readonly assets: Repository<Asset>,
    @InjectRepository(UsageEvent) private readonly usageEvents: Repository<UsageEvent>,
    private readonly projects: ProjectsService,
    private readonly dataSource: DataSource,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  private async committedBytes(manager: EntityManager, organizationId: string): Promise<number> {
    const row = await manager
      .createQueryBuilder(Asset, 'asset')
      .innerJoin(Project, 'project', 'project.id = asset.project_id')
      .select('COALESCE(SUM(asset.size_bytes), 0)', 'total')
      .where('project.organization_id = :organizationId', { organizationId })
      .andWhere('asset.deleted_at IS NULL')
      .getRawOne<{ total: string }>();
    return Number(row?.total ?? 0);
  }

  /** Bytes promised by in-flight sessions; they are deducted from the allowance. */
  private async reservedBytes(manager: EntityManager, organizationId: string): Promise<number> {
    const row = await manager
      .createQueryBuilder(UploadSession, 'session')
      .innerJoin(Project, 'project', 'project.id = session.project_id')
      .select('COALESCE(SUM(session.expected_size), 0)', 'total')
      .where('project.organization_id = :organizationId', { organizationId })
      .andWhere("session.status IN ('pending', 'uploading')")
      .andWhere('session.expires_at > :now', { now: new Date() })
      .getRawOne<{ total: string }>();
    return Number(row?.total ?? 0);
  }

  private async monthlyUploads(manager: EntityManager, organizationId: string): Promise<number> {
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    return manager
      .createQueryBuilder(UsageEvent, 'event')
      .innerJoin(Project, 'project', 'project.id = event.project_id')
      .where('project.organization_id = :organizationId', { organizationId })
      .andWhere("event.event_type = 'upload.completed'")
      .andWhere('event.created_at >= :start', { start })
      .getCount();
  }

  async init(projectId: string, dto: InitUploadDto) {
    const project = await this.projects.findById(projectId);
    if (!project) throw Errors.notFound('Project not found');
    if (project.status !== 'active') throw Errors.projectInactive();

    const declaredType = baseMimeType(dto.mimeType);
    if (isWildcardMimeType(declaredType)) {
      throw Errors.uploadInvalid('Wildcard MIME types cannot be declared');
    }
    if (!isMimeAllowed(project.allowedMimeTypes, declaredType)) {
      throw Errors.uploadInvalid('This file type is not allowed for the project');
    }
    if (dto.size > Number(project.maxFileSize)) {
      throw Errors.quota(`File exceeds the project limit of ${project.maxFileSize} bytes`);
    }

    // Customer filenames are metadata only — never used as storage keys.
    const objectKey = `projects/${projectId}/${randomToken(18)}`;

    // The organization row is the quota ledger. Locking it serialises concurrent
    // uploads so two requests cannot both spend the last free byte.
    const session = await this.dataSource.transaction(async (manager) => {
      const organization = await manager.findOne(Organization, {
        where: { id: project.organizationId },
        lock: { mode: 'pessimistic_write' },
      });
      const plan: Plan = organization?.plan ?? 'free';
      const limits = PLAN_LIMITS[plan];

      const committed = await this.committedBytes(manager, project.organizationId);
      const reserved = await this.reservedBytes(manager, project.organizationId);
      if (committed + reserved + dto.size > limits.storageBytes) {
        throw Errors.quota('Organization storage allowance exceeded');
      }

      const monthly = await this.monthlyUploads(manager, project.organizationId);
      if (monthly >= limits.monthlyUploads) {
        throw Errors.quota('Organization monthly upload allowance exceeded');
      }

      const created = manager.create(UploadSession, {
        projectId,
        objectKey,
        expectedSize: String(dto.size),
        declaredMimeType: declaredType,
        originalFilename: dto.originalFilename,
        status: 'pending',
        expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000),
        assetId: null,
        completedAt: null,
      });
      return manager.save(created);
    });

    try {
      const signed = await this.storage.createSignedUploadUrl(
        objectKey, declaredType, SESSION_TTL_SECONDS, dto.size,
      );
      return {
        id: session.id,
        objectKey,
        uploadUrl: signed.url,
        method: signed.method,
        headers: signed.headers,
        expiresAt: signed.expiresAt.toISOString(),
      };
    } catch (error) {
      await this.sessions.update({ id: session.id }, { status: 'failed' });
      throw error;
    }
  }

  async start(projectId: string, sessionId: string): Promise<void> {
    const session = await this.sessions.findOne({ where: { id: sessionId, projectId } });
    if (!session) throw Errors.notFound('Upload session not found');
    if (session.expiresAt.getTime() <= Date.now()) throw Errors.uploadExpired();
    if (session.status === 'completed') return;
    if (session.status === 'pending') {
      await this.sessions.update({ id: sessionId }, { status: 'uploading' });
    }
  }

  /** Idempotent: repeated calls return the same asset and never double-count. */
  async complete(projectId: string, sessionId: string, checksum?: string) {
    const initial = await this.sessions.findOne({ where: { id: sessionId, projectId } });
    if (!initial) throw Errors.notFound('Upload session not found');

    if (initial.status === 'completed' && initial.assetId) {
      const existing = await this.assets.findOne({ where: { id: initial.assetId } });
      if (existing) return this.toDto(existing);
      throw Errors.notFound('Asset not found');
    }
    if (initial.expiresAt.getTime() <= Date.now()) {
      await this.discard(initial, 'expired');
      throw Errors.uploadExpired();
    }
    if (initial.status === 'failed' || initial.status === 'expired' || initial.status === 'deleted') {
      throw Errors.uploadInvalid(`Upload session is ${initial.status}`);
    }

    // A successful completion call is NOT proof the bytes arrived: verify the
    // object in storage before finalising anything.
    const metadata = await this.storage.headObject(initial.objectKey);
    if (!metadata) {
      await this.discard(initial, 'failed');
      throw Errors.uploadInvalid('Uploaded object was not found in storage');
    }
    if (metadata.size !== Number(initial.expectedSize)) {
      await this.discard(initial, 'failed');
      throw Errors.uploadInvalid(
        `Size mismatch: expected ${initial.expectedSize} bytes, found ${metadata.size}`,
      );
    }

    const actualType = baseMimeType(metadata.contentType);
    const declaredType = baseMimeType(initial.declaredMimeType);
    if (declaredType !== actualType) {
      await this.discard(initial, 'failed');
      throw Errors.uploadInvalid('Uploaded content type does not match the declaration');
    }

    const project = await this.projects.findById(projectId);
    if (!project) throw Errors.notFound('Project not found');
    if (!isMimeAllowed(project.allowedMimeTypes, actualType)) {
      await this.discard(initial, 'failed');
      throw Errors.uploadInvalid('This file type is not allowed for the project');
    }

    const asset = await this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(UploadSession, {
        where: { id: sessionId, projectId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!session) throw Errors.notFound('Upload session not found');

      if (session.status === 'completed' && session.assetId) {
        const existing = await manager.findOne(Asset, { where: { id: session.assetId } });
        if (existing) return existing;
        throw Errors.notFound('Asset not found');
      }

      const created = await manager.save(manager.create(Asset, {
        projectId,
        objectKey: session.objectKey,
        originalFilename: session.originalFilename,
        mimeType: actualType,
        sizeBytes: String(metadata.size),
        status: 'completed',
        checksum: checksum ?? null,
        deletedAt: null,
      }));

      session.status = 'completed';
      session.assetId = created.id;
      session.completedAt = new Date();
      await manager.save(session);

      await manager.save(manager.create(UsageEvent, {
        projectId,
        assetId: created.id,
        eventType: 'upload.completed',
        sizeBytes: String(metadata.size),
      }));

      return created;
    });

    return this.toDto(asset);
  }

  async fail(projectId: string, sessionId: string): Promise<void> {
    const session = await this.sessions.findOne({ where: { id: sessionId, projectId } });
    if (!session) throw Errors.notFound('Upload session not found');
    if (session.status === 'completed' || session.status === 'failed' || session.status === 'expired') {
      return;
    }
    await this.discard(session, 'failed');
  }

  /**
   * Marks expired sessions and removes their objects. Runs on an interval, so
   * abandoned uploads never become permanent orphaned storage.
   *
   * `FOR UPDATE SKIP LOCKED` makes the sweep safe with several API instances;
   * deleting inside the transaction means a storage failure rolls the status
   * back and the next tick retries instead of silently leaking the object.
   */
  async reapExpiredSessions(limit = REAP_BATCH_SIZE): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const rows = await manager
        .createQueryBuilder(UploadSession, 'session')
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .where("session.status IN ('pending', 'uploading')")
        .andWhere('session.expires_at <= :now', { now: new Date() })
        .orderBy('session.expires_at', 'ASC')
        .take(limit)
        .getMany();

      for (const session of rows) {
        await this.storage.deleteObject(session.objectKey);
        session.status = 'expired';
      }
      if (rows.length > 0) await manager.save(rows);
      return rows.length;
    });
  }

  /**
   * Removes bytes for a session that will never become an asset. If storage is
   * unavailable the session is left for the reaper rather than marked failed —
   * marking it failed would make the orphan permanent.
   */
  private async discard(session: UploadSession, status: 'failed' | 'expired'): Promise<void> {
    try {
      await this.storage.deleteObject(session.objectKey);
    } catch (error) {
      this.logger.error(
        `Could not remove object for session ${session.id}; reaper will retry`,
        String(error),
      );
      return;
    }
    await this.sessions.update({ id: session.id }, { status });
  }

  private async toDto(asset: Asset) {
    const signed = await this.storage.createSignedDownloadUrl(
      asset.objectKey,
      DOWNLOAD_URL_TTL_SECONDS,
      { responseContentType: asset.mimeType, downloadFilename: asset.originalFilename },
    );
    return toAssetDto(asset, signed.url);
  }
}
