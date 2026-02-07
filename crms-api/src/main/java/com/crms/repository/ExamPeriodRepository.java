package com.crms.repository;

import com.crms.domain.ExamPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * ExamPeriod Repository
 * Requirements: 4.1, 4.2, 4.6
 */
@Repository
public interface ExamPeriodRepository extends JpaRepository<ExamPeriod, UUID> {

    List<ExamPeriod> findByType(ExamPeriod.ExamType type);

    @Query("SELECT e FROM ExamPeriod e WHERE :date BETWEEN e.startDate AND e.endDate")
    List<ExamPeriod> findByDateRange(@Param("date") LocalDate date);

    @Query("SELECT e FROM ExamPeriod e WHERE e.startDate <= :endDate AND e.endDate >= :startDate")
    List<ExamPeriod> findByDateRangeOverlap(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
