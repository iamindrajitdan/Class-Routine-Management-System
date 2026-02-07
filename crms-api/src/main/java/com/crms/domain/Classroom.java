package com.crms.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Classroom Entity
 * Requirements: 1.1, 2.2
 */
@Entity
@Table(name = "classrooms", indexes = {
        @Index(name = "idx_classroom_code", columnList = "code"),
        @Index(name = "idx_classroom_building", columnList = "building")
})
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String building;

    @Column(length = 50)
    private String floor;

    @NotNull
    @Column(nullable = false)
    private Integer capacity;

    @Column(length = 100)
    private String type; // e.g., "Lab", "Lecture Hall", "Seminar Room"

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL)
    private Set<Routine> routines = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public Classroom() {
    }

    public Classroom(String code, String building, String floor, Integer capacity, String type) {
        this.code = code;
        this.building = building;
        this.floor = floor;
        this.capacity = capacity;
        this.type = type;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Set<Routine> getRoutines() {
        return routines;
    }

    public void setRoutines(Set<Routine> routines) {
        this.routines = routines;
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
