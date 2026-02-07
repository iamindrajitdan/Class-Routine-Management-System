# Quick Start Guide - Class Routine Management System

## 5-Minute Setup

### Prerequisites
- Docker and Docker Compose installed
- Java 17+ (for local development)
- Maven 3.8+ (for local development)

### Option 1: Docker Compose (Recommended for Quick Start)

```bash
# 1. Clone the repository
git clone <repository-url>
cd crms

# 2. Build the JAR locally first (RECOMMENDED)
mvn clean package -DskipTests

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be healthy (30-60 seconds)
docker-compose ps

# 5. Access the application
# API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

**Note**: Building locally first is more reliable than building inside Docker.

### Option 2: Using Build Script (Linux/Mac)

```bash
# 1. Clone the repository
git clone <repository-url>
cd crms

# 2. Make build script executable
chmod +x build.sh

# 3. Build everything and start services
./build.sh all
./build.sh start

# 4. Access the application
# API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Option 3: Using Build Script (Windows)

```cmd
# 1. Clone the repository
git clone <repository-url>
cd crms

# 2. Build everything and start services
build.bat all
build.bat start

# 3. Access the application
# API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Option 4: Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd crms

# 2. Start database and cache with Docker Compose
docker-compose up -d postgres redis

# 3. Build the project
mvn clean install

# 4. Run the application
cd crms-api
mvn spring-boot:run

# 5. Access the application
# API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

## First API Call

### 1. Login to Get JWT Token

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crms.edu",
    "password": "password123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### 2. Use Token to Access Protected Endpoints

```bash
curl -X GET http://localhost:8080/api/v1/routines/123 \
  -H "Authorization: Bearer <your-access-token>"
```

## Common Tasks

### Create a Routine

```bash
curl -X POST http://localhost:8080/api/v1/routines \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "classEntity": {"id": "class-uuid"},
    "teacher": {"id": "teacher-uuid"},
    "subject": {"id": "subject-uuid"},
    "lesson": {"id": "lesson-uuid"},
    "timeSlot": {"id": "timeslot-uuid"},
    "classroom": {"id": "classroom-uuid"},
    "routineType": "REGULAR",
    "status": "ACTIVE"
  }'
```

### Get Unresolved Conflicts

```bash
curl -X GET http://localhost:8080/api/v1/conflicts \
  -H "Authorization: Bearer <token>"
```

### Get User Notifications

```bash
curl -X GET http://localhost:8080/api/v1/notifications \
  -H "Authorization: Bearer <token>"
```

## Database Access

### PostgreSQL

```bash
# Connect to PostgreSQL
docker exec -it crms-postgres psql -U crms_user -d crms_db

# Common queries
SELECT * FROM users;
SELECT * FROM routines;
SELECT * FROM conflicts;
SELECT * FROM audit_logs;
```

### Redis

```bash
# Connect to Redis
docker exec -it crms-redis redis-cli

# Common commands
KEYS *
GET routine:123
FLUSHALL  # Clear all cache
```

## Monitoring

### Health Check

```bash
curl http://localhost:8080/actuator/health
```

### Metrics

```bash
curl http://localhost:8080/actuator/metrics
```

### Prometheus Metrics

```bash
curl http://localhost:8080/actuator/prometheus
```

## Logs

### View Application Logs

```bash
# Docker Compose
docker-compose logs -f crms-api

# Local development
# Logs appear in console
```

### View Database Logs

```bash
docker-compose logs -f postgres
```

### View Redis Logs

```bash
docker-compose logs -f redis
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Troubleshooting

### Docker Build Fails

If you encounter Docker build errors like `mvn clean package` failing inside Docker:

**Solution 1 (Recommended): Build Locally First**
```bash
# Build the JAR on your machine
mvn clean package -DskipTests

# Then start Docker Compose (uses pre-built JAR)
docker-compose up -d
```

**Solution 2: Use Simplified Dockerfile**
```bash
# Build with simplified Dockerfile (no Maven inside Docker)
docker build -t crms-api:latest -f crms-api/Dockerfile.prebuilt .
docker-compose up -d
```

**Solution 3: Increase Docker Memory**
- Docker Desktop → Preferences → Resources → Memory (set to 4GB+)
- Then try: `docker-compose up -d --build`

**Solution 4: Clear Maven Cache**
```bash
rm -rf ~/.m2/repository
mvn clean package -DskipTests
docker-compose up -d
```

For more detailed troubleshooting, see `BUILD_GUIDE.md`.

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Redis Connection Error

```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
docker exec crms-redis redis-cli ping

# Restart Redis
docker-compose restart redis
```

### Build Script Issues

```bash
# Linux/Mac: Make script executable
chmod +x build.sh

# View available commands
./build.sh help      # Linux/Mac
build.bat help       # Windows

# Clean and rebuild
./build.sh clean     # Linux/Mac
build.bat clean      # Windows
```

## Default Credentials

For local development, the following default users are available:

| Email | Password | Role |
|-------|----------|------|
| admin@crms.edu | password123 | ADMIN |
| planner@crms.edu | password123 | ACADEMIC_PLANNER |
| faculty@crms.edu | password123 | FACULTY |
| student@crms.edu | password123 | STUDENT |

**Note**: Change these credentials in production!

## API Documentation

Access the interactive API documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Next Steps

1. **Explore the API**: Visit http://localhost:8080/swagger-ui.html
2. **Read the Documentation**: See IMPLEMENTATION.md for detailed guide
3. **Run Tests**: `mvn test`
4. **Deploy to Kubernetes**: See k8s/ directory

## Support

For issues or questions:
1. Check IMPLEMENTATION.md for detailed documentation
2. Review logs: `docker-compose logs`
3. Create an issue in the repository

## Quick Reference

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start all services |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View logs |
| `mvn clean install` | Build project |
| `mvn test` | Run tests |
| `mvn spring-boot:run` | Run application |
| `curl http://localhost:8080/actuator/health` | Check health |

Enjoy using the Class Routine Management System! 🚀
