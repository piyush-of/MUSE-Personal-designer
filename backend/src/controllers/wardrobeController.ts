import { Request, Response, NextFunction } from 'express';
import { AnalysisRepository } from '../repositories/analysisRepository';
import logger from '../utils/logger';

const analysisRepository = new AnalysisRepository();

export async function getWardrobe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const items = await analysisRepository.findByUserId(userId);

    // Map fields to match previous API response
    const mapped = items.map(item => ({
      _id: item.id,
      id: item.id,
      skinTone: item.skinTone,
      gender: item.gender,
      score: item.score,
      styleCategory: item.styleCategory,
      detectedColors: item.detectedColors,
      aiProvider: item.aiProvider,
      createdAt: item.createdAt,
    }));

    res.json({
      success: true,
      count: mapped.length,
      data: mapped,
    });
  } catch (err: any) {
    logger.error('Error fetching wardrobe:', err.message);
    next(err);
  }
}

export async function getWardrobeItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const item = await analysisRepository.findById(id);
    if (!item || item.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found in your wardrobe.',
      });
    }

    res.json({
      success: true,
      data: {
        ...item,
        _id: item.id,
      },
    });
  } catch (err: any) {
    logger.error('Error fetching wardrobe item:', err.message);
    next(err);
  }
}

export async function deleteWardrobeItem(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
      await analysisRepository.delete(id, userId);
      res.json({
        success: true,
        message: 'Analysis deleted from wardrobe.',
      });
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found or unauthorized.',
      });
    }
  } catch (err: any) {
    logger.error('Error deleting wardrobe item:', err.message);
    next(err);
  }
}
