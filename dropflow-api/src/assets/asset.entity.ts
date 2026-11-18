import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity.js';

export type AssetStatus = 'pending' | 'uploading' | 'completed' | 'failed' | 'expired' | 'deleted';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'object_key', type: 'varchar', unique: true })
  objectKey!: string;

  @Column({ name: 'original_filename', type: 'varchar' })
  originalFilename!: string;

  @Column({ name: 'mime_type', type: 'varchar' })
  mimeType!: string;

  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes!: string;

  @Column({ type: 'varchar', default: 'pending' })
  status!: AssetStatus;

  @Column({ type: 'varchar', nullable: true })
  checksum!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
