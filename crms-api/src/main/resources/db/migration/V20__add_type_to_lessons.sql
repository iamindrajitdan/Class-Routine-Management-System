-- Migration to add missing columns to lessons table
-- Requirements: 6.2

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'THEORY';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;

-- Subject mapping should have a default duration if not specified
UPDATE lessons SET duration_minutes = 60 WHERE duration_minutes IS NULL;
UPDATE lessons SET type = 'THEORY' WHERE type IS NULL;

-- Make them NOT NULL after populating defaults
ALTER TABLE lessons ALTER COLUMN type SET NOT NULL;
ALTER TABLE lessons ALTER COLUMN duration_minutes SET NOT NULL;
