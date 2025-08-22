#!/bin/bash
set -e

echo "Running migrations..."
poetry run python manage.py migrate --noinput

echo "Collecting static files..."
poetry run python manage.py collectstatic --noinput

exec "$@"
