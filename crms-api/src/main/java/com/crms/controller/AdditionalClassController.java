package com.crms.controller;

import com.crms.domain.AdditionalClass;
import com.crms.service.AdditionalClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/supplementary")
public class AdditionalClassController {

    @Autowired
    private AdditionalClassService supplementaryService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AdditionalClass>> getAllSessions() {
        return ResponseEntity.ok(supplementaryService.getAllSessions());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<AdditionalClass> scheduleSession(@RequestBody AdditionalClass session) {
        return ResponseEntity.ok(supplementaryService.scheduleSession(session));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Void> cancelSession(@PathVariable UUID id) {
        supplementaryService.cancelSession(id);
        return ResponseEntity.noContent().build();
    }
}
