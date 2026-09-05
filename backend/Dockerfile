# ==============================================================================
# NutriVision AI - Spring Boot Backend Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build JAR with Maven & Eclipse Temurin JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Runtime Image with Eclipse Temurin JRE 17
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user and uploads directory
RUN addgroup --system nutrivision && adduser --system --ingroup nutrivision nutrivision
RUN mkdir -p /app/uploads/assessments /app/uploads/temporary && chown -R nutrivision:nutrivision /app

COPY --from=build /app/target/nutrivision-backend-1.0.0.jar app.jar

USER nutrivision

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV APP_STORAGE_UPLOAD_DIR=/app/uploads/assessments

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
