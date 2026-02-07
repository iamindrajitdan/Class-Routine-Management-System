package com.crms.service;

import com.crms.domain.TimeSlot;
import com.crms.repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

/**
 * TimeSlot Service
 * Requirements: 7.1, 7.2, 7.3, 7.5, 7.6
 */
@Service
@Transactional
public class TimeSlotService {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Cacheable(value = "time_slots", key = "#id")
    public TimeSlot getTimeSlotById(UUID id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time slot not found with id: " + id));
    }

    @Cacheable(value = "time_slots_by_day", key = "#dayOfWeek")
    public List<TimeSlot> getTimeSlotsByDay(DayOfWeek dayOfWeek) {
        return timeSlotRepository.findByDayOfWeek(dayOfWeek);
    }

    @CacheEvict(value = {"time_slots", "time_slots_by_day"}, allEntries = true)
    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        validateTimeSlot(timeSlot);
        checkForOverlap(timeSlot);
        return timeSlotRepository.save(timeSlot);
    }

    @CacheEvict(value = {"time_slots", "time_slots_by_day"}, allEntries = true)
    public TimeSlot updateTimeSlot(UUID id, TimeSlot updatedTimeSlot) {
        TimeSlot timeSlot = getTimeSlotById(id);
        validateTimeSlot(updatedTimeSlot);

        // Check for overlap with other time slots (excluding current)
        List<TimeSlot> overlappingSlots = timeSlotRepository.findOverlappingTimeSlots(
                updatedTimeSlot.getDayOfWeek(),
                updatedTimeSlot.getStartTime(),
                updatedTimeSlot.getEndTime()
        );

        if (overlappingSlots.stream().anyMatch(ts -> !ts.getId().equals(id))) {
            throw new RuntimeException("Time slot overlaps with existing time slots");
        }

        timeSlot.setDayOfWeek(updatedTimeSlot.getDayOfWeek());
        timeSlot.setStartTime(updatedTimeSlot.getStartTime());
        timeSlot.setEndTime(updatedTimeSlot.getEndTime());
        timeSlot.setLabel(updatedTimeSlot.getLabel());

        return timeSlotRepository.save(timeSlot);
    }

    @CacheEvict(value = {"time_slots", "time_slots_by_day"}, allEntries = true)
    public void deleteTimeSlot(UUID id) {
        TimeSlot timeSlot = getTimeSlotById(id);

        if (!timeSlot.getRoutines().isEmpty()) {
            throw new RuntimeException("Cannot delete time slot with assigned routines");
        }

        timeSlotRepository.deleteById(id);
    }

    private void validateTimeSlot(TimeSlot timeSlot) {
        if (timeSlot.getDayOfWeek() == null) {
            throw new IllegalArgumentException("Day of week is required");
        }
        if (timeSlot.getStartTime() == null || timeSlot.getEndTime() == null) {
            throw new IllegalArgumentException("Start and end times are required");
        }
        if (!timeSlot.getStartTime().isBefore(timeSlot.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

    private void checkForOverlap(TimeSlot timeSlot) {
        List<TimeSlot> overlappingSlots = timeSlotRepository.findOverlappingTimeSlots(
                timeSlot.getDayOfWeek(),
                timeSlot.getStartTime(),
                timeSlot.getEndTime()
        );

        if (!overlappingSlots.isEmpty()) {
            throw new RuntimeException("Time slot overlaps with existing time slots");
        }
    }
}
