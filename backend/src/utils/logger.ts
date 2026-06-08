type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'http';

const COLORS: Record<LogLevel, string> = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[36m',
  debug: '\x1b[90m',
  http: '\x1b[90m',
};

const RESET = '\x1b[0m';

function log(level: LogLevel, ...args: unknown[]) {
  const method = level === 'error' ? 'error' : 'log';
  console[method](
    `${COLORS[level] || ''}[${new Date().toISOString()}][${level.toUpperCase()}]${RESET}`,
    ...args
  );
}

export const logger = {
  error: (...args: unknown[]) => log('error', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  debug: (...args: unknown[]) => log('debug', ...args),
  http: (...args: unknown[]) => log('http', ...args),
};

export default logger;
