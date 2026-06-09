import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

const signOptions = (expiresIn: string): SignOptions => ({
  expiresIn: expiresIn as SignOptions['expiresIn'],
  issuer: 'muse.style',
  audience: 'muse-client',
});

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.secret, signOptions(config.jwt.accessExpiry));
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, signOptions(config.jwt.refreshExpiry));
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'muse.style',
      audience: 'muse-client',
    }) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'muse.style',
      audience: 'muse-client',
    }) as TokenPayload;
  } catch {
    return null;
  }
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie('muse_refresh', token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie('muse_refresh', { path: '/api/auth' });
}
