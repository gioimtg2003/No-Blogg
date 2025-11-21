import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER')
    `);
    await queryRunner.query(`
      CREATE TYPE "post_status_enum" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED')
    `);

    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" varchar(30) PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "slug" varchar(255) NOT NULL UNIQUE,
        "domain" varchar(255) UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar(30) PRIMARY KEY,
        "email" varchar(255) NOT NULL,
        "name" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'VIEWER',
        "tenant_id" varchar(30) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_users_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "uq_users_email_tenant" UNIQUE ("email", "tenant_id")
      )
    `);

    // Create posts table
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" varchar(30) PRIMARY KEY,
        "title" varchar(255) NOT NULL,
        "slug" varchar(255) NOT NULL,
        "content" text NOT NULL,
        "excerpt" text,
        "status" "post_status_enum" NOT NULL DEFAULT 'DRAFT',
        "author_id" varchar(30) NOT NULL,
        "tenant_id" varchar(30) NOT NULL,
        "published_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_posts_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_posts_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
        CONSTRAINT "uq_posts_slug_tenant" UNIQUE ("slug", "tenant_id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "idx_users_email_tenant" ON "users" ("email", "tenant_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_posts_slug_tenant" ON "posts" ("slug", "tenant_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "idx_posts_slug_tenant"`);
    await queryRunner.query(`DROP INDEX "idx_users_email_tenant"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "tenants"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "post_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
