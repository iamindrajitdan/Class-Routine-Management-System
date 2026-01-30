# Design Document: Class Routine Management System

## Overview

The Class Routine Management System is a comprehensive, cloud-ready platform for managing academic schedules in universities. The system employs a layered architecture with clear separation of concerns: presentation layer (role-based UIs), business logic layer (routine management, conflict detection, optimization), data access layer (database abstraction), and external services (notifications, AI optimization).

The design prioritizes scalability, security, and maintainability while supporting complex constraint solving for timetable optimization.

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Admin Portal │ Planner UI   │ Faculty App  │ Student App  │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway & Auth Layer                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ REST API | OAuth 2.0 | Rate Limiting | Request Logging │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                          │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Routine Mgmt │ Conflict Det │ Substitute   │ Optimization │  │
│  │              │              │ Allocation   │ Engine       │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Calendar Mgmt│ Notification │ Report Gen   │ Audit Logger │  │
│  │              │ Service      │              │              │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ORM/Query Builder | Connection Pooling | Caching Layer  │   │
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
│  │ Email/SMS    │ AI Solver    │ Cloud Storage│ Monitoring   │  │
│  │ Notification │ (Constraint) │              │ (Prometheus) │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend**: Node.js/Express or Python/FastAPI
- **Language**: TypeScript (Node.js) or Python 3.10+
- **Framework**: Express.js or FastAPI
- **ORM**: Sequelize/TypeORM (Node) or SQLAlchemy (Python)
- **Validation**: Joi/Zod (Node) or Pydantic (Python)

**Database**: PostgreSQL 14+
- **Caching**: Redis 7+
- **Search**: Elasticsearch (optional, for advanced reporting)

**AI/Optimization**: Python-based microservice
- **Constraint Solver**: OR-Tools (Google)
- **ML Framework**: scikit-learn for optimization scoring

**Frontend**: React 18+ or Vue 3+
- **State Management**: Redux or Pinia
- **UI Framework**: Material-UI or Tailwind CSS
- **Accessibility**: axe-core for testing

**DevOps**: Docker, Kubernetes, CI/CD
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions or GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Components and Interfaces

### Core Components

1. **Routine Management Service**
   - Create, read, update, delete routines
   - Validate routine data
   - Manage routine lifecycle

2. **Conflict Detection Engine**
   - Detect teacher double-booking
   - Detect classroom conflicts
   - Detect class scheduling conflicts
   - Suggest resolutions

3. **Substitute Allocation Service**
   - Identify available substitutes
   - Allocate substitutes
   - Manage substitute history

4. **Calendar Management Service**
   - Manage yearly calendars
   - Manage class calendars
   - Handle holidays and exam periods
   - Validate calendar constraints

5. **Optimization Engine**
   - Analyze constraints
   - Generate optimized routines
   - Score optimization results
   - Support human-in-the-loop approval

6. **Notification Service**
   - Send email/SMS notifications
   - Manage notification preferences
   - Track notification delivery

7. **Report Generation Service**
   - Generate routine reports
   - Export to PDF/CSV/Excel
   - Create analytics dashboards

8. **Audit Logging Service**
   - Log all system actions
   - Track data changes
   - Support compliance queries

### API Interfaces

**Routine Management API**
```
POST   /api/v1/routines              - Create routine
GET    /api/v1/routines              - List routines
GET    /api/v1/routines/:id          - Get routine
PUT    /api/v1/routines/:id          - Update routine
DELETE /api/v1/routines/:id          - Delete routine
POST   /api/v1/routines/:id/validate - Validate routine
```

**Conflict Detection API**
```
POST   /api/v1/conflicts/detect      - Detect conflicts
GET    /api/v1/conflicts             - List conflicts
POST   /api/v1/conflicts/:id/resolve - Resolve conflict
```

**Substitute Allocation API**
```
POST   /api/v1/substitutes           - Allocate substitute
GET    /api/v1/substitutes           - List substitutes
PUT    /api/v1/substitutes/:id       - Update substitute
DELETE /api/v1/substitutes/:id       - Remove substitute
```

**Calendar Management API**
```
POST   /api/v1/calendars             - Create calendar
GET    /api/v1/calendars             - List calendars
PUT    /api/v1/calendars/:id         - Update calendar
POST   /api/v1/holidays              - Define holiday
POST   /api/v1/exam-periods          - Define exam period
```

**Optimization API**
```
POST   /api/v1/optimize              - Request optimization
GET    /api/v1/optimize/:id          - Get optimization result
POST   /api/v1/optimize/:id/approve  - Approve optimization
```

## Data Models

### Core Entities

**User**
- id (UUID)
- email (String, unique)
- password_hash (String)
- first_name (String)
- last_name (String)
- role (Enum: Admin, Academic_Planner, Faculty, Student)
- department_id (FK)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

**Class**
- id (UUID)
- name (String)
- code (String, unique)
- academic_year (String)
- semester (Integer)
- program_id (FK)
- capacity (Integer)
- created_at (Timestamp)

**Teacher**
- id (UUID)
- user_id (FK)
- department_id (FK)
- specialization (String)
- max_hours_per_week (Integer)
- created_at (Timestamp)

**Subject**
- id (UUID)
- name (String)
- code (String, unique)
- description (Text)
- credit_hours (Integer)
- created_at (Timestamp)

**Lesson**
- id (UUID)
- subject_id (FK)
- lesson_number (Integer)
- title (String)
- duration_minutes (Integer)
- created_at (Timestamp)

**TimeSlot**
- id (UUID)
- day_of_week (Enum: Mon-Sun)
- start_time (Time)
- end_time (Time)
- created_at (Timestamp)

**Classroom**
- id (UUID)
- name (String)
- capacity (Integer)
- building (String)
- floor (Integer)
- is_virtual (Boolean)
- created_at (Timestamp)

**Routine**
- id (UUID)
- class_id (FK)
- teacher_id (FK)
- subject_id (FK)
- lesson_id (FK)
- time_slot_id (FK)
- classroom_id (FK)
- routine_type (Enum: Regular, Additional, Remedial)
- status (Enum: Active, Inactive, Cancelled)
- created_by (FK to User)
- created_at (Timestamp)
- updated_at (Timestamp)

**Substitute**
- id (UUID)
- original_teacher_id (FK)
- substitute_teacher_id (FK)
- routine_id (FK)
- start_date (Date)
- end_date (Date)
- reason (String)
- status (Enum: Pending, Approved, Active, Completed)
- created_at (Timestamp)

**Holiday**
- id (UUID)
- name (String)
- start_date (Date)
- end_date (Date)
- academic_year (String)
- created_at (Timestamp)

**ExamPeriod**
- id (UUID)
- name (String)
- start_date (Date)
- end_date (Date)
- academic_year (String)
- created_at (Timestamp)

**Conflict**
- id (UUID)
- routine_id (FK)
- conflict_type (Enum: TeacherDouble, ClassroomDouble, ClassDouble)
- description (String)
- severity (Enum: High, Medium, Low)
- status (Enum: Detected, Resolved, Ignored)
- created_at (Timestamp)

**AuditLog**
- id (UUID)
- user_id (FK)
- action (String)
- resource_type (String)
- resource_id (UUID)
- before_state (JSON)
- after_state (JSON)
- timestamp (Timestamp)
- ip_address (String)

**Notification**
- id (UUID)
- user_id (FK)
- type (String)
- title (String)
- message (String)
- is_read (Boolean)
- created_at (Timestamp)

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property-Based Testing Overview

Property-based testing (PBT) validates software correctness by testing universal properties across many generated inputs. Each property is a formal specification that should hold for all valid inputs.

**Core Principles**:
1. **Universal Quantification**: Every property must contain an explicit "for all" statement
2. **Requirements Traceability**: Each property must reference the requirements it validates
3. **Executable Specifications**: Properties must be implementable as automated tests
4. **Comprehensive Coverage**: Properties should cover all testable acceptance criteria

### Common Property Patterns

1. **Invariants**: Properties that remain constant despite changes
2. **Round Trip Properties**: Combining an operation with its inverse returns to original value
3. **Idempotence**: Doing an operation twice equals doing it once
4. **Metamorphic Properties**: Relationships that must hold between components
5. **Model-Based Testing**: Comparing optimized vs standard implementations
6. **Confluence**: Order of operations doesn't matter
7. **Error Conditions**: Bad inputs properly signal errors



### Correctness Properties

Based on the prework analysis, here are the key correctness properties for the Class Routine Management System:

**Property 1: Routine Creation Idempotence**
*For any* valid routine input, creating the routine twice should result in only one routine in the system (or the second creation should be rejected as duplicate)
**Validates: Requirements 1.1, 1.3**

**Property 2: Unique Routine Identifiers**
*For any* set of routines created in the system, all routine IDs should be unique
**Validates: Requirements 1.3**

**Property 3: Routine Modification Persistence**
*For any* routine, modifying it and then retrieving it should return the modified values
**Validates: Requirements 1.4**

**Property 4: Audit Log Completeness**
*For any* routine modification, the Audit_Log should contain an entry with the user, timestamp, action type, and affected resource
**Validates: Requirements 1.4, 11.1, 11.2**

**Property 5: Teacher Conflict Detection**
*For any* two routines assigned to the same teacher with overlapping time slots, the system should detect a conflict
**Validates: Requirements 2.1**

**Property 6: Classroom Conflict Detection**
*For any* two routines assigned to the same classroom with overlapping time slots, the system should detect a conflict
**Validates: Requirements 2.2**

**Property 7: Class Conflict Detection**
*For any* two routines assigned to the same class with overlapping time slots, the system should detect a conflict
**Validates: Requirements 2.3**

**Property 8: Conflict Prevention**
*For any* conflicting routine, the system should reject the creation and prevent it from being saved
**Validates: Requirements 2.4**

**Property 9: Teacher Availability Constraint**
*For any* teacher marked unavailable during a period, no new routines should be created assigning that teacher during that period
**Validates: Requirements 3.1**

**Property 10: Substitute Conflict Checking**
*For any* substitute allocated to a routine, the substitute should have no conflicting assignments
**Validates: Requirements 3.4**

**Property 11: Holiday Constraint**
*For any* date defined as a holiday, no routines should be scheduled on that date
**Validates: Requirements 4.1**

**Property 12: Exam Period Suspension**
*For any* exam period defined, regular class routines should be suspended during that period
**Validates: Requirements 4.2**

**Property 13: Additional Class Scheduling**
*For any* additional class created, it should be scheduled outside regular routine slots
**Validates: Requirements 5.1**

**Property 14: Subject-Lesson Linking**
*For any* lesson created, it should be linked to a subject with a valid sequence number
**Validates: Requirements 6.3**

**Property 15: Time Slot Non-Overlap**
*For any* set of time slots defined for the same day, no two time slots should overlap
**Validates: Requirements 7.2**

**Property 16: Multiple Time Slots Per Day**
*For any* day, multiple non-overlapping time slots should be allowed
**Validates: Requirements 7.3**

**Property 17: RBAC Permission Enforcement**
*For any* user with a specific role, they should only have access to features and data permitted for that role
**Validates: Requirements 8.1, 8.2, 8.5, 8.6**

**Property 18: Notification Delivery**
*For any* routine creation/modification, notifications should be sent to all affected teachers and students
**Validates: Requirements 9.1**

**Property 19: Notification Storage**
*For any* notification sent to a user, it should be stored in the user's notification center
**Validates: Requirements 9.6**

**Property 20: Report Generation**
*For any* report generated, it should contain routine data, statistics, and analytics
**Validates: Requirements 10.5**

**Property 21: Report Export Formats**
*For any* generated report, it should be exportable in PDF, CSV, and Excel formats
**Validates: Requirements 10.6**

**Property 22: API Authentication**
*For any* API request without valid credentials, the system should reject the request
**Validates: Requirements 13.1**

**Property 23: API Response Format**
*For any* successful API request, the response should be in JSON format
**Validates: Requirements 13.3**

**Property 24: API Error Handling**
*For any* failed API request, the system should return an error message with details and appropriate HTTP status code
**Validates: Requirements 13.4**

**Property 25: API Rate Limiting**
*For any* user exceeding the rate limit, subsequent API requests should be rejected
**Validates: Requirements 13.6**

**Property 26: User Authentication**
*For any* login attempt with invalid credentials, the system should reject the login
**Validates: Requirements 15.1**

**Property 27: Session Token Issuance**
*For any* successful authentication, the system should issue a secure session token
**Validates: Requirements 15.2**

**Property 28: Authorization Enforcement**
*For any* user accessing data they are not authorized to access, the system should deny access
**Validates: Requirements 15.5**

**Property 29: Optimization Constraint Satisfaction**
*For any* optimized routine, all hard constraints (teacher availability, classroom capacity) should be satisfied
**Validates: Requirements 17.3**

**Property 30: Optimization Alternatives**
*For any* optimization request, the system should suggest multiple alternative arrangements
**Validates: Requirements 17.4**

**Property 31: Hard Constraint Validation**
*For any* routine, hard constraints (no teacher double-booking, classroom availability) should be validated
**Validates: Requirements 18.1**

**Property 32: Constraint Violation Prevention**
*For any* routine violating constraints, the system should prevent it from being saved
**Validates: Requirements 18.3**

**Property 33: Calendar Date Validation**
*For any* calendar created, dates should not conflict with defined holidays or exam periods
**Validates: Requirements 19.4**

**Property 34: Data Persistence Round Trip**
*For any* data created or modified, retrieving it from the database should return the same data
**Validates: Requirements 12.1**

**Property 35: Data Integrity Validation**
*For any* invalid data, the system should reject it before persisting to the database
**Validates: Requirements 12.2**

## Error Handling

The system implements comprehensive error handling across all layers:

**API Layer**:
- 400 Bad Request: Invalid input parameters
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: User lacks permission for the action
- 404 Not Found: Resource does not exist
- 409 Conflict: Scheduling conflict or constraint violation
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Unexpected server error

**Business Logic Layer**:
- Validation errors with specific field details
- Conflict detection with suggested resolutions
- Constraint violation errors with violation details
- Substitute allocation failures with reasons

**Data Layer**:
- Database connection errors with retry logic
- Data integrity errors with rollback
- Transaction failures with compensation logic

**Notification Layer**:
- Failed notification delivery with retry mechanism
- Notification preference validation
- Delivery status tracking

## Testing Strategy

### Unit Testing

Unit tests validate specific components in isolation:

- **Routine Management**: Test routine creation, modification, deletion with valid/invalid inputs
- **Conflict Detection**: Test detection of teacher, classroom, and class conflicts
- **Substitute Allocation**: Test substitute identification and allocation logic
- **Calendar Management**: Test holiday and exam period handling
- **RBAC**: Test role-based access control enforcement
- **API Validation**: Test request validation and error responses
- **Data Persistence**: Test database operations and data integrity

### Property-Based Testing

Property-based tests validate universal properties across many generated inputs:

- **Routine Uniqueness**: Verify all created routines have unique IDs
- **Conflict Detection Completeness**: Verify all conflicts are detected
- **Constraint Satisfaction**: Verify all constraints are satisfied in optimized routines
- **Authorization Enforcement**: Verify users can only access authorized data
- **Audit Logging**: Verify all actions are logged with complete information
- **Notification Delivery**: Verify notifications are sent to all affected users
- **Data Persistence**: Verify data round-trip (create → retrieve → verify)

### Integration Testing

Integration tests validate interactions between components:

- **Routine Creation Workflow**: Test complete routine creation with conflict detection and notifications
- **Substitute Allocation Workflow**: Test substitute identification, allocation, and notifications
- **Holiday/Exam Handling**: Test calendar updates and routine suspension
- **Optimization Workflow**: Test optimization request, suggestion, and approval
- **API Integration**: Test API endpoints with database and business logic

### User Acceptance Testing

UAT validates the system meets user requirements:

- **Admin Dashboard**: Verify system statistics and user management
- **Planner Workflow**: Verify routine creation, conflict resolution, and optimization
- **Faculty Experience**: Verify access to assigned classes and routines
- **Student Experience**: Verify access to class routine and schedule
- **Notification System**: Verify timely and accurate notifications
- **Report Generation**: Verify report accuracy and export functionality

## Deployment Architecture

### Cloud-Ready Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Platform (AWS/Azure/GCP)           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Kubernetes Cluster                      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Ingress Controller (Load Balancer)            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  API Service Pods (Auto-scaling)               │  │   │
│  │  │  ├─ Pod 1 (API Server)                         │  │   │
│  │  │  ├─ Pod 2 (API Server)                         │  │   │
│  │  │  └─ Pod N (API Server)                         │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Optimization Service Pods                     │  │   │
│  │  │  ├─ Pod 1 (Constraint Solver)                  │  │   │
│  │  │  └─ Pod N (Constraint Solver)                  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Notification Service Pods                     │  │   │
│  │  │  ├─ Pod 1 (Email/SMS)                          │  │   │
│  │  │  └─ Pod N (Email/SMS)                          │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Persistent Storage                            │  │   │
│  │  │  ├─ PostgreSQL (Primary)                       │  │   │
│  │  │  ├─ PostgreSQL (Replica)                       │  │   │
│  │  │  ├─ Redis Cache                                │  │   │
│  │  │  └─ Backup Storage                             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Monitoring & Logging                               │   │
│  │  ├─ Prometheus (Metrics)                            │   │
│  │  ├─ Grafana (Dashboards)                            │   │
│  │  ├─ ELK Stack (Logs)                                │   │
│  │  └─ Alert Manager                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
Developer Push → GitHub/GitLab
    ↓
GitHub Actions / GitLab CI
    ├─ Code Checkout
    ├─ Lint & Format Check
    ├─ Unit Tests
    ├─ Property-Based Tests
    ├─ Integration Tests
    ├─ Security Scan (SAST)
    ├─ Build Docker Image
    ├─ Push to Registry
    ├─ Deploy to Staging
    ├─ Smoke Tests
    ├─ Performance Tests
    └─ Deploy to Production (Manual Approval)
```

### Environment Configuration

- **Development**: Local Docker Compose setup
- **Staging**: Kubernetes cluster with production-like configuration
- **Production**: Multi-region Kubernetes cluster with auto-scaling

