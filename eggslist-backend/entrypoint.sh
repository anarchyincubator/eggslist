#!/bin/sh
set -e

python manage.py migrate --noinput

# Only collect static when using S3 storage
if [ "$USE_S3" = "True" ]; then
    python manage.py collectstatic --noinput
fi

exec gunicorn wsgi:application \
    --workers "${GUNICORN_WORKERS:-2}" \
    --timeout "${GUNICORN_TIMEOUT:-600}" \
    --bind "0.0.0.0:${PORT:-8000}"
