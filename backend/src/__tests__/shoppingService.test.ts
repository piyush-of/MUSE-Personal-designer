import { getShoppingItems, buildPalette, enrichShoppingItem } from '../services/shoppingService';

describe('ShoppingService', () => {
  describe('buildPalette', () => {
    it('returns palette headline for skin tone and style', () => {
      const palette = buildPalette('neutral', 'medium');
      expect(palette.headline).toContain('Medium');
      expect(palette.bestColors.length).toBeGreaterThan(0);
    });
  });

  describe('enrichShoppingItem', () => {
    it('adds retailers and line art', () => {
      const item = {
        item: 'Test Dress',
        category: 'Dress',
        priceRange: '₹1,000',
        why: 'Test',
        styleTip: 'Tip',
        amazon: 'https://amazon.in',
      };
      const enriched = enrichShoppingItem(item, 'neutral', 'medium', 'women');
      expect(enriched.retailers).toBeDefined();
      expect(enriched.lineArtSvg).toContain('svg');
      expect(enriched.story).toBe('Classic Neutrals');
    });
  });

  describe('getShoppingItems', () => {
    it('filters by category', () => {
      const result = getShoppingItems({ category: 'bold', skinTone: 'medium', gender: 'women' });
      expect(result.items.every(i => i.styleKey === 'bold')).toBe(true);
    });

    it('returns all categories when category is all', () => {
      const result = getShoppingItems({ category: 'all', skinTone: 'fair', gender: 'men' });
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.filters.genders).toContain('women');
    });

    it('filters by item type', () => {
      const result = getShoppingItems({ category: 'all', skinTone: 'medium', gender: 'women', itemType: 'Dress' });
      expect(result.items.every(i => String((i as { category?: string }).category).toLowerCase() === 'dress')).toBe(true);
    });
  });
});
