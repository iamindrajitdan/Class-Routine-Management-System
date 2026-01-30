/**
 * Rate Limiting Middleware
 * Requirements: 13.6, 14.1
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

/**
 * Rate limiting middleware
 * Requirement 13.6: Enforce rate limiting to prevent abuse
 */
export const rateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.ip || 'unknown';
  const now = Date.now();

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + WINDOW_MS };
    next();
    return;
  }

  if (now > store[key].resetTime) {
    store[key] = { count: 1, resetTime: now + WINDOW_MS };
    next();
    return;
  }

  store[key].count++;

  if (store[key].count > MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for IP: ${key}`);
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000} seconds`,
      retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
  res.set('X-RateLimit-Remaining', (MAX_REQUESTS - store[key].count).toString());
  res.set('X-RateLimit-Reset', store[key].resetTime.toString());

  next();
};

/**
 * Cleanup old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, WINDOW_MS);
