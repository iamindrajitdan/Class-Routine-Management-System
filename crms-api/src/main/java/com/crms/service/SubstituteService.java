package com.crms.service;

import com.crms.domain.*;
import com.crms.repository.SubstituteRepository;
import com.crms.repository.TeacherRepository;
import com.crms.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Substitute Allocation Service
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */
@Service
@Transactional
public class SubstituteService {

    @Autowired
    private SubstituteRepository substituteRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ConflictDetectionService conflictDetectionService;

    @Cacheable(value = "substitutes", key = "#id")
    public Substitute getSubstituteById(UUID id) {
        return substituteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Substitute not found with id: " + id));
    }

    public List<Substitute> getSubstitutesByRoutine(Routine routine) {
        return substituteRepository.findByRoutine(routine);
    }

    public List<Substitute> getSubstitutesByTeacher(Teacher teacher) {
        return substituteRepository.findByOriginalTeacher(teacher);
    }

    public List<Teacher> identifyAvailableSubstitutes(Routine routine, LocalDate substituteDate) {
        // Get all teachers
        List<Teacher> allTeachers = teacherRepository.findAll();
        List<Teacher> availableSubstitutes = new ArrayList<>();

        for (Teacher teacher : allTeachers) {
            // Check if teacher is available
            if (!teacher.getIsAvailable()) {
                continue;
            }

            // Check if teacher has conflicts at the same time
            List<Routine> conflictingRoutines = routineRepository.findConflictingRoutinesByTeacherAndTimeSlot(
                    teacher,
                    routine.getTimeSlot()
            );

            if (conflictingRoutines.isEmpty()) {
                availableSubstitutes.add(teacher);
            }
        }

        return availableSubstitutes;
    }

    @CacheEvict(value = "substitutes", allEntries = true)
    public Substitute allocateSubstitute(Routine routine, Teacher substitute, LocalDate substituteDate, String reason, User createdBy) {
        // Validate substitute availability
        List<Routine> conflicts = routineRepository.findConflictingRoutinesByTeacherAndTimeSlot(
                substitute,
                routine.getTimeSlot()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Substitute teacher has conflicting assignments");
        }

        Substitute substitution = new Substitute(
                routine,
                routine.getTeacher(),
                substitute,
                substituteDate,
                reason,
                createdBy
        );

        return substituteRepository.save(substitution);
    }

    @CacheEvict(value = "substitutes", allEntries = true)
    public void removeSubstitute(UUID id) {
        Substitute substitute = getSubstituteById(id);
        substituteRepository.deleteById(id);
    }

    public List<Substitute> getSubstituteHistory(Teacher teacher) {
        return substituteRepository.findByOriginalTeacher(teacher);
    }
}
