/**
 * Database Seeding Script
 * Requirements: 12.1
 */

import { query } from '@config/database';
import { logger } from '@utils/logger';
import bcryptjs from 'bcryptjs';

/**
 * Seed database with initial data
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('Starting database seeding');

    // Seed departments
    const departments = [
      { name: 'Computer Science', code: 'CS' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
    ];

    for (const dept of departments) {
      await query(
        'INSERT INTO departments (name, code) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
        [dept.name, dept.code]
      );
    }

    logger.info('Departments seeded');

    // Seed programs
    const programs = [
      { name: 'B.Tech Computer Science', code: 'BTECH-CS', deptCode: 'CS' },
      { name: 'B.Tech Mathematics', code: 'BTECH-MATH', deptCode: 'MATH' },
    ];

    for (const prog of programs) {
      const dept = await query(
        'SELECT id FROM departments WHERE code = $1',
        [prog.deptCode]
      );
      if (dept.length > 0) {
        await query(
          'INSERT INTO programs (name, code, department_id) VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',
          [prog.name, prog.code, (dept[0] as { id: string }).id]
        );
      }
    }

    logger.info('Programs seeded');

    // Seed admin user
    const adminPassword = await bcryptjs.hash('admin123', 10);
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@crms.local', adminPassword, 'System', 'Administrator', 'Admin', true]
    );

    logger.info('Admin user seeded');

    // Seed sample subjects
    const subjects = [
      { name: 'Data Structures', code: 'CS101', creditHours: 3 },
      { name: 'Algorithms', code: 'CS102', creditHours: 3 },
      { name: 'Database Systems', code: 'CS201', creditHours: 4 },
      { name: 'Calculus I', code: 'MATH101', creditHours: 4 },
    ];

    for (const subj of subjects) {
      await query(
        'INSERT INTO subjects (name, code, credit_hours) VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',
        [subj.name, subj.code, subj.creditHours]
      );
    }

    logger.info('Subjects seeded');

    // Seed time slots
    const timeSlots = [
      { day: 'Monday', startTime: '09:00', endTime: '10:00' },
      { day: 'Monday', startTime: '10:15', endTime: '11:15' },
      { day: 'Monday', startTime: '11:30', endTime: '12:30' },
      { day: 'Tuesday', startTime: '09:00', endTime: '10:00' },
      { day: 'Tuesday', startTime: '10:15', endTime: '11:15' },
      { day: 'Wednesday', startTime: '09:00', endTime: '10:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '10:00' },
      { day: 'Friday', startTime: '09:00', endTime: '10:00' },
    ];

    for (const slot of timeSlots) {
      await query(
        `INSERT INTO time_slots (day_of_week, start_time, end_time)
         VALUES ($1, $2, $3)
         ON CONFLICT (day_of_week, start_time, end_time) DO NOTHING`,
        [slot.day, slot.startTime, slot.endTime]
      );
    }

    logger.info('Time slots seeded');

    // Seed classrooms
    const classrooms = [
      { name: 'Room 101', capacity: 30, building: 'Building A', floor: 1 },
      { name: 'Room 102', capacity: 30, building: 'Building A', floor: 1 },
      { name: 'Room 201', capacity: 40, building: 'Building B', floor: 2 },
      { name: 'Lab 301', capacity: 25, building: 'Building C', floor: 3, isVirtual: false },
    ];

    for (const room of classrooms) {
      await query(
        `INSERT INTO classrooms (name, capacity, building, floor, is_virtual)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [room.name, room.capacity, room.building, room.floor, room.isVirtual || false]
      );
    }

    logger.info('Classrooms seeded');

    logger.info('Database seeding completed successfully');
  } catch (err) {
    logger.error('Seeding failed', err);
    throw err;
  }
};

// Run seeding if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding finished');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Seeding error', err);
      process.exit(1);
    });
}
