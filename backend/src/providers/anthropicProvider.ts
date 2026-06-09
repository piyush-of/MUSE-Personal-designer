import { config } from '../config';
import logger from '../utils/logger';
import type { AIProvider, AIGenerateOptions } from './types';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';

  isEnabled(): boolean {
    return config.anthropic.enabled;
  }

  async generateJson(prompt: string, options: AIGenerateOptions = {}): Promise<Record<string, unknown> | null> {
    if (!this.isEnabled()) return null;

    const { task = 'content', temperature = 0.45, systemPrompt } = options;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.anthropic.model,
          max_tokens: 2048,
          temperature,
          system: systemPrompt || 'You are MUSE fashion intelligence. Return strict JSON only.',
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(config.anthropic.timeoutMs),
      });

      if (!response.ok) {
        logger.warn({ provider: this.name, task, status: response.status }, 'Anthropic request failed');
        return null;
      }

      const payload = await response.json() as { content?: Array<{ text?: string }> };
      const text = payload.content?.[0]?.text || '';
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) return null;
      return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn({ provider: this.name, task, err: message }, 'Anthropic request skipped');
      return null;
    }
  }
}
