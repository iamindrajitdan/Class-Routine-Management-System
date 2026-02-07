package com.crms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Conflict Entity - tracks scheduling conflicts
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
@Entity
@Table(name = "conflicts", indexes = {
        @Index(name = "idx_conflict_routine", columnList = "routine_id"),
        @Index(name = "idx_conflict_type", columnList = "conflict_type"),
        @Index(name = "idx_conflict_status", columnList = "status")
})
public class Conflict {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ConflictType conflictType;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ConflictSeverity severity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ConflictStatus status = ConflictStatus.DETECTED;

    @Column(length = 1000)
    private String suggestedResolution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;

    @Column
    private LocalDateTime resolvedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ConflictType {
        TEACHER_DOUBLE_BOOKING,
        CLASSROOM_DOUBLE_BOOKING,
        CLASS_DOUBLE_BOOKING,
        TIME_SLOT_OVERLAP,
        TEACHER_UNAVAILABLE,
        CLASSROOM_CAPACITY_EXCEEDED
    }

    public enum ConflictSeverity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum ConflictStatus {
        DETECTED,
        ACKNOWLEDGED,
        RESOLVED,
        IGNORED
    }

    // Constructors
    public Conflict() {
    }

    public Conflict(Routine routine, ConflictType conflictType, String description, ConflictSeverity severity) {
        this.routine = routine;
        this.conflictType = conflictType;
        this.description = description;
        this.severity = severity;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Routine getRoutine() {
        return routine;
    }

    public void setRoutine(Routine routine) {
        this.routine = routine;
    }

    public ConflictType getConflictType() {
        return conflictType;
    }

    public void setConflictType(ConflictType conflictType) {
        this.conflictType = conflictType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ConflictSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(ConflictSeverity severity) {
        this.severity = severity;
    }

    public ConflictStatus getStatus() {
        return status;
    }

    public void setStatus(ConflictStatus status) {
        this.status = status;
    }

    public String getSuggestedResolution() {
        return suggestedResolution;
    }

    public void setSuggestedResolution(String suggestedResolution) {
        this.suggestedResolution = suggestedResolution;
    }

    public User getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(User resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
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
