package com.crms.service;

import com.crms.domain.User;
import com.crms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private ConflictRepository conflictRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRoutines", routineRepository.count());
        stats.put("totalConflicts", conflictRepository.count());
        stats.put("totalTeachers", teacherRepository.count());
        stats.put("totalClasses", lessonRepository.count());
        stats.put("recentLogs", auditLogRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 5)).getContent());
        return stats;
    }

    public Map<String, Object> getPlannerStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRoutines", routineRepository.count());
        stats.put("totalConflicts", conflictRepository.count());
        stats.put("totalTeachers", teacherRepository.count());
        stats.put("totalClasses", lessonRepository.count());
        return stats;
    }

    public Map<String, Object> getFacultyStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        // Assuming Teacher entity is linked to User
        stats.put("myClasses", routineRepository.countByTeacherUser(user));
        stats.put("unreadNotifications", notificationRepository.countUnreadNotificationsByUser(user));
        return stats;
    }

    public Map<String, Object> getStudentStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        // Assuming Student logic or Class attribution
        stats.put("myRoutineClasses", routineRepository.count()); // Placeholder logic
        stats.put("unreadNotifications", notificationRepository.countUnreadNotificationsByUser(user));
        return stats;
    }
}
