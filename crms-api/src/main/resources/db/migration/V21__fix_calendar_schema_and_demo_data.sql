-- Fix missing calendar schema and provide comprehensive demo data
-- Requirements: 1.1, 6.1, 12.1

-- 1. Create missing Academic Year table
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create missing Semester table
CREATE TABLE IF NOT EXISTS semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2.1 Fix Exam Periods schema to match entity
ALTER TABLE exam_periods DROP COLUMN IF EXISTS academic_year CASCADE;
ALTER TABLE exam_periods ADD COLUMN IF NOT EXISTS description VARCHAR(500);
ALTER TABLE exam_periods ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'FINAL';

-- 3. Insert Academic Year
INSERT INTO academic_years (id, name, start_date, end_date, is_active)
VALUES ('a50e8400-e29b-41d4-a716-446655440100', 'Academic Year 2025-2026', '2025-09-01', '2026-06-30', true)
ON CONFLICT DO NOTHING;

-- 4. Insert Semesters
INSERT INTO semesters (id, type, academic_year_id, start_date, end_date, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-440000000001', 'FALL', 'a50e8400-e29b-41d4-a716-446655440100', '2025-09-01', '2025-12-20', false),
  ('550e8400-e29b-41d4-a716-440000000002', 'SPRING', 'a50e8400-e29b-41d4-a716-446655440100', '2026-01-15', '2026-05-30', true)
ON CONFLICT DO NOTHING;

-- 5. Additional Departments
INSERT INTO departments (id, name, code, description)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', 'Electrical Engineering', 'EE', 'Electrical Engineering Department'),
  ('550e8400-e29b-41d4-a716-446655440021', 'Mechanical Engineering', 'ME', 'Mechanical Engineering Department'),
  ('550e8400-e29b-41d4-a716-446655440022', 'Business Administration', 'BBA', 'Business Administration Department')
ON CONFLICT DO NOTHING;

-- 6. Additional Programs
INSERT INTO programs (id, name, code, department_id, description)
VALUES 
  ('550e8400-e29b-41d4-a716-440000000101', 'B.Sc in Computer Science', 'BSCS', '550e8400-e29b-41d4-a716-446655440000', 'Undergraduate CS Program'),
  ('550e8400-e29b-41d4-a716-440000000102', 'B.Sc in Electrical Engineering', 'BSEE', '550e8400-e29b-41d4-a716-446655440020', 'Undergraduate EE Program'),
  ('550e8400-e29b-41d4-a716-440000000103', 'Master of Business Administration', 'MBA', '550e8400-e29b-41d4-a716-446655440022', 'Postgraduate Business Program')
ON CONFLICT DO NOTHING;

-- 7. Additional Time Slots (To fill the calendar)
INSERT INTO time_slots (id, day_of_week, start_time, end_time)
VALUES 
  (uuid_generate_v4(), 'MONDAY', '14:45:00', '16:15:00'),
  (uuid_generate_v4(), 'TUESDAY', '13:00:00', '14:30:00'),
  (uuid_generate_v4(), 'TUESDAY', '14:45:00', '16:15:00'),
  (uuid_generate_v4(), 'WEDNESDAY', '10:45:00', '12:15:00'),
  (uuid_generate_v4(), 'WEDNESDAY', '13:00:00', '14:30:00'),
  (uuid_generate_v4(), 'THURSDAY', '10:45:00', '12:15:00'),
  (uuid_generate_v4(), 'THURSDAY', '13:00:00', '14:30:00'),
  (uuid_generate_v4(), 'FRIDAY', '10:45:00', '12:15:00')
ON CONFLICT DO NOTHING;

-- 8. Additional Holidays and Exams
INSERT INTO holidays (id, name, holiday_date, type, description)
VALUES 
  (uuid_generate_v4(), 'New Year Day', '2026-01-01', 'PUBLIC', 'National Holiday'),
  (uuid_generate_v4(), 'Independence Day', '2026-03-26', 'PUBLIC', 'National Holiday'),
  (uuid_generate_v4(), 'Eid-ul-Fitr', '2026-04-10', 'RELIGIOUS', 'Religious Holiday')
ON CONFLICT DO NOTHING;

INSERT INTO exam_periods (id, name, start_date, end_date, description, type)
VALUES 
  (uuid_generate_v4(), 'Midterm Exams Fall 2025', '2025-10-15', '2025-10-25', 'First semester midterms', 'MIDTERM'),
  (uuid_generate_v4(), 'Final Exams Fall 2025', '2025-12-15', '2025-12-24', 'First semester finals', 'FINAL')
ON CONFLICT DO NOTHING;

-- 9. More Routines (Populating the weekly schedule)
-- We need to link to existing or newly created IDs
-- For simplicity, let's use some existing IDs from V4/V5 and some generic ones

INSERT INTO routines (id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by)
SELECT 
  uuid_generate_v4(), 
  '950e8400-e29b-41d4-a716-446655440001', -- CS 3rd Sem A
  '650e8400-e29b-41d4-a716-446655440001', -- John Smith
  '750e8400-e29b-41d4-a716-446655440002', -- Database Systems
  'd50e8400-e29b-41d4-a716-446655440002', -- Database Design
  id, 
  'a50e8400-e29b-41d4-a716-446655440001', -- Room 101
  'REGULAR', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440001'
FROM time_slots 
WHERE day_of_week IN ('TUESDAY', 'WEDNESDAY', 'THURSDAY')
LIMIT 10;

-- 10. Audit Logs & Notifications
INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, after_state, ip_address)
VALUES 
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', 'LOGIN', 'USER', '550e8400-e29b-41d4-a716-446655440001', 'User logged in successfully', '127.0.0.1'),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', 'CREATE', 'ROUTINE', '550e8400-e29b-41d4-a716-440000000001', 'New routine created for CS-3A', '127.0.0.1')
ON CONFLICT DO NOTHING;

INSERT INTO notifications (id, user_id, notification_type, title, message, is_read, delivery_status, created_at, updated_at)
VALUES 
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', 'SYSTEM', 'Welcome to CRMS', 'Your academic portal is now active.', false, 'DELIVERED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', 'ALERT', 'New Routine Assigned', 'A new routine for Data Structures has been assigned to your department.', false, 'DELIVERED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
