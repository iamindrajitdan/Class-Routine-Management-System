package com.crms.service;

import com.crms.domain.*;
import com.crms.repository.HolidayRepository;
import com.crms.repository.ExamPeriodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Calendar Management Service
 * Requirements: 4.1, 4.2, 4.6, 19.1, 19.2, 19.3
 */
@Service
@Transactional
public class CalendarService {

    @Autowired
    private HolidayRepository holidayRepository;

    @Autowired
    private ExamPeriodRepository examPeriodRepository;

    @Cacheable(value = "holidays", key = "#id")
    public Holiday getHolidayById(UUID id) {
        return holidayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Holiday not found with id: " + id));
    }

    @Cacheable(value = "exam_periods", key = "#id")
    public ExamPeriod getExamPeriodById(UUID id) {
        return examPeriodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam period not found with id: " + id));
    }

    @Cacheable(value = "holidays_by_date", key = "#date")
    public List<Holiday> getHolidaysByDate(LocalDate date) {
        return holidayRepository.findByHolidayDate(date);
    }

    @Cacheable(value = "exam_periods_by_date", key = "#date")
    public List<ExamPeriod> getExamPeriodsByDate(LocalDate date) {
        return examPeriodRepository.findByDateRange(date);
    }

    public boolean isHoliday(LocalDate date) {
        return !holidayRepository.findByHolidayDate(date).isEmpty();
    }

    public boolean isExamPeriod(LocalDate date) {
        return !examPeriodRepository.findByDateRange(date).isEmpty();
    }

    @CacheEvict(value = {"holidays", "holidays_by_date"}, allEntries = true)
    public Holiday createHoliday(Holiday holiday) {
        validateHoliday(holiday);
        return holidayRepository.save(holiday);
    }

    @CacheEvict(value = {"exam_periods", "exam_periods_by_date"}, allEntries = true)
    public ExamPeriod createExamPeriod(ExamPeriod examPeriod) {
        validateExamPeriod(examPeriod);
        return examPeriodRepository.save(examPeriod);
    }

    @CacheEvict(value = {"holidays", "holidays_by_date"}, allEntries = true)
    public Holiday updateHoliday(UUID id, Holiday updatedHoliday) {
        Holiday holiday = getHolidayById(id);
        validateHoliday(updatedHoliday);

        holiday.setName(updatedHoliday.getName());
        holiday.setHolidayDate(updatedHoliday.getHolidayDate());
        holiday.setDescription(updatedHoliday.getDescription());
        holiday.setType(updatedHoliday.getType());

        return holidayRepository.save(holiday);
    }

    @CacheEvict(value = {"exam_periods", "exam_periods_by_date"}, allEntries = true)
    public ExamPeriod updateExamPeriod(UUID id, ExamPeriod updatedExamPeriod) {
        ExamPeriod examPeriod = getExamPeriodById(id);
        validateExamPeriod(updatedExamPeriod);

        examPeriod.setName(updatedExamPeriod.getName());
        examPeriod.setStartDate(updatedExamPeriod.getStartDate());
        examPeriod.setEndDate(updatedExamPeriod.getEndDate());
        examPeriod.setDescription(updatedExamPeriod.getDescription());
        examPeriod.setType(updatedExamPeriod.getType());

        return examPeriodRepository.save(examPeriod);
    }

    @CacheEvict(value = {"holidays", "holidays_by_date"}, allEntries = true)
    public void deleteHoliday(UUID id) {
        holidayRepository.deleteById(id);
    }

    @CacheEvict(value = {"exam_periods", "exam_periods_by_date"}, allEntries = true)
    public void deleteExamPeriod(UUID id) {
        examPeriodRepository.deleteById(id);
    }

    private void validateHoliday(Holiday holiday) {
        if (holiday.getName() == null || holiday.getName().isEmpty()) {
            throw new IllegalArgumentException("Holiday name is required");
        }
        if (holiday.getHolidayDate() == null) {
            throw new IllegalArgumentException("Holiday date is required");
        }
    }

    private void validateExamPeriod(ExamPeriod examPeriod) {
        if (examPeriod.getName() == null || examPeriod.getName().isEmpty()) {
            throw new IllegalArgumentException("Exam period name is required");
        }
        if (examPeriod.getStartDate() == null || examPeriod.getEndDate() == null) {
            throw new IllegalArgumentException("Start and end dates are required");
        }
        if (examPeriod.getStartDate().isAfter(examPeriod.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
    }
}
