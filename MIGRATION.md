# Migration Guide: Prisma to TypeORM

This document explains the migration from Prisma to TypeORM in the No-Blogg CMS project.

## Why TypeORM?

TypeORM was chosen based on maintainer preference and offers several advantages:

- **Explicit Entity Definitions**: TypeScript decorators provide clear, type-safe schema definitions
- **Better IDE Support**: Enhanced autocompletion and type inference
- **Flexible Query Building**: Both repository pattern and query builder available
- **Active Development**: Regular updates and strong community support
- **Enterprise Ready**: Used by many large-scale applications

## Key Changes

### 1. Dependencies

**Before (Prisma):**
```json
{
  "@prisma/client": "^5.7.0",
  "prisma": "^5.7.0"
}
```

**After (TypeORM):**
```json
{
  "typeorm": "^0.3.19",
  "pg": "^8.11.3",
  "reflect-metadata": "^0.2.1"
}
```

### 2. Schema Definition

**Before (Prisma Schema):**
```prisma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  users     User[]
  posts     Post[]
  @@map("tenants")
}
```

**After (TypeORM Entity):**
```typescript
@Entity('tenants')
export class Tenant {
  @PrimaryColumn('varchar', { length: 30 })
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255, unique: true })
  slug!: string;

  @OneToMany(() => User, (user) => user.tenant)
  users!: User[];

  @OneToMany(() => Post, (post) => post.tenant)
  posts!: Post[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = `c${Date.now()}${Math.random().toString(36).substring(2, 11)}`;
    }
  }
}
```

### 3. Database Queries

**Before (Prisma):**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, tenantId: true, role: true },
});
```

**After (TypeORM):**
```typescript
const userRepo = AppDataSource.getRepository(User);
const user = await userRepo.findOne({
  where: { id: userId },
  select: ['id', 'email', 'tenantId', 'role'],
});
```

### 4. Migrations

**Before (Prisma):**
```bash
pnpm db:generate  # Generate Prisma Client
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Prisma Studio
```

**After (TypeORM):**
```bash
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database
# Note: No code generation step needed
# Note: No built-in studio GUI
```

### 5. Configuration

**Before (schema.prisma):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

**After (data-source.ts):**
```typescript
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Tenant, User, Post],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
});
```

## Migration Steps

If you're updating from an older version with Prisma:

1. **Install new dependencies:**
   ```bash
   pnpm install
   ```

2. **Remove old Prisma artifacts:**
   ```bash
   rm -rf node_modules/.prisma
   rm -rf apps/api/prisma
   ```

3. **Build shared packages:**
   ```bash
   pnpm --filter @no-blogg/types build
   pnpm --filter @no-blogg/utils build
   ```

4. **Run TypeORM migrations:**
   ```bash
   pnpm db:migrate
   ```

5. **Seed the database:**
   ```bash
   pnpm db:seed
   ```

6. **Start development:**
   ```bash
   pnpm dev
   ```

## Breaking Changes

### Removed Features
- ❌ `pnpm db:studio` - Prisma Studio no longer available
- ❌ `pnpm db:generate` - TypeORM doesn't require code generation

### Changed Behavior
- Migrations are now in `apps/api/src/migrations/` instead of `apps/api/prisma/migrations/`
- Seed script moved to `apps/api/src/database/seed.ts`
- Entity definitions are in `apps/api/src/entities/`

## Common Patterns

### Creating Records

**Before (Prisma):**
```typescript
const post = await prisma.post.create({
  data: {
    title: 'New Post',
    authorId: userId,
    tenantId: tenantId,
  },
});
```

**After (TypeORM):**
```typescript
const postRepo = AppDataSource.getRepository(Post);
const post = postRepo.create({
  title: 'New Post',
  authorId: userId,
  tenantId: tenantId,
});
await postRepo.save(post);
```

### Finding with Relations

**Before (Prisma):**
```typescript
const post = await prisma.post.findFirst({
  where: { id: postId },
  include: { author: true },
});
```

**After (TypeORM):**
```typescript
const postRepo = AppDataSource.getRepository(Post);
const post = await postRepo.findOne({
  where: { id: postId },
  relations: ['author'],
});
```

### Updating Records

**Before (Prisma):**
```typescript
await prisma.post.update({
  where: { id: postId },
  data: { title: 'Updated Title' },
});
```

**After (TypeORM):**
```typescript
const postRepo = AppDataSource.getRepository(Post);
await postRepo.update(postId, { title: 'Updated Title' });
```

## Troubleshooting

### Issue: "DATABASE_URL environment variable is required"
**Solution:** Ensure your `.env` file has the `DATABASE_URL` set:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/noblogg
```

### Issue: "Cannot find module 'typeorm'"
**Solution:** Run `pnpm install` to install all dependencies.

### Issue: Decorator errors
**Solution:** Ensure `tsconfig.json` has:
```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

### Issue: Database connection fails
**Solution:** Verify PostgreSQL is running and DATABASE_URL is correct.

## Resources

- [TypeORM Documentation](https://typeorm.io/)
- [TypeORM Entity Documentation](https://typeorm.io/entities)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)
- [TypeORM Repository API](https://typeorm.io/repository-api)

## Support

For issues related to this migration:
1. Check this migration guide
2. Review the TypeORM documentation
3. Open an issue on GitHub with details about your problem

---

**Migration completed on:** 2025-11-21  
**Maintainer:** @gioimtg2003  
**Contributors:** GitHub Copilot
