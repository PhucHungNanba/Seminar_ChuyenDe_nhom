# Multi-stage build for Java Social Media Application
# Stage 1: Build stage using Microsoft OpenJDK 21
FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu AS builder

# Set working directory
WORKDIR /workspace

# Copy Gradle wrapper and build files
COPY java/socialapp/gradlew java/socialapp/gradlew.bat ./
COPY java/socialapp/gradle ./gradle/
COPY java/socialapp/build.gradle java/socialapp/settings.gradle ./

# Make gradlew executable
RUN chmod +x gradlew

# Copy source code
COPY java/socialapp/src ./src/

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# Extract JRE from JDK for smaller runtime image
RUN $JAVA_HOME/bin/jlink \
    --add-modules ALL-MODULE-PATH \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /javaruntime

# Stage 2: Runtime stage with custom JRE
FROM ubuntu:22.04

# Install only curl for health check and create user in single layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r appuser && \
    useradd -r -g appuser -m appuser

# Copy the custom JRE from builder stage
COPY --from=builder /javaruntime /opt/java/openjdk

# Set environment variables
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Add Codespaces environment variables
ENV CODESPACE_NAME=""
ENV GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=""

# Create application directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Create SQLite database file and set proper permissions
RUN touch /app/sns_api.db && \
    chmod 664 /app/sns_api.db && \
    chown appuser:appuser /app/sns_api.db

# Change ownership of application directory
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port 8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Run the application with proper SQLite configuration
ENTRYPOINT ["java", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "-Xms256m", \
            "-Xmx512m", \
            "-jar", \
            "/app/app.jar"]
CMD ["--server.port=8080", \
     "--spring.datasource.url=jdbc:sqlite:/app/sns_api.db", \
     "--spring.jpa.hibernate.ddl-auto=create-drop", \
     "--spring.jpa.show-sql=false", \
     "--logging.level.org.springframework.web=INFO"]