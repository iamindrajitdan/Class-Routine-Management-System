package com.crms.repository;

import com.crms.domain.Lesson;
import com.crms.domain.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Lesson Repository
 * Requirements: 6.2, 6.3
 */
@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {

    List<Lesson> findBySubject(Subject subject);

    List<Lesson> findBySubjectOrderBySequenceNumber(Subject subject);
}
