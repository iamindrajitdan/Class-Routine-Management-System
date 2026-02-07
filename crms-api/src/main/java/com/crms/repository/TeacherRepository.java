package com.crms.repository;

import com.crms.domain.Teacher;
import com.crms.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Teacher Repository
 * Requirements: 3.1, 3.2, 3.3
 */
@Repository
public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    Optional<Teacher> findByUser(User user);

    List<Teacher> findByIsAvailable(Boolean isAvailable);

    @Query("SELECT t FROM Teacher t WHERE t.isAvailable = true")
    List<Teacher> findAvailableTeachers();

    @Query("SELECT COUNT(r) FROM Routine r WHERE r.teacher = :teacher AND r.status = 'ACTIVE'")
    Long countActiveRoutinesByTeacher(@Param("teacher") Teacher teacher);
}
