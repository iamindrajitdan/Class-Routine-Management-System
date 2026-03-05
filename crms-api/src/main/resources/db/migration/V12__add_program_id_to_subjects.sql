-- Add program_id to subjects table
ALTER TABLE subjects ADD COLUMN program_id UUID;
ALTER TABLE subjects ADD CONSTRAINT fk_subjects_program FOREIGN KEY (program_id) REFERENCES programs(id);
