import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { config } from '../config';

export async function getHealth(_req: Request, res: Response) {
  let dbState = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbState = 'connected';
  } catch {
    dbState = 'disconnected';
  }

  res.json({
    status: dbState === 'connected' || config.isTest ? 'ok' : 'degraded',
    service: 'muse-api',
    env: config.env,
    database: dbState,
    ai: config.gemini.enabled ? 'gemini' : 'fallback',
    cloudinary: config.cloudinary.enabled ? 'enabled' : 'disabled',
    timestamp: new Date().toISOString(),
  });
}
