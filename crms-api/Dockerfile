# Multi-stage build for Spring Boot application
# Requirements: 20.1 - Docker containerization

FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent POM
COPY pom.xml .
COPY crms-api/pom.xml crms-api/

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY crms-api/src crms-api/src

# Build application
RUN mvn clean package -DskipTests -pl crms-api -am

# Production stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S spring && adduser -S spring -u 1001

# Copy JAR from builder
COPY --from=builder /app/crms-api/target/*.jar app.jar

# Change ownership
RUN chown spring:spring app.jar

USER spring

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# JVM options for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"

# Start application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
