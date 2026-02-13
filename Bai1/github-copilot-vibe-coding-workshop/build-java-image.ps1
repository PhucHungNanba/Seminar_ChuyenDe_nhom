# PowerShell build script for Java Social Media Application Docker Image
# Make sure Docker Desktop is running before executing this script

Write-Host "🚀 Building Java Social Media Application Docker Image..." -ForegroundColor Green
Write-Host "📍 Working directory: $(Get-Location)" -ForegroundColor Cyan

# Check if Docker is available
try {
    $dockerVersion = docker --version 2>$null
    Write-Host "✅ Docker is available: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if Docker daemon is running
try {
    docker info 2>$null | Out-Null
    Write-Host "✅ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker daemon is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Build the image
Write-Host "🏗️  Building Docker image with tag 'socialapp-java:latest'..." -ForegroundColor Yellow
$buildResult = docker build -f Dockerfile.java -t socialapp-java:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Image details:" -ForegroundColor Cyan
    docker images socialapp-java:latest
    Write-Host ""
    Write-Host "🎯 To run the container:" -ForegroundColor Yellow
    Write-Host "   docker run -p 8080:8080 socialapp-java:latest" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 To run with Codespaces environment variables:" -ForegroundColor Yellow
    Write-Host "   docker run -p 8080:8080 ```" -ForegroundColor White
    Write-Host "     -e CODESPACE_NAME=`"`$env:CODESPACE_NAME`" ```" -ForegroundColor White
    Write-Host "     -e GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=`"`$env:GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN`" ```" -ForegroundColor White
    Write-Host "     socialapp-java:latest" -ForegroundColor White
} else {
    Write-Host "❌ Docker image build failed!" -ForegroundColor Red
    exit 1
}