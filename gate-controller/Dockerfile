# Use the official Ubuntu 23.04 image
FROM ubuntu:23.04

# Install system dependencies
RUN apt update && apt install -y \
    python3-pip \
    python3-lgpio \
    python3-pigpio \
    python3-rpi.gpio \
    libgpiod2

# Install Python dependencies
RUN pip3 install gpiozero flask --break-system-packages

# Set the default command to run your application
CMD ["python3", "main.py"]