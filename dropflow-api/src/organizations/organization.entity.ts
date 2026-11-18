import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Plan } from '../usage/plan-limits.js';
import type { OrganizationMember } from './organization-member.entity.js';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  /** Account-level plan. Allowances are enforced on the organization. */
  @Column({ type: 'varchar', default: 'free' })
  plan!: Plan;

  // String target avoids an ESM circular import with OrganizationMember.
  @OneToMany('OrganizationMember', 'organization')
  members!: OrganizationMember[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
