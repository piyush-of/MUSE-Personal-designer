'use strict';

const { analyse } = require('../engine/fashionEngine');
const { enhanceAnalysisWithGemini } = require('../services/groqStylist');
const logger = require('../utils/logger');
const { v4: uuid } = require('uuid');
const crypto = require('crypto');
const User = require('../models/User');
const Analysis = require('../models/Analysis');

async function analyzeOutfit(req, res, next) {
  const id = uuid(), t0 = Date.now();
  const size = req.file?.size ?? 0;
  logger.info(`[${id}] skin=${req.body.skinTone} gender=${req.body.gender} bytes=${size}`);

  try {
    const baseAnalysis = await analyse(req.file.buffer, req.body.skinTone, req.body.gender);
    const data = await enhanceAnalysisWithGemini(baseAnalysis);

    let savedRecordId = null;
    if (req.user) {
      const user = req.userDoc || await User.findById(req.user.id);
      if (user) {
        user.analysesUsed += 1;
        await user.save();
      }

      const imageHash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

      const analysisRecord = new Analysis({
        userId: req.user.id,
        skinTone: req.body.skinTone,
        gender: req.body.gender,
        score: data.outfit_analysis?.score || 0,
        styleCategory: data.outfit_analysis?.style_category || '',
        detectedColors: data.outfit_analysis?.detected_colors || [],
        aiProvider: data.ai_provider || 'none',
        result: data,
        imageHash
      });
      const saved = await analysisRecord.save();
      savedRecordId = saved._id;
    }

    res.json({
      success: true,
      requestId: id,
      savedRecordId,
      elapsedMs: Date.now() - t0,
      data
    });
  } catch(err) {
    logger.error(`[${id}]`, err.message);
    next(err);
  }
}

module.exports = { analyzeOutfit };
