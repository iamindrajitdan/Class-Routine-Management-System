package com.crms.repository;

import com.crms.domain.Routine;
import com.crms.domain.ClassEntity;
import com.crms.domain.Teacher;
import com.crms.domain.TimeSlot;
import com.crms.domain.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Routine Repository
 * Requirements: 1.1, 1.2, 1.3, 14.1, 14.2
 */
@Repository
public interface RoutineRepository extends JpaRepository<Routine, UUID> {

    List<Routine> findByClassEntity(ClassEntity classEntity);

    List<Routine> findByTeacher(Teacher teacher);

    List<Routine> findByStatus(Routine.RoutineStatus status);

    @Query("SELECT r FROM Routine r WHERE r.teacher = :teacher AND r.timeSlot = :timeSlot AND r.status = 'ACTIVE'")
    List<Routine> findConflictingRoutinesByTeacherAndTimeSlot(
            @Param("teacher") Teacher teacher,
            @Param("timeSlot") TimeSlot timeSlot
    );

    @Query("SELECT r FROM Routine r WHERE r.classroom = :classroom AND r.timeSlot = :timeSlot AND r.status = 'ACTIVE'")
    List<Routine> findConflictingRoutinesByClassroomAndTimeSlot(
            @Param("classroom") Classroom classroom,
            @Param("timeSlot") TimeSlot timeSlot
    );

    @Query("SELECT r FROM Routine r WHERE r.classEntity = :classEntity AND r.timeSlot = :timeSlot AND r.status = 'ACTIVE'")
    List<Routine> findConflictingRoutinesByClassAndTimeSlot(
            @Param("classEntity") ClassEntity classEntity,
            @Param("timeSlot") TimeSlot timeSlot
    );

    @Query("SELECT COUNT(r) FROM Routine r WHERE r.teacher = :teacher AND r.status = 'ACTIVE'")
    Long countActiveRoutinesByTeacher(@Param("teacher") Teacher teacher);
}
