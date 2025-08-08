FROM python:3.10-slim

RUN apt-get update && \
    apt-get install -y gpiod libgpiod-dev python3-libgpiod && \
    pip install flask && \
    pip install requests

WORKDIR /app
COPY . /app

CMD ["python", "main.py"]