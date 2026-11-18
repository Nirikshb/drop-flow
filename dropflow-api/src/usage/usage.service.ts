import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Asset } from '../assets/asset.entity.js';
import { OrganizationsService } from '../organizations/organizations.service.js';
import { ProjectsService } from '../projects/projects.service.js';
import { PLAN_LIMITS } from './plan-limits.js';
import { UsageEvent } from './usage-event.entity.js';

@Injectable()
export class UsageService {
  constructor(
    @InjectRepository(Asset) private readonly assets: Repository<Asset>,
    @InjectRepository(UsageEvent) private readonly events: Repository<UsageEvent>,
    private readonly projects: ProjectsService,
    private readonly organizations: OrganizationsService,
  ) {}

  async getUsage(userId: string, projectId: string) {
    const project = await this.projects.getForUser(userId, projectId);
    const organization = await this.organizations.getForUser(userId, project.organizationId);

    const totals = await this.assets
      .createQueryBuilder('asset')
      .select('COALESCE(SUM(asset.size_bytes), 0)', 'storageBytes')
      .addSelect('COUNT(*)', 'assetCount')
      .where('asset.project_id = :projectId', { projectId })
      .andWhere('asset.deleted_at IS NULL')
      .getRawOne<{ storageBytes: string; assetCount: string }>();

    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);

    const monthlyTotals = await this.events
      .createQueryBuilder('event')
      .select('COALESCE(SUM(event.size_bytes), 0)', 'uploadBytes')
      .addSelect('COUNT(*)', 'uploadCount')
      .where('event.project_id = :projectId', { projectId })
      .andWhere("event.event_type = 'upload.completed'")
      .andWhere('event.created_at >= :monthStart', { monthStart })
      .getRawOne<{ uploadBytes: string; uploadCount: string }>();

    const requestCount = await this.events.count({
      where: { projectId, eventType: 'request' },
    });

    const sixMonthsAgo = new Date(monthStart);
    sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 5);
    const history = await this.events
      .createQueryBuilder('event')
      .select("to_char(date_trunc('month', event.created_at), 'Mon')", 'month')
      .addSelect('COUNT(*)', 'uploads')
      .addSelect('COALESCE(SUM(event.size_bytes), 0)', 'bytes')
      .where('event.project_id = :projectId', { projectId })
      .andWhere("event.event_type = 'upload.completed'")
      .andWhere('event.created_at >= :from', { from: sixMonthsAgo })
      .groupBy("date_trunc('month', event.created_at)")
      .orderBy("date_trunc('month', event.created_at)", 'ASC')
      .getRawMany<{ month: string; uploads: string; bytes: string }>();

    const plan = organization.plan;
    return {
      storageBytes: Number(totals?.storageBytes ?? 0),
      assetCount: Number(totals?.assetCount ?? 0),
      uploadCount: Number(monthlyTotals?.uploadCount ?? 0),
      uploadBytes: Number(monthlyTotals?.uploadBytes ?? 0),
      requestCount,
      plan,
      limits: PLAN_LIMITS[plan],
      monthly: history.map((row) => ({
        month: row.month,
        uploads: Number(row.uploads),
        bytes: Number(row.bytes),
      })),
    };
  }

  async getActivity(userId: string, projectId: string) {
    await this.projects.getForUser(userId, projectId);
    const events = await this.events.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return events.map((event) => ({
      id: event.id,
      type: event.eventType,
      description: describe(event),
      createdAt: event.createdAt,
    }));
  }

  /** Counts asset rows still present, used by safe-delete checks. */
  async liveAssetCount(projectId: string): Promise<number> {
    return this.assets.count({ where: { projectId, deletedAt: IsNull() } });
  }
}

function describe(event: UsageEvent): string {
  const size = (Number(event.sizeBytes) / 1_000_000).toFixed(1);
  switch (event.eventType) {
    case 'upload.completed': return `${size} MB of new assets saved`;
    case 'asset.deleted': return `${size} MB of assets removed`;
    case 'request': return 'API request recorded';
    default: return 'Usage adjusted';
  }
}
