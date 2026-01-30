/**
 * Routine Management Controller
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 13.1, 13.2, 13.3
 */

import { AuthRequest, ApiResponse } from '@types/index';
import { Response } from 'express';
import * as RoutineService from '@services/RoutineService';
import * as ConflictService from '@services/ConflictService';
import { logger } from '@utils/logger';
import { AppError } from '@middleware/errorHandler';

/**
 * Create routine
 * POST /api/v1/routines
 * Requirement 1.1: Accept inputs for routine creation
 */
export const createRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId, teacherId, subjectId, lessonId, timeSlotId, classroomId, routineType } =
      req.body;

    const routine = await RoutineService.createRoutine(
      classId,
      teacherId,
      subjectId,
      lessonId,
      timeSlotId,
      classroomId,
      req.user?.userId || '',
      routineType
    );

    // Detect conflicts
    const conflicts = await ConflictService.detectConflicts(routine.id);

    const response: ApiResponse<unknown> = {
      success: true,
      data: { routine, conflicts },
      message: conflicts.length > 0 ? 'Routine created with conflicts detected' : 'Routine created successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.error('Error creating routine', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};

/**
 * Get routine by ID
 * GET /api/v1/routines/:id
 */
export const getRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const routine = await RoutineService.getRoutine(id);

    const response: ApiResponse<unknown> = {
      success: true,
      data: routine,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.error('Error fetching routine', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};

/**
 * Update routine
 * PUT /api/v1/routines/:id
 * Requirement 1.4: Update routine and log change
 */
export const updateRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const routine = await RoutineService.updateRoutine(id, updates);

    const response: ApiResponse<unknown> = {
      success: true,
      data: routine,
      message: 'Routine updated successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.error('Error updating routine', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};

/**
 * Delete routine
 * DELETE /api/v1/routines/:id
 * Requirement 1.5: Remove from schedule and log deletion
 */
export const deleteRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await RoutineService.deleteRoutine(id);

    const response: ApiResponse<unknown> = {
      success: true,
      message: 'Routine deleted successfully',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.error('Error deleting routine', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};

/**
 * Get routines by class
 * GET /api/v1/routines/class/:classId
 */
export const getRoutinesByClass = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const routines = await RoutineService.getRoutinesByClass(classId);

    const response: ApiResponse<unknown> = {
      success: true,
      data: routines,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (err) {
    logger.error('Error fetching routines', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
};
