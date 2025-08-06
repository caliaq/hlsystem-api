FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (skip pigpio-related apt packages)
RUN apt-get update && apt-get install -y \
    gcc \
    make \
    python3-dev \
    libffi-dev \
    libatlas-base-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone and install pigpio from source
RUN git clone https://github.com/joan2937/pigpio.git \
    && cd pigpio \
    && make \
    && make install

# Copy app code
COPY . .

# Install Python packages
RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 3001

CMD ["python", "app.py"]