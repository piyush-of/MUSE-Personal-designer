import { Request, Response, NextFunction } from 'express';
import { analyse } from '../engine/fashionEngine';
import { enhanceAnalysisWithGemini } from '../services/geminiService';
import logger from '../utils/logger';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import { UserRepository } from '../repositories/userRepository';
import { AnalysisRepository } from '../repositories/analysisRepository';
import cloudinaryService from '../services/cloudinaryService';

const userRepository = new UserRepository();
const analysisRepository = new AnalysisRepository();

export async function analyzeOutfit(req: Request, res: Response, next: NextFunction) {
  const id = uuid();
  const t0 = Date.now();
  const size = req.file?.size ?? 0;
  logger.info(`[${id}] skin=${req.body.skinTone} gender=${req.body.gender} bytes=${size}`);

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const baseAnalysis = await analyse(req.file.buffer, req.body.skinTone, req.body.gender);
    const data = await enhanceAnalysisWithGemini(baseAnalysis);

    let savedRecordId: string | null = null;

    if (req.user) {
      const user = req.userDoc || await userRepository.findById(req.user.id);
      if (user) {
        await userRepository.incrementAnalysesUsed(user.id);
      }

      // Hash the image for deduplication checks
      const imageHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

      // Upload image to Cloudinary (optional/if configured)
      let imageUrl: string | undefined;
      try {
        imageUrl = await cloudinaryService.uploadImage(req.file.buffer);
      } catch (err: any) {
        logger.warn(`Cloudinary upload failed: ${err.message}`);
      }

      // Add image url to output result if uploaded
      if (imageUrl) {
        data.image_url = imageUrl;
      }

      const score = data.outfit_analysis?.score ?? 0;
      const styleCategory = data.outfit_analysis?.style_category ?? '';
      const detectedColors = data.outfit_analysis?.detected_colors ?? [];
      const aiProvider = data.ai_provider ?? 'none';

      const analysisRecord = await analysisRepository.create({
        userId: req.user.id,
        skinTone: req.body.skinTone,
        gender: req.body.gender,
        score,
        styleCategory,
        detectedColors,
        aiProvider,
        result: data,
        imageHash,
        imageUrl,
      });
      savedRecordId = analysisRecord.id;
    }

    res.json({
      success: true,
      requestId: id,
      savedRecordId,
      elapsedMs: Date.now() - t0,
      data
    });
  } catch (err: any) {
    logger.error(`[${id}]`, err.message);
    next(err);
  }
}
