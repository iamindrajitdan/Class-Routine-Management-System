package com.crms.service;

import com.crms.domain.*;
import com.crms.repository.HolidayRepository;
import com.crms.repository.ExamPeriodRepository;
import com.crms.repository.AcademicYearRepository;
import com.crms.repository.SemesterRepository;
import com.crms.repository.UserRepository;
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

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

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
        if (date == null) return holidayRepository.findAll();
        return holidayRepository.findByHolidayDate(date);
    }

    @Cacheable(value = "exam_periods_by_date", key = "#date")
    public List<ExamPeriod> getExamPeriodsByDate(LocalDate date) {
        if (date == null) return examPeriodRepository.findAll();
        return examPeriodRepository.findByDateRange(date);
    }

    public boolean isHoliday(LocalDate date) {
        return !holidayRepository.findByHolidayDate(date).isEmpty();
    }

    public boolean isExamPeriod(LocalDate date) {
        return !examPeriodRepository.findByDateRange(date).isEmpty();
    }

    public boolean isDowntime(LocalDate date) {
        return isHoliday(date) || isExamPeriod(date);
    }

    @CacheEvict(value = {"holidays", "holidays_by_date"}, allEntries = true)
    public Holiday createHoliday(Holiday holiday) {
        validateHoliday(holiday);
        Holiday saved = holidayRepository.save(holiday);
        notifyAllUsers("Institutional Holiday: " + saved.getName(), 
                "A holiday has been scheduled for " + saved.getHolidayDate() + ". All regular classes are suspended.");
        return saved;
    }

    @CacheEvict(value = {"exam_periods", "exam_periods_by_date"}, allEntries = true)
    public ExamPeriod createExamPeriod(ExamPeriod examPeriod) {
        validateExamPeriod(examPeriod);
        ExamPeriod saved = examPeriodRepository.save(examPeriod);
        notifyAllUsers("Exam Period Scheduled: " + saved.getName(), 
                "An examination period has been scheduled from " + saved.getStartDate() + " to " + saved.getEndDate() + ".");
        return saved;
    }

    private void notifyAllUsers(String title, String message) {
        try {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                notificationService.createNotification(user, title, message, Notification.NotificationType.SYSTEM_ALERT);
            }
        } catch (Exception e) {
            // Log error but don't fail the primary action
            System.err.println("Failed to send global notifications: " + e.getMessage());
        }
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

    // Academic Year Methods
    public List<AcademicYear> getAllAcademicYears() {
        return academicYearRepository.findAll();
    }

    public AcademicYear createAcademicYear(AcademicYear academicYear) {
        if (academicYear.getStartDate().isAfter(academicYear.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        return academicYearRepository.save(academicYear);
    }

    public void deleteAcademicYear(UUID id) {
        academicYearRepository.deleteById(id);
    }

    // Semester Methods
    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    public Semester createSemester(Semester semester) {
        AcademicYear ay = academicYearRepository.findById(semester.getAcademicYear().getId())
                .orElseThrow(() -> new RuntimeException("Academic Year not found"));
        
        if (semester.getStartDate().isBefore(ay.getStartDate()) || semester.getEndDate().isAfter(ay.getEndDate())) {
            throw new IllegalArgumentException("Semester dates must be within the Academic Year range");
        }
        
        return semesterRepository.save(semester);
    }

    public void deleteSemester(UUID id) {
        semesterRepository.deleteById(id);
    }
}
