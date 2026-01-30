/**
 * Database Migration Runner
 * Requirements: 12.1
 */

import { query } from '@config/database';
import { logger } from '@utils/logger';
import fs from 'fs';
import path from 'path';

interface Migration {
  name: string;
  version: number;
  executed: boolean;
  executedAt?: Date;
}

/**
 * Run all pending migrations
 */
export const runMigrations = async (): Promise<void> => {
  try {
    logger.info('Starting database migrations');

    // Create migrations table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        version INTEGER NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql') && f !== 'run.ts')
      .sort();

    // Execute pending migrations
    for (const file of files) {
      const migrationName = file.replace('.sql', '');
      const migrationPath = path.join(migrationsDir, file);

      // Check if migration already executed
      const executed = await query<Migration>(
        'SELECT * FROM migrations WHERE name = $1',
        [migrationName]
      );

      if (executed.length === 0) {
        logger.info(`Executing migration: ${migrationName}`);
        const sql = fs.readFileSync(migrationPath, 'utf-8');

        // Execute migration
        await query(sql);

        // Record migration
        await query(
          'INSERT INTO migrations (name, version) VALUES ($1, $2)',
          [migrationName, parseInt(migrationName.split('_')[0], 10)]
        );

        logger.info(`Migration completed: ${migrationName}`);
      }
    }

    logger.info('All migrations completed successfully');
  } catch (err) {
    logger.error('Migration failed', err);
    throw err;
  }
};

// Run migrations if executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations finished');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Migration error', err);
      process.exit(1);
    });
}
