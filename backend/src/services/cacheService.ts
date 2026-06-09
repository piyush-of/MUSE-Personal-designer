import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import logger from '../utils/logger';

let client: RedisClientType | null = null;
const memoryFallback = new Map<string, { value: string; expiresAt: number }>();

async function getClient(): Promise<RedisClientType | null> {
  if (!config.redis.enabled) return null;
  if (client?.isOpen) return client;

  try {
    client = createClient({ url: config.redis.url });
    client.on('error', (err: Error) => logger.error({ err: err.message }, 'Redis error'));
    await client.connect();
    logger.info('Redis connected');
    return client;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn({ err: message }, 'Redis unavailable — using in-memory cache fallback');
    return null;
  }
}

async function get<T>(key: string): Promise<T | null> {
  const redis = await getClient();
  if (redis) {
    const raw = await redis.get(`muse:${key}`);
    return raw ? JSON.parse(raw) as T : null;
  }

  const entry = memoryFallback.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryFallback.delete(key);
    return null;
  }
  return JSON.parse(entry.value) as T;
}

async function set(key: string, value: unknown, ttlSec = 3600): Promise<void> {
  const redis = await getClient();
  const serialized = JSON.stringify(value);

  if (redis) {
    await redis.setEx(`muse:${key}`, ttlSec, serialized);
    return;
  }

  memoryFallback.set(key, { value: serialized, expiresAt: Date.now() + ttlSec * 1000 });
}

async function del(key: string): Promise<void> {
  const redis = await getClient();
  if (redis) {
    await redis.del(`muse:${key}`);
    return;
  }
  memoryFallback.delete(key);
}

async function disconnect(): Promise<void> {
  if (client?.isOpen) await client.quit();
  client = null;
}

export default { get, set, del, disconnect };
