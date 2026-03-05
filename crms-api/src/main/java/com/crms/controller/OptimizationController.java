package com.crms.controller;

import com.crms.dto.OptimizationRequest;
import com.crms.dto.OptimizationResult;
import com.crms.service.OptimizationEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/optimize")
public class OptimizationController {

    @Autowired
    private OptimizationEngine optimizationEngine;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<OptimizationResult> optimize(@Valid @RequestBody OptimizationRequest request) {
        OptimizationResult result = optimizationEngine.optimize(request);
        if ("FAILED".equals(result.getStatus()) || "INFEASIBLE".equals(result.getStatus())) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }
}
