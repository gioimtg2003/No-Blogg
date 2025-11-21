import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Tenant } from '../entities/Tenant';
import { User, UserRole } from '../entities/User';
import { Post, PostStatus } from '../entities/Post';

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // Initialize database
    await AppDataSource.initialize();

    const tenantRepo = AppDataSource.getRepository(Tenant);
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);

    // Create demo tenants
    let tenant1 = await tenantRepo.findOne({ where: { slug: 'acme-corp' } });
    if (!tenant1) {
      tenant1 = tenantRepo.create({
        name: 'Acme Corp',
        slug: 'acme-corp',
        domain: 'acme.example.com',
      });
      await tenantRepo.save(tenant1);
    }

    let tenant2 = await tenantRepo.findOne({ where: { slug: 'demo-org' } });
    if (!tenant2) {
      tenant2 = tenantRepo.create({
        name: 'Demo Organization',
        slug: 'demo-org',
        domain: 'demo.example.com',
      });
      await tenantRepo.save(tenant2);
    }

    console.log('✅ Created tenants:', { tenant1, tenant2 });

    // Create demo users
    const hashedPassword = await bcrypt.hash('password123', 10);

    let admin1 = await userRepo.findOne({
      where: { email: 'admin@acme.com', tenantId: tenant1.id },
    });
    if (!admin1) {
      admin1 = userRepo.create({
        email: 'admin@acme.com',
        name: 'Admin User',
        password: hashedPassword,
        role: UserRole.ADMIN,
        tenantId: tenant1.id,
      });
      await userRepo.save(admin1);
    }

    let editor1 = await userRepo.findOne({
      where: { email: 'editor@acme.com', tenantId: tenant1.id },
    });
    if (!editor1) {
      editor1 = userRepo.create({
        email: 'editor@acme.com',
        name: 'Editor User',
        password: hashedPassword,
        role: UserRole.EDITOR,
        tenantId: tenant1.id,
      });
      await userRepo.save(editor1);
    }

    let admin2 = await userRepo.findOne({
      where: { email: 'admin@demo.com', tenantId: tenant2.id },
    });
    if (!admin2) {
      admin2 = userRepo.create({
        email: 'admin@demo.com',
        name: 'Demo Admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
        tenantId: tenant2.id,
      });
      await userRepo.save(admin2);
    }

    console.log('✅ Created users:', { admin1, editor1, admin2 });

    // Create demo posts
    let post1 = await postRepo.findOne({
      where: { slug: 'welcome-to-acme-corp', tenantId: tenant1.id },
    });
    if (!post1) {
      post1 = postRepo.create({
        title: 'Welcome to Acme Corp',
        slug: 'welcome-to-acme-corp',
        content: 'This is our first blog post. Welcome to our multi-tenant CMS!',
        excerpt: 'A warm welcome to our new blog platform.',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: admin1.id,
        tenantId: tenant1.id,
      });
      await postRepo.save(post1);
    }

    let post2 = await postRepo.findOne({
      where: { slug: 'getting-started-guide', tenantId: tenant1.id },
    });
    if (!post2) {
      post2 = postRepo.create({
        title: 'Getting Started Guide',
        slug: 'getting-started-guide',
        content: 'Learn how to use our platform effectively with this comprehensive guide.',
        excerpt: 'Everything you need to know to get started.',
        status: PostStatus.DRAFT,
        authorId: editor1.id,
        tenantId: tenant1.id,
      });
      await postRepo.save(post2);
    }

    let post3 = await postRepo.findOne({
      where: { slug: 'demo-org-announcement', tenantId: tenant2.id },
    });
    if (!post3) {
      post3 = postRepo.create({
        title: 'Demo Organization Announcement',
        slug: 'demo-org-announcement',
        content: 'Big news from Demo Organization! Check out what we have been working on.',
        excerpt: 'Exciting updates from our team.',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: admin2.id,
        tenantId: tenant2.id,
      });
      await postRepo.save(post3);
    }

    console.log('✅ Created posts:', { post1, post2, post3 });

    console.log('🎉 Seed completed!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
