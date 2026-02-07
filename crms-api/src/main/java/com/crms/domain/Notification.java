package com.crms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Notification Entity - stores user notifications
 * Requirements: 9.1, 9.2, 9.3, 9.6
 */
@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_user", columnList = "user_id"),
        @Index(name = "idx_notification_type", columnList = "notification_type"),
        @Index(name = "idx_notification_status", columnList = "delivery_status"),
        @Index(name = "idx_notification_read", columnList = "is_read"),
        @Index(name = "idx_notification_created", columnList = "created_at")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 2000)
    private String message;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NotificationType notificationType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;

    @NotNull
    @Column(nullable = false)
    private Boolean isRead = false;

    @Column
    private LocalDateTime readAt;

    @Column(length = 100)
    private String relatedResourceType;

    @Column
    private UUID relatedResourceId;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum NotificationType {
        ROUTINE_CREATED,
        ROUTINE_UPDATED,
        ROUTINE_DELETED,
        SUBSTITUTE_ASSIGNED,
        CONFLICT_DETECTED,
        HOLIDAY_ANNOUNCED,
        EXAM_PERIOD_ANNOUNCED,
        ADDITIONAL_CLASS_SCHEDULED,
        SYSTEM_ALERT
    }

    public enum DeliveryStatus {
        PENDING,
        SENT,
        FAILED,
        DELIVERED
    }

    // Constructors
    public Notification() {
    }

    public Notification(User user, String title, String message, NotificationType notificationType) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.notificationType = notificationType;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public String getRelatedResourceType() {
        return relatedResourceType;
    }

    public void setRelatedResourceType(String relatedResourceType) {
        this.relatedResourceType = relatedResourceType;
    }

    public UUID getRelatedResourceId() {
        return relatedResourceId;
    }

    public void setRelatedResourceId(UUID relatedResourceId) {
        this.relatedResourceId = relatedResourceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
