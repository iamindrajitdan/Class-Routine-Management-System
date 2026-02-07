package com.crms.repository;

import com.crms.domain.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Holiday Repository
 * Requirements: 4.1, 4.2
 */
@Repository
public interface HolidayRepository extends JpaRepository<Holiday, UUID> {

    List<Holiday> findByHolidayDate(LocalDate date);

    List<Holiday> findByType(Holiday.HolidayType type);
}
