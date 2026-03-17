'use strict';
module.exports = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  env:  process.env.NODE_ENV ?? 'development',
  isDev: (process.env.NODE_ENV ?? 'development') === 'development',
  upload: { maxBytes: 10*1024*1024, allowedMime: ['image/jpeg','image/png','image/webp','image/gif'] },
  rateLimit: { windowMs: 15*60*1000, max: 120 }
};
