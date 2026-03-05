package com.crms.controller;

import com.crms.domain.User;
import com.crms.repository.UserRepository;
import com.crms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Dashboard Controller for role-specific statistics
 */
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        String role = user.getRole().name();

        if (role.equals("ADMIN")) {
            return ResponseEntity.ok(dashboardService.getAdminStats());
        } else if (role.equals("ACADEMIC_PLANNER")) {
            return ResponseEntity.ok(dashboardService.getPlannerStats());
        } else if (role.equals("FACULTY")) {
            return ResponseEntity.ok(dashboardService.getFacultyStats(user));
        } else {
            return ResponseEntity.ok(dashboardService.getStudentStats(user));
        }
    }
}
