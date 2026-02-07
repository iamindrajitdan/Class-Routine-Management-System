# Class Routine Management System - Implementation Guide

## Overview

This is a comprehensive Java-based enterprise implementation of the Class Routine Management System using Spring Boot 3.x, Spring Security, Hibernate/JPA, PostgreSQL, Redis, and Google OR-Tools.

## Project Structure

```
crms/
├── crms-api/                          # Spring Boot API module
│   ├── src/main/java/com/crms/
│   │   ├── controller/                # REST Controllers
│   │   ├── service/                   # Business Logic Services
│   │   ├── domain/                    # JPA Entities
│   │   ├── repository/                # Spring Data JPA Repositories
│   │   ├── security/                  # Security Configuration
│   │   ├── config/                    # Application Configuration
│   │   └── dto/                       # Data Transfer Objects
│   ├── src/main/resources/
│   │   ├── db/migration/              # Flyway Database Migrations
│   │   └── application.yml            # Spring Boot Configuration
│   ├── Dockerfile                     # Docker build configuration
│   └── pom.xml                        # Maven dependencies
├── k8s/                               # Kubernetes manifests
│   ├── deployment.yaml                # Deployment configuration
│   ├── configmap.yaml                 # ConfigMap for configuration
│   └── secrets.yaml                   # Secrets for sensitive data
├── .github/workflows/                 # GitHub Actions CI/CD
│   └── ci-cd.yml                      # CI/CD pipeline
├── docker-compose.yml                 # Local development environment
├── pom.xml                            # Parent POM
└── README.md                          # Project documentation
```

## Technology Stack

### Backend
- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.2.1
- **Security**: Spring Security 6.x with JWT
- **ORM**: Hibernate 6.x with Spring Data JPA
- **Build**: Maven 3.8+
- **Validation**: Jakarta Bean Validation

### Database
- **Primary**: PostgreSQL 14+
- **Caching**: Redis 7+
- **Migrations**: Flyway 10.4.1
- **Connection Pooling**: HikariCP

### AI/Optimization
- **Constraint Solver**: Google OR-Tools Java bindings

### Testing
- **Unit Tests**: JUnit 5 with Mockito
- **Integration Tests**: Testcontainers
- **Property-Based Tests**: QuickTheories
- **Code Coverage**: JaCoCo (70% minimum)

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or Loki

## Getting Started

### Prerequisites
- Java 17 or later
- Maven 3.8+
- Docker and Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis 7+ (or use Docker)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd crms
```

2. **Start services with Docker Compose**
```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Redis cache
- Spring Boot API (if configured)

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
cd crms-api
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### API Documentation

Once the application is running, access the API documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Core Features

### 1. Routine Management
- Create, read, update, delete class routines
- Automatic conflict detection
- Routine validation and constraints

### 2. Conflict Detection
- Teacher double-booking detection
- Classroom conflict detection
- Class scheduling conflict detection
- Conflict resolution suggestions

### 3. Substitute Allocation
- Identify available substitute teachers
- Allocate substitutes with conflict checking
- Maintain substitute history
- Teacher reassignment management

### 4. Calendar Management
- Yearly calendar creation and management
- Holiday definition and enforcement
- Exam period suspension logic
- Class calendar linking

### 5. Subject-Lesson Mapping
- Subject creation and management
- Lesson creation and linking
- Curriculum structure management

### 6. Time Slot Management
- Day-wise time slot definition
- Overlap validation
- Multiple time slots per day support

### 7. Notifications
- Email and SMS notifications
- Notification center for users
- Read/unread tracking
- Async notification processing

### 8. Audit Logging
- Complete action logging
- Before/after state tracking
- User and IP address tracking
- Compliance and security audit trails

### 9. Role-Based Access Control
- Four roles: Admin, Academic_Planner, Faculty, Student
- Method-level security with @PreAuthorize
- Resource-level access filtering

### 10. Reporting
- Routine report generation
- Statistics and analytics
- PDF, CSV, Excel export

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Routines
- `GET /api/v1/routines/{id}` - Get routine
- `POST /api/v1/routines` - Create routine
- `PUT /api/v1/routines/{id}` - Update routine
- `DELETE /api/v1/routines/{id}` - Delete routine

### Conflicts
- `POST /api/v1/conflicts/detect` - Detect conflicts
- `GET /api/v1/conflicts` - List unresolved conflicts
- `POST /api/v1/conflicts/{id}/resolve` - Resolve conflict

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread` - Get unread notifications
- `PUT /api/v1/notifications/{id}/read` - Mark as read
- `DELETE /api/v1/notifications/{id}` - Delete notification

### Audit Logs
- `GET /api/v1/audit-logs` - List audit logs
- `GET /api/v1/audit-logs/{id}` - Get audit log details

## Database Schema

The system uses PostgreSQL with the following main tables:

- `users` - System users with roles
- `departments` - Academic departments
- `programs` - Academic programs
- `classes` - Student classes
- `teachers` - Faculty members
- `subjects` - Academic subjects
- `lessons` - Subject lessons
- `time_slots` - Class time slots
- `classrooms` - Physical/virtual classrooms
- `routines` - Class routine assignments
- `substitutes` - Teacher substitutions
- `holidays` - Institutional holidays
- `exam_periods` - Exam scheduling periods
- `conflicts` - Detected scheduling conflicts
- `audit_logs` - System action audit trail
- `notifications` - User notifications

## Configuration

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crms_db
DB_USER=crms_user
DB_PASSWORD=crms_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-min-256-bits
JWT_EXPIRATION=86400000  # 24 hours

# Mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
```

### Spring Boot Profiles

- **dev**: Development environment with debug logging
- **test**: Test environment with in-memory database
- **prod**: Production environment with optimized settings

## Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=RoutineServiceTest
```

### Run with Coverage Report
```bash
mvn clean test jacoco:report
```

Coverage report available at: `target/site/jacoco/index.html`

## Deployment

### Docker Build
```bash
docker build -t crms-api:latest crms-api/
```

### Docker Run
```bash
docker run -p 8080:8080 \
  -e DB_HOST=postgres \
  -e REDIS_HOST=redis \
  crms-api:latest
```

### Kubernetes Deployment
```bash
# Create namespace
kubectl create namespace crms

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml

# Check deployment status
kubectl get deployment -n crms
kubectl get pods -n crms
```

## Monitoring and Logging

### Metrics
- Access Prometheus metrics at: `http://localhost:8080/actuator/prometheus`
- Metrics include: JVM memory, GC, HTTP requests, database connections

### Health Checks
- Liveness probe: `http://localhost:8080/actuator/health`
- Readiness probe: `http://localhost:8080/actuator/health/readiness`

### Logging
- Logs are written to console and file
- Log level configurable via `LOG_LEVEL` environment variable
- Structured logging in JSON format for production

## Performance Optimization

### Caching Strategy
- Redis caching for frequently accessed data
- Cache invalidation on data updates
- TTL-based expiration (default: 1 hour)

### Database Optimization
- Lazy loading for relationships
- Pagination for large result sets
- Database indexes on frequently queried columns
- Connection pooling with HikariCP

### Concurrency
- Async processing for notifications
- CompletableFuture for non-blocking operations
- Optimistic locking with @Version annotation

## Security Best Practices

1. **Authentication**: JWT tokens with RS256 signing
2. **Authorization**: Role-based access control with @PreAuthorize
3. **Data Protection**: TLS 1.2+ for data in transit, AES-256 for sensitive data at rest
4. **Input Validation**: Jakarta Bean Validation on all inputs
5. **Rate Limiting**: Token bucket algorithm to prevent abuse
6. **Audit Logging**: Complete action logging for compliance
7. **CORS**: Configured for allowed origins
8. **CSRF Protection**: Enabled for web endpoints

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker logs crms-postgres
```

### Redis Connection Issues
```bash
# Check Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping
```

### Application Startup Issues
```bash
# Check application logs
docker logs crms-api

# Check port availability
lsof -i :8080
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `mvn test`
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
