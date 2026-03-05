ALTER TABLE substitutes DROP CONSTRAINT IF EXISTS valid_date_range;

ALTER TABLE substitutes
    ADD COLUMN IF NOT EXISTS substitute_date DATE,
    ADD COLUMN IF NOT EXISTS created_by UUID;

-- Set substitute_date to start_date if it exists
UPDATE substitutes SET substitute_date = CURRENT_DATE WHERE substitute_date IS NULL;

-- Set a default user for created_by
UPDATE substitutes SET created_by = (SELECT id FROM users LIMIT 1) WHERE created_by IS NULL;

ALTER TABLE substitutes
    ALTER COLUMN substitute_date SET NOT NULL,
    ALTER COLUMN created_by SET NOT NULL,
    DROP COLUMN IF EXISTS start_date CASCADE,
    DROP COLUMN IF EXISTS end_date CASCADE;

ALTER TABLE substitutes
    ADD CONSTRAINT fk_substitutes_created_by FOREIGN KEY (created_by) REFERENCES users(id);
