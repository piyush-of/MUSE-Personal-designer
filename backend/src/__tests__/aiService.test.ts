import { listProviders } from '../services/aiService';

describe('AIService', () => {
  it('lists all providers with enabled status', () => {
    const providers = listProviders();
    expect(providers).toHaveLength(3);
    expect(providers.map(p => p.name)).toEqual(expect.arrayContaining(['gemini', 'openai', 'anthropic']));
  });
});
