/**
 * Holiday Model
 * Requirements: 4.1, 4.2, 19.1
 */

import { query, queryOne } from '@config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Holiday {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  academicYear: string;
  createdAt: Date;
}

/**
 * Create a holiday
 * Requirement 4.1: Define holiday
 */
export const createHoliday = async (
  name: string,
  startDate: Date,
  endDate: Date,
  academicYear: string
): Promise<Holiday> => {
  const id = uuidv4();

  const result = await query<Holiday>(
    `INSERT INTO holidays (id, name, start_date, end_date, academic_year)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, start_date, end_date, academic_year, created_at`,
    [id, name, startDate, endDate, academicYear]
  );

  return result[0];
};

/**
 * Get holiday by ID
 */
export const getHolidayById = async (id: string): Promise<Holiday | null> => {
  return queryOne<Holiday>(
    `SELECT id, name, start_date, end_date, academic_year, created_at
     FROM holidays WHERE id = $1`,
    [id]
  );
};

/**
 * Get holidays for academic year
 */
export const getHolidaysByYear = async (academicYear: string): Promise<Holiday[]> => {
  return query<Holiday>(
    `SELECT id, name, start_date, end_date, academic_year, created_at
     FROM holidays WHERE academic_year = $1
     ORDER BY start_date ASC`,
    [academicYear]
  );
};

/**
 * Check if date is a holiday
 * Requirement 4.1: Prevent routines on holiday dates
 */
export const isHoliday = async (date: Date, academicYear: string): Promise<boolean> => {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM holidays
     WHERE academic_year = $1 AND start_date <= $2 AND end_date >= $2`,
    [academicYear, date]
  );

  return parseInt(result[0].count, 10) > 0;
};

/**
 * Delete holiday
 */
export const deleteHoliday = async (id: string): Promise<void> => {
  await query('DELETE FROM holidays WHERE id = $1', [id]);
};
