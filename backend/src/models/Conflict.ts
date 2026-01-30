/**
 * Conflict Model
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { query, queryOne } from '@config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Conflict {
  id: string;
  routineId: string;
  conflictType: 'TeacherDouble' | 'ClassroomDouble' | 'ClassDouble';
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Detected' | 'Resolved' | 'Ignored';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a conflict record
 * Requirement 2.1, 2.2, 2.3: Detect conflicts
 */
export const createConflict = async (
  routineId: string,
  conflictType: string,
  description: string,
  severity: string = 'High'
): Promise<Conflict> => {
  const id = uuidv4();

  const result = await query<Conflict>(
    `INSERT INTO conflicts (id, routine_id, conflict_type, description, severity, status)
     VALUES ($1, $2, $3, $4, $5, 'Detected')
     RETURNING id, routine_id, conflict_type, description, severity, status, created_at, updated_at`,
    [id, routineId, conflictType, description, severity]
  );

  return result[0];
};

/**
 * Get conflict by ID
 */
export const getConflictById = async (id: string): Promise<Conflict | null> => {
  return queryOne<Conflict>(
    `SELECT id, routine_id, conflict_type, description, severity, status, created_at, updated_at
     FROM conflicts WHERE id = $1`,
    [id]
  );
};

/**
 * Get all conflicts for a routine
 */
export const getConflictsByRoutine = async (routineId: string): Promise<Conflict[]> => {
  return query<Conflict>(
    `SELECT id, routine_id, conflict_type, description, severity, status, created_at, updated_at
     FROM conflicts WHERE routine_id = $1 AND status = 'Detected'
     ORDER BY severity DESC, created_at DESC`,
    [routineId]
  );
};

/**
 * Get all unresolved conflicts
 */
export const getUnresolvedConflicts = async (): Promise<Conflict[]> => {
  return query<Conflict>(
    `SELECT id, routine_id, conflict_type, description, severity, status, created_at, updated_at
     FROM conflicts WHERE status = 'Detected'
     ORDER BY severity DESC, created_at DESC`
  );
};

/**
 * Update conflict status
 * Requirement 2.5: Resolve conflict
 */
export const updateConflictStatus = async (
  id: string,
  status: 'Detected' | 'Resolved' | 'Ignored'
): Promise<Conflict | null> => {
  const result = await query<Conflict>(
    `UPDATE conflicts SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, routine_id, conflict_type, description, severity, status, created_at, updated_at`,
    [status, id]
  );

  return result.length > 0 ? result[0] : null;
};

/**
 * Check for teacher double-booking
 * Requirement 2.1: Detect if teacher assigned to multiple classes at same time
 */
export const checkTeacherConflict = async (
  teacherId: string,
  timeSlotId: string,
  excludeRoutineId?: string
): Promise<boolean> => {
  const query_str = excludeRoutineId
    ? `SELECT COUNT(*) as count FROM routines
       WHERE teacher_id = $1 AND time_slot_id = $2 AND id != $3 AND status = 'Active'`
    : `SELECT COUNT(*) as count FROM routines
       WHERE teacher_id = $1 AND time_slot_id = $2 AND status = 'Active'`;

  const params = excludeRoutineId ? [teacherId, timeSlotId, excludeRoutineId] : [teacherId, timeSlotId];
  const result = await query<{ count: string }>(query_str, params);

  return parseInt(result[0].count, 10) > 0;
};

/**
 * Check for classroom conflict
 * Requirement 2.2: Detect if classroom assigned to multiple classes at same time
 */
export const checkClassroomConflict = async (
  classroomId: string,
  timeSlotId: string,
  excludeRoutineId?: string
): Promise<boolean> => {
  const query_str = excludeRoutineId
    ? `SELECT COUNT(*) as count FROM routines
       WHERE classroom_id = $1 AND time_slot_id = $2 AND id != $3 AND status = 'Active'`
    : `SELECT COUNT(*) as count FROM routines
       WHERE classroom_id = $1 AND time_slot_id = $2 AND status = 'Active'`;

  const params = excludeRoutineId ? [classroomId, timeSlotId, excludeRoutineId] : [classroomId, timeSlotId];
  const result = await query<{ count: string }>(query_str, params);

  return parseInt(result[0].count, 10) > 0;
};

/**
 * Check for class conflict
 * Requirement 2.3: Detect if class assigned multiple subjects at same time
 */
export const checkClassConflict = async (
  classId: string,
  timeSlotId: string,
  excludeRoutineId?: string
): Promise<boolean> => {
  const query_str = excludeRoutineId
    ? `SELECT COUNT(*) as count FROM routines
       WHERE class_id = $1 AND time_slot_id = $2 AND id != $3 AND status = 'Active'`
    : `SELECT COUNT(*) as count FROM routines
       WHERE class_id = $1 AND time_slot_id = $2 AND status = 'Active'`;

  const params = excludeRoutineId ? [classId, timeSlotId, excludeRoutineId] : [classId, timeSlotId];
  const result = await query<{ count: string }>(query_str, params);

  return parseInt(result[0].count, 10) > 0;
};
