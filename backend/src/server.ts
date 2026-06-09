import { initSentry } from './config/sentry';
import app from './app';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './db/prisma';
import logger from './utils/logger';
import cache from './services/cacheService';
import { startWorkers } from './jobs/queue';
import type { Worker } from 'bullmq';

initSentry();

async function start() {
  let workers: Worker[] = [];

  try {
    await connectDatabase();
    logger.info('PostgreSQL connected via Prisma');

    if (!config.isTest) {
      workers = startWorkers();
    }

    const server = app.listen(config.port, () => {
      logger.info(`MUSE API running on port ${config.port} [${config.env}]`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        await Promise.all(workers.map(w => w.close()));
        await cache.disconnect();
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();
