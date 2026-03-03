-- Fix user passwords using pgcrypto extension
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update all demo users with properly hashed passwords
-- Using crypt function with bf (blowfish/bcrypt) algorithm
UPDATE users SET password_hash = crypt('password123', gen_salt('bf', 10))
WHERE email IN ('admin@crms.edu', 'planner@crms.edu', 'faculty@crms.edu', 'student@crms.edu');
