import cache from '../services/cacheService';

describe('CacheService (memory fallback)', () => {
  it('sets and gets values', async () => {
    await cache.set('test-key', { foo: 'bar' }, 60);
    const result = await cache.get<{ foo: string }>('test-key');
    expect(result?.foo).toBe('bar');
  });

  it('returns null for missing keys', async () => {
    const result = await cache.get('nonexistent-key-xyz');
    expect(result).toBeNull();
  });

  it('deletes keys', async () => {
    await cache.set('delete-me', 'value', 60);
    await cache.del('delete-me');
    expect(await cache.get('delete-me')).toBeNull();
  });
});
