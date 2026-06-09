import { GeminiProvider } from '../providers/geminiProvider';
import { OpenAIProvider } from '../providers/openaiProvider';
import { AnthropicProvider } from '../providers/anthropicProvider';

describe('AI Providers', () => {
  it('GeminiProvider reports disabled without API key', () => {
    const provider = new GeminiProvider();
    expect(provider.name).toBe('gemini');
    expect(provider.isEnabled()).toBe(false);
  });

  it('OpenAIProvider reports disabled without API key', () => {
    const provider = new OpenAIProvider();
    expect(provider.name).toBe('openai');
    expect(provider.isEnabled()).toBe(false);
  });

  it('AnthropicProvider reports disabled without API key', () => {
    const provider = new AnthropicProvider();
    expect(provider.name).toBe('anthropic');
    expect(provider.isEnabled()).toBe(false);
  });

  it('returns null when provider is disabled', async () => {
    const provider = new GeminiProvider();
    const result = await provider.generateJson('test prompt');
    expect(result).toBeNull();
  });
});
