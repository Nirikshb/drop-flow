import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from '../assets/asset.entity.js';
import { Project } from '../projects/project.entity.js';

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed' | 'expired' | 'deleted';

@Entity('upload_sessions')
export class UploadSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'asset_id', type: 'uuid', nullable: true, unique: true })
  assetId!: string | null;

  @ManyToOne(() => Asset, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset | null;

  @Column({ name: 'object_key', type: 'varchar', unique: true })
  objectKey!: string;

  @Column({ name: 'expected_size', type: 'bigint' })
  expectedSize!: string;

  @Column({ name: 'declared_mime_type', type: 'varchar' })
  declaredMimeType!: string;

  @Column({ name: 'original_filename', type: 'varchar' })
  originalFilename!: string;

  @Column({ type: 'varchar', default: 'pending' })
  status!: UploadStatus;

  @Index()
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;
}
