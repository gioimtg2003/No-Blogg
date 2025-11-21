import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppDataSource from '../db';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
  };
  tenantId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      tenantId: string;
      role: string;
    };

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: decoded.userId },
      select: ['id', 'email', 'tenantId', 'role'],
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };
    req.tenantId = user.tenantId;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    next();
  };
};

export const tenantIsolation = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.tenantId) {
    return res.status(400).json({ success: false, error: 'Tenant not identified' });
  }
  next();
};
