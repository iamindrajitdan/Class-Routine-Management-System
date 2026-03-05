-- Create faculty_availability table
CREATE TABLE faculty_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    is_preferred BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT valid_faculty_day_of_week CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'))
);

CREATE INDEX idx_faculty_availability_teacher ON faculty_availability(teacher_id);
CREATE INDEX idx_faculty_availability_time_slot ON faculty_availability(time_slot_id);
