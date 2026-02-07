package com.crms.repository;

import com.crms.domain.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

/**
 * TimeSlot Repository
 * Requirements: 7.1, 7.2, 7.3
 */
@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, UUID> {

    List<TimeSlot> findByDayOfWeek(DayOfWeek dayOfWeek);

    @Query("SELECT t FROM TimeSlot t WHERE t.dayOfWeek = :dayOfWeek AND " +
            "((t.startTime < :endTime AND t.endTime > :startTime))")
    List<TimeSlot> findOverlappingTimeSlots(
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
