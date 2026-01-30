/**
 * Authentication and Authorization Middleware
 * Requirements: 8.1, 8.2, 15.1, 15.2
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '@utils/logger';
import { AuthRequest, JWTPayload, UserRole } from '@types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 * Requirement 15.2: Issue secure session token
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn(`Unauthorized access attempt from ${req.ip}`);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'No authentication token provided',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    req.ip = req.ip || req.connection.remoteAddress;
    next();
  } catch (err) {
    logger.warn(`Invalid token attempt from ${req.ip}`);
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Check if user has required role
 * Requirement 8.1, 8.2: Role-based access control
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      logger.warn(
        `Unauthorized role access: ${req.user.email} (${req.user.role}) attempted to access ${req.path}`
      );
      res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions for this action',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

/**
 * Generate JWT token
 * Requirement 15.2: Issue secure session token
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const expiryTime = process.env.JWT_EXPIRY || '24h';
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiryTime });
};

/**
 * Verify JWT token
 * Requirement 15.1: Authenticate using secure credentials
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    logger.error('Token verification failed:', err);
    return null;
  }
};
