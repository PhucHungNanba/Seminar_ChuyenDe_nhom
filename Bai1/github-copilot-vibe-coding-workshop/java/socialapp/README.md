# Spring Boot Social App

A Spring Boot application scaffolded with the following specifications:

## Project Details

- **Package Name**: `com.contoso.socialapp`
- **Artifact ID**: `socialapp`
- **Group ID**: `com.contoso`
- **Package Type**: `jar`
- **Java Version**: 25 (OpenJDK)
- **Spring Boot Version**: 3.5.0
- **Build Tool**: Gradle 8.14.4

## Dependencies

- **Spring Web**: RESTful web services support
- **Spring Boot Actuator**: Production-ready monitoring and management
- **Lombok**: Boilerplate code reduction

## Configuration

- **Server Port**: 8080
- **CORS**: Enabled for all origins (configured in `SocialappApplication.java`)

## Building the Application

```bash
.\gradlew.bat build
```

Build artifacts are generated in `build/libs/`:
- `socialapp-0.0.1-SNAPSHOT.jar` (executable JAR, ~23 MB)
- `socialapp-0.0.1-SNAPSHOT-plain.jar` (plain JAR)

## Running the Application

```bash
.\gradlew.bat bootRun
```

The application will start on `http://localhost:8080`

## Available Endpoints

### Health Check
- **URL**: `http://localhost:8080/actuator/health`
- **Method**: GET
- **Response**: `{"status":"UP"}`

### Actuator
- **URL**: `http://localhost:8080/actuator`
- **Method**: GET
- **Description**: Lists all available actuator endpoints

### Custom Status
- **URL**: `http://localhost:8080/api/status`
- **Method**: GET
- **Response**:
```json
{
  "status": "running",
  "message": "Spring Boot Social App is running successfully",
  "port": 8080,
  "cors": "enabled for all origins"
}
```

## Project Structure

```
socialapp/
├── src/
│   ├── main/
│   │   ├── java/com/contoso/socialapp/
│   │   │   ├── SocialappApplication.java (Main application with CORS config)
│   │   │   └── controller/
│   │   │       └── HealthController.java (REST API controller)
│   │   └── resources/
│   │       └── application.properties (Configuration)
│   └── test/
│       └── java/com/contoso/socialapp/
│           └── SocialappApplicationTests.java
├── build.gradle (Gradle build configuration)
└── gradlew.bat (Gradle wrapper for Windows)
```

## CORS Configuration

CORS is configured to allow requests from any origin with:
- All origins allowed (`*`)
- All headers allowed
- All HTTP methods allowed
- Credentials enabled

## Notes

- The application uses Java 25 (initially configured for Java 21, but updated to match the installed JDK)
- Spring Boot DevTools is not included, so manual restart is required after code changes
- Actuator endpoints are exposed under `/actuator` base path
