package com.crms.controller;

import com.crms.domain.ExamPeriod;
import com.crms.domain.Holiday;
import com.crms.service.InstitutionalContinuityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/continuity")
public class InstitutionalContinuityController {

    @Autowired
    private InstitutionalContinuityService continuityService;

    @GetMapping("/holidays")
    public List<Holiday> getAllHolidays() {
        return continuityService.getAllHolidays();
    }

    @PostMapping("/holidays")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Holiday> createHoliday(@Valid @RequestBody Holiday holiday) {
        return ResponseEntity.ok(continuityService.createHoliday(holiday));
    }

    @GetMapping("/exams")
    public List<ExamPeriod> getAllExamPeriods() {
        return continuityService.getAllExamPeriods();
    }

    @PostMapping("/exams")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamPeriod> createExamPeriod(@Valid @RequestBody ExamPeriod examPeriod) {
        return ResponseEntity.ok(continuityService.createExamPeriod(examPeriod));
    }
}
