ALTER TABLE teachers ADD COLUMN code VARCHAR(50);
CREATE SEQUENCE temp_teacher_code_seq;
UPDATE teachers SET code = 'T-' || LPAD(nextval('temp_teacher_code_seq')::text, 4, '0') WHERE code IS NULL;
DROP SEQUENCE temp_teacher_code_seq;
ALTER TABLE teachers ALTER COLUMN code SET NOT NULL;
ALTER TABLE teachers ADD CONSTRAINT uk_teacher_code UNIQUE (code);
CREATE INDEX idx_teacher_code ON teachers(code);
