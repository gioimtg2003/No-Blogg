import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { User } from './User';
import { Tenant } from './Tenant';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('posts')
@Index(['slug', 'tenantId'], { unique: true })
export class Post {
  @PrimaryColumn('varchar', { length: 30 })
  id!: string;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('varchar', { length: 255 })
  slug!: string;

  @Column('text')
  content!: string;

  @Column('text', { nullable: true })
  excerpt?: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

  @Column('varchar', { length: 30, name: 'author_id' })
  authorId!: string;

  @Column('varchar', { length: 30, name: 'tenant_id' })
  tenantId!: string;

  @Column('timestamp', { nullable: true, name: 'published_at' })
  publishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `c${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    }
  }
}
