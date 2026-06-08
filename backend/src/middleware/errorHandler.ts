import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred.';
  let errors: string[] | undefined;

  // Handle Prisma Specific Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      status = 409;
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      message = `${target} already in use.`;
    }
  }

  // Multer file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'File too large. Maximum size is 10MB.';
  }

  const isDev = process.env.NODE_ENV !== 'production';

  if (status >= 500) {
    logger.error(`[${req.method}] ${req.path} →`, err.message, isDev ? err.stack : '');
  }

  res.status(status).json({
    success: false,
    error: status >= 500 && !isDev ? 'An unexpected error occurred.' : message,
    ...(errors ? { errors } : {}),
    ...(isDev && status >= 500 ? { stack: err.stack } : {}),
  });
}

export default errorHandler;
