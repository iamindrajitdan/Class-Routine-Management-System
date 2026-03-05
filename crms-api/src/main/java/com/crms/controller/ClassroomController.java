package com.crms.controller;

import com.crms.domain.*;
import com.crms.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomRepository classroomRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Classroom createClassroom(@Valid @RequestBody Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Classroom> updateClassroom(@PathVariable UUID id, @Valid @RequestBody Classroom classroomDetails) {
        return classroomRepository.findById(id)
                .map(classroom -> {
                    classroom.setCode(classroomDetails.getCode());
                    classroom.setBuilding(classroomDetails.getBuilding());
                    classroom.setFloor(classroomDetails.getFloor());
                    classroom.setCapacity(classroomDetails.getCapacity());
                    classroom.setType(classroomDetails.getType());
                    return ResponseEntity.ok(classroomRepository.save(classroom));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClassroom(@PathVariable UUID id) {
        return classroomRepository.findById(id)
                .map(classroom -> {
                    classroomRepository.delete(classroom);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
