# Django project

## Development

### Local development installation

Go inside `backend` directory to install the Django project

#### Using Poetry

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

#### Running tests

- Run tests: `python manage.py test`

## Linters with pre-commit

Pre-commit is a tool that runs checks on your code before allowing a commit to be created. This helps catch issues early and maintains code quality standards across the project.

### Installation

After install the package `pre-commit`, install the pre-commit hooks into your git repository:

> pre-commit install

### Usage

#### Running on all files

To run pre-commit checks on all files in the repository:

> pre-commit run --all-files

#### Running on Staged Files Only

By default, pre-commit runs only on staged files when you try to commit. To manually run on staged files:

> pre-commit run

#### Common comands

- Install hooks: `pre-commit install`
- Update hooks: `pre-commit autoupdate`
- List hooks: `pre-commit list`
- Clean cache: `pre-commit clean`
- Run specific hook: `pre-commit run <hook_id>`
