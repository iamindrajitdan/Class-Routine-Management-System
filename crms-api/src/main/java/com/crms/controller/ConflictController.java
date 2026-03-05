package com.crms.controller;

import com.crms.domain.Conflict;
import com.crms.domain.Routine;
import com.crms.domain.User;
import com.crms.service.ConflictDetectionService;
import com.crms.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.crms.repository.UserRepository;

import java.util.List;
import java.util.UUID;

/**
 * Conflict Detection REST Controller
 * Requirements: 2.1, 2.4, 2.5, 13.1, 13.2
 */
@RestController
@RequestMapping("/api/v1/conflicts")
public class ConflictController {

    @Autowired
    private ConflictDetectionService conflictDetectionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/detect")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<List<Conflict>> detectConflicts(@RequestBody Routine routine) {
        List<Conflict> conflicts = conflictDetectionService.detectConflicts(routine);
        return ResponseEntity.ok(conflicts);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<List<Conflict>> getUnresolvedConflicts() {
        List<Conflict> conflicts = conflictDetectionService.getUnresolvedConflicts();
        return ResponseEntity.ok(conflicts);
    }

    @Autowired
    private com.crms.repository.ConflictRepository conflictRepository;

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Conflict> resolveConflict(
            @PathVariable UUID id,
            Authentication authentication) {
        Conflict conflict = conflictRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conflict not found with ID " + id));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        conflictDetectionService.resolveConflict(conflict, user);
        return ResponseEntity.ok(conflict);
    }
}
