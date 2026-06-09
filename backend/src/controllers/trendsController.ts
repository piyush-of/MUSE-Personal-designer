import { Request, Response, NextFunction } from 'express';
import { UPDATED_AT, WOMEN_TRENDS, MEN_TRENDS } from '../data/trends';
import { enhanceTrendsWithGemini } from '../services/geminiService';
import cache from '../services/cacheService';

export async function getAllTrends(_req: Request, res: Response, next: NextFunction) {
  try {
    const content = await enhanceTrendsWithGemini({ women: WOMEN_TRENDS, men: MEN_TRENDS });
    res.json({
      success: true,
      data: { updatedAt: UPDATED_AT, women: WOMEN_TRENDS, men: MEN_TRENDS, content },
    });
  } catch (err) {
    next(err);
  }
}

export async function getWomenTrends(_req: Request, res: Response, next: NextFunction) {
  try {
    const content = await enhanceTrendsWithGemini({ women: WOMEN_TRENDS, men: [] });
    res.json({ success: true, data: WOMEN_TRENDS, updatedAt: UPDATED_AT, content });
  } catch (err) {
    next(err);
  }
}

export async function getMenTrends(_req: Request, res: Response, next: NextFunction) {
  try {
    const content = await enhanceTrendsWithGemini({ women: [], men: MEN_TRENDS });
    res.json({ success: true, data: MEN_TRENDS, updatedAt: UPDATED_AT, content });
  } catch (err) {
    next(err);
  }
}

export async function getStaticTrends(_req: Request, res: Response) {
  const cacheKey = 'trends:static';
  const cached = await cache.get<{ updatedAt: string; women: typeof WOMEN_TRENDS; men: typeof MEN_TRENDS }>(cacheKey);
  const data = cached || { updatedAt: UPDATED_AT, women: WOMEN_TRENDS, men: MEN_TRENDS };
  if (!cached) await cache.set(cacheKey, data, 3600);
  res.json({ success: true, data });
}
