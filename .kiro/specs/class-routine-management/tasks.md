# Implementation Plan: Class Routine Management Systema Implementation)

## Overview

This implementation plan breaks down the Class Routine Management System into actionable engineering tasks organized by phases and modules. Each task is traceable to specific requirements and design components. This is a **Java-based enterprise implementation** using Spring Boot 3.x, Spring Security, Hibernate/JPA, PostgreSQL, Redis, and Google OR-Tools.

## Phase 1: Project Setup & Foundations (Java)

- [ ] 1.1 Initialize Maven project structure and Git repository
  - Create multi-module Maven project (parent, api, optimizer, frontend)
  - Set up Git repository with branch protection rules
  - Configure .gitignore for Java/Maven projects
2_

- [ ] 1.2 Configure Spring Boot parent POM and dependencies
  - Set up Spring Boot 3.2+ parent POM
  - Add Spring Web, Spring Security, Spring Data JPA, Spring Cache
  - Add PostgreSQL driver, Redis client, Hibernate
  - Add testing dependencies (JUnit 5, Mockito, Testcontainers)
  - _Requirements: 20.1, 20.2_

- [ ] 1.3 Set up development environment and Docker Compose
  - Create Docker Compose configuration for PostgreSQL, Redis, API, Frontend
  - Configure Spring Boot application.yml for local development
  - Set up Flyway for database migrations
  - _Requirements: 20.1, 20.2_

- [ ] 1.4 Implement Spring Security and cation
  - Configure Spring Security with JWT token provider
  - Implement JWT token generation and validation
  - Create authentication controller with login endpoint
  - Set up RS256 asymmetric signing (public/private keys)
  - _Requirements: 8.1, 8.2, 15.1, 15.2_

- [ ] 1.5 Set up API gateway and request logging
  - Configure Spring Cloud Gateway or custom interceptors
  - Implement rate limiting with Spring Cloud Gateway or custom filter
  - Implement request/response logging with Spring AOP
  - Set up error handling with @ControllerAdvice
  - _Requirements: 13.1, 13.2, 13.6_

## Phase 2: Database & Schema Design (Java/Hibernate)

- [ ] 2.1 Design and create JPA entities for core domain
  - Create User, Department, Program, Class entities
  - Create Teacher, Subject, Lesson, TimeSlot, Classroom entities
  - Define relationships with @ManyToOne, @OneToMany, @ManyToMany
  - Add validation annotations (Jakarta Bean Validation)
  - _Requirements: 1.1, 6.1, 7.1_

- [ ] 2.2 Create Routine and related entities
  - Create Routine, Substitute, Holiday, ExamPeriod entities
  - Define relationships and constraints
  - Add @CreationTimestamp and @UpdeTimestamp annotations
  - _Requirements: 1.1, 3.1, 4.1, 5.1_

- [ ] 2.3 Create Conflict and AuditLog entities
  - Create Conflict entity for conflict tracking
  - Create AuditLog entity for compliance and security
  - Add @Enumerated annotations for status fields
  - _Requirements: 2.1, 11.1_

- [ ] 2.4 Create Notification entity
  - Create Notification entity for user notifications
  - Define notification types and delivery status
  - Add indexes for performance
  - _Requirements: 9.1_

- [ ] 2.5 Set up Flyway database migrations
  - Create initial schema migration (V1__initial_schema.sql)
  - Create seed data migration (V2__seed_data.sql)
  - Configure Flyway in Spring Boot application.yml
  - _Requirements: 12.1_

- [ ] 2.6 Implement Spring Data JPA repositories and caching
  - Create Repository interfaces extending JpaRepository
  - Implement custom query methods with @Query
  - Configure Redis caching with @Cacheable, @CacheEvict
  - Configure HikariCP connection pooling
ments: 14.1, 14.2_

## Phase 3: Backend Services - Core Components (Java/Spring)

- [ ] 3.1 Implement Routine Management Service
  - Create RoutineService with @Service annotation
  - Implement CRUD operations using RoutineRepository
  - Implement routine validation logic
  - Add @Transactional for transaction management
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3.2 Implement Routine modification and deletion with audit logging
  - Implement update and delete operations
  - Implement audit logging using Spring AOP
  - Create custom @Auditable annotation
  - _Requirements: 1.4, 1.5, 11.1_

- [ ] 3.3 Implement Conflict Detection Service
  - Create ConflictDetectionService with @Service annotation
  - Implement teacher double-booking detection
  - Implement classroom conflict detection
  - Implement class scheduling conflict detection
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3.4 Implement conflict prevention and resolution
  - Prevent conflicting routines from being saved
  - Implement conflict suggestion logic
  - Create ConflictResolutionService
  - _Requirements: 2.4, 2.5_

- [ ] 3.5 Implement Substitute Allocation Service
  - Create SubstituteService with @Service annotation
  - Implement substitute identification logic
  - Implement substitute allocation with conflict checking
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3.6 Implement substitute management and reassignment
  - Implement substitute history tracking
  - Implement teacher reassignment logic
  - Create SubstituteRepository with custom queries
  - _Requirements: 3.5, 3.6_

- [ ] 3.7 Implement Calendar Management Service
  - Create CalendarService with @Service annotation
  - Implement yearly calendar creation and management
  - Implement class calendar linking
  - _Requirements: 19.1, 19.2, 19.3_

- [ ] 3.8 Implement holiday and exam period handling
  - Implement holiday definition and constraint enforcement
  - Implement exam period suspension logic
  - Create HolidayRepository and ExamPeriodRepository
  - _Requirements: 4.1, 4.2, 4.6_

- [ ] 3.9 Implement Subject-Lesson Mapping Service
  - Create SubjectService with @Service annotation
  - Implement subject creation and management
  - Implement lesson creation and linking
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 3.10 Implement subject/lesson modification and deletion
  - Implement update operations with cascade validation
  - Implement deletion prevention for active routines
  - Create SubjectRepository and LessonRepository
  - _Requirements: 6.5, 6.6_

- [ ] 3.11 Implement Time Slot Management Service
  - Create TimeSlotService with @Service annotation
  - Implement time slot creation with overlap validation
  - Implement multiple time slots per day support
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 3.12 Implement time slot modification and deletion
  - Implement update operations with cascade updates
  - Implement deletion prevention for assigned routines
  - Create TimeSlotRepository with custom queries
  - _Requirements: 7.5, 7.6_

- [ ] 3.13 Implement Additional and Remedial Class Service
  - Create AdditionalClassService with @Service annotation
  - Implement additional class scheduling outside regular slots
  - Implement remedial class linking to subjects and students
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 3.14 Implement additional/remedial class cancellation
  - Implement cancellation with participant notification
  - Create AdditionalClassRepository
  - _Requirements: 5.6_

## Phase 4: Backend Services - AI & Optimization (Java/OR-Tools)

- [ ] 4.1 Integrate Google OR-Tools Java bindings
  - Add OR-Tools dependency to Maven POM
  - Create OptimizationEngine service with @Service annotation
  - Implement constraint solver initialization
  - _Requirements: 17.1, 17.3, 18.1_

- [ ] 4.2 Implement hard constraint validation
  - Implement teacher availability constraints
ity constraints
  - Implement time slot constraints
  - Create ConstraintValidator interface
  - _Requirements: 17.3, 18.1_

- [ ] 4.3 Implement soft constraint handling
  - Implement teacher preference constraints
  - Implement classroom preference constraints
  - Create PreferenceWeighting strategy
  - _Requirements: 18.2_

- [ ] 4.4 Implement optimization objective functions
  - Implement teacher travel time minimization
  - Implement classroom utilization optimization
  - Create ObjectiveFunction interface
  - _Requirements: 17.2_

- [ ] 4.5 Implement optimization suggestion and scoring
  - Implement multiple alternative generation
  - Implement optimization score calculation
  - Create OptimizationResult DTO
  - _Requirements: 17.4, 17.5_

- [ ] 4.6 Implement human-in-the-loop approval workflow
  - Implement optimization approval mechanism
  - Implement optimization action logging
  - Create OptimizationApprovalService
  - _Requirements: 17.6_

## Phase 5: Backend Services - Notifications & Reporting (JaSpring)

- [ ] 5.1 Implement Notification Service
  - Create NotificationService with @Service annotation
  - Implement email notification sending (JavaMailSender)
  - Implement SMS notification sending (Twilio SDK)
  - Use @Async for non-blocking notifications
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 5.2 Implement notification storage and retrieval
  - Implement notification center for users
  - Implement notification read/unread tracking
  - Create NotificationRepository with custom queries
  - _Requirements: 9.6_

- [ ] 5.3 Implement Report Generation Service
  - Create ReportService with @Service annotation
  - Implement routine report generation
  - Implement statistics and analytics calculation
  - _Requirements: 10.5_

- [ ] 5.4 Implement report export functionality
  - Implement PDF export (iText or Apache PDFBox)
  - Implement CSV export (Apache Commons CSV)
  - Implement Excel export (Apache POI)
  - Create ReportExporter interface
  - _Requirements: 10.6_

## Phase 6: Backend Services - va/Spring)

- [ ] 6.1 Implement Audit Logging Service
  - Create AuditLogService with @Service annotation
  - Implement action logging for all operations
  - Implement before/after state tracking (JSON serialization)
  - Use Spring AOP with custom @Auditable annotation
  - _Requirements: 11.1, 11.2, 11.4_

- [ ] 6.2 Implement audit log access logging
  - Implement audit log access tracking
  - Create AuditLogRepository with custom queries
  - _Requirements: 11.5_

- [ ] 6.3 Implement Role-BasBAC)
  - Create UserRole enum (Admin, Academic_Planner, Faculty, Student)
  - Implement role definitions in Spring Security
  - Create @PreAuthorize annotations for method-level security
  - _Requirements: 8.1, 8.2_

- [ ] 6.4 Implement data access filtering by role
  - Implement Faculty data filtering (only assigned classes)
  - Implement Student data filtering (only their class routine)
  - Create custom Spring Data JPA Specification classes
  - _Requirements: 8.5, 8.6_

- [ ] 6.5 Implement securitt logging
  - Implement unauthorized access logging
  - Implement security incident notification
  - Create SecurityEventListener
  - _Requirements: 15.6_

## Phase 7: Backend REST APIs (Java/Spring)

- [ ] 7.1 Implement Routine Management APIs
  - Create RoutineController with @RestController
  - Implement POST /api/v1/routines (create)
  - Implement GET /api/v1/routines (list with pagination)
  - Implement GET /api/v1/routines/{id} (get)
  - Implement PUT /api/v1/routines/{id} (update)
v1/routines/{id} (delete)
  - _Requirements: 1.1, 1.4, 1.5, 13.1, 13.2, 13.3_

- [ ] 7.2 Implement Conflict Detection APIs
  - Create ConflictController with @RestController
  - Implement POST /api/v1/conflicts/detect
  - Implement GET /api/v1/conflicts
  - Implement POST /api/v1/conflicts/{id}/resolve
  - _Requirements: 2.1, 2.4, 2.5, 13.1, 13.2_

- [ ] 7.3 Implement Substitute Allocation APIs
  - Create SubstituteController with @RestController
  - Implement POST /api/v1/substitutes
  - Implement GET /api/v1/substitutes
  - Implement PUT /api/v1/substitutes/{id}
  - Implement DELETE /api/v1/substitutes/{id}
  - _Requirements: 3.1, 3.3, 13.1, 13.2_

- [ ] 7.4 Implement Calendar Management APIs
  - Create CalendarController with @RestController
  - Implement POST /api/v1/calendars
  - Implement GET /api/v1/calendars
  - Implement PUT /api/v1/calendars/{id}
  - Implement POST /api/v1/holidays
  - Implement POST /api/v1/exam-periods
  - _Requirements: 4.1, 4.2, 19.1, 19.2, 13.1, 13.2_

- [ ] 7.5 Implement Optimization APIs
oller with @RestController
  - Implement POST /api/v1/optimize
  - Implement GET /api/v1/optimize/{id}
  - Implement POST /api/v1/optimize/{id}/approve
  - _Requirements: 17.1, 17.5, 17.6, 13.1, 13.2_

- [ ] 7.6 Implement Subject-Lesson APIs
  - Create SubjectController with @RestController
  - Implement POST /api/v1/subjects
  - Implement GET /api/v1/subjects
  - Implement PUT /api/v1/subjects/{id}
  - Implement POST /api/v1/lessons
  - _Requirements: 6.1, 6.2, 13.1, 13.2_

- [ ] 7.7 Implement Time Slot s
  - Create TimeSlotController with @RestController
  - Implement POST /api/v1/time-slots
  - Implement GET /api/v1/time-slots
  - Implement PUT /api/v1/time-slots/{id}
  - Implement DELETE /api/v1/time-slots/{id}
  - _Requirements: 7.1, 7.2, 13.1, 13.2_

- [ ] 7.8 Implement Report and Dashboard APIs
  - Create ReportController with @RestController
  - Implement GET /api/v1/reports
  - Implement POST /api/v1/reports/generate
  - Create DashboardController with @RestController
  - Implement GET /api/v1/dashboards/admin
  - Implement GET /api/v1/dashboards/planner
  - Implement GET /api/v1/dashboards/faculty
  - Implement GET /api/v1/dashboards/student
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 13.1, 13.2_

- [ ] 7.9 Implement Notification APIs
  - Create NotificationController with @RestController
  - Implement GET /api/v1/notifications
  - Implement PUT /api/v1/notifications/{id}/read
  - Implement DELETE /api/v1/notifications/{id}
  - _Requirements: 9.1, 9.6, 13.1, 13.2_

- [ ] 7.10 Implement Audit Log APIs
  - Create AuditLogController with @RestController
  - Implement GET /api/v1/audit-logs
  - Implement GET /api/v1/audit-logs/{id}
  - _Requirements: 11.1, 11.3, 11.4, 13.1, 13.2_

## Phase 8: Frontend - Admin Portal (React)

- [ ] 8.1 Create Admin Dashboard
  - Display system statistics (total classes, teachers, conflicts)
  - Display user management interface
  - _Requirements: 10.1, 8.3_

- [ ] 8.2 Implement User Management UI
  - Create user creation form
  - Implement role assignment interface
8.2_

- [ ] 8.3 Implement Audit Log Viewer
  - Create audit log display with filtering
  - Implement search functionality
  - _Requirements: 11.3, 11.4_

## Phase 9: Frontend - Academic Planner (React)

- [ ] 9.1 Create Routine Management UI
  - Implement routine creation form
  - Implement routine list view
  - _Requirements: 1.1, 1.2_

- [ ] 9.2 Implement Conflict Resolution UI
  - Display detected conflicts
  - Implement conflict resolution interface
  - _Requirements: 2.4, 2.5_

- [ ] 9.3 Implement Substitute Allocation UI
  - Display substitute options
  - Implement substitute allocation interface
  - _Requirements: 3.2, 3.3_

- [ ] 9.4 Implement Calendar Management UI
  - Create calendar creation form
  - Implement holiday/exam period definition
  - _Requirements: 4.1, 4.2, 19.1, 19.2_

- [ ] 9.5 Implement Optimization Request UI
  - Create optimization request interface
  - Display optimization suggestions
  - Implement approval workflow
  - _Requirements: 17.1, 17.4, 17.5, 17.6_

- [ ] 9.6 Create Planner Dashboard
  - Display routine status and conflicts
  - Display pending actions
  - _Requirements: 10.2_

## Phase 10: Frontend - Faculty & Student (React)

- [ ] 10.1 Create Faculty Dashboard
  - Display assigned classes and routines
  - Display upcoming schedules
  - _Requirements: 10.3, 8.5_

- [ ] 10.2 Implement Faculty Availability Management
  - Create availability marking interface
  - _Requirements: 3.1_

- [ ] 10.3 Create Student Dashboard
  - Display class routine and schedule
  - Display upcoming classes
  - _Requirements: 10.4, 8.6_

- [ ] 10.4 Implement Responsive Design
  - Ensure mobile responsiveness
  - Test on various devices
  - _Requirements: 16.6_

## Phase 11: Frontend - Common Features (React)

- [ ] 11.1 Implement Notification Center
  - Display user notifications
  - Implement notification read/unread toggle
  - _Requirements: 9.6_

- [ ] 11.2 Implement Report Generation UI
  - Create report generation form
  - Implement export functionality
  - _Requirements: 10.5, 10.6_

Accessibility Features
  - Ensure WCAG 2.1 Level AA compliance
  - Implement screen reader support
  - Implement keyboard navigation
  - _Requirements: 16.1, 16.5_

- [ ] 11.4 Implement Localization
  - Support multiple languages
  - Implement language switching
  - _Requirements: 16.3_

## Phase 12: Testing - Unit Tests (Java/JUnit 5)

- [ ] 12.1 Write unit tests for Routine Management Service
  - Test routine creation with valid/invalid inputs
  - Test routine modification and deletion
  - Use Mockito for mocking repositories
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 12.2 Write unit tests for Conflict Detection Service
  - Test teacher conflict detection
  - Test classroom conflict detection
  - Test class conflict detection
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 12.3 Write unit tests for Substitute Allocation Service
  - Test substitute identification
  - Test substitute allocation with conflict checking
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

Service
  - Test holiday constraint enforcement
  - Test exam period suspension
  - _Requirements: 4.1, 4.2_

- [ ] 12.5 Write unit tests for RBAC
  - Test role-based access control
  - Test permission enforcement
  - _Requirements: 8.1, 8.2, 8.5, 8.6_

- [ ] 12.6 Write unit tests for REST API endpoints
  - Test request validation
  - Test error responses
  - Test authentication and authorization
  - Use MockMvc for testing
  - _Requirements: 13.1, 13.2, 13.4_

## Phase 13: Testing - Propertya/QuickTheories)

- [ ] 13.1 Write property test for routine uniqueness
  - **Property 2: Unique Routine Identifiers**
  - Use QuickTheories for property generation
  - **Validates: Requirements 1.3**

- [ ] 13.2 Write property test for conflict detection completeness
  - **Property 5: Teacher Conflict Detection**
  - Generate random routine combinations
  - **Validates: Requirements 2.1**

- [ ] 13.3 Write property test for constraint satisfaction
  - **Property 29: Optimization Constraint Satisfaction**
- Verify all hard constraints are satisfied
  - **Validates: Requirements 17.3**

- [ ] 13.4 Write property test for authorization enforcement
  - **Property 17: RBAC Permission Enforcement**
  - Test all role combinations
  - **Validates: Requirements 8.1, 8.2, 8.5, 8.6**

- [ ] 13.5 Write property test for audit logging completeness
  - **Property 4: Audit Log Completeness**
  - Verify all actions are logged
  - **Validates: Requirements 11.1, 11.2**

- [ ] 13.6 Write property test for dp
  - **Property 34: Data Persistence Round Trip**
  - Use Testcontainers for PostgreSQL
  - **Validates: Requirements 12.1**

## Phase 14: Testing - Integration Tests (Java/Testcontainers)

- [ ] 14.1 Write integration test for routine creation workflow
  - Test complete routine creation with conflict detection and notifications
  - Use Testcontainers for PostgreSQL and Redis
  - _Requirements: 1.1, 2.1, 9.1_

- [ ] 14.2 Write integration test for substitute allocation workflow
  - Test substitute identification, allocation, and notifications
  - _Requirements: 3.1, 3.2, 3.3, 9.2_

- [ ] 14.3 Write integration test for holiday/exam handling
  - Test calendar updates and routine suspension
  - _Requirements: 4.1, 4.2, 4.6_
is, Google OR-Tools).

All tasks follow Java best practices, SOLID principles, and cloud-native deployment patterns suitable for academic submission and real-world institutional deployment.
Each task is:

- **Traceable**: References specific requirements and design components
- **Executable**: Includes clear acceptance criteria and deliverables
- **Measurable**: Includes specific metrics and quality gates
- **Testable**: Includes testing strategy and coverage targets

The plan preserves all 20 functional requirements and 35 correctness properties from the original specification while implementing them using enterprise-grade Java technologies (Spring Boot, Spring Security, Hibernate/JPA, PostgreSQL, Redcument known issues
  - Document future roadmap
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 16.5 Prepare for academic submission
  - Create project overview document
  - Create architecture documentation
  - Create test coverage report (JaCoCo)
  - Create performance benchmarks (JMH)
  - _Requirements: All_

---

## Summary

This implementation plan contains **100+ granular, actionable tasks** organized in **16 phases** for a complete Java-based implementation of the Class Routine Management System. : 13.1, 13.2_

- [ ] 16.2 Create deployment guide
  - Document deployment procedures for Java/Spring Boot
  - Create environment configuration guide
  - Document JVM tuning parameters
  - _Requirements: 20.1, 20.2, 20.4, 20.6_

- [ ] 16.3 Create user documentation
  - Create admin user guide
  - Create planner user guide
  - Create faculty user guide
  - Create student user guide
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 16.4 Create release notes (v1.0)
  - Document features and improvements
  - Doana for dashboards
  - Set up ELK Stack or Loki for logging
  - _Requirements: 14.1, 14.2_

- [ ] 15.5 Implement backup and disaster recovery
  - Configure automated PostgreSQL backups
  - Implement backup restoration procedures
  - _Requirements: 12.3, 12.4, 12.5, 12.6_

## Phase 16: Documentation & Release (Java)

- [ ] 16.1 Create API documentation
  - Document all REST API endpoints with Swagger/OpenAPI
  - Create API usage examples
  - Generate API documentation with Springdoc-OpenAPI
  - _Requirementsng
  - Create Ingress manifest for API gateway
  - Create ConfigMap for configuration
  - Create Secret for sensitive data
  - _Requirements: 20.2_

- [ ] 15.3 Set up CI/CD pipeline
  - Configure GitHub Actions / GitLab CI
  - Implement Maven build and test
  - Implement SonarQube analysis
  - Implement security scanning (OWASP)
  - Implement automated deployment
  - _Requirements: 20.1, 20.2_

- [ ] 15.4 Configure monitoring and logging
  - Set up Prometheus for metrics (Spring Boot Actuator)
  - Set up Grafith Testcontainers
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

## Phase 15: DevOps & Deployment (Java/Docker/Kubernetes)

- [ ] 15.1 Create Docker configuration for Java services
  - Create Dockerfile for Spring Boot API (multi-stage build)
  - Create Dockerfile for optimization service (if separate)
  - Optimize image size with Alpine base images
  - _Requirements: 20.1_

- [ ] 15.2 Create Kubernetes manifests
  - Create Deployment manifests for Spring Boot services
  - Create Service manifests for networki
- [ ] 14.4 Write integration test for optimization workflow
  - Test optimization request, suggestion, and approval
  - _Requirements: 17.1, 17.4, 17.5, 17.6_

- [ ] 14.5 Write integration test for API endpoints
  - Test API endpoints with database and business logic
  - Use @SpringBootTest w