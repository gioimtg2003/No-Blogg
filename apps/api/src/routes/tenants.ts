import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Public route to get all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: tenants });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch tenants' });
  }
});

// Get current tenant (requires authentication)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId! },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ success: false, error: 'Tenant not found' });
    }

    res.json({ success: true, data: tenant });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch tenant' });
  }
});

export default router;
