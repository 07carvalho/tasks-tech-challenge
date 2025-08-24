FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    gcc \
    python3-dev \
    pkg-config \
    tk \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel virtualenv
RUN pip install poetry
RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock /code/

RUN poetry install --no-interaction --no-ansi --no-root

EXPOSE 8000

COPY docker-entrypoint.sh /code/docker-entrypoint.sh
RUN chmod +x /code/docker-entrypoint.sh

ENTRYPOINT ["/code/docker-entrypoint.sh"]

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
