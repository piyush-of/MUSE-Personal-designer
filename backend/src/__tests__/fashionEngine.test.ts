import { scoreOutfit } from '../engine/fashionEngine';

describe('Fashion Engine', () => {
  describe('scoreOutfit', () => {
    it('returns higher score for matching skin tone colors', () => {
      const goodScore = scoreOutfit(['Camel', 'Ivory', 'Brown / Chocolate'], 'medium');
      const poorScore = scoreOutfit(['Neon Green', 'Hot Pink', 'Electric Blue'], 'porcelain');
      expect(goodScore).toBeGreaterThan(poorScore);
    });

    it('clamps score between 10 and 98', () => {
      const score = scoreOutfit(['White / Ivory'], 'fair');
      expect(score).toBeGreaterThanOrEqual(10);
      expect(score).toBeLessThanOrEqual(98);
    });
  });
});
