import pino from 'pino';
import { config } from '../config';

const pinoLogger = pino({
  level: config.isTest ? 'silent' : config.isDev ? 'debug' : 'info',
  transport: config.isDev && !config.isTest
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
});

export const logger = {
  error: (objOrMsg: unknown, msg?: string) => {
    if (typeof objOrMsg === 'string') pinoLogger.error(objOrMsg);
    else if (msg) pinoLogger.error(objOrMsg as object, msg);
    else pinoLogger.error(objOrMsg as object);
  },
  warn: (objOrMsg: unknown, msg?: string) => {
    if (typeof objOrMsg === 'string') pinoLogger.warn(objOrMsg);
    else if (msg) pinoLogger.warn(objOrMsg as object, msg);
    else pinoLogger.warn(objOrMsg as object);
  },
  info: (objOrMsg: unknown, msg?: string) => {
    if (typeof objOrMsg === 'string') pinoLogger.info(objOrMsg);
    else if (msg) pinoLogger.info(objOrMsg as object, msg);
    else pinoLogger.info(objOrMsg as object);
  },
  debug: (objOrMsg: unknown, msg?: string) => {
    if (typeof objOrMsg === 'string') pinoLogger.debug(objOrMsg);
    else if (msg) pinoLogger.debug(objOrMsg as object, msg);
    else pinoLogger.debug(objOrMsg as object);
  },
  http: (msg: string) => pinoLogger.info({ type: 'http' }, msg),
  child: (bindings: Record<string, unknown>) => pinoLogger.child(bindings),
};

export default logger;
