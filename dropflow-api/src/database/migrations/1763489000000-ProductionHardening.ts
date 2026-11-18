import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Production hardening: account-level plans, per-project browser origins and
 * the indexes used by quota reservation and the expired-upload reaper.
 */
export class ProductionHardening1763489000000 implements MigrationInterface {
  name = 'ProductionHardening1763489000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD COLUMN IF NOT EXISTS "plan" varchar NOT NULL DEFAULT 'free'`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "allowed_origins" jsonb NOT NULL DEFAULT '[]'::jsonb`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_sessions_status_expires" ON "upload_sessions" ("status", "expires_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_usage_project_type_created" ON "usage_events" ("project_id", "event_type", "created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_usage_project_type_created"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sessions_status_expires"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "allowed_origins"`);
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN IF EXISTS "plan"`);
  }
}
