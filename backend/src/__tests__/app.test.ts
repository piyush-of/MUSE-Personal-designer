import request from 'supertest';
import app from '../app';

describe('MUSE API', () => {
  describe('GET /health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body.service).toBe('muse-api');
    });
  });

  describe('GET /api/trends/static', () => {
    it('returns static trend data without AI', async () => {
      const res = await request(app).get('/api/trends/static');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.women).toBeInstanceOf(Array);
      expect(res.body.data.men).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/shopping', () => {
    it('returns shopping picks with filters', async () => {
      const res = await request(app).get('/api/shopping?category=neutral&gender=women');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.filters).toHaveProperty('skinTones');
    });
  });

  describe('POST /api/auth/register', () => {
    it('rejects invalid payload', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('X-CSRF-Token', 'test')
        .send({ name: 'A', email: 'bad', password: 'weak' });
      expect([400, 403]).toContain(res.status);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns null user when unauthenticated', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeNull();
    });
  });
});
