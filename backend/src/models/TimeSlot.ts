/**
 * TimeSlot Model
 * Requirements: 7.1, 7.2, 7.3
 */

import { query, queryOne } from '@config/database';
import { v4 as uuidv4 } from 'uuid';

export interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
}

/**
 * Create a time slot
 * Requirement 7.1: Accept day of week, start time, end time
 */
export const createTimeSlot = async (
  dayOfWeek: string,
  startTime: string,
  endTime: string
): Promise<TimeSlot> => {
  const id = uuidv4();

  const result = await query<TimeSlot>(
    `INSERT INTO time_slots (id, day_of_week, start_time, end_time)
     VALUES ($1, $2, $3, $4)
     RETURNING id, day_of_week, start_time, end_time, created_at`,
    [id, dayOfWeek, startTime, endTime]
  );

  return result[0];
};

/**
 * Get time slot by ID
 */
export const getTimeSlotById = async (id: string): Promise<TimeSlot | null> => {
  return queryOne<TimeSlot>(
    `SELECT id, day_of_week, start_time, end_time, created_at
     FROM time_slots WHERE id = $1`,
    [id]
  );
};

/**
 * Get all time slots for a day
 * Requirement 7.3: Allow multiple time slots per day
 */
export const getTimeSlotsByDay = async (dayOfWeek: string): Promise<TimeSlot[]> => {
  return query<TimeSlot>(
    `SELECT id, day_of_week, start_time, end_time, created_at
     FROM time_slots WHERE day_of_week = $1
     ORDER BY start_time ASC`,
    [dayOfWeek]
  );
};

/**
 * Get all time slots
 */
export const getAllTimeSlots = async (): Promise<TimeSlot[]> => {
  return query<TimeSlot>(
    `SELECT id, day_of_week, start_time, end_time, created_at
     FROM time_slots
     ORDER BY day_of_week, start_time ASC`
  );
};

/**
 * Check for time slot overlap
 * Requirement 7.2: Validate time slots do not overlap
 */
export const checkTimeSlotOverlap = async (
  dayOfWeek: string,
  startTime: string,
  endTime: string,
  excludeId?: string
): Promise<boolean> => {
  const query_str = excludeId
    ? `SELECT COUNT(*) as count FROM time_slots
       WHERE day_of_week = $1 AND id != $4
       AND ((start_time < $3 AND end_time > $2))`
    : `SELECT COUNT(*) as count FROM time_slots
       WHERE day_of_week = $1
       AND ((start_time < $3 AND end_time > $2))`;

  const params = excludeId ? [dayOfWeek, startTime, endTime, excludeId] : [dayOfWeek, startTime, endTime];
  const result = await query<{ count: string }>(query_str, params);

  return parseInt(result[0].count, 10) > 0;
};

/**
 * Delete time slot
 */
export const deleteTimeSlot = async (id: string): Promise<void> => {
  await query('DELETE FROM time_slots WHERE id = $1', [id]);
};
