package com.crms.service;

import com.crms.domain.Notification;
import com.crms.domain.User;
import com.crms.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Notification Service
 * Requirements: 9.1, 9.2, 9.3, 9.6
 */
@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JavaMailSender mailSender;

    public Notification createNotification(User user, String title, String message, Notification.NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }

    @Async
    public void sendEmailNotification(User user, String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailMessage.setFrom("noreply@crms.edu");

            mailSender.send(mailMessage);

            // Update notification status
            Notification notification = createNotification(user, subject, message, Notification.NotificationType.SYSTEM_ALERT);
            notification.setDeliveryStatus(Notification.DeliveryStatus.SENT);
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Log error and mark as failed
            Notification notification = createNotification(user, subject, message, Notification.NotificationType.SYSTEM_ALERT);
            notification.setDeliveryStatus(Notification.DeliveryStatus.FAILED);
            notificationRepository.save(notification);
        }
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUser(user, org.springframework.data.domain.PageRequest.of(0, 50)).getContent();
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findUnreadNotificationsByUser(user);
    }

    public Long countUnreadNotifications(User user) {
        return notificationRepository.countUnreadNotificationsByUser(user);
    }

    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(java.time.LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void notifyRoutineCreated(User user, String routineDetails) {
        String message = "A new routine has been created: " + routineDetails;
        createNotification(user, "Routine Created", message, Notification.NotificationType.ROUTINE_CREATED);
        sendEmailNotification(user, "Routine Created", message);
    }

    public void notifyConflictDetected(User user, String conflictDetails) {
        String message = "A scheduling conflict has been detected: " + conflictDetails;
        createNotification(user, "Conflict Detected", message, Notification.NotificationType.CONFLICT_DETECTED);
        sendEmailNotification(user, "Conflict Detected", message);
    }

    public void notifySubstituteAssigned(User user, String substituteDetails) {
        String message = "A substitute has been assigned: " + substituteDetails;
        createNotification(user, "Substitute Assigned", message, Notification.NotificationType.SUBSTITUTE_ASSIGNED);
        sendEmailNotification(user, "Substitute Assigned", message);
    }
}
