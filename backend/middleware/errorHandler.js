'use strict';

const logger = require('../utils/logger');

function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== 'production';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, errors: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, error: `${field} already in use.` });
  }

  // Multer file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large. Maximum size is 10MB.' });
  }

  if (status >= 500) {
    logger.error(`[${req.method}] ${req.path} →`, err.message, isDev ? err.stack : '');
  }

  res.status(status).json({
    success: false,
    error: status >= 500 && !isDev ? 'An unexpected error occurred.' : (err.message || 'Error'),
    ...(isDev && status >= 500 ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
