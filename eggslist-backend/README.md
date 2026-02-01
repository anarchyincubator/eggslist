# Eggslist Backend

Django REST Framework backend for Eggslist, a virtual farmer's market connecting local farmers and gardeners with consumers. It provides API endpoints for user authentication, product catalog with geographic filtering (PostGIS), blog content, seller verification, Stripe payments, and more.

## Local Development with Docker

The recommended way to run the backend locally is with Docker Compose from the **repository root**:

```bash
docker-compose up --build
```

This starts all required services:
- **Backend** (Django) with GDAL and all dependencies
- **PostgreSQL + PostGIS** database
- **Redis** for caching and sessions

Create a `.env` file in the repository root with the environment variables listed below. At minimum you need `SECRET_KEY` and `ENVIRONMENT=local`. The Docker Compose setup provides default database and Redis connectivity, so those can often be omitted for local dev.

The Docker image uses a multi-stage build with a non-root user. No `.env` file is baked into the image.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ENVIRONMENT` | Yes | `local`, `development`, or `prod`. Controls which settings module is loaded. |
| `SECRET_KEY` | Yes | Django secret key. |
| `DEBUG` | No | Defaults to `True` for local, `False` for production. |
| `ALLOWED_HOSTS` | No | Comma-separated list of allowed hosts. |
| **Database** | | |
| `DB_NAME` | No | PostgreSQL database name. Has a default for local dev. |
| `DB_USER` | No | Database user. |
| `DB_PASSWORD` | No | Database password. |
| `DB_HOST` | No | Database host. Defaults to `localhost` (or the Docker service name). |
| `DB_PORT` | No | Database port. Defaults to `5432`. |
| **Redis** | | |
| `REDIS_URL` | No | Full Redis connection URL. Defaults to `redis://localhost:6379/0`. |
| **S3-Compatible Storage** | | |
| `USE_S3` | No | Set to `True` to enable S3 storage for static/media files. Disabled by default. |
| `AWS_ACCESS_KEY_ID` | No | S3 access key (works with DigitalOcean Spaces or AWS). |
| `AWS_SECRET_ACCESS_KEY` | No | S3 secret key. |
| `AWS_STORAGE_BUCKET_NAME` | No | Bucket name. |
| `AWS_S3_ENDPOINT_URL` | No | Custom endpoint URL (for non-AWS providers like DigitalOcean Spaces). |
| `AWS_S3_CUSTOM_DOMAIN` | No | Custom domain for serving files (e.g., CDN). |
| **Stripe** | | |
| `STRIPE_SECRET_KEY` | No | Stripe API secret key. |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook endpoint signing secret. |
| **Sentry** | | |
| `SENTRY_DSN` | No | Sentry DSN for error tracking. |
| **Email** | | |
| `EMAIL_HOST` | No | SMTP host. |
| `EMAIL_PORT` | No | SMTP port. |
| `EMAIL_HOST_USER` | No | SMTP username. |
| `EMAIL_HOST_PASSWORD` | No | SMTP password. |
| **OAuth** | | |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret. |
| `FACEBOOK_CLIENT_ID` | No | Facebook OAuth client ID. |
| `FACEBOOK_CLIENT_SECRET` | No | Facebook OAuth client secret. |

**Optional integrations** -- Stripe, Sentry, email, OAuth, and S3 storage all degrade gracefully when their respective environment variables are not configured. You do not need any of them for basic local development.

## Running Without Docker

### Prerequisites

- Python 3.9+
- PostgreSQL with the PostGIS extension
- GDAL library installed on your system (see the [Django GIS install guide](https://docs.djangoproject.com/en/4.1/ref/contrib/gis/install/)). On macOS with Homebrew you may need to set library paths in your local settings:
  ```python
  GDAL_LIBRARY_PATH = '/opt/homebrew/opt/gdal/lib/libgdal.dylib'
  GEOS_LIBRARY_PATH = '/opt/homebrew/opt/geos/lib/libgeos_c.dylib'
  ```
- Redis

### Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Create `app/settings/local.py` by copying `app/settings/local-example.py`. This file should include:

```python
SESSION_COOKIE_DOMAIN = "127.0.0.1"  # or "localhost"
```

## Common Commands

```bash
# Run development server
python manage.py runserver

# Create and apply database migrations
python manage.py makemigrations
python manage.py migrate

# Code formatting (configured for 99-char line length)
black .
isort .
flake8 .

# Run tests
python manage.py test
```

Install [pre-commit](https://pre-commit.com/#install) to have `isort` and `black` run automatically on each commit.

## Settings System

Settings are in `app/settings/` with the following structure:

- `base.py` -- Shared settings for all environments.
- `development.py` -- Development server settings (extends base).
- `production.py` -- Production settings (extends base).
- `local.py` -- Your local overrides (not committed to git). Copy from `local-example.py`.

The `ENVIRONMENT` environment variable (`local`, `development`, or `prod`) determines which settings module is loaded.

## Contribution

- Pull requests should target the **development** branch.
- The **production** branch is updated only via PR from **development**.
- Commit format: `Keyword: #issue -- message` (or `Keyword: message` if no issue). Keywords: `Feat`, `Fix`, `Refactor`, `Chore`, `Test`. Subject line max 50 characters, body lines max 80 characters.
- Production merge commits: `Release Month Day: message`.
