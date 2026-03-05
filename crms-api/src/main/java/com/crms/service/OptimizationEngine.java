package com.crms.service;

import com.crms.domain.*;
import com.crms.dto.OptimizationRequest;
import com.crms.dto.OptimizationResult;
import com.crms.repository.*;
import com.google.ortools.Loader;
import com.google.ortools.sat.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OptimizationEngine {

    static {
        Loader.loadNativeLibraries();
    }

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    public OptimizationResult optimize(OptimizationRequest request) {
        CpModel model = new CpModel();

        List<Lesson> lessons = lessonRepository.findAllById(request.getLessonIds());
        List<Teacher> teachers = teacherRepository.findAllById(request.getTeacherIds());
        List<Classroom> classrooms = classroomRepository.findAllById(request.getClassroomIds());
        List<TimeSlot> timeSlots = timeSlotRepository.findAllById(request.getTimeSlotIds());

        if (lessons.isEmpty() || timeSlots.isEmpty() || classrooms.isEmpty()) {
            return OptimizationResult.builder()
                    .status("FAILED")
                    .suggestions(Collections.emptyList())
                    .build();
        }

        // Variable: x[lesson_idx][timeslot_idx][classroom_idx]
        Literal[][][] x = new Literal[lessons.size()][timeSlots.size()][classrooms.size()];
        for (int i = 0; i < lessons.size(); i++) {
            for (int j = 0; j < timeSlots.size(); j++) {
                for (int k = 0; k < classrooms.size(); k++) {
                    x[i][j][k] = model.newBoolVar("l" + i + "t" + j + "c" + k);
                }
            }
        }

        // Constraint 1: Each lesson must be scheduled exactly once
        for (int i = 0; i < lessons.size(); i++) {
            List<Literal> possibleSlots = new ArrayList<>();
            for (int j = 0; j < timeSlots.size(); j++) {
                for (int k = 0; k < classrooms.size(); k++) {
                    possibleSlots.add(x[i][j][k]);
                }
            }
            model.addExactlyOne(possibleSlots.toArray(new Literal[0]));
        }

        // Constraint 2: At most one lesson per classroom per timeslot
        for (int j = 0; j < timeSlots.size(); j++) {
            for (int k = 0; k < classrooms.size(); k++) {
                List<Literal> lessonsInRoom = new ArrayList<>();
                for (int i = 0; i < lessons.size(); i++) {
                    lessonsInRoom.add(x[i][j][k]);
                }
                model.addAtMostOne(lessonsInRoom.toArray(new Literal[0]));
            }
        }

        // Constraint 3: At most one lesson per teacher per timeslot
        Map<UUID, Integer> teacherToIdx = new HashMap<>();
        for (int t = 0; t < teachers.size(); t++) {
            teacherToIdx.put(teachers.get(t).getId(), t);
        }

        for (int tIdx = 0; tIdx < teachers.size(); tIdx++) {
            Teacher teacher = teachers.get(tIdx);
            for (int j = 0; j < timeSlots.size(); j++) {
                List<Literal> teacherLessons = new ArrayList<>();
                for (int i = 0; i < lessons.size(); i++) {
                    // This is a simplification: assuming lesson is tied to a teacher
                    // In real CRMS, Subject/Class has a teacher.
                    // Let's assume for now that the lesson we are scheduling is already assigned to a teacher.
                    // We need to fetch the teacher assigned to the subject/class of this lesson.
                    // For now, let's just use the teacherIds in the request as a pool and assume lessons are assigned.
                    // Correct logic: check if lesson's subject/class teacher is 'teacher'
                    if (lessons.get(i).getSubject() != null && 
                        lessons.get(i).getSubject().getTeachers() != null && 
                        lessons.get(i).getSubject().getTeachers().stream().anyMatch(tea -> tea.getId().equals(teacher.getId()))) {
                        for (int k = 0; k < classrooms.size(); k++) {
                            teacherLessons.add(x[i][j][k]);
                        }
                    }
                }
                if (!teacherLessons.isEmpty()) {
                    model.addAtMostOne(teacherLessons.toArray(new Literal[0]));
                }

                // Add Constraint: Forbidden slots from FacultyAvailability
                // If a teacher has availability settings and this slot is NOT in their allowed/preferred list
                // we should forbid it. For simplicity, if they have ANY settings, we assume only those are allowed.
                final UUID currentTeacherId = teacher.getId();
                final TimeSlot currentSlot = timeSlots.get(j);
                
                boolean hasSpecificAvailability = teacher.getFacultyAvailabilities().stream()
                        .anyMatch(fa -> fa.getDayOfWeek().equals(currentSlot.getDayOfWeek()));
                
                if (hasSpecificAvailability) {
                    boolean isSlotAllowed = teacher.getFacultyAvailabilities().stream()
                            .anyMatch(fa -> fa.getDayOfWeek().equals(currentSlot.getDayOfWeek()) && 
                                           fa.getTimeSlot().getId().equals(currentSlot.getId()));
                    
                    if (!isSlotAllowed) {
                        for (int i = 0; i < lessons.size(); i++) {
                            if (lessons.get(i).getSubject() != null && 
                                lessons.get(i).getSubject().getTeachers().stream().anyMatch(tea -> tea.getId().equals(currentTeacherId))) {
                                for (int k = 0; k < classrooms.size(); k++) {
                                    model.addImplication(x[i][j][k], x[i][j][k].not());
                                }
                            }
                        }
                    }
                }
            }
        }

        // Constraint 4: At most one lesson per ClassEntity per timeslot
        Set<UUID> classIds = lessons.stream()
                .map(l -> l.getSubject().getProgram().getId()) // Simplified: use Program ID as Class ID for now
                .collect(Collectors.toSet());
        
        for (UUID classId : classIds) {
            for (int j = 0; j < timeSlots.size(); j++) {
                List<Literal> classLessons = new ArrayList<>();
                for (int i = 0; i < lessons.size(); i++) {
                    if (lessons.get(i).getSubject().getProgram().getId().equals(classId)) {
                        for (int k = 0; k < classrooms.size(); k++) {
                            classLessons.add(x[i][j][k]);
                        }
                    }
                }
                if (!classLessons.isEmpty()) {
                    model.addAtMostOne(classLessons.toArray(new Literal[0]));
                }
            }
        }

        // Solver
        CpSolver solver = new CpSolver();
        CpSolverStatus status = solver.solve(model);

        if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
            List<OptimizationResult.ScheduledRoutine> suggestions = new ArrayList<>();
            for (int i = 0; i < lessons.size(); i++) {
                for (int j = 0; j < timeSlots.size(); j++) {
                    for (int k = 0; k < classrooms.size(); k++) {
                        if (solver.booleanValue(x[i][j][k])) {
                            Lesson l = lessons.get(i);
                            suggestions.add(OptimizationResult.ScheduledRoutine.builder()
                                    .lessonId(l.getId())
                                    .subjectId(l.getSubject().getId())
                                    .teacherId(l.getSubject().getTeachers().isEmpty() ? null : l.getSubject().getTeachers().iterator().next().getId())
                                    .classId(l.getSubject().getProgram().getId())
                                    .timeSlotId(timeSlots.get(j).getId())
                                    .classroomId(classrooms.get(k).getId())
                                    .build());
                        }
                    }
                }
            }

            return OptimizationResult.builder()
                    .status("SUCCESS")
                    .score(solver.objectiveValue())
                    .suggestions(suggestions)
                    .build();
        } else {
            return OptimizationResult.builder()
                    .status("INFEASIBLE")
                    .suggestions(Collections.emptyList())
                    .build();
        }
    }
}
