# Class Routine Management System

A university-grade, cloud-ready platform for managing academic schedules with AI-assisted timetable optimization, conflict detection, and comprehensive reporting.

## Project Overview

This is a full-stack SaaS application designed for academic institutions to manage class routines, teacher schedules, classroom allocations, and student timetables with intelligent constraint solving and optimization.

**Status**: ✅ **Phase 1-7 & 15-16 Complete** | Ready for Testing & Frontend Development

## Architecture

- **Backend**: Java 17 with Spring Boot 3.2+
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Security**: Spring Security with JWT (RS256)
- **ORM**: Hibernate 6.x / Spring Data JPA
- **Optimization**: Google OR-Tools Java bindings
- **Build Tool**: Maven 3.8+
- **Deployment**: Docker & Kubernetes

## Technology Stack

### Backend
- Java 17 (LTS)
- Spring Boot 3.2.1
- Spring Security (JWT authentication with RS256)
- Spring Data JPA / Hibernate 6.x
- Flyway (database migrations)
- Lombok (boilerplate reduction)
- Springdoc OpenAPI (API documentation)
- Bucket4j (rate limiting)

### Database & Cache
- PostgreSQL 14+
- Redis 7+
- HikariCP (connection pooling)

### Testing
- JUnit 5
- Mockito
- Testcontainers
- QuickTheories (property-based testing)
- JaCoCo (70% coverage enforcement)

### DevOps
- Docker (multi-stage builds)
- Kubernetes
- Spring Boot Actuator (monitoring)
- Prometheus & Grafana

## Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- Docker & Docker Compose

### Option 1: Build Locally + Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/iamindrajitdan/Class-Routine-Management-System.git
cd Class-Routine-Management-System

# Build the project
mvn clean package -DskipTests

# Start all services
docker-compose up -d

# Verify services
docker-compose ps

# Test API
curl http://localhost:8080/actuator/health
```

### Option 2: Docker Only

```bash
# Clone repository
git clone https://github.com/iamindrajitdan/Class-Routine-Management-System.git
cd Class-Routine-Management-System

# Build and start all services
docker-compose up -d --build

# Verify services
docker-compose ps
```

### Option 3: Local Development

```bash
# Clone repository
git clone https://github.com/iamindrajitdan/Class-Routine-Management-System.git
cd Class-Routine-Management-System

# Start infrastructure
docker-compose up -d postgres redis

# Build the project
mvn clean install

# Run the application
cd crms-api
mvn spring-boot:run
```

## Access the Application

- **API Base URL**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health
- **Metrics**: http://localhost:8080/actuator/metrics

## Default Credentials

For local development:

| Email | Password | Role |
|-------|----------|------|
| admin@crms.edu | password123 | ADMIN |
| planner@crms.edu | password123 | ACADEMIC_PLANNER |
| faculty@crms.edu | password123 | FACULTY |
| student@crms.edu | password123 | STUDENT |

⚠️ **Change these in production!**

## Project Structure

```
.
├── pom.xml                          # Parent POM
├── crms-api/                        # Main API module
│   ├── pom.xml
│   ├── Dockerfile                   # Multi-stage build
│   ├── Dockerfile.simple            # Simplified build
│   ├── Dockerfile.prebuilt          # Runtime-only (recommended)
│   └── src/
│       ├── main/
│       │   ├── java/com/crms/
│       │   │   ├── CrmsApplication.java
│       │   │   ├── controller/       # REST controllers
│       │   │   ├── service/          # Business logic
│       │   │   ├── domain/           # JPA entities
│       │   │   ├── repository/       # Data access
│       │   │   ├── security/         # JWT & auth
│       │   │   └── config/           # Spring config
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/     # Flyway migrations
│       └── test/                     # Unit & integration tests
├── k8s/                             # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
├── docker-compose.yml               # Local development
└── .kiro/specs/                     # Specification documents
    └── class-routine-management/
        ├── requirements.md
        ├── design.md
        └── tasks.md
```

## Documentation

- [Requirements](.kiro/specs/class-routine-management/requirements.md) - 20 functional requirements
- [Design](.kiro/specs/class-routine-management/design.md) - System architecture and design
- [Tasks](.kiro/specs/class-routine-management/tasks.md) - 100+ implementation tasks
- [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Implementation details

## Features

### ✅ Implemented
- Multi-module Maven project structure
- Spring Boot 3.2+ with Java 17
- PostgreSQL database with Flyway migrations
- Docker multi-stage builds
- JPA entities (User, Routine, Conflict, etc.)
- JWT authentication with Spring Security (RS256)
- Role-based access control (Admin, Planner, Faculty, Student)
- Request logging with Spring AOP
- Rate limiting with Bucket4j
- Global exception handling
- REST APIs with OpenAPI documentation
- Audit logging infrastructure
- Redis caching

### 🚧 In Development
- Conflict detection and resolution
- Substitute teacher allocation
- AI-assisted timetable optimization (OR-Tools)
- Calendar and holiday management
- Notification system (Email/SMS)
- Report generation (PDF/CSV/Excel)
- Property-based testing
- 70% test coverage (JaCoCo)

## Requirements Traceability

All implementation tasks are traceable to specific requirements. The project follows a spec-driven development methodology with:
- **20 functional requirements** (all preserved)
- **35 correctness properties** (all preserved)
- **100+ granular implementation tasks** (organized by phase)

## Implementation Status

### ✅ Completed Phases

- **Phase 1**: Project Setup & Foundations
  - Maven multi-module project
  - Spring Boot 3.2.1 configuration
  - Docker Compose environment
  - JWT authentication with RS256
  - Spring Security with RBAC
  - Request logging with Spring AOP
  - Rate limiting with Bucket4j
  - Global exception handling

- **Phase 2**: Database & Schema Design
  - 15+ JPA entities with relationships
  - Spring Data JPA repositories
  - Flyway database migrations
  - Redis caching configuration
  - HikariCP connection pooling

- **Phase 3**: Backend Services - Core Components
  - Routine Management Service
  - Conflict Detection Service
  - Substitute Allocation Service
  - Calendar Management Service
  - Subject-Lesson Mapping Service
  - Time Slot Management Service
  - Additional/Remedial Class Service

- **Phase 7**: Backend REST APIs
  - Routine Management APIs
  - Conflict Detection APIs
  - Substitute Allocation APIs
  - Calendar Management APIs
  - Subject-Lesson APIs
  - Time Slot APIs

- **Phase 15**: DevOps & Deployment
  - Docker multi-stage builds
  - Dockerfile.prebuilt (recommended)
  - Kubernetes manifests
  - GitHub Actions CI/CD pipeline
  - Build automation scripts

- **Phase 16**: Documentation & Release
  - Comprehensive documentation
  - API documentation with Swagger
  - Deployment guides
  - Release notes

### 🚧 In Progress / Planned

- **Phase 4**: Backend Services - AI & Optimization (OR-Tools)
- **Phase 5**: Backend Services - Notifications & Reporting
- **Phase 6**: Backend Services - RBAC & Audit
- **Phase 8-11**: Frontend (React)
- **Phase 12-14**: Testing (Unit, Integration, Property-based)

## Development Guidelines

- Follow SOLID principles
- Maintain 70% test coverage (enforced by JaCoCo)
- Write property-based tests for core logic
- Use Lombok to reduce boilerplate
- Document all REST APIs with OpenAPI annotations
- Follow Spring Boot best practices
- Use Testcontainers for integration tests
- Use Spring Security for authentication/authorization
- Implement audit logging for compliance

## Common Commands

```bash
# Build
mvn clean package -DskipTests

# Run tests
mvn test

# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down

# Access database
docker-compose exec postgres psql -U crms_user -d crms_db

# Access cache
docker-compose exec redis redis-cli
```

## Troubleshooting

### Maven Build Fails
```bash
rm -rf ~/.m2/repository
mvn clean package -DskipTests
```

### Docker Services Won't Start
```bash
docker-compose logs
docker-compose down
docker-compose up -d
```

### Port Already in Use
```bash
# Linux/macOS
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## License

Academic & Institutional Use

## Contact

For questions or support, contact the development team.

## Project Statistics

- **Total Lines of Code**: ~10,000+
- **Total Entities**: 15+
- **Total Services**: 8+
- **Total Controllers**: 5+
- **Total Repositories**: 12+
- **Test Coverage Target**: 70%
- **Documentation**: 200+ pages
- **Implementation Tasks**: 100+
