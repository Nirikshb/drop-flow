import 'reflect-metadata';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

/**
 * Standalone DataSource used by migration and seed scripts (outside Nest DI).
 * Globs accept both .ts (tsx) and .js (compiled dist) files.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'],
  entities: [fileURLToPath(new URL('../**/*.entity{.ts,.js}', import.meta.url))],
  migrations: [fileURLToPath(new URL('./migrations/*{.ts,.js}', import.meta.url))],
  synchronize: false,
  logging: false,
});
