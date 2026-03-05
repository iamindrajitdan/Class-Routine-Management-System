-- Rename column to match JPA entity
ALTER TABLE lessons RENAME COLUMN lesson_number TO sequence_number;

-- Add missing columns to time_slots
ALTER TABLE time_slots ADD COLUMN label VARCHAR(100);
ALTER TABLE time_slots ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Setup trigger for time_slots updated_at
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
