import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  BeforeInsert,
} from 'typeorm';
import { Tenant } from './Tenant';
import { Post } from './Post';

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

@Entity('users')
@Index(['email', 'tenantId'], { unique: true })
export class User {
  @PrimaryColumn('varchar', { length: 30 })
  id!: string;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role!: UserRole;

  @Column('varchar', { length: 30, name: 'tenant_id' })
  tenantId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `c${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }
  }
}
