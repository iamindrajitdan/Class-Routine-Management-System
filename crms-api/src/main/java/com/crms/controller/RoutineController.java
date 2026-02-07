package com.crms.controller;

import com.crms.domain.Routine;
import com.crms.service.RoutineService;
import com.crms.service.AuditLogService;
import com.crms.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

/**
 * Routine Management REST Controller
 * Requirements: 1.1, 1.4, 1.5, 13.1, 13.2, 13.3
 */
@RestController
@RequestMapping("/api/v1/routines")
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER', 'FACULTY')")
    public ResponseEntity<Routine> getRoutine(@PathVariable UUID id) {
        Routine routine = routineService.getRoutineById(id);
        return ResponseEntity.ok(routine);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Routine> createRoutine(@Valid @RequestBody Routine routine, Authentication authentication) {
        try {
            Routine createdRoutine = routineService.createRoutine(routine);
            auditLogService.logCreate(
                    (User) authentication.getPrincipal(),
                    "Routine",
                    createdRoutine.getId(),
                    createdRoutine
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRoutine);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Routine> updateRoutine(
            @PathVariable UUID id,
            @Valid @RequestBody Routine routine,
            Authentication authentication) {
        try {
            Routine existingRoutine = routineService.getRoutineById(id);
            Routine updatedRoutine = routineService.updateRoutine(id, routine);
            auditLogService.logUpdate(
                    (User) authentication.getPrincipal(),
                    "Routine",
                    id,
                    existingRoutine,
                    updatedRoutine
            );
            return ResponseEntity.ok(updatedRoutine);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Void> deleteRoutine(@PathVariable UUID id, Authentication authentication) {
        Routine routine = routineService.getRoutineById(id);
        routineService.deleteRoutine(id);
        auditLogService.logDelete(
                (User) authentication.getPrincipal(),
                "Routine",
                id,
                routine
        );
        return ResponseEntity.noContent().build();
    }
}
