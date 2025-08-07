#!/bin/bash

# AI Service Setup Script

echo "🤖 Setting up AI License Plate Recognition Service..."

# Check if model files exist
if [ ! -f "lpd-edgetpu.tflite" ]; then
    echo "❌ Missing lpd-edgetpu.tflite model file"
    echo "Please place the license plate detection model in the ai/ directory"
    exit 1
fi

if [ ! -f "lpc-edgetpu.tflite" ]; then
    echo "❌ Missing lpc-edgetpu.tflite model file"
    echo "Please place the license plate character recognition model in the ai/ directory"
    exit 1
fi

echo "✅ Model files found"

# Check network connectivity for RTSP cameras
echo "📡 Checking network connectivity for camera streams..."
if ping -c 1 109.164.15.139 >/dev/null 2>&1; then
    echo "✅ Camera network is reachable"
else
    echo "⚠️ Camera network is not reachable - check network configuration"
fi

echo "🐳 Building Docker container..."
docker-compose build ai

if [ $? -eq 0 ]; then
    echo "✅ Docker container built successfully"
    echo "🚀 Starting AI service..."
    docker-compose up ai
else
    echo "❌ Failed to build Docker container"
    exit 1
fi
