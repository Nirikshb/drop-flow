import { fileURLToPath } from 'node:url';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Owns the single database connection for the modular monolith.
 *
 * `synchronize` and `migrationsRun` are deliberately false: schema changes
 * must be explicit, reviewed migrations, never an implicit side effect of
 * booting the app. Phase 2 adds the concrete migrations.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') === 'development';
        return {
          type: 'postgres' as const,
          url: config.getOrThrow<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: false,
          migrations: [fileURLToPath(new URL('./migrations/*.js', import.meta.url))],
          logging: isDev ? (['error', 'warn', 'schema'] as const) : (['error'] as const),
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
