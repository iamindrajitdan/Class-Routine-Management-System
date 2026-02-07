package com.crms.controller;

import com.crms.domain.Notification;
import com.crms.domain.User;
import com.crms.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Notification REST Controller
 * Requirements: 9.1, 9.6, 13.1, 13.2
 */
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Notification> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Notification> notifications = notificationService.getUnreadNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> countUnreadNotifications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long count = notificationService.countUnreadNotifications(user);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
