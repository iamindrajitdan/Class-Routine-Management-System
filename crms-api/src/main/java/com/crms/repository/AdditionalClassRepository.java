package com.crms.repository;

import com.crms.domain.AdditionalClass;
import com.crms.domain.Teacher;
import com.crms.domain.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdditionalClassRepository extends JpaRepository<AdditionalClass, UUID> {
    List<List<AdditionalClass>> findByTeacherAndTimeSlot(Teacher teacher, TimeSlot timeSlot);
    List<AdditionalClass> findByType(AdditionalClass.SessionType type);
}
