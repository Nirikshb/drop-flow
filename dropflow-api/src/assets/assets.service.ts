import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Errors } from '../common/errors.js';
import { STORAGE_SERVICE, type StorageService } from '../storage/storage.interface.js';
import { UsageEvent } from '../usage/usage-event.entity.js';
import { toAssetDto } from './asset.dto.js';
import { Asset } from './asset.entity.js';

const DOWNLOAD_URL_TTL_SECONDS = 15 * 60;

export interface ListAssetsQuery {
  projectId: string;
  search?: string;
  mimeType?: string;
  sort?: 'newest' | 'oldest' | 'largest' | 'name';
  limit?: number;
  offset?: number;
}

@Injectable()
export class AssetsService {
  private readonly logger = new Logger('AssetsService');

  constructor(
    @InjectRepository(Asset) private readonly assets: Repository<Asset>,
    @InjectRepository(UsageEvent) private readonly usageEvents: Repository<UsageEvent>,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
    private readonly dataSource: DataSource,
  ) {}

  /** Private buckets: every response carries a short-lived signed GET URL. */
  private async toDto(asset: Asset) {
    const signed = await this.storage.createSignedDownloadUrl(
      asset.objectKey,
      DOWNLOAD_URL_TTL_SECONDS,
      { responseContentType: asset.mimeType, downloadFilename: asset.originalFilename },
    );
    return toAssetDto(asset, signed.url);
  }

  async list(query: ListAssetsQuery) {
    const limit = Math.min(Math.max(query.limit ?? 24, 1), 100);
    const offset = Math.max(query.offset ?? 0, 0);

    const qb = this.assets.createQueryBuilder('asset')
      .where('asset.project_id = :projectId', { projectId: query.projectId })
      .andWhere('asset.deleted_at IS NULL');

    if (query.search) {
      qb.andWhere('asset.original_filename ILIKE :search', {
        search: `%${query.search.replace(/[%"_\\]/g, '\\$&')}%`,
      });
    }
    if (query.mimeType) {
      if (query.mimeType.endsWith('/*')) {
        qb.andWhere('asset.mime_type LIKE :mime', { mime: `${query.mimeType.slice(0, -1)}%` });
      } else {
        qb.andWhere('asset.mime_type = :mime', { mime: query.mimeType });
      }
    }

    switch (query.sort) {
      case 'oldest': qb.orderBy('asset.created_at', 'ASC'); break;
      case 'largest': qb.orderBy('asset.size_bytes', 'DESC'); break;
      case 'name': qb.orderBy('asset.original_filename', 'ASC'); break;
      default: qb.orderBy('asset.created_at', 'DESC');
    }

    const rows = await qb.skip(offset).take(limit + 1).getMany();
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    const dtos = await Promise.all(data.map((asset) => this.toDto(asset)));

    return {
      data: dtos,
      nextCursor: hasMore ? String(offset + limit) : null,
      hasMore,
    };
  }

  async get(projectId: string, assetId: string) {
    const asset = await this.assets.findOne({
      where: { id: assetId, projectId, deletedAt: IsNull() },
    });
    if (!asset || asset.deletedAt) throw Errors.notFound('Asset not found');
    return this.toDto(asset);
  }

  async delete(projectId: string, assetId: string): Promise<{ success: boolean }> {
    const asset = await this.assets.findOne({
      where: { id: assetId, projectId, deletedAt: IsNull() },
    });
    if (!asset || asset.deletedAt) throw Errors.notFound('Asset not found');

    await this.dataSource.transaction(async (manager) => {
      const current = await manager.findOne(Asset, { where: { id: assetId } });
      if (!current || current.deletedAt) throw Errors.notFound('Asset not found');
      current.deletedAt = new Date();
      current.status = 'deleted';
      await manager.save(current);
      await manager.save(manager.create(UsageEvent, {
        projectId,
        assetId,
        eventType: 'asset.deleted',
        sizeBytes: `-${current.sizeBytes}`,
      }));
    });

    // Storage deletion happens after the database commit. If R2 is briefly
    // unavailable the object is logged for the operator but customer data is
    // never lost and the row stays soft-deleted — safe, recoverable behaviour.
    try {
      await this.storage.deleteObject(asset.objectKey);
    } catch (error) {
      this.logger.error(`Failed to remove object ${asset.objectKey}`, String(error));
    }
    return { success: true };
  }
}
