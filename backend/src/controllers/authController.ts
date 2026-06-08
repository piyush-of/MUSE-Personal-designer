import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import validator from 'validator';
import { UserRepository } from '../repositories/userRepository';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository';
import prisma from '../db/prisma';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueTokens(user: any, res: Response): Promise<string> {
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });
  
  // Save refresh token to db
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await refreshTokenRepository.save(hashToken(refreshToken), user.id, expiresAt);
  
  setRefreshCookie(res, refreshToken);
  return accessToken;
}

function toProfile(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    analysesUsed: user.analysesUsed,
    analysesLimit: user.analysesLimit,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account already exists with that email.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await userRepository.create({
      name: validator.escape(name.trim()),
      email: email.toLowerCase().trim(),
      password: passwordHash,
    });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const updatedUser = await userRepository.update(user.id, {
      verifyToken: hashedVerifyToken,
      verifyTokenExpiry,
    });

    await sendVerificationEmail(updatedUser.email, updatedUser.name, verifyToken);
    const accessToken = await issueTokens(updatedUser, res);

    logger.info(`[AUTH] New user registered: ${updatedUser.email}`);
    res.status(201).json({ success: true, accessToken, user: toProfile(updatedUser) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isLocked = user.lockedUntil && user.lockedUntil > new Date();
    if (isLocked) {
      const minutesLeft = Math.ceil(((user.lockedUntil?.getTime() || 0) - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        error: `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      let lockUntil: Date | undefined;
      const nextAttemptCount = user.loginAttempts + 1;
      if (nextAttemptCount >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      await userRepository.incrementAttempts(user.id, lockUntil);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const updatedUser = await userRepository.update(user.id, {
      loginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    });

    const accessToken = await issueTokens(updatedUser, res);

    logger.info(`[AUTH] Login: ${updatedUser.email}`);
    res.json({ success: true, accessToken, user: toProfile(updatedUser) });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.muse_refresh;
    if (!token) return res.status(401).json({ success: false, error: 'Refresh token missing.' });

    const decoded = verifyRefreshToken(token);
    if (!decoded) return res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });

    const tokenRecord = await refreshTokenRepository.find(hashToken(token));
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ success: false, error: 'Refresh token invalid or expired.' });
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, error: 'User not found.' });

    const accessToken = await issueTokens(user, res);
    res.json({ success: true, accessToken, user: toProfile(user) });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.muse_refresh;
    if (token) {
      const hashed = hashToken(token);
      await refreshTokenRepository.delete(hashed);
    }
    clearRefreshCookie(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response) {
  if (!req.user) return res.json({ success: true, user: null });
  const user = await userRepository.findById(req.user.id);
  res.json({ success: true, user: user ? toProfile(user) : null });
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const hashedToken = hashToken(req.params.token);
    const user = await prisma?.user.findFirst({
      where: {
        verifyToken: hashedToken,
        verifyTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) return res.status(400).json({ success: false, error: 'Token invalid or expired.' });

    await userRepository.update(user.id, {
      isVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    });

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = hashToken(resetToken);
    const resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await userRepository.update(user.id, {
      resetPasswordToken: hashedResetToken,
      resetPasswordExpiry,
    });

    await sendPasswordResetEmail(user.email, user.name, resetToken);
    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { password } = req.body;
    const hashedToken = hashToken(req.params.token);
    const user = await prisma?.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { gt: new Date() },
      },
    });
    if (!user) return res.status(400).json({ success: false, error: 'Token invalid or expired.' });

    const passwordHash = await bcrypt.hash(password, 12);

    await userRepository.update(user.id, {
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      loginAttempts: 0,
      lockedUntil: null,
    });

    res.json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (err) {
    next(err);
  }
}
