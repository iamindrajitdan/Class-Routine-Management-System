package com.crms.controller;

import com.crms.dto.ReferenceDataResponse;
import com.crms.repository.*;
import com.crms.domain.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reference-data")
public class ReferenceDataController {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ClassEntityRepository classEntityRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER', 'FACULTY')")
    public ResponseEntity<ReferenceDataResponse> getReferenceData() {
        List<Teacher> teachers = teacherRepository.findAll();
        List<ClassEntity> classes = classEntityRepository.findAll();
        List<Subject> subjects = subjectRepository.findAll();
        List<Lesson> lessons = lessonRepository.findAll();
        List<Classroom> classrooms = classroomRepository.findAll();
        List<TimeSlot> timeSlots = timeSlotRepository.findAll();
        List<Program> programs = programRepository.findAll();
        List<User> users = userRepository.findAll();

        return ResponseEntity.ok(ReferenceDataResponse.build(
                teachers, classes, subjects, lessons, classrooms, timeSlots, programs, users
        ));
    }
}
