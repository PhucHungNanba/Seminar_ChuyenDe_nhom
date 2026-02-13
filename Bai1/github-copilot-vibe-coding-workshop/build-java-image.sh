#!/bin/bash

# Build script for Java Social Media Application Docker Image
# Make sure Docker Desktop is running before executing this script

echo "🚀 Building Java Social Media Application Docker Image..."
echo "📍 Working directory: $(pwd)"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is available and running"

# Build the image
echo "🏗️  Building Docker image with tag 'socialapp-java:latest'..."
docker build -f Dockerfile.java -t socialapp-java:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "📊 Image details:"
    docker images socialapp-java:latest
    echo ""
    echo "🎯 To run the container:"
    echo "   docker run -p 8080:8080 socialapp-java:latest"
    echo ""
    echo "🌐 To run with Codespaces environment variables:"
    echo "   docker run -p 8080:8080 \\"
    echo "     -e CODESPACE_NAME=\"\$CODESPACE_NAME\" \\"
    echo "     -e GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=\"\$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN\" \\"
    echo "     socialapp-java:latest"
else
    echo "❌ Docker image build failed!"
    exit 1
fi