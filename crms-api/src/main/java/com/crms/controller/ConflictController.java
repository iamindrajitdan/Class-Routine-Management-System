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
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Conflict> resolveConflict(
            @PathVariable UUID id,
            Authentication authentication) {
        // In a real implementation, you would fetch the conflict and resolve it
        // For now, this is a placeholder
        return ResponseEntity.ok().build();
    }
}
