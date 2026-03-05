package com.crms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "faculty_availability")
public class FacultyAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private java.time.DayOfWeek dayOfWeek;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;

    @NotNull
    @Column(nullable = false)
    private Boolean isPreferred = true;

    // Constructors
    public FacultyAvailability() {}

    public FacultyAvailability(Teacher teacher, java.time.DayOfWeek dayOfWeek, TimeSlot timeSlot, Boolean isPreferred) {
        this.teacher = teacher;
        this.dayOfWeek = dayOfWeek;
        this.timeSlot = timeSlot;
        this.isPreferred = isPreferred;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }
    public java.time.DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(java.time.DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public TimeSlot getTimeSlot() { return timeSlot; }
    public void setTimeSlot(TimeSlot timeSlot) { this.timeSlot = timeSlot; }
    public Boolean getIsPreferred() { return isPreferred; }
    public void setIsPreferred(Boolean isPreferred) { this.isPreferred = isPreferred; }
}
