'use strict';
// controllers/analyzeController.js
const { analyse } = require('../engine/fashionEngine');
const logger = require('../utils/logger');
const { v4: uuid } = require('uuid');

async function analyzeOutfit(req, res, next) {
  const id = uuid(), t0 = Date.now();
  logger.info(`[${id}] skin=${req.body.skinTone} gender=${req.body.gender} bytes=${req.file.size}`);
  try {
    const data = await analyse(req.file.buffer, req.body.skinTone, req.body.gender);
    res.json({ success: true, requestId: id, elapsedMs: Date.now()-t0, data });
  } catch(err) { logger.error(`[${id}]`, err.message); next(err); }
}
module.exports = { analyzeOutfit };
