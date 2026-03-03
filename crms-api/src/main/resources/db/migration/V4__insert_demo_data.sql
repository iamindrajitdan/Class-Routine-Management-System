-- Insert demo data matching the correct schema

-- Insert additional departments
INSERT INTO departments (id, name, code, description, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'Mathematics', 'MATH', 'Mathematics Department', CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440011', 'Physics', 'PHY', 'Physics Department', CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440012', 'Chemistry', 'CHEM', 'Chemistry Department', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert programs
INSERT INTO programs (id, name, code, department_id, description, created_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Computer Science', 'CS', '550e8400-e29b-41d4-a716-446655440000', 'Computer Science Program', CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440010', 'Mathematics', 'MATH', '550e8400-e29b-41d4-a716-446655440010', 'Mathematics Program', CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440011', 'Physics', 'PHY', '550e8400-e29b-41d4-a716-446655440011', 'Physics Program', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert teacher users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, is_active, created_at, updated_at)
VALUES 
  ('560e8400-e29b-41d4-a716-446655440001', 'john.smith@crms.edu', '$2b$12$fake_hash_john', 'John', 'Smith', 'FACULTY', '550e8400-e29b-41d4-a716-446655440000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('560e8400-e29b-41d4-a716-446655440002', 'sarah.johnson@crms.edu', '$2b$12$fake_hash_sarah', 'Sarah', 'Johnson', 'FACULTY', '550e8400-e29b-41d4-a716-446655440000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('560e8400-e29b-41d4-a716-446655440003', 'michael.brown@crms.edu', '$2b$12$fake_hash_michael', 'Michael', 'Brown', 'FACULTY', '550e8400-e29b-41d4-a716-446655440010', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('560e8400-e29b-41d4-a716-446655440004', 'emily.davis@crms.edu', '$2b$12$fake_hash_emily', 'Emily', 'Davis', 'FACULTY', '550e8400-e29b-41d4-a716-446655440011', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('560e8400-e29b-41d4-a716-446655440005', 'david.wilson@crms.edu', '$2b$12$fake_hash_david', 'David', 'Wilson', 'FACULTY', '550e8400-e29b-41d4-a716-446655440012', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert teachers
INSERT INTO teachers (id, user_id, department_id, specialization, created_at, updated_at)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', '560e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Data Structures', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('650e8400-e29b-41d4-a716-446655440002', '560e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Algorithms', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('650e8400-e29b-41d4-a716-446655440003', '560e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', 'Calculus', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('650e8400-e29b-41d4-a716-446655440004', '560e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440011', 'Quantum Physics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('650e8400-e29b-41d4-a716-446655440005', '560e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440012', 'Organic Chemistry', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert subjects
INSERT INTO subjects (id, name, code, credit_hours, description, created_at, updated_at)
VALUES 
  ('750e8400-e29b-41d4-a716-446655440001', 'Data Structures', 'CS201', 3, 'Introduction to Data Structures and Algorithms', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('750e8400-e29b-41d4-a716-446655440002', 'Database Systems', 'CS301', 4, 'Relational Database Management Systems', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('750e8400-e29b-41d4-a716-446655440003', 'Web Development', 'CS302', 3, 'Full Stack Web Development', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('750e8400-e29b-41d4-a716-446655440004', 'Calculus I', 'MATH101', 4, 'Differential and Integral Calculus', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('750e8400-e29b-41d4-a716-446655440005', 'Physics I', 'PHY101', 4, 'Mechanics and Thermodynamics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert classes
INSERT INTO classes (id, name, code, academic_year, semester, program_id, capacity, created_at, updated_at)
VALUES 
  ('950e8400-e29b-41d4-a716-446655440001', 'CS 3rd Semester A', 'CS-3A', '2025-2026', 3, '550e8400-e29b-41d4-a716-446655440000', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('950e8400-e29b-41d4-a716-446655440002', 'CS 3rd Semester B', 'CS-3B', '2025-2026', 3, '550e8400-e29b-41d4-a716-446655440000', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('950e8400-e29b-41d4-a716-446655440003', 'CS 5th Semester A', 'CS-5A', '2025-2026', 5, '550e8400-e29b-41d4-a716-446655440000', 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert classrooms
INSERT INTO classrooms (id, name, building, floor, capacity, created_at, updated_at)
VALUES 
  ('a50e8400-e29b-41d4-a716-446655440001', 'Room 101', 'Main Building', 1, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a50e8400-e29b-41d4-a716-446655440002', 'Room 102', 'Main Building', 1, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a50e8400-e29b-41d4-a716-446655440003', 'Lab 201', 'CS Building', 2, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('a50e8400-e29b-41d4-a716-446655440004', 'Room 301', 'Main Building', 3, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert time slots
INSERT INTO time_slots (id, day_of_week, start_time, end_time, created_at)
VALUES 
  ('b50e8400-e29b-41d4-a716-446655440001', 'MONDAY', '09:00:00', '10:30:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440002', 'MONDAY', '10:45:00', '12:15:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440003', 'MONDAY', '13:00:00', '14:30:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440004', 'TUESDAY', '09:00:00', '10:30:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440005', 'TUESDAY', '10:45:00', '12:15:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440006', 'WEDNESDAY', '09:00:00', '10:30:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440007', 'THURSDAY', '09:00:00', '10:30:00', CURRENT_TIMESTAMP),
  ('b50e8400-e29b-41d4-a716-446655440008', 'FRIDAY', '09:00:00', '10:30:00', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert lessons
INSERT INTO lessons (id, subject_id, lesson_number, title, duration_minutes, created_at, updated_at)
VALUES 
  ('d50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 1, 'Arrays and Lists', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 1, 'Database Design', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 1, 'HTML & CSS Basics', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', 1, 'Functions and Limits', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('d50e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', 1, 'Motion and Forces', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
