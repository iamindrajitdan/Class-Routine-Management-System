-- Rename name column to code to match JPA entity
ALTER TABLE classrooms RENAME COLUMN name TO code;

-- Add missing type column
ALTER TABLE classrooms ADD COLUMN type VARCHAR(100);

-- Ensure floor is varchar to match JPA entity (it was INTEGER in V1)
ALTER TABLE classrooms ALTER COLUMN floor TYPE VARCHAR(50);
