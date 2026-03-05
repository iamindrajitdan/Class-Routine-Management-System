package com.crms.controller;

import com.crms.domain.Routine;
import com.crms.domain.Substitute;
import com.crms.domain.Teacher;
import com.crms.domain.User;
import com.crms.repository.SubstituteRepository;
import com.crms.repository.TeacherRepository;
import com.crms.service.RoutineService;
import com.crms.service.SubstituteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.crms.repository.UserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/substitutes")
public class SubstituteController {

    @Autowired
    private SubstituteService substituteService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubstituteRepository substituteRepository;

    @Autowired
    private RoutineService routineService;

    @Autowired
    private TeacherRepository teacherRepository;

    public record SubstituteRequest(
            @NotNull UUID routineId,
            @NotNull UUID substituteTeacherId,
            @NotNull LocalDate substituteDate,
            String reason
    ) {}

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER', 'FACULTY')")
    public ResponseEntity<List<Substitute>> getAllSubstitutes() {
        return ResponseEntity.ok(substituteRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<?> allocateSubstitute(
            @Valid @RequestBody SubstituteRequest request,
            Authentication authentication
    ) {
        try {
            Routine routine = routineService.getRoutineById(request.routineId());
            Teacher substituteTeacher = teacherRepository.findById(request.substituteTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Substitute substitute = substituteService.allocateSubstitute(
                    routine,
                    substituteTeacher,
                    request.substituteDate(),
                    request.reason(),
                    user
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(substitute);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER')")
    public ResponseEntity<Void> removeSubstitute(@PathVariable UUID id) {
        substituteService.removeSubstitute(id);
        return ResponseEntity.noContent().build();
    }
}
