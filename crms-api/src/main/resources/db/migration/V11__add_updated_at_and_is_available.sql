-- Add updated_at to departments table
ALTER TABLE departments ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create trigger for departments
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add is_available to teachers table
ALTER TABLE teachers ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT TRUE;
