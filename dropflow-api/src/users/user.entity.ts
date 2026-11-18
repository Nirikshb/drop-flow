import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash!: string;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName!: string;

  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: 'email_verification_token_hash', type: 'varchar', nullable: true })
  emailVerificationTokenHash!: string | null;

  @Column({ name: 'email_verification_expires_at', type: 'timestamptz', nullable: true })
  emailVerificationExpiresAt!: Date | null;

  @Column({ name: 'password_reset_token_hash', type: 'varchar', nullable: true })
  passwordResetTokenHash!: string | null;

  @Column({ name: 'password_reset_expires_at', type: 'timestamptz', nullable: true })
  passwordResetExpiresAt!: Date | null;

  @Column({ name: 'deletion_requested_at', type: 'timestamptz', nullable: true })
  deletionRequestedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
