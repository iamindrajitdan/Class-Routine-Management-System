/**
 * Conflict Detection Service
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import * as ConflictModel from '@models/Conflict';
import * as RoutineModel from '@models/Routine';
import { logger } from '@utils/logger';
import { AppError } from '@middleware/errorHandler';

/**
 * Detect all conflicts for a routine
 * Requirement 2.1, 2.2, 2.3: Detect teacher, classroom, class conflicts
 */
export const detectConflicts = async (routineId: string): Promise<ConflictModel.Conflict[]> => {
  const routine = await RoutineModel.getRoutineById(routineId);
  if (!routine) {
    throw new AppError(404, 'Routine not found');
  }

  const conflicts: ConflictModel.Conflict[] = [];

  // Check teacher conflict
  const teacherConflict = await ConflictModel.checkTeacherConflict(
    routine.teacherId,
    routine.timeSlotId,
    routineId
  );
  if (teacherConflict) {
    const conflict = await ConflictModel.createConflict(
      routineId,
      'TeacherDouble',
      'Teacher is assigned to multiple classes at the same time',
      'High'
    );
    conflicts.push(conflict);
    logger.warn(`Teacher conflict detected for routine ${routineId}`);
  }

  // Check classroom conflict
  const classroomConflict = await ConflictModel.checkClassroomConflict(
    routine.classroomId,
    routine.timeSlotId,
    routineId
  );
  if (classroomConflict) {
    const conflict = await ConflictModel.createConflict(
      routineId,
      'ClassroomDouble',
      'Classroom is assigned to multiple classes at the same time',
      'High'
    );
    conflicts.push(conflict);
    logger.warn(`Classroom conflict detected for routine ${routineId}`);
  }

  // Check class conflict
  const classConflict = await ConflictModel.checkClassConflict(
    routine.classId,
    routine.timeSlotId,
    routineId
  );
  if (classConflict) {
    const conflict = await ConflictModel.createConflict(
      routineId,
      'ClassDouble',
      'Class is assigned multiple subjects at the same time',
      'High'
    );
    conflicts.push(conflict);
    logger.warn(`Class conflict detected for routine ${routineId}`);
  }

  return conflicts;
};

/**
 * Get all unresolved conflicts
 */
export const getUnresolvedConflicts = async (): Promise<ConflictModel.Conflict[]> => {
  return ConflictModel.getUnresolvedConflicts();
};

/**
 * Resolve conflict
 * Requirement 2.5: Resolve conflict
 */
export const resolveConflict = async (
  conflictId: string,
  status: 'Resolved' | 'Ignored'
): Promise<ConflictModel.Conflict> => {
  const conflict = await ConflictModel.getConflictById(conflictId);
  if (!conflict) {
    throw new AppError(404, 'Conflict not found');
  }

  const updated = await ConflictModel.updateConflictStatus(conflictId, status);
  if (!updated) {
    throw new AppError(500, 'Failed to update conflict');
  }

  logger.info(`Conflict ${status}: ${conflictId}`);
  return updated;
};

/**
 * Suggest alternative time slots
 * Requirement 2.5: Suggest alternative time slots
 */
export const suggestAlternativeTimeSlots = async (
  teacherId: string,
  classroomId: string,
  currentTimeSlotId: string
): Promise<string[]> => {
  // TODO: Implement logic to suggest available time slots
  // This would query for time slots that don't have conflicts
  logger.info('Suggesting alternative time slots', {
    teacherId,
    classroomId,
    currentTimeSlotId,
  });
  return [];
};
