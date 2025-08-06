FROM python:3.11-slim

WORKDIR /app

# Install basic system dependencies
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy app code
COPY . .

# Install Python packages
RUN pip install --upgrade pip && pip install Flask==3.0.0

EXPOSE 3001

CMD ["python", "main.py"]