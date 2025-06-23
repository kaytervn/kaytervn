FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    ffmpeg \
    libsm6 \
    libxext6 \
    cron \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt requests

COPY src/ /app/

RUN mkdir -p /app/uploads /app/logs
RUN chmod +x /app/wake_service.py

RUN echo "*/10 * * * * /usr/local/bin/python /app/wake_service.py >> /app/logs/cron.log 2>&1" > /etc/cron.d/wake-service-cron \
    && chmod 0644 /etc/cron.d/wake-service-cron \
    && crontab /etc/cron.d/wake-service-cron

ENV UPLOAD_DIR=/app/uploads

RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'service cron start' >> /app/start.sh && \
    echo 'uvicorn main:app --host 0.0.0.0 --port 8000' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 8000

CMD ["/app/start.sh"]
