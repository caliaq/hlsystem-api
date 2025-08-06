FROM python:3.11-slim

# Install system dependencies including network tools
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libgomp1 \
    libgl1-mesa-glx \
    iputils-ping \
    telnet \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application
COPY . .

# Create directory for models if needed
RUN mkdir -p models

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV API_URL=http://api:8080
ENV OPENCV_FFMPEG_CAPTURE_OPTIONS="rtsp_transport;tcp"

# Expose port (optional, since this service doesn't serve HTTP)
EXPOSE 5000

# Command to run the application
CMD ["python", "start.py"]
