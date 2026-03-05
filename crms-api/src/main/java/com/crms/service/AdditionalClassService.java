package com.crms.service;

import com.crms.domain.AdditionalClass;
import com.crms.repository.AdditionalClassRepository;
import com.crms.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AdditionalClassService {

    @Autowired
    private AdditionalClassRepository additionalClassRepository;

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private CalendarService calendarService;

    public AdditionalClass scheduleSession(AdditionalClass session) {
        // Validation: No scheduling on Holidays or Exam Periods
        if (calendarService.isDowntime(session.getSessionDate())) {
            throw new RuntimeException("Cannot schedule classes during institutional holidays or exam periods.");
        }

        // Validation: No overlap with regular routines for Teacher
        if (!routineRepository.findConflictingRoutinesByTeacherAndTimeSlot(session.getTeacher(), session.getTimeSlot()).isEmpty()) {
            throw new RuntimeException("Teacher has a regular class conflict in this time slot.");
        }

        // Validation: No overlap with regular routines for Classroom
        if (!routineRepository.findConflictingRoutinesByClassroomAndTimeSlot(session.getClassroom(), session.getTimeSlot()).isEmpty()) {
            throw new RuntimeException("Classroom is occupied by a regular class in this time slot.");
        }

        return additionalClassRepository.save(session);
    }

    public List<AdditionalClass> getAllSessions() {
        return additionalClassRepository.findAll();
    }

    public void cancelSession(UUID id) {
        additionalClassRepository.deleteById(id);
    }
}
