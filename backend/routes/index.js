'use strict';
// ── Analyze route ──────────────────────────────────────────────────────────
const multer = require('multer');
const config = require('../../config');
const validate = require('../middleware/validate');
const { analyzeOutfit } = require('../controllers/analyzeController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxBytes },
  fileFilter(_req, file, cb) {
    config.upload.allowedMime.includes(file.mimetype)
      ? cb(null, true)
      : cb(Object.assign(new Error(`Unsupported type: ${file.mimetype}`), { status: 415 }));
  },
});

const analyzeRouter = require('express').Router();
analyzeRouter.post('/', upload.single('image'), validate, analyzeOutfit);

// ── Trends route ───────────────────────────────────────────────────────────
const { UPDATED_AT, WOMEN_TRENDS, MEN_TRENDS } = require('../data/trends');
const trendsRouter = require('express').Router();

trendsRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      updatedAt: UPDATED_AT,
      women: WOMEN_TRENDS,
      men: MEN_TRENDS,
    },
  });
});

trendsRouter.get('/women', (_req, res) => {
  res.json({ success: true, data: WOMEN_TRENDS, updatedAt: UPDATED_AT });
});

trendsRouter.get('/men', (_req, res) => {
  res.json({ success: true, data: MEN_TRENDS, updatedAt: UPDATED_AT });
});

// ── Shopping route ─────────────────────────────────────────────────────────
const { SHOPPING_DB } = require('../engine/fashionEngine');
const shoppingRouter = require('express').Router();

shoppingRouter.get('/', (req, res) => {
  const { category } = req.query;
  const all = Object.entries(SHOPPING_DB).flatMap(([key, items]) =>
    items.map(item => ({ ...item, styleKey: key }))
  );
  const filtered = category ? all.filter(i => i.styleKey === category) : all;
  res.json({ success: true, data: filtered, categories: Object.keys(SHOPPING_DB) });
});

// ── Health route ───────────────────────────────────────────────────────────
const healthRouter = require('express').Router();
healthRouter.get('/', (_req, res) => res.json({ status: 'ok', service: 'muse-v3', timestamp: new Date().toISOString() }));

module.exports = { analyzeRouter, trendsRouter, shoppingRouter, healthRouter };
