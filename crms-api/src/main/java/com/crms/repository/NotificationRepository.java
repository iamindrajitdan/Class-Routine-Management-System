package com.crms.repository;

import com.crms.domain.Notification;
import com.crms.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Notification Repository
 * Requirements: 9.1, 9.6
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findByUser(User user, Pageable pageable);

    Page<Notification> findByUserAndIsRead(User user, Boolean isRead, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadNotificationsByUser(@Param("user") User user);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    Long countUnreadNotificationsByUser(@Param("user") User user);

    List<Notification> findByNotificationType(Notification.NotificationType notificationType);
}
