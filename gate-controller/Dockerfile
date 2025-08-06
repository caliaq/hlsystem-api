FROM ubuntu:23.04

RUN apt update && apt install -y python3-pip python3-lgpio python3-pigpio python3-rpi.gpio
RUN pip3 install gpiozero --break-system-packages

CMD ["python3", "main.py"]