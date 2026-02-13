# 🔗 Application URLs Reference Guide

## ✅ Working Applications

### 🌐 Blazor Frontend (Social Media UI)
- **URL**: http://localhost:5062
- **Status**: ✅ Running
- **Description**: Interactive social media web application

### 🚀 Spring Boot API (Backend)
- **Base URL**: http://localhost:8080/api
- **Status**: ✅ Running  
- **Description**: RESTful API for social media functionality

## 📡 API Endpoints

### Core Endpoints
| Endpoint | URL | Description |
|----------|-----|-------------|
| **Root API** | http://localhost:8080/api/ | API information and endpoint list |
| **Posts** | http://localhost:8080/api/posts | Social media posts (GET, POST) |
| **Health Check** | http://localhost:8080/api/actuator/health | Application health status |

### Documentation
| Endpoint | URL | Description |
|----------|-----|-------------|
| **Swagger UI** | http://localhost:8080/api/swagger-ui.html | Interactive API documentation |
| **OpenAPI Docs** | http://localhost:8080/api/api-docs | Raw OpenAPI specification |

### Individual Posts
- **Get Post**: `GET http://localhost:8080/api/posts/{id}`
- **Like Post**: `POST http://localhost:8080/api/posts/{id}/like`
- **Unlike Post**: `DELETE http://localhost:8080/api/posts/{id}/like`
- **Add Comment**: `POST http://localhost:8080/api/posts/{id}/comments`

## 🔧 Fixed Issues

### ❌ Previous 404 Errors:
- `http://localhost:8080` → Missing context path
- `http://localhost:8080/actuator/health` → Missing /api prefix
- `http://localhost:8080/swagger-ui.html` → Missing /api prefix

### ✅ Corrections Applied:
- Added **Root Controller** for API information
- Fixed **context path configuration** (`/api` prefix required)
- Enabled **Actuator health endpoints** with proper configuration  
- Added **CORS configuration** for Blazor frontend integration
- Updated **Swagger/OpenAPI paths** to work with context path

## 🎯 Quick Access Commands

```powershell
# Test API Health
Invoke-RestMethod "http://localhost:8080/api/actuator/health"

# Get All Posts
Invoke-RestMethod "http://localhost:8080/api/posts"

# View API Documentation
Start-Process "http://localhost:8080/api/swagger-ui.html"

# Access Blazor App
Start-Process "http://localhost:5062"
```

## 💡 Notes
- All API endpoints require the `/api` prefix due to `server.servlet.context-path=/api`
- The Blazor frontend is correctly configured to use the API base URL
- CORS is enabled for cross-origin requests from the Blazor app
- SQLite database is automatically created and managed by the API