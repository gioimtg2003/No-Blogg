import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo tenants
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      domain: 'acme.example.com',
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      domain: 'demo.example.com',
    },
  });

  console.log('✅ Created tenants:', { tenant1, tenant2 });

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin1 = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@acme.com',
        tenantId: tenant1.id,
      },
    },
    update: {},
    create: {
      email: 'admin@acme.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: tenant1.id,
    },
  });

  const editor1 = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'editor@acme.com',
        tenantId: tenant1.id,
      },
    },
    update: {},
    create: {
      email: 'editor@acme.com',
      name: 'Editor User',
      password: hashedPassword,
      role: 'EDITOR',
      tenantId: tenant1.id,
    },
  });

  const admin2 = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@demo.com',
        tenantId: tenant2.id,
      },
    },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Demo Admin',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: tenant2.id,
    },
  });

  console.log('✅ Created users:', { admin1, editor1, admin2 });

  // Create demo posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Welcome to Acme Corp',
      slug: 'welcome-to-acme-corp',
      content: 'This is our first blog post. Welcome to our multi-tenant CMS!',
      excerpt: 'A warm welcome to our new blog platform.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin1.id,
      tenantId: tenant1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Getting Started Guide',
      slug: 'getting-started-guide',
      content: 'Learn how to use our platform effectively with this comprehensive guide.',
      excerpt: 'Everything you need to know to get started.',
      status: 'DRAFT',
      authorId: editor1.id,
      tenantId: tenant1.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Demo Organization Announcement',
      slug: 'demo-org-announcement',
      content: 'Big news from Demo Organization! Check out what we have been working on.',
      excerpt: 'Exciting updates from our team.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin2.id,
      tenantId: tenant2.id,
    },
  });

  console.log('✅ Created posts:', { post1, post2, post3 });

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
