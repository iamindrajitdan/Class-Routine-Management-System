# Build stage
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the parent pom.xml
COPY pom.xml .

# Copy the api module pom.xml
COPY crms-api/pom.xml crms-api/

# Download dependencies for the api module
RUN mvn dependency:go-offline -pl crms-api -am

# Copy the source code
COPY crms-api/src crms-api/src

# Build the api module
RUN mvn package -DskipTests -pl crms-api -am

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Note: maven will have built it into crms-api/target/
COPY --from=build /app/crms-api/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
