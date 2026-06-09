import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { config } from './config';
import logger from './utils/logger';
import errorHandler from './middleware/errorHandler';
import { attachUser } from './middleware/auth';
import { generalLimiter } from './middleware/rateLimiter';
import authRouter from './routes/auth';
import analyzeRouter from './routes/analyze';
import trendsRouter from './routes/trends';
import shoppingRouter from './routes/shopping';
import wardrobeRouter from './routes/wardrobe';
import healthRouter from './routes/health';

const app = express();

const cspDirectives: Record<string, string[]> = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'connect-src': ["'self'", ...config.corsOrigins],
  'font-src': ["'self'", 'https:', 'data:'],
  'img-src': ["'self'", 'data:', 'blob:', 'https:', 'res.cloudinary.com'],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https:'],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
};

if (config.isProd) {
  cspDirectives['upgrade-insecure-requests'] = [];
}

app.set('trust proxy', config.security.trustProxy);
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: { useDefaults: true, directives: cspDirectives },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin(origin, cb) {
    if (!origin || config.isDev || config.corsOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(Object.assign(new Error('CORS origin blocked'), { status: 403 }));
  },
  credentials: true,
}));

app.use(compression());
app.use(morgan('dev', { stream: { write: m => logger.http(m.trim()) } }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(hpp());

app.use((req, res, next) => {
  if (!req.cookies.muse_csrf) {
    res.cookie('muse_csrf', crypto.randomBytes(32).toString('hex'), {
      httpOnly: false,
      secure: config.isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
  next();
});

app.use((req, res, next) => {
  const mutates = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const authPath = req.path.startsWith('/api/auth');
  if (!mutates || !authPath) return next();

  const cookieToken = req.cookies.muse_csrf;
  const headerToken = req.get('x-csrf-token');
  const cookieBuffer = Buffer.from(cookieToken || '');
  const headerBuffer = Buffer.from(headerToken || '');
  if (
    cookieBuffer.length > 0 &&
    cookieBuffer.length === headerBuffer.length &&
    crypto.timingSafeEqual(cookieBuffer, headerBuffer)
  ) {
    return next();
  }
  return res.status(403).json({ success: false, error: 'CSRF token missing or invalid.' });
});

app.use(attachUser);
app.use('/api/', generalLimiter);
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/shopping', shoppingRouter);
app.use('/api/wardrobe', wardrobeRouter);

app.use(errorHandler);

export default app;
