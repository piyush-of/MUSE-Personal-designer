'use strict';
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { attachUser } = require('./middleware/auth');
const { authRouter } = require('./routes/auth');
const { analyzeRouter, trendsRouter, shoppingRouter, healthRouter } = require('./routes/index');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.isDev ? '*' : false }));
app.use(compression());
app.use(morgan('dev', { stream: { write: m => logger.http(m.trim()) } }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(attachUser);
app.use('/api/', rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max, standardHeaders: true, legacyHeaders: false }));
app.use('/css', express.static(path.join(__dirname, '../css'), { maxAge: config.isDev ? 0 : '1d' }));
app.use('/js', express.static(path.join(__dirname, '../js'), { maxAge: config.isDev ? 0 : '1d' }));
app.use('/health',           healthRouter);
app.use('/api/auth',         authRouter);
app.use('/api/analyze',      analyzeRouter);
app.use('/api/trends',       trendsRouter);
app.use('/api/shopping',     shoppingRouter);

const pageMap = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/auth.html', 'auth.html'],
  ['/analyze.html', 'analyze.html'],
  ['/shopping.html', 'shopping.html'],
  ['/cart.html', 'cart.html'],
  ['/trends.html', 'trends.html'],
  ['/about.html', 'about.html'],
]);

app.get('*', (req, res, next) => {
  const page = pageMap.get(req.path);
  if (!page) return next();
  return res.sendFile(path.join(__dirname, '..', page));
});

app.use(errorHandler);
module.exports = app;
