import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UserRepository } from '../repositories/userRepository';

const userRepository = new UserRepository();

export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = authHeader.slice(7).trim();
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      req.user = null;
      return next();
    }
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    req.user = null;
    next();
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required.' });
  }
  next();
}

export async function checkAnalysisQuota(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next();
    const user = await userRepository.findById(req.user.id);
    if (!user) return next();
    if (user.plan === 'pro') return next();
    if (user.analysesUsed >= user.analysesLimit) {
      return res.status(429).json({
        success: false,
        error: `Free tier limit reached (${user.analysesLimit} analyses/month). Upgrade to Pro for unlimited.`,
        code: 'QUOTA_EXCEEDED',
      });
    }
    req.userDoc = user;
    next();
  } catch (err) {
    next(err);
  }
}
