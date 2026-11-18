import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type UsageEventType =
  | 'upload.completed'
  | 'asset.deleted'
  | 'request'
  | 'storage.adjustment';

/** Append-only accounting ledger. Never UPDATE these rows. */
@Entity('usage_events')
export class UsageEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @Column({ name: 'asset_id', type: 'uuid', nullable: true })
  assetId!: string | null;

  @Column({ name: 'event_type', type: 'varchar' })
  eventType!: UsageEventType;

  @Column({ name: 'size_bytes', type: 'bigint', default: 0 })
  sizeBytes!: string;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
