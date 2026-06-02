'use strict';

const request = require('supertest');
const app = require('../app');

describe('app deployment smoke checks', () => {
  test('GET /health reports service status', async () => {
    const res = await request(app).get('/health').expect(200);

    expect(res.body).toEqual(expect.objectContaining({
      service: 'muse-v4',
      env: 'test',
      ai: expect.any(String),
      database: expect.any(String),
      timestamp: expect.any(String),
    }));
  });

  test('auth mutations require CSRF token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'person@example.com', password: 'Password1' })
      .expect(403);

    expect(res.body).toEqual(expect.objectContaining({
      success: false,
      error: 'CSRF token missing or invalid.',
    }));
  });
});
