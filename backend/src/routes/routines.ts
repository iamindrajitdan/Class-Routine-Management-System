/**
 * Routine Routes
 * Requirements: 1.1, 1.4, 1.5, 13.1, 13.2, 13.3
 */

import { Router } from 'express';
import { authenticateToken, authorize } from '@middleware/auth';
import { UserRole } from '@types/index';
import * as RoutineController from '@controllers/RoutineController';

const router = Router();

// All routine endpoints require authentication
router.use(authenticateToken);

/**
 * POST /api/v1/routines
 * Create routine
 * Requirement 1.1: Create routine with all required fields
 */
router.post(
  '/',
  authorize(UserRole.Admin, UserRole.AcademicPlanner),
  RoutineController.createRoutine
);

/**
 * GET /api/v1/routines/:id
 * Get routine by ID
 */
router.get('/:id', RoutineController.getRoutine);

/**
 * PUT /api/v1/routines/:id
 * Update routine
 * Requirement 1.4: Update routine and log change
 */
router.put(
  '/:id',
  authorize(UserRole.Admin, UserRole.AcademicPlanner),
  RoutineController.updateRoutine
);

/**
 * DELETE /api/v1/routines/:id
 * Delete routine
 * Requirement 1.5: Delete routine and log deletion
 */
router.delete(
  '/:id',
  authorize(UserRole.Admin, UserRole.AcademicPlanner),
  RoutineController.deleteRoutine
);

/**
 * GET /api/v1/routines/class/:classId
 * Get routines by class
 */
router.get('/class/:classId', RoutineController.getRoutinesByClass);

export default router;
