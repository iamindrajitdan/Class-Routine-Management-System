package com.crms.service;

import com.crms.domain.*;
import com.crms.repository.RoutineRepository;
import com.crms.repository.ConflictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Conflict Detection Service
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
@Service
@Transactional
public class ConflictDetectionService {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private ConflictRepository conflictRepository;

    public List<Conflict> detectConflicts(Routine routine) {
        List<Conflict> conflicts = new ArrayList<>();

        // Detect teacher double-booking
        conflicts.addAll(detectTeacherDoubleBooking(routine));

        // Detect classroom conflicts
        conflicts.addAll(detectClassroomConflicts(routine));

        // Detect class scheduling conflicts
        conflicts.addAll(detectClassSchedulingConflicts(routine));

        // Save detected conflicts
        if (!conflicts.isEmpty()) {
            conflictRepository.saveAll(conflicts);
        }

        return conflicts;
    }

    private List<Conflict> detectTeacherDoubleBooking(Routine routine) {
        List<Conflict> conflicts = new ArrayList<>();

        List<Routine> existingRoutines = routineRepository.findConflictingRoutinesByTeacherAndTimeSlot(
                routine.getTeacher(),
                routine.getTimeSlot()
        );

        for (Routine existing : existingRoutines) {
            if (!existing.getId().equals(routine.getId())) {
                Conflict conflict = new Conflict(
                        routine,
                        Conflict.ConflictType.TEACHER_DOUBLE_BOOKING,
                        "Teacher " + routine.getTeacher().getUser().getFirstName() + " is already assigned to another class at this time",
                        Conflict.ConflictSeverity.CRITICAL
                );
                conflict.setSuggestedResolution("Choose a different time slot or teacher");
                conflicts.add(conflict);
            }
        }

        return conflicts;
    }

    private List<Conflict> detectClassroomConflicts(Routine routine) {
        List<Conflict> conflicts = new ArrayList<>();

        List<Routine> existingRoutines = routineRepository.findConflictingRoutinesByClassroomAndTimeSlot(
                routine.getClassroom(),
                routine.getTimeSlot()
        );

        for (Routine existing : existingRoutines) {
            if (!existing.getId().equals(routine.getId())) {
                Conflict conflict = new Conflict(
                        routine,
                        Conflict.ConflictType.CLASSROOM_DOUBLE_BOOKING,
                        "Classroom " + routine.getClassroom().getCode() + " is already booked at this time",
                        Conflict.ConflictSeverity.HIGH
                );
                conflict.setSuggestedResolution("Choose a different classroom or time slot");
                conflicts.add(conflict);
            }
        }

        return conflicts;
    }

    private List<Conflict> detectClassSchedulingConflicts(Routine routine) {
        List<Conflict> conflicts = new ArrayList<>();

        List<Routine> existingRoutines = routineRepository.findConflictingRoutinesByClassAndTimeSlot(
                routine.getClassEntity(),
                routine.getTimeSlot()
        );

        for (Routine existing : existingRoutines) {
            if (!existing.getId().equals(routine.getId())) {
                Conflict conflict = new Conflict(
                        routine,
                        Conflict.ConflictType.CLASS_DOUBLE_BOOKING,
                        "Class " + routine.getClassEntity().getCode() + " already has a class scheduled at this time",
                        Conflict.ConflictSeverity.HIGH
                );
                conflict.setSuggestedResolution("Choose a different time slot");
                conflicts.add(conflict);
            }
        }

        return conflicts;
    }

    public List<Conflict> getUnresolvedConflicts() {
        return conflictRepository.findUnresolvedConflicts();
    }

    public Long countUnresolvedConflicts() {
        return conflictRepository.countUnresolvedConflicts();
    }

    public void resolveConflict(Conflict conflict, User resolvedBy) {
        conflict.setStatus(Conflict.ConflictStatus.RESOLVED);
        conflict.setResolvedBy(resolvedBy);
        conflict.setResolvedAt(java.time.LocalDateTime.now());
        conflictRepository.save(conflict);
    }
}
