/**
 * Error Handling Middleware
 * Requirements: 13.2, 13.4
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handler middleware
 * Requirement 13.2: Return error message with details and appropriate HTTP status code
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.statusCode} - ${err.message}`, err.details);
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Validation error handler
 */
export const validationErrorHandler = (
  errors: Record<string, string>
): AppError => {
  return new AppError(400, 'Validation failed', errors);
};
