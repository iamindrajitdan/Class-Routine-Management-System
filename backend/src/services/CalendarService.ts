/**
 * Calendar Management Service
 * Requirements: 4.1, 4.2, 4.6, 19.1, 19.2, 19.3, 19.4
 */

import * as HolidayModel from '@models/Holiday';
import { logger } from '@utils/logger';
import { AppError } from '@middleware/errorHandler';

/**
 * Create holiday
 * Requirement 4.1: Define holiday
 */
export const createHoliday = async (
  name: string,
  startDate: Date,
  endDate: Date,
  academicYear: string
): Promise<HolidayModel.Holiday> => {
  if (!name || !startDate || !endDate || !academicYear) {
    throw new AppError(400, 'All required fields must be provided', {
      required: ['name', 'startDate', 'endDate', 'academicYear'],
    });
  }

  if (startDate > endDate) {
    throw new AppError(400, 'Start date must be before end date');
  }

  const holiday = await HolidayModel.createHoliday(name, startDate, endDate, academicYear);
  logger.info(`Holiday created: ${holiday.id}`, { holiday });
  return holiday;
};

/**
 * Get holidays for academic year
 */
export const getHolidaysByYear = async (academicYear: string): Promise<HolidayModel.Holiday[]> => {
  return HolidayModel.getHolidaysByYear(academicYear);
};

/**
 * Check if date is holiday
 * Requirement 4.1: Prevent routines on holiday dates
 */
export const isHoliday = async (date: Date, academicYear: string): Promise<boolean> => {
  return HolidayModel.isHoliday(date, academicYear);
};

/**
 * Delete holiday
 */
export const deleteHoliday = async (id: string): Promise<void> => {
  const holiday = await HolidayModel.getHolidayById(id);
  if (!holiday) {
    throw new AppError(404, 'Holiday not found');
  }
  await HolidayModel.deleteHoliday(id);
  logger.info(`Holiday deleted: ${id}`);
};
