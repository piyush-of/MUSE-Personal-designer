import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { config } from '../config';

interface LimiterOptions {
  max: number;
  windowMs?: number;
  message?: string;
  skipSuccess?: boolean;
}

function createLimiter(options: LimiterOptions) {
  return rateLimit({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccess || false,
    message: { success: false, error: options.message || 'Too many requests. Please try again later.' },
    keyGenerator: (req: Request) => {
      return req.user?.id || req.ip || 'anonymous';
    },
  });
}

export const analyzeLimiter = createLimiter({
  max: config.rateLimit.analyze,
  message: `Analysis limit reached (${config.rateLimit.analyze} per 15 min). Upgrade to Pro for higher limits.`,
});

export const authLoginLimiter = createLimiter({
  max: config.rateLimit.auth,
  windowMs: 15 * 60 * 1000,
  message: 'Too many login attempts. Please wait 15 minutes.',
  skipSuccess: true,
});

export const authRegisterLimiter = createLimiter({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: 'Too many registration attempts. Please try again later.',
});

export const generalLimiter = createLimiter({
  max: config.rateLimit.general,
  message: 'Too many requests. Please slow down.',
});
