'use strict';
const app = require('./app');
const config = require('../config');
const logger = require('./utils/logger');
const server = app.listen(config.port, () => {
  logger.info(`✦ MUSE v3 → http://localhost:${config.port}  [${config.env}]`);
});
const shutdown = sig => { logger.info(`${sig} – shutting down`); server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 8000).unref(); };
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', r => logger.error('UnhandledRejection:', r));
process.on('uncaughtException',  e => { logger.error('UncaughtException:', e); process.exit(1); });
