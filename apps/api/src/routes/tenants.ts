import { Router } from 'express';
import AppDataSource from '../db';
import { Tenant } from '../entities/Tenant';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Public route to get all tenants
router.get('/', async (req, res) => {
  try {
    const tenantRepo = AppDataSource.getRepository(Tenant);

    const tenants = await tenantRepo.find({
      select: ['id', 'name', 'slug', 'domain', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    res.json({ success: true, data: tenants });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch tenants' });
  }
});

// Get current tenant (requires authentication)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const tenantRepo = AppDataSource.getRepository(Tenant);

    const tenant = await tenantRepo.findOne({
      where: { id: req.tenantId! },
      select: ['id', 'name', 'slug', 'domain', 'createdAt', 'updatedAt'],
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
