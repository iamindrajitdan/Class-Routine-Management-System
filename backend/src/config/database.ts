/**
 * Database Configuration
 * Requirements: 12.1, 14.1, 14.2
 */

import { Pool, PoolClient } from 'pg';
import { logger } from '@utils/logger';

const pool = new Pool({
  user: process.env.DB_USER || 'crms_user',
  password: process.env.DB_PASSWORD || 'crms_password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'crms_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  logger.info('New database connection established');
});

/**
 * Get database connection
 */
export const getConnection = async (): Promise<PoolClient> => {
  try {
    return await pool.connect();
  } catch (err) {
    logger.error('Failed to get database connection', err);
    throw err;
  }
};

/**
 * Execute query
 */
export const query = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms`, { text, params });
    return result.rows;
  } catch (err) {
    logger.error('Database query error', { text, params, error: err });
    throw err;
  }
};

/**
 * Execute single row query
 */
export const queryOne = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T | null> => {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT NOW()');
    return true;
  } catch (err) {
    logger.error('Database health check failed', err);
    return false;
  }
};

/**
 * Close pool
 */
export const closePool = async (): Promise<void> => {
  await pool.end();
  logger.info('Database pool closed');
};

export { pool };
