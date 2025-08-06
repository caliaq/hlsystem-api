#!/bin/bash

echo "🔧 Rebuilding AI Docker container with network fixes..."

# Navigate to project directory
cd /Users/e.japrrr/Developer/lom/api

# Stop the current ai container
echo "⏹️  Stopping current AI container..."
docker-compose stop ai

# Rebuild the AI service
echo "🔨 Rebuilding AI service..."
docker-compose build --no-cache ai

# Start the AI service
echo "🚀 Starting AI service..."
docker-compose up ai

echo "✅ Done! Monitor the logs to see if camera connection improves."
