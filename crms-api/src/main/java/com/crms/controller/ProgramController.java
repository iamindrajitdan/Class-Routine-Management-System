package com.crms.controller;

import com.crms.domain.Program;
import com.crms.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/programs")
public class ProgramController {

    @Autowired
    private ProgramRepository programRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_PLANNER', 'FACULTY', 'STUDENT')")
    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Program createProgram(@Valid @RequestBody Program program) {
        return programRepository.save(program);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProgram(@PathVariable UUID id) {
        return programRepository.findById(id)
                .map(program -> {
                    programRepository.delete(program);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
