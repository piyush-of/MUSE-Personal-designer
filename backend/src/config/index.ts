import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  GEMINI_API_KEY: z.string().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),
  GEMINI_TIMEOUT_MS: z.string().default('20000'),
  OPENAI_API_KEY: z.string().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_TIMEOUT_MS: z.string().default('20000'),
  ANTHROPIC_API_KEY: z.string().default(''),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-haiku-20241022'),
  ANTHROPIC_TIMEOUT_MS: z.string().default('20000'),
  AI_PREFERRED_PROVIDER: z.enum(['gemini', 'openai', 'anthropic']).default('gemini'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  SENTRY_DSN: z.string().default(''),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().default(''),
  EMAIL_FROM: z.string().default('noreply@muse.style'),
  APP_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().optional().default(''),
  TRUST_PROXY: z.string().default('1'),
  RATE_LIMIT_ANALYZE: z.string().default('20'),
  RATE_LIMIT_AUTH: z.string().default('10'),
  RATE_LIMIT_GENERAL: z.string().default('200'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map(i => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(`\n❌ Environment variable validation failed:\n${issues}\n`);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const env = parsed.success ? parsed.data : {
  PORT: '3001',
  NODE_ENV: 'development' as const,
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/muse?schema=public',
  JWT_SECRET: 'dev-secret-not-for-production-change-me-now-32c',
  JWT_REFRESH_SECRET: 'dev-refresh-secret-not-for-prod-change-me-32c',
  GEMINI_API_KEY: '',
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_TIMEOUT_MS: '20000',
  OPENAI_API_KEY: '',
  OPENAI_MODEL: 'gpt-4o-mini',
  OPENAI_TIMEOUT_MS: '20000',
  ANTHROPIC_API_KEY: '',
  ANTHROPIC_MODEL: 'claude-3-5-haiku-20241022',
  ANTHROPIC_TIMEOUT_MS: '20000',
  AI_PREFERRED_PROVIDER: 'gemini' as const,
  REDIS_URL: 'redis://localhost:6379',
  SENTRY_DSN: '',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: '',
  RESEND_API_KEY: '',
  EMAIL_FROM: 'noreply@muse.style',
  APP_URL: 'http://localhost:5173',
  CORS_ORIGINS: 'http://localhost:5173,http://localhost:3001',
  TRUST_PROXY: '1',
  RATE_LIMIT_ANALYZE: '20',
  RATE_LIMIT_AUTH: '10',
  RATE_LIMIT_GENERAL: '200',
};

export const config = {
  port: parseInt(env.PORT, 10),
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  databaseUrl: env.DATABASE_URL,
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  ai: {
    preferredProvider: env.AI_PREFERRED_PROVIDER,
  },
  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
    timeoutMs: parseInt(env.GEMINI_TIMEOUT_MS, 10),
    enabled: !!env.GEMINI_API_KEY,
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    timeoutMs: parseInt(env.OPENAI_TIMEOUT_MS, 10),
    enabled: !!env.OPENAI_API_KEY,
  },
  anthropic: {
    apiKey: env.ANTHROPIC_API_KEY,
    model: env.ANTHROPIC_MODEL,
    timeoutMs: parseInt(env.ANTHROPIC_TIMEOUT_MS, 10),
    enabled: !!env.ANTHROPIC_API_KEY,
  },
  redis: {
    url: env.REDIS_URL,
    enabled: env.NODE_ENV !== 'test',
  },
  sentry: {
    dsn: env.SENTRY_DSN,
    enabled: !!env.SENTRY_DSN && env.NODE_ENV === 'production',
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    enabled: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
  },
  email: {
    resendKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM,
    appUrl: env.APP_URL,
    enabled: !!env.RESEND_API_KEY,
  },
  appUrl: env.APP_URL,
  corsOrigins: env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : [env.APP_URL],
  security: {
    trustProxy: parseInt(env.TRUST_PROXY, 10),
  },
  rateLimit: {
    analyze: parseInt(env.RATE_LIMIT_ANALYZE, 10),
    auth: parseInt(env.RATE_LIMIT_AUTH, 10),
    general: parseInt(env.RATE_LIMIT_GENERAL, 10),
    windowMs: 15 * 60 * 1000,
  },
  upload: {
    maxBytes: 10 * 1024 * 1024,
    allowedMime: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
};
