-- Consolidated Database Initialization for CRMS
-- This script initializes the schema and populates demo data in a single run.

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'ACADEMIC_PLANNER', 'FACULTY', 'STUDENT');
CREATE TYPE routine_type AS ENUM ('REGULAR', 'ADDITIONAL', 'REMEDIAL');
CREATE TYPE routine_status AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');
CREATE TYPE substitute_status AS ENUM ('PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED');
CREATE TYPE conflict_type AS ENUM ('TEACHER_DOUBLE', 'CLASSROOM_DOUBLE', 'CLASS_DOUBLE');
CREATE TYPE conflict_status AS ENUM ('DETECTED', 'RESOLVED', 'IGNORED');
CREATE TYPE day_of_week AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- 3. Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Tables with Final Schema
-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Programs
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'STUDENT',
    department_id UUID REFERENCES departments(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(255),
    max_hours_per_week INTEGER DEFAULT 40 CHECK (max_hours_per_week > 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    credit_hours INTEGER NOT NULL CHECK (credit_hours > 0),
    program_id UUID REFERENCES programs(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Lessons
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL CHECK (sequence_number > 0),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
    type VARCHAR(20) NOT NULL DEFAULT 'LECTURE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, sequence_number)
);

-- Time slots
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    label VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    UNIQUE(day_of_week, start_time, end_time)
);

-- Classrooms
CREATE TABLE classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    building VARCHAR(100),
    floor VARCHAR(50),
    is_virtual BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    academic_year VARCHAR(9) NOT NULL,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Routines
CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    routine_type routine_type DEFAULT 'REGULAR',
    status routine_status DEFAULT 'ACTIVE',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Availability
CREATE TABLE faculty_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    is_preferred BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT valid_faculty_day_of_week CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
);

-- Substitutes
CREATE TABLE substitutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    substitute_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    substitute_date DATE NOT NULL,
    reason VARCHAR(255),
    status substitute_status DEFAULT 'PENDING',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Academic Years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Semesters
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Holidays
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    holiday_date DATE NOT NULL,
    type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Exam periods
CREATE TABLE exam_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description VARCHAR(500),
    type VARCHAR(50) DEFAULT 'FINAL',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Conflicts
CREATE TABLE conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    conflict_type conflict_type NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('HIGH', 'MEDIUM', 'LOW')),
    status conflict_status DEFAULT 'DETECTED',
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    suggested_resolution TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    before_state TEXT,
    after_state TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    related_resource_type VARCHAR(100),
    related_resource_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- 5. Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_classes_academic_year ON classes(academic_year);
CREATE INDEX idx_classes_semester ON classes(semester);
CREATE INDEX idx_routines_class_id ON routines(class_id);
CREATE INDEX idx_routines_teacher_id ON routines(teacher_id);
CREATE INDEX idx_routines_time_slot_id ON routines(time_slot_id);
CREATE INDEX idx_routines_classroom_id ON routines(classroom_id);
CREATE INDEX idx_routines_status ON routines(status);
CREATE INDEX idx_substitutes_original_teacher ON substitutes(original_teacher_id);
CREATE INDEX idx_substitutes_substitute ON substitutes(substitute_id);
CREATE INDEX idx_substitutes_status ON substitutes(status);
CREATE INDEX idx_conflicts_routine_id ON conflicts(routine_id);
CREATE INDEX idx_conflicts_status ON conflicts(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_faculty_availability_teacher ON faculty_availability(teacher_id);
CREATE INDEX idx_faculty_availability_time_slot ON faculty_availability(time_slot_id);
CREATE INDEX idx_teacher_code ON teachers(code);

-- 6. Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON classrooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_substitutes_updated_at BEFORE UPDATE ON substitutes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conflicts_updated_at BEFORE UPDATE ON conflicts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Demo Data
-- Departments
INSERT INTO departments (id, name, code, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Computer Science', 'CS', 'Department of Computer Science'),
('550e8400-e29b-41d4-a716-446655440020', 'Electrical Engineering', 'EE', 'Electrical Engineering Department'),
('550e8400-e29b-41d4-a716-446655440021', 'Mechanical Engineering', 'ME', 'Mechanical Engineering Department'),
('550e8400-e29b-41d4-a716-446655440022', 'Business Administration', 'BBA', 'Business Administration Department');

-- Programs
INSERT INTO programs (id, name, code, department_id, description) VALUES
('550e8400-e29b-41d4-a716-44000101', 'B.Sc in Computer Science', 'BSCS', '550e8400-e29b-41d4-a716-446655440000', 'Undergraduate CS Program'),
('550e8400-e29b-41d4-a716-44000102', 'B.Sc in Electrical Engineering', 'BSEE', '550e8400-e29b-41d4-a716-446655440020', 'Undergraduate EE Program'),
('550e8400-e29b-41d4-a716-44000103', 'Master of Business Administration', 'MBA', '550e8400-e29b-41d4-a716-446655440022', 'Postgraduate Business Program');

-- Users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@crms.edu', crypt('password123', gen_salt('bf', 10)), 'Admin', 'User', 'ADMIN', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440002', 'planner@crms.edu', crypt('password123', gen_salt('bf', 10)), 'Academic', 'Planner', 'ACADEMIC_PLANNER', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440003', 'faculty@crms.edu', crypt('password123', gen_salt('bf', 10)), 'John', 'Smith', 'FACULTY', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440004', 'student@crms.edu', crypt('password123', gen_salt('bf', 10)), 'Jane', 'Doe', 'STUDENT', '550e8400-e29b-41d4-a716-446655440000');

-- Teachers
INSERT INTO teachers (id, user_id, department_id, code, specialization, max_hours_per_week) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'T-0001', 'Data Science & Algorithms', 40);

-- Classrooms
INSERT INTO classrooms (id, code, type, capacity, building, floor) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Room 101', 'THEORY', 60, 'Main Building', '1st Floor'),
('a50e8400-e29b-41d4-a716-446655440002', 'Lab 202', 'LAB', 30, 'Science Tower', '2nd Floor');

-- Classes
INSERT INTO classes (id, name, code, academic_year, semester, program_id, capacity) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'CS 3rd Semester A', 'CS-3A', '2025-2026', 3, '550e8400-e29b-41d4-a716-44000101', 40),
('950e8400-e29b-41d4-a716-446655440002', 'CS 3rd Semester B', 'CS-3B', '2025-2026', 3, '550e8400-e29b-41d4-a716-44000101', 40);

-- Subjects
INSERT INTO subjects (id, name, code, description, credit_hours, program_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Data Structures', 'CS301', 'Linear and non-linear data structures', 3, '550e8400-e29b-41d4-a716-44000101'),
('750e8400-e29b-41d4-a716-446655440002', 'Database Systems', 'CS302', 'Relational database design and SQL', 4, '550e8400-e29b-41d4-a716-44000101');

-- Lessons
INSERT INTO lessons (id, subject_id, sequence_number, title, duration_minutes, type) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 1, 'Arrays and Lists', 90, 'LECTURE'),
('d50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 1, 'Database Design', 90, 'LECTURE');

-- Time Slots
INSERT INTO time_slots (id, day_of_week, start_time, end_time, label) VALUES
(uuid_generate_v4(), 'MONDAY', '09:00:00', '10:30:00', 'Morning Session 1'),
(uuid_generate_v4(), 'MONDAY', '10:45:00', '12:15:00', 'Morning Session 2'),
(uuid_generate_v4(), 'TUESDAY', '09:00:00', '10:30:00', 'Morning Session 1'),
(uuid_generate_v4(), 'TUESDAY', '13:00:00', '14:30:00', 'Afternoon Session 1');

-- Routines
INSERT INTO routines (id, class_id, teacher_id, subject_id, lesson_id, time_slot_id, classroom_id, routine_type, status, created_by)
SELECT 
  uuid_generate_v4(), 
  '950e8400-e29b-41d4-a716-446655440001', -- CS-3A
  '650e8400-e29b-41d4-a716-446655440001', -- John Smith
  '750e8400-e29b-41d4-a716-446655440001', -- Data Structures
  'd50e8400-e29b-41d4-a716-446655440001', -- Arrays
  id, 
  'a50e8400-e29b-41d4-a716-446655440001', -- Room 101
  'REGULAR', 'ACTIVE', '550e8400-e29b-41d4-a716-446655440001'
FROM time_slots LIMIT 5;

-- Calendar Data
INSERT INTO academic_years (id, name, start_date, end_date, is_active)
VALUES ('a50e8400-e29b-41d4-a716-446655440100', 'Academic Year 2025-2026', '2025-09-01', '2026-06-30', true);

INSERT INTO semesters (id, type, academic_year_id, start_date, end_date, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-440000000001', 'FALL', 'a50e8400-e29b-41d4-a716-446655440100', '2025-09-01', '2025-12-20', false),
  ('550e8400-e29b-41d4-a716-440000000002', 'SPRING', 'a50e8400-e29b-41d4-a716-446655440100', '2026-01-15', '2026-05-30', true);

INSERT INTO holidays (id, name, holiday_date, type, description)
VALUES 
  (uuid_generate_v4(), 'Independence Day', '2026-03-26', 'PUBLIC', 'National Holiday'),
  (uuid_generate_v4(), 'Christmas', '2025-12-25', 'RELIGIOUS', 'Christmas Holiday');

INSERT INTO exam_periods (id, name, start_date, end_date, description, type)
VALUES 
  (uuid_generate_v4(), 'Midterm Exams Fall 2025', '2025-10-15', '2025-10-25', 'First semester midterms', 'MIDTERM'),
  (uuid_generate_v4(), 'Final Exams Fall 2025', '2025-12-15', '2025-12-24', 'First semester finals', 'FINAL');

-- Audit Logs & Notifications
INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, after_state, ip_address)
VALUES 
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', 'LOGIN', 'USER', '550e8400-e29b-41d4-a716-446655440001', 'User logged in successfully', '127.0.0.1');

INSERT INTO notifications (id, user_id, notification_type, title, message, is_read, delivery_status, created_at, updated_at)
VALUES 
  (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440001', 'SYSTEM', 'Welcome to CRMS', 'Your academic portal is now active.', false, 'DELIVERED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
