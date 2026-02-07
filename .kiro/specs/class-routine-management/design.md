# Design Document: Class Routine Management System (Java Implementation)

## Overview

The Class Routine Management System is a comprehensive, cloud-ready platform for managing academic schedules in universities. The system employs a layered architecture with clear separation of concerns: presentation layer (role-based UIs), business logic layer (routine management, conflict detection, optimization), data access layer (Hibernate/JPA), and external services (notifications, AI optimization).

This design document specifies a **Java-based enterprise implementation** using Spring Boot, Spring Security, Hibernate/JPA, PostgreSQL, Redis, and Google OR-Tools for constraint solving.

The design prioritizes scalability, security, and maintainability while supporting complex constraint solving for timetable optimization.

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Admin Portal │ Planner UI   │ Faculty App  │ Student App  │  │
│  │   (React)    │   (React)    │   (React)    │   (React)    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway & Auth Layer                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Spring Cloud Gateway | Spring Security | JWT | RBAC    │   │
│  │ Rate Limiting | Request Logging | CORS | TLS           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Routine Mgmt │ Conflict Det │ Substitute   │ Optimization │  │
│  │ Service      │ Service      │ Allocation   │ Service      │  │
│  │ (Spring)     │ (Spring)     │ Service      │ (Java/OR)    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Calendar Mgmt│ Notification │ Report Gen   │ Audit Logger │  │
│  │ Service      │ Service      │ Service      │ Service      │  │
│  │ (Spring)     │ (Spring)     │ (Spring)     │ (Spring)     │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Spring Data JPA | Hibernate | HikariCP | Redis Cache    │   │
│  │ Flyway Migrations | Query DSL                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                    │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ PostgreSQL   │ Redis Cache  │ Backup Store │ Audit DB     │  │
│  │ (Primary)    │              │              │              │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Email/SMS    │ OR-Tools     │ Cloud Storage│ Monitoring   │  │
│  │ Notification │ Constraint   │              │ (Prometheus) │  │
│  │              │ Solver       │              │              │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack (Java-Based)

**Backend**: Java 17+ with Spring Boot 3.x
- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.2+
- **Security**: Spring Security 6.x with JWT
- **ORM**: Hibernate 6.x with Spring Data JPA
- **Build**: Maven 3.8+ or Gradle 7.0+
- **Validation**: Jakarta Bean Validation (Hibernate Validator)

**Database**: PostgreSQL 14+
- **Caching**: Redis 7+
- **Migrations**: Flyway 9.x or Liquibase 4.x
- **Connection Pooling**: HikariCP (default: 10 connections)

**AI/Optimization**: Java-based Constraint Solving
- **Constraint Solver**: Google OR-Tools Java bindings
- **Alternative**: Optaplanner (if OR-Tools unavailable)

**Frontend**: React 18+ (unchanged)
- **State Management**: Redux or Zustand
- **UI Framework**: Material-UI or Tailwind CSS
- **Accessibility**: axe-core for testing

**DevOps**: Docker, Kubernetes, CI/CD (Java-compatible)
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) or Loki

### Layered Architecture

#### 1. Presentation Layer
- Spring MVC Controllers
- REST endpoints with @RestController
- Request/Response DTOs
- Exception handling with @ControllerAdvice

#### 2. Business Logic Layer
- Service classes with @Service annotation
- Business rule validation
- Transaction management with @Transactional
- Constraint solving and optimization logic

#### 3. Data Access Layer
- Spring Data JPA Repositories
- Hibernate entities with JPA annotations
- Custom query methods
- Specification pattern for complex queries

#### 4. Infrastructure Layer
- Spring Security configuration
- Redis caching configuration
- Database connection pooling
- Logging and monitoring

## Components and Interfaces

### Core Components

1. **Routine Management Service**
   - Create, read, update, delete routines
   - Validate routine data
   - Manage routine lifecycle
   - Implementation: Spring Service with JPA Repository

2. **Conflict Detection Engine**
   - Detect teacher double-booking
   - Detect classroom conflicts
   - Detect class scheduling conflicts
   - Suggest resolutions
   - Implementation: Spring Service with custom logic

3. **Substitute Allocation Service**
   - Identify available substitutes
   - Allocate substitutes
   - Manage substitute history
   - Implementation: Spring Service with JPA Repository

4. **Calendar Management Service**
   - Manage yearly calendars
   - Manage class calendars
   - Handle holidays and exam periods
   - Validate calendar constraints
   - Implementation: Spring Service with JPA Repository

5. **Optimization Engine**
   - Analyze constraints using OR-Tools
   - Generate optimized routines
   - Score optimization results
   - Support human-in-the-loop approval
   - Implementation: Spring Service with OR-Tools Java bindings

6. **Notification Service**
   - Send email/SMS notifications
   - Manage notification preferences
   - Track notification delivery
   - Implementation: Spring Service with async processing

7. **Report Generation Service**
   - Generate routine reports
   - Export to PDF/CSV/Excel
   - Create analytics dashboards
   - Implementation: Spring Service with iText/Apache POI

8. **Audit Logging Service**
   - Log all system actions
   - Track data changes
   - Support compliance queries
   - Implementation: Spring AOP with custom annotations

### REST API Interfaces

**Routine Management API**
```
POST   /api/v1/routines              - Create routine
GET    /api/v1/routines              - List routines (paginated)
GET    /api/v1/routines/{id}         - Get routine
PUT    /api/v1/routines/{id}         - Update routine
DELETE /api/v1/routines/{id}         - Delete routine
POST   /api/v1/routines/{id}/validate - Validate routine
```

**Conflict Detection API**
```
POST   /api/v1/conflicts/detect      - Detect conflicts
GET    /api/v1/conflicts             - List conflicts
POST   /api/v1/conflicts/{id}/resolve - Resolve conflict
```

**Substitute Allocation API**
```
POST   /api/v1/substitutes           - Allocate substitute
GET    /api/v1/substitutes           - List substitutes
PUT    /api/v1/substitutes/{id}      - Update substitute
DELETE /api/v1/substitutes/{id}      - Remove substitute
```

**Calendar Management API**
```
POST   /api/v1/calendars             - Create calendar
GET    /api/v1/calendars             - List calendars
PUT    /api/v1/calendars/{id}        - Update calendar
POST   /api/v1/holidays              - Define holiday
POST   /api/v1/exam-periods          - Define exam period
```

**Optimization API**
```
POST   /api/v1/optimize              - Request optimization
GET    /api/v1/optimize/{id}         - Get optimization result
POST   /api/v1/optimize/{id}/approve - Approve optimization
```

## Data Models (JPA Entities)

### Core Entities

**User Entity**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**Routine Entity**
```java
@Entity
@Table(name = "routines")
public class Routine {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classEntity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoutineType routineType = RoutineType.REGULAR;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoutineStatus status = RoutineStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**Conflict Entity**
```java
@Entity
@Table(name = "conflicts")
public class Conflict {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    private Routine routine;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConflictType conflictType;
    
    @Column(nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConflictSeverity severity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConflictStatus status = ConflictStatus.DETECTED;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**AuditLog Entity**
```java
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private String action;
    
    @Column(nullable = false)
    private String resourceType;
    
    private UUID resourceId;
    
    @Column(columnDefinition = "jsonb")
    private String beforeState;
    
    @Column(columnDefinition = "jsonb")
    private String afterState;
    
    @CreationTimestamp
    private LocalDateTime timestamp;
    
    private String ipAddress;
}
```

## Security Architecture

### Authentication
- Spring Security with JWT tokens
- RS256 asymmetric signing (public/private key pair)
- Token expiration: configurable (default: 24 hours)
- Refresh token mechanism for long-lived sessions

### Authorization
- Role-Based Access Control (RBAC) with Spring Security
- Four roles: Admin, Academic_Planner, Faculty, Student
- Method-level security with @PreAuthorize annotations
- Resource-level security with custom authorization logic

### Data Protection
- TLS 1.2+ for all data in transit
- AES-256 encryption for sensitive data at rest
- Password hashing with bcrypt (Spring Security)
- CSRF protection for web endpoints

## Testing Strategy

### Unit Testing
- JUnit 5 with Mockito for mocking
- Test coverage target: 70%+
- Mockito for mocking Spring beans
- AssertJ for fluent assertions

### Integration Testing
- Testcontainers for PostgreSQL and Redis
- Spring Boot Test with @SpringBootTest
- MockMvc for testing REST endpoints
- Test database with Flyway migrations

### Property-Based Testing
- QuickTheories or jqwik for property-based tests
- 35 correctness properties from specification
- Shrinking for minimal failing examples

### Performance Testing
- JMH (Java Microbenchmark Harness) for benchmarks
- Load testing with JMeter or Gatling
- Memory profiling with JProfiler

## Deployment Architecture

### Docker Containerization
```dockerfile
# Multi-stage build for Spring Boot application
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Kubernetes Deployment
- StatefulSet for database (PostgreSQL)
- Deployment for API services (Spring Boot)
- Service for load balancing
- ConfigMap for configuration
- Secret for sensitive data
- HPA (Horizontal Pod Autoscaler) for auto-scaling

### CI/CD Pipeline
```
Developer Push → GitHub/GitLab
    ↓
GitHub Actions / GitLab CI
    ├─ Code Checkout
    ├─ Maven Build & Test
    ├─ SonarQube Analysis
    ├─ Security Scan (OWASP)
    ├─ Build Docker Image
    ├─ Push to Registry
    ├─ Deploy to Staging
    ├─ Integration Tests
    ├─ Performance Tests
    └─ Deploy to Production (Manual Approval)
```

### Environment Configuration
- **Development**: Local Docker Compose with Spring Boot dev tools
- **Staging**: Kubernetes cluster with production-like configuration
- **Production**: Multi-region Kubernetes cluster with auto-scaling

## Error Handling

### HTTP Status Codes
- 200 OK: Successful request
- 201 Created: Resource created
- 400 Bad Request: Invalid input parameters
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: User lacks permission
- 404 Not Found: Resource does not exist
- 409 Conflict: Scheduling conflict or constraint violation
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Unexpected server error

### Exception Handling
- Custom exceptions extending RuntimeException
- @ControllerAdvice for global exception handling
- Structured error responses with error codes
- Logging of all exceptions with context

## Performance Considerations

### Caching Strategy
- Redis for session caching
- Spring Cache abstraction with @Cacheable
- Cache invalidation on data updates
- TTL-based expiration

### Database Optimization
- Lazy loading for relationships
- Pagination for large result sets
- Database indexes on frequently queried columns
- Query optimization with EXPLAIN ANALYZE

### Concurrency
- Spring's async processing with @Async
- CompletableFuture for non-blocking operations
- Thread pool configuration for async tasks
- Optimistic locking with @Version annotation

## Monitoring and Observability

### Metrics
- Spring Boot Actuator for application metrics
- Prometheus format for metrics export
- Custom metrics for business logic
- JVM metrics (memory, GC, threads)

### Logging
- SLF4J with Logback
- Structured logging with JSON format
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized logging with ELK Stack

### Tracing
- Spring Cloud Sleuth for distributed tracing
- Correlation IDs for request tracking
- Integration with Jaeger or Zipkin

## Summary

This design document specifies a **Java-based enterprise implementation** of the Class Routine Management System using Spring Boot, Spring Security, Hibernate/JPA, PostgreSQL, Redis, and Google OR-Tools. The architecture follows SOLID principles, implements layered design patterns, and supports cloud-native deployment on Kubernetes. All 20 functional requirements and 35 correctness properties are preserved and remain valid for this Java implementation.
