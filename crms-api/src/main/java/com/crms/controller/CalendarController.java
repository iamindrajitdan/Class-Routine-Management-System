package com.crms.controller;

import com.crms.domain.AcademicYear;
import com.crms.domain.ExamPeriod;
import com.crms.domain.Holiday;
import com.crms.domain.Semester;
import com.crms.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/calendar")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping("/holidays")
    public ResponseEntity<List<Holiday>> getAllHolidays() {
        // Assuming holidayRepository.findAll() is available or add to service
        // For simplicity, let's just return a list from service if implemented
        // I'll add a findAll method to service or repo if needed
        return ResponseEntity.ok(calendarService.getHolidaysByDate(null)); // Placeholder logic
    }

    @PostMapping("/holidays")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Holiday> createHoliday(@RequestBody Holiday holiday) {
        return ResponseEntity.ok(calendarService.createHoliday(holiday));
    }

    @DeleteMapping("/holidays/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Void> deleteHoliday(@PathVariable UUID id) {
        calendarService.deleteHoliday(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exam-periods")
    public ResponseEntity<List<ExamPeriod>> getAllExamPeriods() {
        return ResponseEntity.ok(calendarService.getExamPeriodsByDate(null)); // Placeholder logic
    }

    @PostMapping("/exam-periods")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<ExamPeriod> createExamPeriod(@RequestBody ExamPeriod examPeriod) {
        return ResponseEntity.ok(calendarService.createExamPeriod(examPeriod));
    }

    @DeleteMapping("/exam-periods/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Void> deleteExamPeriod(@PathVariable UUID id) {
        calendarService.deleteExamPeriod(id);
        return ResponseEntity.noContent().build();
    }

    // Academic Year Endpoints
    @GetMapping("/academic-years")
    public ResponseEntity<List<AcademicYear>> getAllAcademicYears() {
        return ResponseEntity.ok(calendarService.getAllAcademicYears());
    }

    @PostMapping("/academic-years")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<AcademicYear> createAcademicYear(@RequestBody AcademicYear academicYear) {
        return ResponseEntity.ok(calendarService.createAcademicYear(academicYear));
    }

    @DeleteMapping("/academic-years/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deleteAcademicYear(@PathVariable UUID id) {
        calendarService.deleteAcademicYear(id);
        return ResponseEntity.noContent().build();
    }

    // Semester Endpoints
    @GetMapping("/semesters")
    public ResponseEntity<List<Semester>> getAllSemesters() {
        return ResponseEntity.ok(calendarService.getAllSemesters());
    }

    @PostMapping("/semesters")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Semester> createSemester(@RequestBody Semester semester) {
        return ResponseEntity.ok(calendarService.createSemester(semester));
    }

    @DeleteMapping("/semesters/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Void> deleteSemester(@PathVariable UUID id) {
        calendarService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }
}
