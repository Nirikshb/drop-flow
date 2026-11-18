import { MigrationInterface, QueryRunner } from 'typeorm';

/** Creates the complete Dropflow schema. Source of truth for local + production. */
export class InitialSchema1763472000000 implements MigrationInterface {
  name = 'InitialSchema1763472000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "full_name" varchar NOT NULL,
        "email_verified_at" timestamptz,
        "email_verification_token_hash" varchar,
        "email_verification_expires_at" timestamptz,
        "password_reset_token_hash" varchar,
        "password_reset_expires_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "user_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "session_token_hash" varchar NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "revoked_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_sessions_token" UNIQUE ("session_token_hash"),
        CONSTRAINT "FK_sessions_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_user" ON "user_sessions" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_expires" ON "user_sessions" ("expires_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_revoked" ON "user_sessions" ("revoked_at")`);

    await queryRunner.query(`
      CREATE TABLE "organizations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "slug" varchar NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_organizations_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "organization_members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" varchar NOT NULL DEFAULT 'member',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_member_org_user" UNIQUE ("organization_id", "user_id"),
        CONSTRAINT "CHK_member_role" CHECK ("role" IN ('owner','admin','member')),
        CONSTRAINT "FK_members_org" FOREIGN KEY ("organization_id")
          REFERENCES "organizations"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_members_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_members_org" ON "organization_members" ("organization_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_members_user" ON "organization_members" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "organization_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "public_key" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'active',
        "max_file_size" bigint NOT NULL DEFAULT 52428800,
        "allowed_mime_types" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_projects_public_key" UNIQUE ("public_key"),
        CONSTRAINT "CHK_project_status" CHECK ("status" IN ('active','disabled','suspended')),
        CONSTRAINT "FK_projects_org" FOREIGN KEY ("organization_id")
          REFERENCES "organizations"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_projects_org" ON "projects" ("organization_id")`);

    await queryRunner.query(`
      CREATE TABLE "api_keys" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "name" varchar NOT NULL,
        "key_prefix" varchar NOT NULL,
        "key_hash" varchar NOT NULL,
        "last_used_at" timestamptz,
        "revoked_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_api_keys_hash" UNIQUE ("key_hash"),
        CONSTRAINT "FK_keys_project" FOREIGN KEY ("project_id")
          REFERENCES "projects"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_keys_project" ON "api_keys" ("project_id")`);

    await queryRunner.query(`
      CREATE TABLE "assets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "object_key" varchar NOT NULL,
        "original_filename" varchar NOT NULL,
        "mime_type" varchar NOT NULL,
        "size_bytes" bigint NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "checksum" varchar,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "UQ_assets_object_key" UNIQUE ("object_key"),
        CONSTRAINT "CHK_asset_status" CHECK ("status" IN ('pending','uploading','completed','failed','expired','deleted')),
        CONSTRAINT "FK_assets_project" FOREIGN KEY ("project_id")
          REFERENCES "projects"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_assets_project" ON "assets" ("project_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_assets_created" ON "assets" ("created_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_assets_deleted" ON "assets" ("deleted_at")`);

    await queryRunner.query(`
      CREATE TABLE "upload_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "asset_id" uuid,
        "object_key" varchar NOT NULL,
        "expected_size" bigint NOT NULL,
        "declared_mime_type" varchar NOT NULL,
        "original_filename" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "expires_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "completed_at" timestamptz,
        CONSTRAINT "UQ_sessions_object_key" UNIQUE ("object_key"),
        CONSTRAINT "UQ_sessions_asset" UNIQUE ("asset_id"),
        CONSTRAINT "CHK_session_status" CHECK ("status" IN ('pending','uploading','completed','failed','expired','deleted')),
        CONSTRAINT "FK_sessions_project" FOREIGN KEY ("project_id")
          REFERENCES "projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sessions_asset" FOREIGN KEY ("asset_id")
          REFERENCES "assets"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_project" ON "upload_sessions" ("project_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_expires_at" ON "upload_sessions" ("expires_at")`);

    await queryRunner.query(`
      CREATE TABLE "usage_events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "asset_id" uuid,
        "event_type" varchar NOT NULL,
        "size_bytes" bigint NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "FK_usage_project" FOREIGN KEY ("project_id")
          REFERENCES "projects"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_usage_asset" FOREIGN KEY ("asset_id")
          REFERENCES "assets"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_usage_project" ON "usage_events" ("project_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_usage_created" ON "usage_events" ("created_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usage_events"`);
    await queryRunner.query(`DROP TABLE "upload_sessions"`);
    await queryRunner.query(`DROP TABLE "assets"`);
    await queryRunner.query(`DROP TABLE "api_keys"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "organization_members"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "user_sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
