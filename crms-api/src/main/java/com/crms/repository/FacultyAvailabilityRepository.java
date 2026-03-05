package com.crms.repository;

import com.crms.domain.FacultyAvailability;
import com.crms.domain.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FacultyAvailabilityRepository extends JpaRepository<FacultyAvailability, UUID> {
    List<FacultyAvailability> findByTeacher(Teacher teacher);
    void deleteByTeacher(Teacher teacher);
}
