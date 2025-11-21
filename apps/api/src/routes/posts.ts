import { Router } from 'express';
import { z } from 'zod';
import AppDataSource from '../db';
import { Post, PostStatus } from '../entities/Post';
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

    const postRepo = AppDataSource.getRepository(Post);

    const where: Record<string, unknown> = {
      tenantId: req.tenantId!,
      ...(status && { status: status as PostStatus }),
    };

    const [posts, total] = await Promise.all([
      postRepo.find({
        where,
        relations: ['author'],
        order: { createdAt: 'DESC' },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
          tenantId: true,
          author: {
            id: true,
            name: true,
            email: true,
          },
        },
      }),
      postRepo.count({ where }),
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
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// Get a single post
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const postRepo = AppDataSource.getRepository(Post);

    const post = await postRepo.findOne({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
      relations: ['author'],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        tenantId: true,
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

// Create a new post (requires EDITOR or ADMIN role)
router.post('/', requireRole(['ADMIN', 'EDITOR']), async (req: AuthRequest, res) => {
  try {
    const data = createPostSchema.parse(req.body);
    const postRepo = AppDataSource.getRepository(Post);

    // Check if slug already exists for this tenant
    const existingPost = await postRepo.findOne({
      where: {
        slug: data.slug,
        tenantId: req.tenantId!,
      },
    });

    if (existingPost) {
      return res.status(409).json({ success: false, error: 'Slug already exists' });
    }

    const post = postRepo.create({
      ...data,
      status: data.status as PostStatus || PostStatus.DRAFT,
      authorId: req.user!.id,
      tenantId: req.tenantId!,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
    });

    await postRepo.save(post);

    // Fetch with relations
    const savedPost = await postRepo.findOne({
      where: { id: post.id },
      relations: ['author'],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        tenantId: true,
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    res.status(201).json({ success: true, data: savedPost });
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
    const postRepo = AppDataSource.getRepository(Post);

    // Check if post exists and belongs to tenant
    const existingPost = await postRepo.findOne({
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
      const conflictPost = await postRepo.findOne({
        where: {
          slug: data.slug,
          tenantId: req.tenantId!,
        },
      });

      if (conflictPost) {
        return res.status(409).json({ success: false, error: 'Slug already exists' });
      }
    }

    const updateData: Record<string, unknown> = { ...data };

    // Set publishedAt when changing status to PUBLISHED
    if (data.status === 'PUBLISHED' && existingPost.status !== PostStatus.PUBLISHED) {
      updateData.publishedAt = new Date();
    }

    await postRepo.update(req.params.id, updateData);

    // Fetch updated post with relations
    const post = await postRepo.findOne({
      where: { id: req.params.id },
      relations: ['author'],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        tenantId: true,
        author: {
          id: true,
          name: true,
          email: true,
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
    const postRepo = AppDataSource.getRepository(Post);

    // Check if post exists and belongs to tenant
    const existingPost = await postRepo.findOne({
      where: {
        id: req.params.id,
        tenantId: req.tenantId!,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    await postRepo.remove(existingPost);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

export default router;
