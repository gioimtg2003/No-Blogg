import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity('tenants')
export class Tenant {
  @PrimaryColumn('varchar', { length: 30 })
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255, unique: true })
  slug!: string;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  domain?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users!: User[];

  @OneToMany(() => Post, (post) => post.tenant)
  posts!: Post[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      // Generate a simple unique ID (in production, use a proper ID generation library)
      this.id = `c${Date.now()}${Math.random().toString(36).substring(2, 11)}`;
    }
  }
}
