import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config';
import logger from '../utils/logger';

const connection = { url: config.redis.url };

export const QUEUE_NAMES = {
  EMAIL: 'muse-email',
  QUOTA: 'muse-quota',
} as const;

export type EmailJobData = {
  type: 'verification' | 'password-reset';
  email: string;
  name: string;
  token: string;
};

export type QuotaJobData = {
  type: 'monthly-reset';
};

function createQueue(name: string): Queue | null {
  if (!config.redis.enabled) return null;
  try {
    return new Queue(name, { connection });
  } catch (error) {
    logger.warn({ err: error }, `Failed to create queue ${name}`);
    return null;
  }
}

export const emailQueue = createQueue(QUEUE_NAMES.EMAIL);
export const quotaQueue = createQueue(QUEUE_NAMES.QUOTA);

export async function enqueueEmail(data: EmailJobData): Promise<void> {
  if (emailQueue) {
    await emailQueue.add(data.type, data, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
    return;
  }
  const { sendVerificationEmail, sendPasswordResetEmail } = await import('../services/emailService');
  if (data.type === 'verification') await sendVerificationEmail(data.email, data.name, data.token);
  else await sendPasswordResetEmail(data.email, data.name, data.token);
}

export function startWorkers(): Worker[] {
  if (!config.redis.enabled) return [];

  const workers: Worker[] = [];

  workers.push(new Worker(QUEUE_NAMES.EMAIL, async (job: Job<EmailJobData>) => {
    const { sendVerificationEmail, sendPasswordResetEmail } = await import('../services/emailService');
    if (job.data.type === 'verification') {
      await sendVerificationEmail(job.data.email, job.data.name, job.data.token);
    } else {
      await sendPasswordResetEmail(job.data.email, job.data.name, job.data.token);
    }
  }, { connection }));

  workers.push(new Worker(QUEUE_NAMES.QUOTA, async (job: Job<QuotaJobData>) => {
    if (job.data.type === 'monthly-reset') {
      const prisma = (await import('../db/prisma')).default;
      await prisma.user.updateMany({
        where: { plan: 'free' },
        data: { analysesUsed: 0 },
      });
      logger.info('Monthly quota reset completed');
    }
  }, { connection }));

  logger.info('BullMQ workers started');
  return workers;
}
