'use strict';

const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT:                z.string().default('3000'),
  NODE_ENV:            z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI:         z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET:          z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET:  z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  GEMINI_API_KEY:      z.string().optional().default(''),
  GEMINI_MODEL:        z.string().default('gemini-2.0-flash'),
  GEMINI_TIMEOUT_MS:   z.string().default('20000'),
  GROQ_API_KEY:        z.string().optional().default(''),
  GROQ_MODEL:          z.string().default('llama-3.3-70b-versatile'),
  GROQ_VISION_MODEL:   z.string().default('llama-3.2-11b-vision-preview'),
  GROQ_TIMEOUT_MS:     z.string().default('20000'),
  RESEND_API_KEY:      z.string().optional().default(''),
  EMAIL_FROM:          z.string().email().optional().default('noreply@muse.style'),
  APP_URL:             z.string().default('http://localhost:3000'),
  CORS_ORIGINS:        z.string().optional().default(''),
  TRUST_PROXY:         z.string().optional().default('1'),
  RATE_LIMIT_ANALYZE:  z.string().default('20'),
  RATE_LIMIT_AUTH:     z.string().default('10'),
  RATE_LIMIT_GENERAL:  z.string().default('200'),
});

let _env;

function getConfig() {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues.map(i => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    console.error(`\n❌ Environment variable validation failed:\n${issues}\n`);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }

  const env = parsed.success ? parsed.data : { ...envSchema.parse({ ...process.env, MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/muse', JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-not-for-production-change-me-now-32c', JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-not-for-prod-change-me-32c' }) };
  const appOrigin = new URL(env.APP_URL).origin;
  const corsOrigins = env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
    : [appOrigin];

  _env = {
    port:          parseInt(env.PORT, 10),
    env:           env.NODE_ENV,
    isDev:         env.NODE_ENV === 'development',
    isProd:        env.NODE_ENV === 'production',
    isTest:        env.NODE_ENV === 'test',
    mongoUri:      env.MONGODB_URI,
    jwt: {
      secret:         env.JWT_SECRET,
      refreshSecret:  env.JWT_REFRESH_SECRET,
      accessExpiry:   '15m',
      refreshExpiry:  '7d',
    },
    groq: {
      apiKey:       env.GROQ_API_KEY,
      baseUrl:      'https://api.groq.com/openai/v1/chat/completions',
      model:        env.GROQ_MODEL,
      visionModel:  env.GROQ_VISION_MODEL,
      timeoutMs:    parseInt(env.GROQ_TIMEOUT_MS, 10),
      enabled:      !!env.GROQ_API_KEY,
    },
    gemini: {
      apiKey:       env.GEMINI_API_KEY,
      baseUrl:      'https://generativelanguage.googleapis.com/v1beta',
      model:        env.GEMINI_MODEL,
      timeoutMs:    parseInt(env.GEMINI_TIMEOUT_MS, 10),
      enabled:      !!env.GEMINI_API_KEY,
    },
    email: {
      resendKey:  env.RESEND_API_KEY,
      from:       env.EMAIL_FROM,
      appUrl:     env.APP_URL,
      enabled:    !!env.RESEND_API_KEY,
    },
    security: {
      corsOrigins,
      appOrigin,
      trustProxy: env.TRUST_PROXY,
    },
    upload: {
      maxBytes:     10 * 1024 * 1024,
      allowedMime:  ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
    rateLimit: {
      analyze:  parseInt(env.RATE_LIMIT_ANALYZE, 10),
      auth:     parseInt(env.RATE_LIMIT_AUTH, 10),
      general:  parseInt(env.RATE_LIMIT_GENERAL, 10),
      windowMs: 15 * 60 * 1000,
    },
  };

  return _env;
}

module.exports = getConfig();
