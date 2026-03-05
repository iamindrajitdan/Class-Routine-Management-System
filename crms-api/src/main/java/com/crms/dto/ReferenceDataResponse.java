package com.crms.dto;

import com.crms.domain.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ReferenceDataResponse(
        List<TeacherRecord> teachers,
        List<ClassRecord> classes,
        List<SubjectRecord> subjects,
        List<LessonRecord> lessons,
        List<ClassroomRecord> classrooms,
        List<TimeSlotRecord> timeSlots,
        List<ProgramRecord> programs,
        List<UserRecord> users
) {
    public record UserRecord(UUID id, String firstName, String lastName, String email) {
        public static UserRecord from(User u) {
            return new UserRecord(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail());
        }
    }

    public record ProgramRecord(UUID id, String code, String name) {
        public static ProgramRecord from(Program p) {
            return new ProgramRecord(p.getId(), p.getCode(), p.getName());
        }
    }

    public record TeacherRecord(UUID id, String code, String firstName, String lastName) {
        public static TeacherRecord from(Teacher t) {
            return new TeacherRecord(t.getId(), t.getCode(), t.getUser().getFirstName(), t.getUser().getLastName());
        }
    }

    public record ClassRecord(UUID id, String code, String name) {
        public static ClassRecord from(ClassEntity c) {
            return new ClassRecord(c.getId(), c.getCode(), c.getName());
        }
    }

    public record SubjectRecord(UUID id, String code, String name) {
        public static SubjectRecord from(Subject s) {
            return new SubjectRecord(s.getId(), s.getCode(), s.getName());
        }
    }

    public record LessonRecord(UUID id, String title, UUID subjectId) {
        public static LessonRecord from(Lesson l) {
            return new LessonRecord(l.getId(), l.getTitle(), l.getSubject().getId());
        }
    }

    public record ClassroomRecord(UUID id, String code, String name, Integer capacity) {
        public static ClassroomRecord from(Classroom c) {
            return new ClassroomRecord(c.getId(), c.getCode(), c.getBuilding() + " " + (c.getFloor() != null ? c.getFloor() : ""), c.getCapacity());
        }
    }

    public record TimeSlotRecord(UUID id, String dayOfWeek, String startTime, String endTime, String label) {
        public static TimeSlotRecord from(TimeSlot t) {
            return new TimeSlotRecord(
                    t.getId(),
                    t.getDayOfWeek().name(),
                    t.getStartTime().toString(),
                    t.getEndTime().toString(),
                    t.getLabel()
            );
        }
    }

    // Builder/Mapper methods
    public static ReferenceDataResponse build(
            List<Teacher> teachers,
            List<ClassEntity> classes,
            List<Subject> subjects,
            List<Lesson> lessons,
            List<Classroom> classrooms,
            List<TimeSlot> timeSlots,
            List<Program> programs,
            List<User> users
    ) {
        return new ReferenceDataResponse(
                teachers.stream().map(TeacherRecord::from).collect(Collectors.toList()),
                classes.stream().map(ClassRecord::from).collect(Collectors.toList()),
                subjects.stream().map(SubjectRecord::from).collect(Collectors.toList()),
                lessons.stream().map(LessonRecord::from).collect(Collectors.toList()),
                classrooms.stream().map(ClassroomRecord::from).collect(Collectors.toList()),
                timeSlots.stream().map(TimeSlotRecord::from).collect(Collectors.toList()),
                programs.stream().map(ProgramRecord::from).collect(Collectors.toList()),
                users.stream().map(UserRecord::from).collect(Collectors.toList())
        );
    }
}
