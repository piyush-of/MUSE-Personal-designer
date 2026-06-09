import { config } from '../config';
import logger from '../utils/logger';
import type { AIProvider, AIGenerateOptions } from './types';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';

  isEnabled(): boolean {
    return config.openai.enabled;
  }

  async generateJson(prompt: string, options: AIGenerateOptions = {}): Promise<Record<string, unknown> | null> {
    if (!this.isEnabled()) return null;

    const { task = 'content', temperature = 0.45, systemPrompt } = options;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.openai.apiKey}`,
        },
        body: JSON.stringify({
          model: config.openai.model,
          temperature,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt || 'You are MUSE fashion intelligence. Return strict JSON only.' },
            { role: 'user', content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(config.openai.timeoutMs),
      });

      if (!response.ok) {
        logger.warn({ provider: this.name, task, status: response.status }, 'OpenAI request failed');
        return null;
      }

      const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const text = payload.choices?.[0]?.message?.content || '';
      return text ? JSON.parse(text) as Record<string, unknown> : null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn({ provider: this.name, task, err: message }, 'OpenAI request skipped');
      return null;
    }
  }
}
