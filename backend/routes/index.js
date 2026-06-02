'use strict';

const multer = require('multer');
const mongoose = require('mongoose');
const config = require('../../config');
const { validateAnalyze } = require('../middleware/validate');
const { analyzeOutfit } = require('../controllers/analyzeController');
const { checkAnalysisQuota } = require('../middleware/auth');
const { UPDATED_AT, WOMEN_TRENDS, MEN_TRENDS } = require('../data/trends');
const { SHOPPING_DB, SKIN_DATA, buildRetailerLinks } = require('../engine/fashionEngine');
const { enhanceShoppingContextWithGemini, enhanceTrendsWithGemini } = require('../services/groqStylist');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxBytes },
  fileFilter(_req, file, cb) {
    config.upload.allowedMime.includes(file.mimetype)
      ? cb(null, true)
      : cb(Object.assign(new Error(`Unsupported type: ${file.mimetype}`), { status: 415 }));
  },
});

const STYLE_STORIES = {
  neutral: {
    label: 'Classic Neutrals',
    desc: 'Quiet-luxury layers, foundational wardrobe builders, and polished everyday styling.',
    palette: ['Ivory', 'Camel', 'Greige', 'Soft Black'],
    pattern: 'Solid foundations with pinstripes or tiny checks',
    silhouette: 'tailored',
    mood: 'Refined and versatile',
    occasions: ['Office', 'Travel', 'Daily polish'],
  },
  earthy: {
    label: 'Earth Tones',
    desc: 'Grounded warm dressing with terracotta, olive, rust, and texture-rich layers.',
    palette: ['Terracotta', 'Olive', 'Sand', 'Chocolate'],
    pattern: 'Organic florals, ikat details, and textured solids',
    silhouette: 'flowing',
    mood: 'Warm and elevated',
    occasions: ['Weekend', 'Brunch', 'Resort'],
  },
  bold: {
    label: 'Bold & Vivid',
    desc: 'High-energy statement dressing led by saturated colors and sharper contrast.',
    palette: ['Cobalt', 'Fuchsia', 'Emerald', 'Bright White'],
    pattern: 'Color blocking, abstract florals, and graphic prints',
    silhouette: 'statement',
    mood: 'Confident and expressive',
    occasions: ['Party', 'Events', 'Night out'],
  },
  pastel: {
    label: 'Pastels',
    desc: 'Soft-focus color stories with airy silhouettes and light layering.',
    palette: ['Powder Blue', 'Blush', 'Mint', 'Butter'],
    pattern: 'Soft florals, watercolor motifs, and tonal textures',
    silhouette: 'soft',
    mood: 'Light and romantic',
    occasions: ['Garden party', 'Day dates', 'Summer days'],
  },
  classic: {
    label: 'Timeless Classic',
    desc: 'Structured essentials that stay relevant across seasons and occasions.',
    palette: ['Navy', 'White', 'Beige', 'Espresso'],
    pattern: 'Herringbone, micro-checks, and polished solids',
    silhouette: 'tailored',
    mood: 'Sharp and timeless',
    occasions: ['Work', 'Meetings', 'Evening dinner'],
  },
};

const CATEGORY_SKETCHES = {
  dress: 'dress',
  'co-ord': 'dress',
  tops: 'top',
  bottoms: 'bottom',
  outerwear: 'jacket',
  footwear: 'shoe',
  accessories: 'bag',
};

const PATTERN_GUIDE = {
  neutral: {
    best: 'Solid dressing with one subtle stripe or check',
    avoid: 'Too many competing loud prints',
    mix: 'Layer matte and satin neutrals to keep the look dimensional.',
  },
  earthy: {
    best: 'Texture-led solids with soft botanical or handloom-inspired prints',
    avoid: 'Icy geometric prints',
    mix: 'Keep one warm anchor shade like terracotta or olive in every look.',
  },
  bold: {
    best: 'Strong color blocking or one hero statement print',
    avoid: 'Stacking multiple neon patterns together',
    mix: 'Pair one saturated piece with one calmer support tone for balance.',
  },
  pastel: {
    best: 'Watercolor florals and tonal ombre details',
    avoid: 'Harsh black-based graphics',
    mix: 'Use creamy white to connect pastel pieces without breaking softness.',
  },
  classic: {
    best: 'Pinstripes, heritage checks, or fully solid tailoring',
    avoid: 'Overly distressed patterns',
    mix: 'Repeat one dark neutral twice to make the outfit feel intentional.',
  },
};

function titleCase(value = '') {
  return String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ');
}

function resolveAudience(gender) {
  return gender === 'men' ? 'men' : 'women';
}

function getTrendPool(gender) {
  return resolveAudience(gender) === 'men' ? MEN_TRENDS : WOMEN_TRENDS;
}

function buildPalette(styleKey, skinTone) {
  const story = STYLE_STORIES[styleKey] || STYLE_STORIES.neutral;
  const skin = SKIN_DATA[skinTone] || SKIN_DATA.medium;
  const primary = skin.bestColors.slice(0, 2);
  const support = story.palette.slice(0, 2);
  const accents = skin.neutrals.slice(0, 2);

  return {
    headline: `${titleCase(skinTone || 'medium')} skin tone + ${story.label}`,
    bestColors: [...new Set([...primary, ...support])].slice(0, 4),
    accents,
    avoid: skin.avoidColors.slice(0, 2),
    metals: skin.metals,
  };
}

function createSketchSvg(item, styleKey) {
  const categoryKey = CATEGORY_SKETCHES[String(item.category || '').toLowerCase()] || 'dress';
  const story = STYLE_STORIES[styleKey] || STYLE_STORIES.neutral;
  const stroke = styleKey === 'bold' ? '#B5674D' : '#1A1714';
  const accent = {
    neutral: '#C8A870',
    earthy: '#9A6B4F',
    bold: '#B5674D',
    pastel: '#A886C1',
    classic: '#35506B',
  }[styleKey] || '#B5674D';

  const figures = {
    dress: `
      <path d="M59 25c3-8 12-13 21-13s18 5 21 13l5 15c2 5 7 10 12 13l12 8-16 17-7 45H53l-7-45-16-17 12-8c5-3 10-8 12-13l5-15Z" />
      <path d="M66 39h28" />
      <path d="M58 75h44" stroke="${accent}" />
    `,
    top: `
      <path d="M52 25c4-7 12-12 20-12h16c8 0 16 5 20 12l11 18-15 13-9 67H45L36 56 21 43l11-18Z" />
      <path d="M57 42h46" stroke="${accent}" />
    `,
    bottom: `
      <path d="M48 15h56l7 30-10 78H77l-7-45-7 45H39L29 45l19-30Z" />
      <path d="M48 15l14 32" />
      <path d="M104 15 90 47" />
    `,
    jacket: `
      <path d="M50 17h60l12 20-16 16-10 70H74l-4-38-4 38H44L34 53 18 37l12-20Z" />
      <path d="M80 18v105" stroke="${accent}" />
      <path d="M60 46h40" />
    `,
    shoe: `
      <path d="M25 84c11 0 18-8 26-20l8-12 13 3c6 2 12 6 18 12l16 16c4 4 9 6 15 6h10v14H25c-8 0-14-5-14-11s6-8 14-8Z" />
      <path d="M58 55c6 9 14 15 22 18" stroke="${accent}" />
    `,
    bag: `
      <path d="M37 45h86l-6 68c-1 9-8 15-17 15H60c-9 0-16-6-17-15l-6-68Z" />
      <path d="M58 45c0-18 10-29 22-29s22 11 22 29" />
      <path d="M54 70h52" stroke="${accent}" />
    `,
  };

  const markup = figures[categoryKey];

  return `
    <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8f2ea" />
          <stop offset="100%" stop-color="#efe3d4" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="28" fill="url(#bg)" />
      <circle cx="124" cy="36" r="18" fill="${accent}" fill-opacity="0.08" />
      <g fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        ${markup}
      </g>
      <text x="18" y="145" fill="${accent}" font-family="DM Mono, monospace" font-size="10" letter-spacing="1.6">${story.mood.toUpperCase()}</text>
    </svg>
  `.trim();
}

function enrichShoppingItem(item, styleKey, skinTone, gender) {
  const story = STYLE_STORIES[styleKey] || STYLE_STORIES.neutral;
  const palette = buildPalette(styleKey, skinTone);
  const trendMatch = getTrendPool(gender).find(trend =>
    trend.colors.some(color => palette.bestColors.some(best => best.toLowerCase().includes(color.split(' ')[0].toLowerCase())))
  );
  const pattern = PATTERN_GUIDE[styleKey] || PATTERN_GUIDE.neutral;

  return {
    ...item,
    styleKey,
    story: story.label,
    audience: resolveAudience(gender),
    silhouette: story.silhouette,
    recommendedPalette: palette,
    patternAdvice: pattern,
    styleInsights: {
      mood: story.mood,
      occasions: story.occasions,
      stylingNote: `${story.desc} Best when anchored with ${palette.accents[0] || 'a strong neutral'}.`,
    },
    trendSignal: trendMatch
      ? {
          trend: trendMatch.trend,
          season: trendMatch.season,
          colors: trendMatch.colors.slice(0, 3),
        }
      : null,
    retailers: buildRetailerLinks(item),
    lineArtSvg: createSketchSvg(item, styleKey),
  };
}

const analyzeRouter = require('express').Router();
analyzeRouter.post('/', upload.single('image'), validateAnalyze, checkAnalysisQuota, analyzeOutfit);

const trendsRouter = require('express').Router();

trendsRouter.get('/', async (_req, res, next) => {
  try {
    const content = await enhanceTrendsWithGemini({ women: WOMEN_TRENDS, men: MEN_TRENDS });
    res.json({
      success: true,
      data: {
        updatedAt: UPDATED_AT,
        women: WOMEN_TRENDS,
        men: MEN_TRENDS,
        content,
      },
    });
  } catch (err) {
    next(err);
  }
});

trendsRouter.get('/women', async (_req, res, next) => {
  try {
    const content = await enhanceTrendsWithGemini({ women: WOMEN_TRENDS, men: [] });
    res.json({ success: true, data: WOMEN_TRENDS, updatedAt: UPDATED_AT, content });
  } catch (err) {
    next(err);
  }
});

trendsRouter.get('/men', async (_req, res, next) => {
  try {
    const content = await enhanceTrendsWithGemini({ women: [], men: MEN_TRENDS });
    res.json({ success: true, data: MEN_TRENDS, updatedAt: UPDATED_AT, content });
  } catch (err) {
    next(err);
  }
});

trendsRouter.get('/static', (_req, res) => {
  res.json({
    success: true,
    data: {
      updatedAt: UPDATED_AT,
      women: WOMEN_TRENDS,
      men: MEN_TRENDS,
    },
  });
});

const shoppingRouter = require('express').Router();

shoppingRouter.get('/', async (req, res, next) => {
  const { category, skinTone = 'medium', gender = 'women', itemType } = req.query;
  try {
    const all = Object.entries(SHOPPING_DB).flatMap(([key, items]) =>
      items.map(item => enrichShoppingItem(item, key, skinTone, gender))
    );

    const filtered = all.filter(item => {
      if (category && category !== 'all' && item.styleKey !== category) return false;
      if (itemType && itemType !== 'all' && String(item.category || '').toLowerCase() !== String(itemType).toLowerCase()) return false;
      return true;
    });

    const trendPool = getTrendPool(gender).slice(0, 3).map(trend => ({
      trend: trend.trend,
      season: trend.season,
      colors: trend.colors,
    }));

    const context = {
      updatedAt: UPDATED_AT,
      audience: resolveAudience(gender),
      skinTone,
      paletteHeadline: buildPalette(category && category !== 'all' ? category : 'neutral', skinTone),
      trendHighlights: trendPool,
    };
    const aiContent = await enhanceShoppingContextWithGemini(context, filtered);

    res.json({
      success: true,
      data: filtered,
      categories: ['all', ...Object.keys(SHOPPING_DB)],
      filters: {
        genders: ['women', 'men'],
        skinTones: Object.keys(SKIN_DATA),
        itemTypes: ['all', 'Dress', 'Co-ord', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'],
      },
      context: {
        ...context,
        aiContent,
      },
    });
  } catch (err) {
    next(err);
  }
});

const healthRouter = require('express').Router();
healthRouter.get('/', (_req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: dbState === 'connected' || config.isTest ? 'ok' : 'degraded',
    service: 'muse-v4',
    env: config.env,
    database: dbState,
    ai: config.gemini.enabled ? 'gemini' : 'fallback',
    timestamp: new Date().toISOString(),
  });
});

module.exports = { analyzeRouter, trendsRouter, shoppingRouter, healthRouter };
