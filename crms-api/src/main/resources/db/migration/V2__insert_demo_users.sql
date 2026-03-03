-- Insert demo users for testing
-- Requirements: 8.1, 8.2

-- Insert Department first
INSERT INTO departments (id, name, code, description) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Computer Science', 'CS', 'Computer Science Department')
ON CONFLICT DO NOTHING;

-- Insert demo users with bcrypt hashed password for 'password123'
-- Bcrypt hash of 'password123': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, is_active, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@crms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ADMIN', '550e8400-e29b-41d4-a716-446655440000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440002', 'planner@crms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Planner', 'User', 'ACADEMIC_PLANNER', '550e8400-e29b-41d4-a716-446655440000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440003', 'faculty@crms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Faculty', 'User', 'FACULTY', '550e8400-e29b-41d4-a716-446655440000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('550e8400-e29b-41d4-a716-446655440004', 'student@crms.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Student', 'User', 'STUDENT', '550e8400-e29b-41d4-a716-446655440000', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
