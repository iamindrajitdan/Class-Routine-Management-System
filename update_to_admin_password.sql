-- Update admin user to use 'admin' as password
-- Bcrypt hash for 'admin': $2a$10$DOwnh1y/7NKDlXPRKPLqXu3xqLvVsqLvJf8Qs8FqYqVlKqLvJf8Qs
UPDATE users SET password_hash = '$2a$10$DOwnh1y/7NKDlXPRKPLqXu3xqLvVsqLvJf8Qs8FqYqVlKqLvJf8Qs' 
WHERE email = 'admin@crms.edu';
