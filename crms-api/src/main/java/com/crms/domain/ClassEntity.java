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
 * Class Entity (e.g., CS-2024-A, BBA-2023-B)
 * Represents a group of students enrolled in a specific program/semester
 * Requirements: 1.1, 6.1
 */
@Entity
@Table(name = "classes", indexes = {
        @Index(name = "idx_class_code", columnList = "code"),
        @Index(name = "idx_class_program", columnList = "program_id")
})
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String name;

    @NotNull
    @Column(nullable = false)
    private Integer semester;

    @NotNull
    @Column(nullable = false)
    private Integer academicYear;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL)
    private Set<Routine> routines = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public ClassEntity() {
    }

    public ClassEntity(String code, String name, Integer semester, Integer academicYear, Program program) {
        this.code = code;
        this.name = name;
        this.semester = semester;
        this.academicYear = academicYear;
        this.program = program;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Integer getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(Integer academicYear) {
        this.academicYear = academicYear;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
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
