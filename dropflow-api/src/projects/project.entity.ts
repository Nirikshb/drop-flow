import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity.js';

export type ProjectStatus = 'active' | 'disabled' | 'suspended';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @ManyToOne(() => Organization, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ name: 'public_key', type: 'varchar', unique: true })
  publicKey!: string;

  @Column({ type: 'varchar', default: 'active' })
  status!: ProjectStatus;

  @Column({ name: 'max_file_size', type: 'bigint', default: 52428800 })
  maxFileSize!: string;

  @Column({ name: 'allowed_mime_types', type: 'jsonb', default: () => "'[]'::jsonb" })
  allowedMimeTypes!: string[];

  /** Browser origins allowed to call `/v1/uploads` with this project's public key. */
  @Column({ name: 'allowed_origins', type: 'jsonb', default: () => "'[]'::jsonb" })
  allowedOrigins!: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
