/**
 * Class Routine Management System - Backend API
 * Entry point for the Express application
 * Requirements: 1.1, 13.1, 13.2, 15.1, 15.2
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from '@utils/logger';
import {
  rateLimit,
  requestLogger,
  errorHandler,
  authenticateToken,
  authorize,
} from '@middleware/index';
import { UserRole } from '@types/index';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.API_PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
}));

// Logging Middleware
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));
app.use(requestLogger);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting Middleware (Requirement 13.6)
app.use(rateLimit);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API version endpoint
app.get('/api/v1/version', (_req: Request, res: Response) => {
  res.status(200).json({
    version: '1.0.0',
    name: 'Class Routine Management System',
    environment: process.env.NODE_ENV || 'development',
  });
});

// TODO: Import and register route handlers
// app.use('/api/v1/routines', routineRoutes);
// app.use('/api/v1/conflicts', conflictRoutes);
// app.use('/api/v1/substitutes', substituteRoutes);
// app.use('/api/v1/calendars', calendarRoutes);
// app.use('/api/v1/optimize', optimizationRoutes);
// app.use('/api/v1/subjects', subjectRoutes);
// app.use('/api/v1/time-slots', timeSlotRoutes);
// app.use('/api/v1/reports', reportRoutes);
// app.use('/api/v1/dashboards', dashboardRoutes);
// app.use('/api/v1/notifications', notificationRoutes);
// app.use('/api/v1/audit-logs', auditLogRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (Requirement 13.2, 13.4)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info('API Gateway initialized with rate limiting and request logging');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
