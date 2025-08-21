#!/bin/bash
set -e

echo "Running migrations..."
poetry run python server/manage.py migrate --noinput

echo "Collecting static files..."
poetry run python server/manage.py collectstatic --noinput

exec "$@"
