package com.crms.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Routine Entity
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 * 
 * Represents a scheduled assignment of classes, teachers, subjects, and time slots.
 * Core entity for the routine management system.
 */
@Entity
@Table(name = "routines", indexes = {
    @Index(name = "idx_routine_class", columnList = "class_id"),
    @Index(name = "idx_routine_teacher", columnList = "teacher_id"),
    @Index(name = "idx_routine_timeslot", columnList = "time_slot_id"),
    @Index(name = "idx_routine_classroom", columnList = "classroom_id"),
    @Index(name = "idx_routine_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoutineType routineType = RoutineType.REGULAR;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoutineStatus status = RoutineStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum RoutineType {
        REGULAR,
        ADDITIONAL,
        REMEDIAL
    }

    public enum RoutineStatus {
        ACTIVE,
        INACTIVE,
        CANCELLED
    }
}
