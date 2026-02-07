package com.crms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Substitute Entity - tracks teacher substitutions
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */
@Entity
@Table(name = "substitutes", indexes = {
        @Index(name = "idx_substitute_routine", columnList = "routine_id"),
        @Index(name = "idx_substitute_teacher", columnList = "substitute_id"),
        @Index(name = "idx_substitute_date", columnList = "substitute_date")
})
public class Substitute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_teacher_id", nullable = false)
    private Teacher originalTeacher;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "substitute_id", nullable = false)
    private Teacher substitute;

    @NotNull
    @Column(nullable = false)
    private LocalDate substituteDate;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SubstituteStatus status = SubstituteStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum SubstituteStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    // Constructors
    public Substitute() {
    }

    public Substitute(Routine routine, Teacher originalTeacher, Teacher substitute, LocalDate substituteDate, String reason, User createdBy) {
        this.routine = routine;
        this.originalTeacher = originalTeacher;
        this.substitute = substitute;
        this.substituteDate = substituteDate;
        this.reason = reason;
        this.createdBy = createdBy;
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

    public Teacher getOriginalTeacher() {
        return originalTeacher;
    }

    public void setOriginalTeacher(Teacher originalTeacher) {
        this.originalTeacher = originalTeacher;
    }

    public Teacher getSubstitute() {
        return substitute;
    }

    public void setSubstitute(Teacher substitute) {
        this.substitute = substitute;
    }

    public LocalDate getSubstituteDate() {
        return substituteDate;
    }

    public void setSubstituteDate(LocalDate substituteDate) {
        this.substituteDate = substituteDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public SubstituteStatus getStatus() {
        return status;
    }

    public void setStatus(SubstituteStatus status) {
        this.status = status;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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
