/**
 * Request Logging Middleware
 * Requirements: 13.1, 13.2, 13.5
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

/**
 * Request logging middleware
 * Requirement 13.5: Log the request in the Audit_Log
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function (data: unknown) {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      logger.warn('HTTP request', logData);
    } else {
      logger.debug('HTTP request', logData);
    }

    return originalSend.call(this, data);
  };

  next();
};
