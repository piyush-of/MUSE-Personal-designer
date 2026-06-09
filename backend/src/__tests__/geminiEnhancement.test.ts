import { enhanceTrendsWithGemini, enhanceShoppingContextWithGemini } from '../services/geminiService';
import { WOMEN_TRENDS, MEN_TRENDS } from '../data/trends';

describe('Gemini Enhancement (fallback mode)', () => {
  it('returns fallback trend content without API key', async () => {
    const result = await enhanceTrendsWithGemini({ women: WOMEN_TRENDS.slice(0, 2), men: MEN_TRENDS.slice(0, 2) });
    expect(result.headline).toBeDefined();
    expect(result.keySignals).toBeInstanceOf(Array);
    expect(result.ai_provider).toBe('fallback');
  });

  it('returns fallback shopping content without API key', async () => {
    const context = { audience: 'women', skinTone: 'medium', paletteHeadline: { headline: 'Test' }, trendHighlights: [] };
    const result = await enhanceShoppingContextWithGemini(context, []);
    expect(result.headline).toBeDefined();
    expect(result.copy).toContain('Showing');
  });
});
