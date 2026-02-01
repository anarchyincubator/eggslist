FROM python:3.12-slim-bookworm as builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

FROM python:3.12-slim-bookworm

# Install GDAL/GIS runtime dependencies and curl for healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        binutils libproj-dev gdal-bin curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r app && useradd -r -g app -d /home/app -s /sbin/nologin app

ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir -p $APP_HOME/data/static $APP_HOME/data/media $HOME/data/static $HOME/data/media
WORKDIR $APP_HOME

# Install Python dependencies
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/* && rm -rf /wheels

# Copy project
COPY . $APP_HOME

# Fix entrypoint line endings and permissions
RUN sed -i 's/\r$//g' $APP_HOME/entrypoint.sh && \
    chmod +x $APP_HOME/entrypoint.sh && \
    chown -R app:app $APP_HOME && \
    chown -R app:app $HOME/data

USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

ENTRYPOINT ["./entrypoint.sh"]
