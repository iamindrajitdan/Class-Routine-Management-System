package com.crms.repository;

import com.crms.domain.ExamPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExamPeriodRepository extends JpaRepository<ExamPeriod, UUID> {
    
    @Query("SELECT e FROM ExamPeriod e WHERE :date BETWEEN e.startDate AND e.endDate")
    List<ExamPeriod> findByDateRange(@Param("date") LocalDate date);
}
