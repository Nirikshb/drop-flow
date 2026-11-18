import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalStorageController } from './local-storage.controller.js';
import { LocalStorageService } from './local-storage.service.js';
import { R2StorageService } from './r2-storage.service.js';
import { STORAGE_SERVICE, type StorageService } from './storage.interface.js';

const R2_ENV_KEYS = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_ENDPOINT',
] as const;

/**
 * True when the local adapter (and therefore its HTTP surface) is active.
 *
 * Deliberately reads `process.env`: module metadata is evaluated before Nest
 * bootstraps ConfigModule, so `main.ts` loads dotenv before importing AppModule.
 */
export function isLocalStorageEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const configured = R2_ENV_KEYS.every((key) => Boolean(env[key]));
  return !configured && env['NODE_ENV'] !== 'production';
}

/**
 * Storage is registered dynamically so that the local HTTP controller — which
 * accepts raw PUT bodies and serves signed downloads — cannot exist in
 * production or when R2 is configured.
 */
@Global()
@Module({})
export class StorageModule {
  static register(): DynamicModule {
    const useLocal = isLocalStorageEnabled();
    return {
      module: StorageModule,
      global: true,
      controllers: useLocal ? [LocalStorageController] : [],
      providers: [
        LocalStorageService,
        {
          provide: STORAGE_SERVICE,
          inject: [ConfigService, LocalStorageService],
          useFactory: (config: ConfigService, local: LocalStorageService): StorageService => {
            const configured = R2_ENV_KEYS.every((key) => Boolean(config.get<string>(key)));
            if (configured) return new R2StorageService(config);
            if (config.get<string>('NODE_ENV') === 'production') {
              throw new Error('R2 credentials are required in production');
            }
            return local;
          },
        },
      ],
      exports: [STORAGE_SERVICE, LocalStorageService],
    };
  }
}
