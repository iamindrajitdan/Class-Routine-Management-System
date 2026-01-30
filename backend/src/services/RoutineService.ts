/**
 * Routine Management Service
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3
 */

import * as RoutineModel from '@models/Routine';
import * as ConflictModel from '@models/Conflict';
import { logger } from '@utils/logger';
import { AppError } from '@middleware/errorHandler';

/**
 * Create routine with conflict detection
 * Requirement 1.1: Accept inputs for class, teacher, subject, lesson, time slot, classroom
 * Requirement 1.2: Validate all required fields
 * Requirement 1.3: Assign unique identifier
 * Requirement 1.6: Check for conflicts
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
): Promise<RoutineModel.Routine> => {
  // Validate inputs
  if (!classId || !teacherId || !subjectId || !lessonId || !timeSlotId || !classroomId) {
    throw new AppError(400, 'All required fields must be provided', {
      required: ['classId', 'teacherId', 'subjectId', 'lessonId', 'timeSlotId', 'classroomId'],
    });
  }

  // Check for conflicts
  const teacherConflict = await ConflictModel.checkTeacherConflict(teacherId, timeSlotId);
  if (teacherConflict) {
    throw new AppError(409, 'Teacher conflict detected', {
      conflictType: 'TeacherDouble',
      message: 'Teacher is already assigned to another class at this time',
    });
  }

  const classroomConflict = await ConflictModel.checkClassroomConflict(classroomId, timeSlotId);
  if (classroomConflict) {
    throw new AppError(409, 'Classroom conflict detected', {
      conflictType: 'ClassroomDouble',
      message: 'Classroom is already assigned to another class at this time',
    });
  }

  const classConflict = await ConflictModel.checkClassConflict(classId, timeSlotId);
  if (classConflict) {
    throw new AppError(409, 'Class conflict detected', {
      conflictType: 'ClassDouble',
      message: 'Class is already assigned another subject at this time',
    });
  }

  // Create routine
  const routine = await RoutineModel.createRoutine(
    classId,
    teacherId,
    subjectId,
    lessonId,
    timeSlotId,
    classroomId,
    createdBy,
    routineType
  );

  logger.info(`Routine created: ${routine.id}`, { routine });
  return routine;
};

/**
 * Get routine by ID
 */
export const getRoutine = async (id: string): Promise<RoutineModel.Routine> => {
  const routine = await RoutineModel.getRoutineById(id);
  if (!routine) {
    throw new AppError(404, 'Routine not found', { routineId: id });
  }
  return routine;
};

/**
 * Update routine with conflict detection
 * Requirement 1.4: Update routine and log change
 */
export const updateRoutine = async (
  id: string,
  updates: Partial<RoutineModel.Routine>
): Promise<RoutineModel.Routine> => {
  const routine = await getRoutine(id);

  // Check for conflicts if time slot or classroom changed
  if (updates.timeSlotId && updates.timeSlotId !== routine.timeSlotId) {
    const teacherConflict = await ConflictModel.checkTeacherConflict(
      routine.teacherId,
      updates.timeSlotId,
      id
    );
    if (teacherConflict) {
      throw new AppError(409, 'Teacher conflict detected', {
        conflictType: 'TeacherDouble',
      });
    }
  }

  if (updates.classroomId && updates.classroomId !== routine.classroomId) {
    const classroomConflict = await ConflictModel.checkClassroomConflict(
      updates.classroomId,
      routine.timeSlotId,
      id
    );
    if (classroomConflict) {
      throw new AppError(409, 'Classroom conflict detected', {
        conflictType: 'ClassroomDouble',
      });
    }
  }

  const updated = await RoutineModel.updateRoutine(id, updates);
  if (!updated) {
    throw new AppError(500, 'Failed to update routine');
  }

  logger.info(`Routine updated: ${id}`, { updates });
  return updated;
};

/**
 * Delete routine
 * Requirement 1.5: Remove from schedule and log deletion
 */
export const deleteRoutine = async (id: string): Promise<void> => {
  await getRoutine(id); // Verify exists
  await RoutineModel.deleteRoutine(id);
  logger.info(`Routine deleted: ${id}`);
};

/**
 * Get routines by class
 */
export const getRoutinesByClass = async (classId: string): Promise<RoutineModel.Routine[]> => {
  return RoutineModel.getRoutinesByClass(classId);
};

/**
 * Get routines by teacher
 */
export const getRoutinesByTeacher = async (teacherId: string): Promise<RoutineModel.Routine[]> => {
  return RoutineModel.getRoutinesByTeacher(teacherId);
};
