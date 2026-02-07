package com.crms.repository;

import com.crms.domain.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Subject Repository
 * Requirements: 6.1, 6.2
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    Optional<Subject> findByCode(String code);

    boolean existsByCode(String code);
}
