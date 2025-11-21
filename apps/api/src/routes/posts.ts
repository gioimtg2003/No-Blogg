import { Router } from 'express';
import { z } from 'zod';
import prisma from '../db';
import { authenticate, requireRole, tenantIsolation, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(tenantIsolation);

const createPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  excerpt: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// Get all posts for the current tenant
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { page = '1', limit = '10', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      tenantId: req.tenantId!,
      ...(status && { status: status as string }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// Get a single post
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

// Create a new post (requires EDITOR or ADMIN role)
router.post('/', requireRole(['ADMIN', 'EDITOR']), async (req: AuthRequest, res) => {
  try {
    const data = createPostSchema.parse(req.body);

    // Check if slug already exists for this tenant
    const existingPost = await prisma.post.findUnique({
      where: {
        slug_tenantId: {
          slug: data.slug,
          tenantId: req.tenantId!,
        },
      },
    });

    if (existingPost) {
      return res.status(409).json({ success: false, error: 'Slug already exists' });
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: req.user!.id,
        tenantId: req.tenantId!,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

// Update a post (requires EDITOR or ADMIN role)
router.put('/:id', requireRole(['ADMIN', 'EDITOR']), async (req: AuthRequest, res) => {
  try {
    const data = updatePostSchema.parse(req.body);

    // Check if post exists and belongs to tenant
    const existingPost = await prisma.post.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existingPost.slug) {
      const conflictPost = await prisma.post.findUnique({
        where: {
          slug_tenantId: {
            slug: data.slug,
            tenantId: req.tenantId!,
          },
        },
      });

      if (conflictPost) {
        return res.status(409).json({ success: false, error: 'Slug already exists' });
      }
    }

    const updateData: any = { ...data };
    
    // Set publishedAt when changing status to PUBLISHED
    if (data.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to update post' });
  }
});

// Delete a post (requires ADMIN role)
router.delete('/:id', requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    // Check if post exists and belongs to tenant
    const existingPost = await prisma.post.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    await prisma.post.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

export default router;
