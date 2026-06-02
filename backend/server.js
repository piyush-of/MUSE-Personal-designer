'use strict';
const app = require('./app');
const config = require('../config');
const logger = require('./utils/logger');
const { connectDB } = require('./db/mongoose');

let server;

async function startServer() {
  await connectDB();
  server = app.listen(config.port, () => {
    logger.info(`✦ MUSE v3 → http://localhost:${config.port}  [${config.env}]`);
  });

  const shutdown = sig => {
    logger.info(`${sig} – shutting down`);
    if (server) {
      server.close(() => process.exit(0));
    } else {
      process.exit(0);
    }
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

startServer().catch(err => {
  logger.error('Startup failed:', err);
  process.exit(1);
});

process.on('unhandledRejection', r => logger.error('UnhandledRejection:', r));
process.on('uncaughtException',  e => { logger.error('UncaughtException:', e); process.exit(1); });
