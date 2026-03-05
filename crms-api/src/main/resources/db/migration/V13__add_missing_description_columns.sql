-- Add description to lessons table
ALTER TABLE lessons ADD COLUMN description TEXT;

-- Add description to holidays table
ALTER TABLE holidays ADD COLUMN description TEXT;

-- Add description to exam_periods table
ALTER TABLE exam_periods ADD COLUMN description TEXT;
