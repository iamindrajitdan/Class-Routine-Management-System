package com.crms.service;

import com.crms.domain.ExamPeriod;
import com.crms.domain.Holiday;
import com.crms.domain.Notification;
import com.crms.domain.User;
import com.crms.repository.ExamPeriodRepository;
import com.crms.repository.HolidayRepository;
import com.crms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class InstitutionalContinuityService {

    @Autowired
    private HolidayRepository holidayRepository;

    @Autowired
    private ExamPeriodRepository examPeriodRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Holiday createHoliday(Holiday holiday) {
        Holiday saved = holidayRepository.save(holiday);
        notifyAllUsers("Institutional Holiday: " + saved.getName(), 
                "A holiday has been scheduled for " + saved.getHolidayDate() + ". All regular classes are suspended.");
        return saved;
    }

    public ExamPeriod createExamPeriod(ExamPeriod examPeriod) {
        ExamPeriod saved = examPeriodRepository.save(examPeriod);
        notifyAllUsers("Exam Period Scheduled: " + saved.getName(), 
                "An examination period has been scheduled from " + saved.getStartDate() + " to " + saved.getEndDate() + ".");
        return saved;
    }

    private void notifyAllUsers(String title, String message) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            notificationService.createNotification(user, title, message, Notification.NotificationType.SYSTEM_ALERT);
        }
    }

    public boolean isDowntime(LocalDate date) {
        if (!holidayRepository.findByHolidayDate(date).isEmpty()) return true;
        if (!examPeriodRepository.findByDateRange(date).isEmpty()) return true;
        return false;
    }

    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAll();
    }

    public List<ExamPeriod> getAllExamPeriods() {
        return examPeriodRepository.findAll();
    }
}
