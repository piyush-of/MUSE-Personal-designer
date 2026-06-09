import { config } from './index';

export function initSentry(): void {
  if (!config.sentry.enabled) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/node');
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.env,
      tracesSampleRate: config.isProd ? 0.1 : 1.0,
      integrations: [Sentry.httpIntegration(), Sentry.expressIntegration()],
    });
  } catch {
    // Sentry is optional — skip if package not installed
  }
}

export function captureException(error: unknown): void {
  if (!config.sentry.enabled) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/node');
    Sentry.captureException(error);
  } catch {
    // ignore
  }
}
