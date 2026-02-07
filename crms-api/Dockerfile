# Multi-stage build for Spring Boot application
# Requirements: 20.1

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy all POM files
COPY pom.xml .
COPY crms-api/pom.xml crms-api/

# Copy source code
COPY crms-api/src crms-api/src

# Build application
RUN mvn clean package -DskipTests -pl crms-api -am

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy JAR from builder
COPY --from=builder /app/crms-api/target/crms-api-*.jar app.jar

# Create non-root user
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
