/**
 * Redis Configuration
 * Requirements: 14.1, 14.2
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from '@utils/logger';

let redisClient: RedisClientType;

/**
 * Initialize Redis client
 */
export const initRedis = async (): Promise<RedisClientType> => {
  redisClient = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    socket: {
      reconnectStrategy: (retries: number) => {
        if (retries > 10) {
          logger.error('Redis reconnection failed after 10 attempts');
          return new Error('Redis max retries exceeded');
        }
        return retries * 100;
      },
    },
  });

  redisClient.on('error', (err: Error) => {
    logger.error('Redis client error', err);
  });

  redisClient.on('connect', () => {
    logger.info('Redis client connected');
  });

  await redisClient.connect();
  return redisClient;
};

/**
 * Get Redis client
 */
export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

/**
 * Cache get
 */
export const cacheGet = async <T = unknown>(key: string): Promise<T | null> => {
  try {
    const value = await getRedisClient().get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.error('Cache get error', { key, error: err });
    return null;
  }
};

/**
 * Cache set
 */
export const cacheSet = async (
  key: string,
  value: unknown,
  ttl?: number
): Promise<void> => {
  try {
    const client = getRedisClient();
    if (ttl) {
      await client.setEx(key, ttl, JSON.stringify(value));
    } else {
      await client.set(key, JSON.stringify(value));
    }
  } catch (err) {
    logger.error('Cache set error', { key, error: err });
  }
};

/**
 * Cache delete
 */
export const cacheDel = async (key: string): Promise<void> => {
  try {
    await getRedisClient().del(key);
  } catch (err) {
    logger.error('Cache delete error', { key, error: err });
  }
};

/**
 * Cache clear
 */
export const cacheClear = async (): Promise<void> => {
  try {
    await getRedisClient().flushDb();
  } catch (err) {
    logger.error('Cache clear error', err);
  }
};

/**
 * Close Redis connection
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
};
