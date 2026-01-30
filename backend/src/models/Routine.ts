/**
 * Routine Model
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { query, queryOne } from '@config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Routine {
  id: string;
  classId: string;
  teacherId: string;
  subjectId: string;
  lessonId: string;
  timeSlotId: string;
  classroomId: string;
  routineType: 'Regular' | 'Additional' | 'Remedial';
  status: 'Active' | 'Inactive' | 'Cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new routine
 * Requirement 1.1: Accept inputs for class, teacher, subject, lesson, time slot, classroom
 * Requirement 1.3: Assign unique identifier
 */
export const createRoutine = async (
  classId: string,
  teacherId: string,
  subjectId: string,
  lessonId: string,
  timeSlotId: string,
  classroomId: string,
  createdBy: string,
  routineType: string = 'Regular'
): Promise<Routine> => {
  const id = uuidv4();

  const result = await query<Routine>(
    `INSERT INTO routines (id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', $9)
     RETURNING id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at`,
    [id, classId, teacherId, subjectId, lessonId, timeSlotId, classroomId, routineType, createdBy]
  );

  return result[0];
};

/**
 * Get routine by ID
 */
export const getRoutineById = async (id: string): Promise<Routine | null> => {
  return queryOne<Routine>(
    `SELECT id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at
     FROM routines WHERE id = $1`,
    [id]
  );
};

/**
 * Get all routines for a class
 */
export const getRoutinesByClass = async (classId: string): Promise<Routine[]> => {
  return query<Routine>(
    `SELECT id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at
     FROM routines WHERE class_id = $1 AND status = 'Active'
     ORDER BY created_at DESC`,
    [classId]
  );
};

/**
 * Get all routines for a teacher
 */
export const getRoutinesByTeacher = async (teacherId: string): Promise<Routine[]> => {
  return query<Routine>(
    `SELECT id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at
     FROM routines WHERE teacher_id = $1 AND status = 'Active'
     ORDER BY created_at DESC`,
    [teacherId]
  );
};

/**
 * Update routine
 * Requirement 1.4: Update routine and log change
 */
export const updateRoutine = async (
  id: string,
  updates: Partial<Routine>
): Promise<Routine | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'createdAt' && key !== 'createdBy') {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return getRoutineById(id);
  }

  values.push(id);

  const result = await query<Routine>(
    `UPDATE routines SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount}
     RETURNING id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at`,
    values
  );

  return result.length > 0 ? result[0] : null;
};

/**
 * Delete routine (soft delete)
 * Requirement 1.5: Remove from schedule and log deletion
 */
export const deleteRoutine = async (id: string): Promise<void> => {
  await query('UPDATE routines SET status = $1 WHERE id = $2', ['Cancelled', id]);
};

/**
 * Get routines by time slot
 */
export const getRoutinesByTimeSlot = async (timeSlotId: string): Promise<Routine[]> => {
  return query<Routine>(
    `SELECT id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at
     FROM routines WHERE time_slot_id = $1 AND status = 'Active'`,
    [timeSlotId]
  );
};

/**
 * Get routines by classroom
 */
export const getRoutinesByClassroom = async (classroomId: string): Promise<Routine[]> => {
  return query<Routine>(
    `SELECT id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by, created_at, updated_at
     FROM routines WHERE classroom_id = $1 AND status = 'Active'`,
    [classroomId]
  );
};
