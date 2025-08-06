FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for GPIO libraries
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libffi-dev \
    libpigpio-dev \
    libatlas-base-dev \
    pigpio \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Optional: Enable pigpio daemon if you're using pigpio
# (Needs --privileged container to work inside)
# RUN systemctl enable pigpiod

# Expose any port your app uses
EXPOSE 3001

# Default command to run app
CMD ["python", "app.py"]