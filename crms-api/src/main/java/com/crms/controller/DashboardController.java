package com.crms.controller;

import com.crms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Dashboard Controller for statistics
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private ConflictRepository conflictRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalRoutines", routineRepository.count());
        stats.put("totalConflicts", conflictRepository.count());
        stats.put("totalTeachers", teacherRepository.count());
        stats.put("totalClasses", lessonRepository.count());
        
        return ResponseEntity.ok(stats);
    }
}
