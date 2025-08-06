FROM python:3.10-slim

RUN apt-get update && \
    apt-get install -y gpiod libgpiod-dev python3-libgpiod && \
    pip install flask

WORKDIR /app
COPY . /app

CMD ["python", "main.py"]