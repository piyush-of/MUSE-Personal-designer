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

function buildPrompt(analysis) {
  const outfit = analysis.outfit_analysis || {};
  const palette = analysis.skin_palette || {};
  const shopping = analysis.shopping_picks || {};
  const combos = analysis.combo_suggestions || {};
  const bestCombos = analysis.best_combo_matches || {};

  return [
    'You are a luxury fashion stylist.',
    'Improve the existing outfit analysis while staying consistent with the provided data.',
    'Return only valid JSON with this exact shape:',
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
    `Shopping intro: ${shopping.intro || ''}`,
    `Shopping items: ${(shopping.items || []).map(item => `${item.item} (${item.category})`).join(', ')}`,
    `Combo intro: ${combos.intro || ''}`,
    `Best combo intro: ${bestCombos.intro || ''}`,
    'Keep each field concise and polished. Limit dos and donts to 3 each.'
  ].join('\n');
}

async function enhanceAnalysisWithGroq(analysis) {
  if (!config.groq.apiKey) return analysis;

  try {
    const response = await fetch(config.groq.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.groq.apiKey}`,
      },
      body: JSON.stringify({
        model: config.groq.model,
        temperature: 0.5,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are an expert personal stylist. Return strict JSON only.'
          },
          {
            role: 'user',
            content: buildPrompt(analysis)
          }
        ]
      }),
      signal: AbortSignal.timeout(config.groq.timeoutMs),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn(`Groq request failed with ${response.status}: ${body.slice(0, 200)}`);
      return analysis;
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content || '';
    const parsed = extractJsonObject(content);
    if (!parsed) {
      logger.warn('Groq response did not contain valid JSON content.');
      return analysis;
    }

    return {
      ...analysis,
      outfit_analysis: {
        ...analysis.outfit_analysis,
        feedback: parsed.outfit_feedback || analysis.outfit_analysis.feedback,
      },
      skin_palette: {
        ...analysis.skin_palette,
        summary: parsed.palette_summary || analysis.skin_palette.summary,
      },
      shopping_picks: {
        ...analysis.shopping_picks,
        intro: parsed.shopping_intro || analysis.shopping_picks.intro,
      },
      combo_suggestions: {
        ...analysis.combo_suggestions,
        intro: parsed.combo_intro || analysis.combo_suggestions.intro,
      },
      style_dos_donts: {
        dos: Array.isArray(parsed.dos) && parsed.dos.length ? parsed.dos : analysis.style_dos_donts.dos,
        donts: Array.isArray(parsed.donts) && parsed.donts.length ? parsed.donts : analysis.style_dos_donts.donts,
      },
      ai_provider: 'groq',
      ai_model: config.groq.model,
    };
  } catch (error) {
    logger.warn(`Groq enhancement skipped: ${error.message}`);
    return analysis;
  }
}

module.exports = { enhanceAnalysisWithGroq };
