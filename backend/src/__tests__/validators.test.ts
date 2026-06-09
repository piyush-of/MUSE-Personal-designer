import { analyzeSchema, registerSchema, loginSchema } from '../validators/schemas';

describe('Validators', () => {
  describe('analyzeSchema', () => {
    it('accepts valid skin tone and gender', () => {
      const result = analyzeSchema.safeParse({ skinTone: 'medium', gender: 'women' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid skin tone', () => {
      const result = analyzeSchema.safeParse({ skinTone: 'invalid', gender: 'women' });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('requires strong password', () => {
      const result = registerSchema.safeParse({ name: 'Test User', email: 'test@example.com', password: 'weak' });
      expect(result.success).toBe(false);
    });

    it('accepts valid registration', () => {
      const result = registerSchema.safeParse({ name: 'Test User', email: 'test@example.com', password: 'Secure123' });
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('requires email and password', () => {
      expect(loginSchema.safeParse({ email: '', password: '' }).success).toBe(false);
      expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
    });
  });
});
