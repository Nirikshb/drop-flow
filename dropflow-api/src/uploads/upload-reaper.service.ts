import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { UploadsService } from './uploads.service.js';

const REAP_INTERVAL_MS = 60_000;

/**
 * Periodic sweep for abandoned uploads. A plain interval keeps the module free
 * of extra dependencies; overlapping runs are prevented locally and the
 * database `SKIP LOCKED` clause makes the sweep safe across API instances.
 */
@Injectable()
export class UploadReaperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('UploadReaperService');
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(private readonly uploads: UploadsService) {}

  onModuleInit(): void {
    this.timer = setInterval(() => void this.sweep(), REAP_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async sweep(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const reaped = await this.uploads.reapExpiredSessions();
      if (reaped > 0) this.logger.log(`Reaped ${reaped} expired upload session(s)`);
    } catch (error) {
      this.logger.error('Expired-upload sweep failed; will retry', String(error));
    } finally {
      this.running = false;
    }
  }
}
