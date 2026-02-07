# Class Routine Management System

A university-grade, cloud-ready platform for managing academic schedules with AI-assisted timetable optimization, conflict detection, and comprehensive reporting.

## Project Overview

This is a full-stack SaaS application designed for academic institutions to manage class routines, teacher schedules, classroom allocations, and student timetables with intelligent constraint solving and optimization.

**Status**: Phase 1 - Project Setup & Foundations (In Progress)

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
- Spring Security (JWT authentication)
- Spring Data JPA / Hibernate
- Flyway (database migrations)
- Lombok (boilerplate reduction)
- Springdoc OpenAPI (API documentation)

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
- PostgreSQL 14+ (or use Docker)

### Development Setup

```bash
# Clone repository
git clone https://github.com/iamindrajitdan/Class-Routine-Management-System.git
cd Class-Routine-Management-System

# Set up environment
cp .env.example .env

# Start infrastructure (PostgreSQL, Redis)
docker-compose up -d postgres redis

# Build the project
mvn clean install

# Run the application
cd crms-api
mvn spring-boot:run
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f crms-api

# Stop services
docker-compose down
```

The API will be available at `http://localhost:8080`

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Project Structure

```
.
├── pom.xml                          # Parent POM
├── crms-api/                        # Main API module
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/crms/
│       │   │   ├── CrmsApplication.java
│       │   │   └── domain/          # JPA entities
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/    # Flyway migrations
│       └── test/                    # Unit & integration tests
├── docker-compose.yml
└── .kiro/specs/                     # Specification documents
    └── class-routine-management/
        ├── requirements.md
        ├── design.md
        └── tasks.md
```

## Documentation

- [Requirements](.kiro/specs/class-routine-management/requirements.md) - Complete functional requirements
- [Design](.kiro/specs/class-routine-management/design.md) - System architecture and design
- [Tasks](.kiro/specs/class-routine-management/tasks.md) - Implementation plan

## Features (Planned)

- ✅ Multi-module Maven project structure
- ✅ Spring Boot 3.2+ with Java 17
- ✅ PostgreSQL database with Flyway migrations
- ✅ Docker multi-stage builds
- ✅ JPA entities (User, Routine)
- 🚧 JWT authentication with Spring Security
- 🚧 Role-based access control (Admin, Planner, Faculty, Student)
- 🚧 Conflict detection and resolution
- 🚧 Substitute teacher allocation
- 🚧 AI-assisted timetable optimization (OR-Tools)
- 🚧 Calendar and holiday management
- 🚧 Notification system
- 🚧 Audit logging
- 🚧 REST APIs with OpenAPI documentation
- 🚧 Property-based testing
- 🚧 70% test coverage (JaCoCo)

## Requirements Traceability

All implementation tasks are traceable to specific requirements. The project follows a spec-driven development methodology with:
- 20 functional requirements
- 35 correctness properties
- 100+ granular implementation tasks

## Development Guidelines

- Follow SOLID principles
- Maintain 70% test coverage (enforced by JaCoCo)
- Write property-based tests for core logic
- Use Lombok to reduce boilerplate
- Document all REST APIs with OpenAPI annotations
- Follow Spring Boot best practices
- Use Testcontainers for integration tests

## License

Academic & Institutional Use

## Contact

For questions or support, contact the development team.
