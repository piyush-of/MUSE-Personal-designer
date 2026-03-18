'use strict';
module.exports = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  env:  process.env.NODE_ENV ?? 'development',
  isDev: (process.env.NODE_ENV ?? 'development') === 'development',
  upload: { maxBytes: 10*1024*1024, allowedMime: ['image/jpeg','image/png','image/webp','image/gif'] },
  rateLimit: { windowMs: 15*60*1000, max: 120 },
  groq: {
    apiKey: process.env.GROQ_API_KEY ?? '',
    model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
    baseUrl: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1/chat/completions',
    timeoutMs: parseInt(process.env.GROQ_TIMEOUT_MS ?? '15000', 10),
  }
};
