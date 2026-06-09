import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

describe('JWT Utils', () => {
  const payload = { id: 'user-1', email: 'test@muse.style', role: 'member' };

  it('signs and verifies access tokens', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded?.id).toBe(payload.id);
    expect(decoded?.email).toBe(payload.email);
  });

  it('signs and verifies refresh tokens', () => {
    const token = signRefreshToken(payload);
    const decoded = verifyRefreshToken(token);
    expect(decoded?.id).toBe(payload.id);
  });

  it('returns null for invalid tokens', () => {
    expect(verifyAccessToken('invalid.token.here')).toBeNull();
    expect(verifyRefreshToken('invalid.token.here')).toBeNull();
  });
});
