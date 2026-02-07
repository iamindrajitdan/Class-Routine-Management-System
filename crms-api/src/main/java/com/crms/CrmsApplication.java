package com.crms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application class for Class Routine Management System
 * Requirements: 1.1, 13.1, 15.1, 20.1
 * 
 * This is a Spring Boot application that provides REST APIs for managing
 * academic schedules with AI-assisted optimization, conflict detection,
 * and comprehensive reporting.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
public class CrmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmsApplication.class, args);
    }
}
