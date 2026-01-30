/**
 * Logger utility for structured logging
 * Requirements: 13.1, 13.2
 */

import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'json';

const logger = winston.createLogger({
  level: logLevel,
  format: logFormat === 'json' ? winston.format.json() : winston.format.simple(),
  defaultMeta: { service: 'crms-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export { logger };
