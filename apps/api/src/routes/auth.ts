import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import AppDataSource from '../db';
import { Tenant } from '../entities/Tenant';
import { User, UserRole } from '../entities/User';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantSlug: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  tenantSlug: z.string(),
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, tenantSlug } = loginSchema.parse(req.body);

    const tenantRepo = AppDataSource.getRepository(Tenant);
    const userRepo = AppDataSource.getRepository(User);

    // Find tenant
    const tenant = tenantSlug
      ? await tenantRepo.findOne({ where: { slug: tenantSlug } })
      : await tenantRepo.findOne({ order: { createdAt: 'ASC' } });

    if (!tenant) {
      return res.status(404).json({ success: false, error: 'Tenant not found' });
    }

    // Find user
    const user = await userRepo.findOne({
      where: {
        email,
        tenantId: tenant.id,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const tokenPayload = { userId: user.id, email: user.email, tenantId: user.tenantId, role: user.role };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, tenantSlug } = registerSchema.parse(req.body);

    const tenantRepo = AppDataSource.getRepository(Tenant);
    const userRepo = AppDataSource.getRepository(User);

    // Find tenant
    const tenant = await tenantRepo.findOne({ where: { slug: tenantSlug } });
    if (!tenant) {
      return res.status(404).json({ success: false, error: 'Tenant not found' });
    }

    // Check if user already exists
    const existingUser = await userRepo.findOne({
      where: {
        email,
        tenantId: tenant.id,
      },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepo.create({
      email,
      password: hashedPassword,
      name,
      tenantId: tenant.id,
      role: UserRole.VIEWER,
    });
    await userRepo.save(user);

    // Generate token
    const tokenPayload = { userId: user.id, email: user.email, tenantId: user.tenantId, role: user.role };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

export default router;
