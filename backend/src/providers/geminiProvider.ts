import { config } from '../config';
import logger from '../utils/logger';
import type { AIProvider, AIGenerateOptions } from './types';

function extractJsonObject(text = ''): Record<string, unknown> | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractGeminiText(payload: Record<string, unknown>): string {
  const candidates = (payload.candidates as Array<Record<string, unknown>>) || [];
  return candidates
    .flatMap(c => ((c.content as Record<string, unknown>)?.parts as Array<Record<string, unknown>>) || [])
    .map(p => String(p.text || ''))
    .join('\n')
    .trim();
}

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';

  isEnabled(): boolean {
    return config.gemini.enabled;
  }

  async generateJson(prompt: string, options: AIGenerateOptions = {}): Promise<Record<string, unknown> | null> {
    if (!this.isEnabled()) return null;

    const { task = 'content', temperature = 0.45, systemPrompt } = options;
    const endpoint = `${config.gemini.baseUrl}/models/${encodeURIComponent(config.gemini.model)}:generateContent?key=${encodeURIComponent(config.gemini.apiKey)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: systemPrompt || 'You are MUSE, a precise luxury fashion intelligence engine. Return strict JSON only. Do not include markdown.',
            }],
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature, responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(config.gemini.timeoutMs),
      });

      if (!response.ok) {
        const body = await response.text();
        logger.warn({ provider: this.name, task, status: response.status }, `AI request failed: ${body.slice(0, 240)}`);
        return null;
      }

      const payload = await response.json() as Record<string, unknown>;
      return extractJsonObject(extractGeminiText(payload));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn({ provider: this.name, task, err: message }, 'AI request skipped');
      return null;
    }
  }
}
