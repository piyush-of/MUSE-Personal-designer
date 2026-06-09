import { config } from '../config';
import { GeminiProvider } from '../providers/geminiProvider';
import { OpenAIProvider } from '../providers/openaiProvider';
import { AnthropicProvider } from '../providers/anthropicProvider';
import type { AIProvider, AIGenerateOptions } from '../providers/types';
import cache from './cacheService';

const providers: AIProvider[] = [
  new GeminiProvider(),
  new OpenAIProvider(),
  new AnthropicProvider(),
];

function getActiveProvider(): AIProvider | null {
  const preferred = config.ai.preferredProvider;
  const ordered = preferred
    ? [providers.find(p => p.name === preferred), ...providers.filter(p => p.name !== preferred)]
    : providers;

  return ordered.find(p => p?.isEnabled()) ?? null;
}

export async function generateAIJson(
  prompt: string,
  options: AIGenerateOptions & { cacheKey?: string; cacheTtlSec?: number } = {},
): Promise<{ data: Record<string, unknown> | null; provider: string; model: string }> {
  const { cacheKey, cacheTtlSec = 3600, ...aiOptions } = options;

  if (cacheKey) {
    const cached = await cache.get<Record<string, unknown>>(cacheKey);
    if (cached) {
      return { data: cached, provider: 'cache', model: 'redis' };
    }
  }

  const provider = getActiveProvider();
  if (!provider) {
    return { data: null, provider: 'fallback', model: 'none' };
  }

  const data = await provider.generateJson(prompt, aiOptions);
  if (data && cacheKey) {
    await cache.set(cacheKey, data, cacheTtlSec);
  }

  const modelMap: Record<string, string> = {
    gemini: config.gemini.model,
    openai: config.openai.model,
    anthropic: config.anthropic.model,
  };

  return { data, provider: provider.name, model: modelMap[provider.name] || provider.name };
}

export function listProviders(): Array<{ name: string; enabled: boolean }> {
  return providers.map(p => ({ name: p.name, enabled: p.isEnabled() }));
}
