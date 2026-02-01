#!/bin/sh
set -e

python manage.py migrate --noinput

python manage.py collectstatic --noinput

exec gunicorn wsgi:application \
    --workers "${GUNICORN_WORKERS:-2}" \
    --timeout "${GUNICORN_TIMEOUT:-600}" \
    --bind "0.0.0.0:${PORT:-8000}"
