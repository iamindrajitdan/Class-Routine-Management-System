package com.crms.service;

import com.crms.domain.*;
import com.crms.repository.RoutineRepository;
import com.crms.repository.ConflictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Routine Management Service
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
@Service
@Transactional
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private ConflictRepository conflictRepository;

    @Autowired
    private ConflictDetectionService conflictDetectionService;

    @Cacheable(value = "routines", key = "#id")
    public Routine getRoutineById(UUID id) {
        return routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Routine not found with id: " + id));
    }

    @Cacheable(value = "routines_by_class", key = "#classEntity.id")
    public List<Routine> getRoutinesByClass(ClassEntity classEntity) {
        return routineRepository.findByClassEntity(classEntity);
    }

    @Cacheable(value = "routines_by_teacher", key = "#teacher.id")
    public List<Routine> getRoutinesByTeacher(Teacher teacher) {
        return routineRepository.findByTeacher(teacher);
    }

    @Cacheable(value = "routines_by_status", key = "#status")
    public List<Routine> getRoutinesByStatus(Routine.RoutineStatus status) {
        return routineRepository.findByStatus(status);
    }

    @CacheEvict(value = {"routines", "routines_by_class", "routines_by_teacher", "routines_by_status"}, allEntries = true)
    public Routine createRoutine(Routine routine) {
        // Validate routine data
        validateRoutine(routine);

        // Detect conflicts
        List<Conflict> conflicts = conflictDetectionService.detectConflicts(routine);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Scheduling conflicts detected. Please resolve before saving.");
        }

        return routineRepository.save(routine);
    }

    @CacheEvict(value = {"routines", "routines_by_class", "routines_by_teacher", "routines_by_status"}, allEntries = true)
    public Routine updateRoutine(UUID id, Routine updatedRoutine) {
        Routine routine = getRoutineById(id);

        // Validate updated routine
        validateRoutine(updatedRoutine);

        // Detect conflicts
        List<Conflict> conflicts = conflictDetectionService.detectConflicts(updatedRoutine);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Scheduling conflicts detected. Please resolve before saving.");
        }

        routine.setTeacher(updatedRoutine.getTeacher());
        routine.setSubject(updatedRoutine.getSubject());
        routine.setLesson(updatedRoutine.getLesson());
        routine.setTimeSlot(updatedRoutine.getTimeSlot());
        routine.setClassroom(updatedRoutine.getClassroom());
        routine.setStatus(updatedRoutine.getStatus());

        return routineRepository.save(routine);
    }

    @CacheEvict(value = {"routines", "routines_by_class", "routines_by_teacher", "routines_by_status"}, allEntries = true)
    public void deleteRoutine(UUID id) {
        Routine routine = getRoutineById(id);
        
        // Delete associated conflicts
        List<Conflict> conflicts = conflictRepository.findByRoutine(routine);
        conflictRepository.deleteAll(conflicts);

        routineRepository.deleteById(id);
    }

    private void validateRoutine(Routine routine) {
        if (routine.getClassEntity() == null) {
            throw new IllegalArgumentException("Class is required");
        }
        if (routine.getTeacher() == null) {
            throw new IllegalArgumentException("Teacher is required");
        }
        if (routine.getSubject() == null) {
            throw new IllegalArgumentException("Subject is required");
        }
        if (routine.getLesson() == null) {
            throw new IllegalArgumentException("Lesson is required");
        }
        if (routine.getTimeSlot() == null) {
            throw new IllegalArgumentException("Time slot is required");
        }
        if (routine.getClassroom() == null) {
            throw new IllegalArgumentException("Classroom is required");
        }
    }
}
