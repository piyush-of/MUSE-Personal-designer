'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../../config');

function createLimiter(options) {
  return rateLimit({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccess || false,
    message: { success: false, error: options.message || 'Too many requests. Please try again later.' },
    keyGenerator: (req) => {
      // Use user ID if authenticated, else IP
      return req.user?.id || req.ip;
    },
  });
}

const analyzeLimiter = createLimiter({
  max: config.rateLimit.analyze,
  message: `Analysis limit reached (${config.rateLimit.analyze} per 15 min). Upgrade to Pro for higher limits.`,
});

const authLoginLimiter = createLimiter({
  max: config.rateLimit.auth,
  windowMs: 15 * 60 * 1000,
  message: 'Too many login attempts. Please wait 15 minutes.',
  skipSuccess: true, // only count failed attempts toward limit
});

const authRegisterLimiter = createLimiter({
  max: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many registration attempts. Please try again later.',
});

const generalLimiter = createLimiter({
  max: config.rateLimit.general,
  message: 'Too many requests. Please slow down.',
});

module.exports = { analyzeLimiter, authLoginLimiter, authRegisterLimiter, generalLimiter };
