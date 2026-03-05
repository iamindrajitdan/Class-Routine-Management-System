package com.crms.controller;

import com.crms.domain.FacultyAvailability;
import com.crms.domain.User;
import com.crms.repository.FacultyAvailabilityRepository;
import com.crms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.crms.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/faculty/availability")
public class FacultyAvailabilityController {

    @Autowired
    private FacultyAvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @GetMapping
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<FacultyAvailability>> getMyAvailability(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return teacherRepository.findByUserId(user.getId())
                .map(teacher -> ResponseEntity.ok(availabilityRepository.findByTeacher(teacher)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyAvailability> addAvailability(@RequestBody FacultyAvailability availability, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return teacherRepository.findByUserId(user.getId())
                .map(teacher -> {
                    availability.setTeacher(teacher);
                    return ResponseEntity.ok(availabilityRepository.save(availability));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Void> removeAvailability(@PathVariable UUID id) {
        availabilityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
