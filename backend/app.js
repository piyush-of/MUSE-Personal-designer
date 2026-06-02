'use strict';
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const config = require('../config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { attachUser } = require('./middleware/auth');
const { analyzeLimiter, generalLimiter } = require('./middleware/rateLimiter');
const authRouter = require('./routes/auth');
const { analyzeRouter, trendsRouter, shoppingRouter, healthRouter } = require('./routes/index');
const wardrobeRouter = require('./routes/wardrobe');


const app = express();
const cspDirectives = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "connect-src": ["'self'", ...config.security.corsOrigins],
  "font-src": ["'self'", 'https:', 'data:'],
  "img-src": ["'self'", 'data:', 'blob:', 'https:'],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", 'https:'],
  "object-src": ["'none'"],
  "frame-ancestors": ["'none'"],
};
if (config.isProd) cspDirectives["upgrade-insecure-requests"] = [];

app.set('trust proxy', config.security.trustProxy);
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: cspDirectives,
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin(origin, cb) {
    if (!origin || config.isDev || config.security.corsOrigins.includes(origin)) return cb(null, true);
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
  const authCookiePath = req.path.startsWith('/api/auth');
  if (!mutates || !authCookiePath) return next();

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
app.use('/css', express.static(path.join(__dirname, '../css'), { maxAge: config.isDev ? 0 : '1d' }));
app.use('/js', express.static(path.join(__dirname, '../js'), { maxAge: config.isDev ? 0 : '1d' }));
app.use('/health',           healthRouter);
app.use('/api/auth',         authRouter);
app.use('/api/analyze',      analyzeLimiter, analyzeRouter);
app.use('/api/trends',       trendsRouter);
app.use('/api/shopping',     shoppingRouter);
app.use('/api/wardrobe',     wardrobeRouter);


const pageMap = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/auth.html', 'auth.html'],
  ['/analyze.html', 'analyze.html'],
  ['/shopping.html', 'shopping.html'],
  ['/cart.html', 'cart.html'],
  ['/trends.html', 'trends.html'],
  ['/about.html', 'about.html'],
  ['/wardrobe.html', 'wardrobe.html'],
]);

app.get('*', (req, res, next) => {
  const page = pageMap.get(req.path);
  if (!page) return next();
  return res.sendFile(path.join(__dirname, '..', page));
});

app.use(errorHandler);
module.exports = app;
