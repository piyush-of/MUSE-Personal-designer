'use strict';

const config = require('../../config');
const logger = require('../utils/logger');

function extractJsonObject(text = '') {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function extractGeminiText(payload) {
  return (payload?.candidates || [])
    .flatMap(candidate => candidate?.content?.parts || [])
    .map(part => part.text || '')
    .join('\n')
    .trim();
}

async function generateGeminiJson(prompt, { task = 'content', temperature = 0.45 } = {}) {
  if (!config.gemini.enabled) return null;

  const endpoint = `${config.gemini.baseUrl}/models/${encodeURIComponent(config.gemini.model)}:generateContent?key=${encodeURIComponent(config.gemini.apiKey)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: 'You are MUSE, a precise luxury fashion intelligence engine. Return strict JSON only. Do not include markdown.',
          }],
        },
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          temperature,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(config.gemini.timeoutMs),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn(`Gemini ${task} request failed with ${response.status}: ${body.slice(0, 240)}`);
      return null;
    }

    const payload = await response.json();
    const text = extractGeminiText(payload);
    return extractJsonObject(text);
  } catch (error) {
    logger.warn(`Gemini ${task} skipped: ${error.message}`);
    return null;
  }
}

function listJoin(items = []) {
  const clean = items.filter(Boolean);
  if (clean.length <= 1) return clean[0] || '';
  return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`;
}

function buildFallbackEnhancement(analysis) {
  const outfit = analysis.outfit_analysis || {};
  const palette = analysis.skin_palette || {};
  const shopping = analysis.shopping_picks || {};
  const combos = analysis.combo_suggestions || {};
  const bestColors = palette.best_colors || [];
  const avoidColors = palette.avoid_colors || [];
  const detected = outfit.detected_colors || [];
  const styleCategory = outfit.style_category || 'balanced';
  const occasion = outfit.occasion || 'everyday wear';
  const score = Number(outfit.score || 0);
  const scoreTone = score >= 82 ? 'already strong' : score >= 68 ? 'promising with a few sharper choices' : 'ready for a more intentional reset';

  return {
    ...analysis,
    outfit_analysis: {
      ...outfit,
      feedback: `This ${styleCategory} look is ${scoreTone} for ${occasion}. Keep ${listJoin(detected.slice(0, 2)) || 'the main outfit tones'} as the visual anchor, then add one controlled accent from your palette for a cleaner finish.`,
    },
    skin_palette: {
      ...palette,
      summary: `Your most reliable direction is ${listJoin(bestColors.slice(0, 4)) || 'balanced mid-tone color'} with ${listJoin((palette.neutrals || []).slice(0, 2)) || 'soft neutrals'} as the base. Limit ${listJoin(avoidColors.slice(0, 2)) || 'overpowering colors'} near the face when you want a polished result.`,
    },
    shopping_picks: {
      ...shopping,
      intro: `Prioritize pieces that repeat your best palette colors, fit the ${styleCategory} mood, and can combine with at least two wardrobe staples.`,
    },
    combo_suggestions: {
      ...combos,
      intro: `Build outfits with one hero color, one quiet neutral, and one texture change so the result feels deliberate instead of busy.`,
    },
    style_dos_donts: {
      dos: [
        `Use ${bestColors[0] || 'your strongest color'} close to the face for instant lift.`,
        'Repeat one color in a shoe, belt, bag, or accessory to make the outfit feel composed.',
        'Choose one statement element at a time: color, pattern, shine, or silhouette.',
      ],
      donts: [
        `Avoid stacking ${avoidColors[0] || 'low-flattery colors'} with other intense tones near your face.`,
        'Do not mix multiple loud patterns unless they share a common base color.',
        'Skip pieces that only work in one outfit unless they solve a specific wardrobe gap.',
      ],
    },
    ai_provider: 'fallback',
    ai_model: 'muse-rule-polish-v1',
  };
}

function buildAnalysisPrompt(analysis) {
  const outfit = analysis.outfit_analysis || {};
  const palette = analysis.skin_palette || {};
  const shopping = analysis.shopping_picks || {};
  const combos = analysis.combo_suggestions || {};
  const bestCombos = analysis.best_combo_matches || {};

  return [
    'Improve this fashion analysis while staying consistent with the supplied rule-engine facts.',
    'Return JSON with exactly this shape:',
    '{"outfit_feedback":"","palette_summary":"","shopping_intro":"","combo_intro":"","dos":[],"donts":[]}',
    `Outfit category: ${outfit.style_category || ''}`,
    `Occasion: ${outfit.occasion || ''}`,
    `Season: ${outfit.season || ''}`,
    `Score: ${outfit.score || ''}`,
    `Detected colors: ${(outfit.detected_colors || []).join(', ')}`,
    `Current feedback: ${outfit.feedback || ''}`,
    `Skin palette summary: ${palette.summary || ''}`,
    `Best colors: ${(palette.best_colors || []).join(', ')}`,
    `Avoid colors: ${(palette.avoid_colors || []).join(', ')}`,
    `Shopping items: ${(shopping.items || []).map(item => `${item.item} (${item.category})`).join(', ')}`,
    `Combo intro: ${combos.intro || ''}`,
    `Best combo intro: ${bestCombos.intro || ''}`,
    'Keep each field concise, premium, practical, and specific. Limit dos and donts to 3 each.',
  ].join('\n');
}

async function enhanceAnalysisWithGemini(analysis) {
  const fallbackAnalysis = buildFallbackEnhancement(analysis);
  const parsed = await generateGeminiJson(buildAnalysisPrompt(fallbackAnalysis), {
    task: 'analysis',
    temperature: 0.45,
  });

  if (!parsed) return fallbackAnalysis;

  return {
    ...fallbackAnalysis,
    outfit_analysis: {
      ...fallbackAnalysis.outfit_analysis,
      feedback: parsed.outfit_feedback || fallbackAnalysis.outfit_analysis.feedback,
    },
    skin_palette: {
      ...fallbackAnalysis.skin_palette,
      summary: parsed.palette_summary || fallbackAnalysis.skin_palette.summary,
    },
    shopping_picks: {
      ...fallbackAnalysis.shopping_picks,
      intro: parsed.shopping_intro || fallbackAnalysis.shopping_picks.intro,
    },
    combo_suggestions: {
      ...fallbackAnalysis.combo_suggestions,
      intro: parsed.combo_intro || fallbackAnalysis.combo_suggestions.intro,
    },
    style_dos_donts: {
      dos: Array.isArray(parsed.dos) && parsed.dos.length ? parsed.dos : fallbackAnalysis.style_dos_donts.dos,
      donts: Array.isArray(parsed.donts) && parsed.donts.length ? parsed.donts : fallbackAnalysis.style_dos_donts.donts,
    },
    ai_provider: 'gemini',
    ai_model: config.gemini.model,
  };
}

function fallbackTrendContent(women = [], men = []) {
  return {
    headline: 'AI trend radar',
    summary: 'MUSE blends current trend directions with wearable pieces, color signals, and practical styling moves for women and men.',
    womenIntro: 'Women direction: refined tailoring, romantic softness, and color-led statement dressing.',
    menIntro: 'Men direction: relaxed tailoring, cleaner utility, tonal eveningwear, and versatile knit layers.',
    keySignals: [...women, ...men].slice(0, 4).map(trend => trend.trend),
  };
}

function buildTrendPrompt(women, men) {
  return [
    'Create concise editorial trend content for a fashion web app.',
    'Return JSON with this shape:',
    '{"headline":"","summary":"","womenIntro":"","menIntro":"","keySignals":[]}',
    `Women trends: ${women.map(t => `${t.trend}: ${t.description}`).join(' | ')}`,
    `Men trends: ${men.map(t => `${t.trend}: ${t.description}`).join(' | ')}`,
    'Use fresh, practical language. keySignals must contain 4 short strings.',
  ].join('\n');
}

async function enhanceTrendsWithGemini({ women, men }) {
  const fallback = fallbackTrendContent(women, men);
  const parsed = await generateGeminiJson(buildTrendPrompt(women, men), {
    task: 'trends',
    temperature: 0.55,
  });

  if (!parsed) return { ...fallback, ai_provider: 'fallback', ai_model: 'muse-rule-polish-v1' };
  return {
    headline: parsed.headline || fallback.headline,
    summary: parsed.summary || fallback.summary,
    womenIntro: parsed.womenIntro || fallback.womenIntro,
    menIntro: parsed.menIntro || fallback.menIntro,
    keySignals: Array.isArray(parsed.keySignals) && parsed.keySignals.length ? parsed.keySignals.slice(0, 4) : fallback.keySignals,
    ai_provider: 'gemini',
    ai_model: config.gemini.model,
  };
}

function fallbackShoppingContent(context, count) {
  const palette = context.paletteHeadline || {};
  return {
    headline: palette.headline || 'Recommended shopping context',
    copy: `Showing ${count} picks for ${context.audience || 'women'} with a ${context.skinTone || 'medium'} skin tone. These suggestions blend inventory, palette logic, and current trend signals.`,
    buyingRule: 'Buy pieces that repeat your best colors, solve a real wardrobe gap, and style at least two ways.',
    patternRule: 'Keep one hero detail per outfit: color, print, texture, or silhouette.',
  };
}

function buildShoppingPrompt(context, items) {
  const palette = context.paletteHeadline || {};
  return [
    'Create shopping-context copy for a fashion web app.',
    'Return JSON with this shape:',
    '{"headline":"","copy":"","buyingRule":"","patternRule":""}',
    `Audience: ${context.audience}`,
    `Skin tone: ${context.skinTone}`,
    `Palette headline: ${palette.headline || ''}`,
    `Best colors: ${(palette.bestColors || []).join(', ')}`,
    `Avoid colors: ${(palette.avoid || []).join(', ')}`,
    `Trend highlights: ${(context.trendHighlights || []).map(t => t.trend).join(', ')}`,
    `Items: ${items.slice(0, 8).map(item => `${item.item} (${item.category})`).join(', ')}`,
    'Make it concise, premium, practical, and specific to the filters.',
  ].join('\n');
}

async function enhanceShoppingContextWithGemini(context, items) {
  const fallback = fallbackShoppingContent(context, items.length);
  const parsed = await generateGeminiJson(buildShoppingPrompt(context, items), {
    task: 'shopping content',
    temperature: 0.5,
  });

  if (!parsed) return { ...fallback, ai_provider: 'fallback', ai_model: 'muse-rule-polish-v1' };
  return {
    headline: parsed.headline || fallback.headline,
    copy: parsed.copy || fallback.copy,
    buyingRule: parsed.buyingRule || fallback.buyingRule,
    patternRule: parsed.patternRule || fallback.patternRule,
    ai_provider: 'gemini',
    ai_model: config.gemini.model,
  };
}

module.exports = {
  enhanceAnalysisWithGemini,
  enhanceAnalysisWithGroq: enhanceAnalysisWithGemini,
  enhanceShoppingContextWithGemini,
  enhanceTrendsWithGemini,
  generateGeminiJson,
};
