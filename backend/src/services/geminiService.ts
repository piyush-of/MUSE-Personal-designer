import { generateAIJson } from './aiService';

function listJoin(items: string[] = []): string {
  const clean = items.filter(Boolean);
  if (clean.length <= 1) return clean[0] || '';
  return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`;
}

function buildFallbackEnhancement(analysis: any): any {
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

function buildAnalysisPrompt(analysis: any): string {
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
    `Shopping items: ${(shopping.items || []).map((item: any) => `${item.item} (${item.category})`).join(', ')}`,
    `Combo intro: ${combos.intro || ''}`,
    `Best combo intro: ${bestCombos.intro || ''}`,
    'Keep each field concise, premium, practical, and specific. Limit dos and donts to 3 each.',
  ].join('\n');
}

export async function enhanceAnalysisWithGemini(analysis: any): Promise<any> {
  const fallbackAnalysis = buildFallbackEnhancement(analysis);
  const { data: parsed, provider, model } = await generateAIJson(buildAnalysisPrompt(fallbackAnalysis), {
    task: 'analysis',
    temperature: 0.45,
    cacheKey: `analysis:${JSON.stringify(fallbackAnalysis.outfit_analysis?.detected_colors || [])}`,
    cacheTtlSec: 1800,
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
    ai_provider: provider,
    ai_model: model,
  };
}

function fallbackTrendContent(women: any[] = [], men: any[] = []): any {
  return {
    headline: 'AI trend radar',
    summary: 'MUSE blends current trend directions with wearable pieces, color signals, and practical styling moves for women and men.',
    womenIntro: 'Women direction: refined tailoring, romantic softness, and color-led statement dressing.',
    menIntro: 'Men direction: relaxed tailoring, cleaner utility, tonal eveningwear, and versatile knit layers.',
    keySignals: [...women, ...men].slice(0, 4).map(trend => trend.trend),
  };
}

function buildTrendPrompt(women: any[], men: any[]): string {
  return [
    'Create concise editorial trend content for a fashion web app.',
    'Return JSON with this shape:',
    '{"headline":"","summary":"","womenIntro":"","menIntro":"","keySignals":[]}',
    `Women trends: ${women.map(t => `${t.trend}: ${t.description}`).join(' | ')}`,
    `Men trends: ${men.map(t => `${t.trend}: ${t.description}`).join(' | ')}`,
    'Use fresh, practical language. keySignals must contain 4 short strings.',
  ].join('\n');
}

export async function enhanceTrendsWithGemini({ women, men }: { women: any[]; men: any[] }): Promise<any> {
  const fallback = fallbackTrendContent(women, men);
  const { data: parsed, provider, model } = await generateAIJson(buildTrendPrompt(women, men), {
    task: 'trends',
    temperature: 0.55,
    cacheKey: 'trends:editorial',
    cacheTtlSec: 3600,
  });

  if (!parsed) return { ...fallback, ai_provider: 'fallback', ai_model: 'muse-rule-polish-v1' };
  return {
    headline: parsed.headline || fallback.headline,
    summary: parsed.summary || fallback.summary,
    womenIntro: parsed.womenIntro || fallback.womenIntro,
    menIntro: parsed.menIntro || fallback.menIntro,
    keySignals: Array.isArray(parsed.keySignals) && parsed.keySignals.length ? (parsed.keySignals as string[]).slice(0, 4) : fallback.keySignals,
    ai_provider: provider,
    ai_model: model,
  };
}

function fallbackShoppingContent(context: any, count: number): any {
  const palette = context.paletteHeadline || {};
  return {
    headline: palette.headline || 'Recommended shopping context',
    copy: `Showing ${count} picks for ${context.audience || 'women'} with a ${context.skinTone || 'medium'} skin tone. These suggestions blend inventory, palette logic, and current trend signals.`,
    buyingRule: 'Buy pieces that repeat your best colors, solve a real wardrobe gap, and style at least two ways.',
    patternRule: 'Keep one hero detail per outfit: color, print, texture, or silhouette.',
  };
}

function buildShoppingPrompt(context: any, items: any[]): string {
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
    `Trend highlights: ${(context.trendHighlights || []).map((t: any) => t.trend).join(', ')}`,
    `Items: ${items.slice(0, 8).map(item => `${item.item} (${item.category})`).join(', ')}`,
    'Make it concise, premium, practical, and specific to the filters.',
  ].join('\n');
}

export async function enhanceShoppingContextWithGemini(context: any, items: any[]): Promise<any> {
  const fallback = fallbackShoppingContent(context, items.length);
  const cacheKey = `shopping:${context.audience}:${context.skinTone}:${items.length}`;
  const { data: parsed, provider, model } = await generateAIJson(buildShoppingPrompt(context, items), {
    task: 'shopping content',
    temperature: 0.5,
    cacheKey,
    cacheTtlSec: 1800,
  });

  if (!parsed) return { ...fallback, ai_provider: 'fallback', ai_model: 'muse-rule-polish-v1' };
  return {
    headline: parsed.headline || fallback.headline,
    copy: parsed.copy || fallback.copy,
    buyingRule: parsed.buyingRule || fallback.buyingRule,
    patternRule: parsed.patternRule || fallback.patternRule,
    ai_provider: provider,
    ai_model: model,
  };
}
