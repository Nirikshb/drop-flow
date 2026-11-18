import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountDeletion1763481000000 implements MigrationInterface {
  name = 'AccountDeletion1763481000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "deletion_requested_at" timestamptz`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletion_requested_at"`);
  }
}
