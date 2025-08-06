FROM ubuntu:22.04

RUN apt update &&  apt install -y python3-pip python3-lgpio python3-pigpio python3-rpi.gpio
RUN pip3 install gpiozero
RUN pip3 install flask

COPY "./main.py" "/app/main.py"
CMD ["python3", "/app/main.py"]