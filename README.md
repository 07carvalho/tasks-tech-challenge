# tasks-tech-challenge
Repo with backend and frontend services for a technical challenge

# backend

This a Django project running with Python 3.12 and Postgres database

## Development

### Local development installation

Go inside `backend` directory to install the Django project

#### Option 1:  Using Poetry (Recommended for Local Development)

Prerequisites
- Python 3.12
- Poetry installed (pip install poetry)
- Database with PostgreSQL

##### Installation Steps

Activate the virtual environment

> poetry shell

Install dependencies with Poetry

> poetry install

Set up environment variables

> cp .env.example .env

Go inside `server` and run the migrations

> python manage.py migrate

Then start the development server

> python manage.py runserver

Open your browser and navigate to [http://localhost:8000](http://localhost:8000)

#### Option 2: Using Docker Compose

Prerequisites:
- Docker installed
- Docker Compose installed

Build and start containers
> docker-compose up --build

Open your browser and navigate to [http://localhost:8000](http://localhost:8000)

Additional Docker Commands
- Stop containers: `docker-compose down`
- View logs: `docker-compose logs`
- Run specific commands: `docker-compose exec web <command>`
- Run tests: `docker-compose exec web python manage.py test`


### Linters with pre-commit

Pre-commit is a tool that runs checks on your code before allowing a commit to be created. This helps catch issues early and maintains code quality standards across the project.

#### Installation

After install the package `pre-commit`, install the pre-commit hooks into your git repository:

> pre-commit install

#### Usage

##### Running on all files

To run pre-commit checks on all files in the repository:

> pre-commit run --all-files

##### Running on Staged Files Only

By default, pre-commit runs only on staged files when you try to commit. To manually run on staged files:

> pre-commit run

##### Common comands

- Install hooks: `pre-commit install`
- Update hooks: `pre-commit autoupdate`
- List hooks: `pre-commit list`
- Clean cache: `pre-commit clean`
- Run specific hook: `pre-commit run <hook_id>`


# frontend

This a NextJS project.

## Deployment

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- Git

##### Installation Steps

Using npm

> npm intall

Configure the enviroments variables

> cp .env.local .env

Build the app

> npm build

Then start

> npm start

Open the app in yout browser in [http://localhost:3000](http://localhost:3000)
