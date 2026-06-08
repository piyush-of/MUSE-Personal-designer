import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  GEMINI_API_KEY: z.string().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),
  GEMINI_TIMEOUT_MS: z.string().default('20000'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  APP_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().optional().default(''),
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
  PORT: '3000',
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/muse?schema=public',
  JWT_SECRET: 'dev-secret-not-for-production-change-me-now-32c',
  JWT_REFRESH_SECRET: 'dev-refresh-secret-not-for-prod-change-me-32c',
  GEMINI_API_KEY: '',
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_TIMEOUT_MS: '20000',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: '',
  APP_URL: 'http://localhost:3000',
  CORS_ORIGINS: 'http://localhost:3000',
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
  gemini: {
    apiKey: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
    timeoutMs: parseInt(env.GEMINI_TIMEOUT_MS, 10),
    enabled: !!env.GEMINI_API_KEY,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    enabled: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
  },
  appUrl: env.APP_URL,
  corsOrigins: env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : [env.APP_URL],
};
