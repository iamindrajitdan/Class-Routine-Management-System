-- Add missing columns to conflicts table mapped by Conflict.java entity
ALTER TABLE conflicts ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES users(id);
ALTER TABLE conflicts ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP;
ALTER TABLE conflicts ADD COLUMN IF NOT EXISTS suggested_resolution TEXT;
