/**
 * Audit Logging Middleware
 * Requirements: 11.1, 11.2, 13.5
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';
import { AuthRequest } from '@types/index';

interface AuditLogEntry {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  method: string;
  path: string;
  statusCode: number;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit logging middleware
 * Requirement 11.1: Log the action in the Audit_Log
 * Requirement 13.5: Log the request in the Audit_Log
 */
export const auditLog = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const originalSend = res.send;

  res.send = function (data: unknown) {
    const auditEntry: AuditLogEntry = {
      userId: req.user?.userId,
      action: `${req.method} ${req.path}`,
      resourceType: extractResourceType(req.path),
      resourceId: extractResourceId(req.path),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Log only state-changing operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      logger.info('Audit log entry', auditEntry);
      // TODO: Persist to database
    }

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Extract resource type from path
 */
function extractResourceType(path: string): string {
  const parts = path.split('/');
  return parts[3] || 'unknown';
}

/**
 * Extract resource ID from path
 */
function extractResourceId(path: string): string | undefined {
  const parts = path.split('/');
  return parts[4];
}
