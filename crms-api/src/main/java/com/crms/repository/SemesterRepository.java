package com.crms.repository;

import com.crms.domain.AcademicYear;
import com.crms.domain.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, UUID> {
    List<Semester> findByAcademicYear(AcademicYear academicYear);
    Optional<Semester> findByIsActive(Boolean isActive);
}
