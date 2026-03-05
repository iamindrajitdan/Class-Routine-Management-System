package com.crms.controller;

import com.crms.domain.*;
import com.crms.repository.ClassEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes")
public class ClassEntityController {

    @Autowired
    private ClassEntityRepository classEntityRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public List<ClassEntity> getAllClasses() {
        return classEntityRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ClassEntity createClass(@Valid @RequestBody ClassEntity classEntity) {
        return classEntityRepository.save(classEntity);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassEntity> updateClass(@PathVariable UUID id, @Valid @RequestBody ClassEntity classDetails) {
        return classEntityRepository.findById(id)
                .map(classEntity -> {
                    classEntity.setCode(classDetails.getCode());
                    classEntity.setName(classDetails.getName());
                    classEntity.setCapacity(classDetails.getCapacity());
                    classEntity.setSemester(classDetails.getSemester());
                    classEntity.setAcademicYear(classDetails.getAcademicYear());
                    return ResponseEntity.ok(classEntityRepository.save(classEntity));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable UUID id) {
        return classEntityRepository.findById(id)
                .map(classEntity -> {
                    classEntityRepository.delete(classEntity);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
