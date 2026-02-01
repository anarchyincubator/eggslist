# Eggslist

A virtual farmer's market web application that connects local farmers and gardeners directly with consumers. Browse and list produce, eggs, honey, and other homegrown goods filtered by your geographic location.

## Project Goals

- **Local-first commerce** -- Help small-scale farmers and gardeners sell directly to people in their area, cutting out middlemen.
- **Geographic discovery** -- Surface products near the buyer using PostGIS-powered location filtering so every search feels like visiting a neighborhood market.
- **Seller verification** -- Build trust through a verification workflow that confirms sellers are real, local growers.
- **Low barrier to entry** -- Sellers can list products in minutes; buyers can browse without an account.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.9+, Django REST Framework, PostgreSQL + PostGIS, Redis |
| Frontend | Nuxt.js 2 (Vue 2), SCSS, Axios |
| Payments | Stripe Connect |
| Auth | JWT + Google/Facebook OAuth |
| Infrastructure | Docker Compose, Nginx, Gunicorn |

## Repository Structure

```
eggslist/
├── eggslist-backend/    # Django REST API
├── eggslist-frontend/   # Nuxt.js SPA (static target)
├── docker-compose.yml   # Full-stack local environment
├── Makefile             # Convenience commands
└── setup.sh             # Interactive first-boot setup
```

## Quick Start

> **Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) must be installed.

### One-command setup

```bash
git clone <repo-url> eggslist
cd eggslist
make setup
```

`make setup` will:

1. Prompt you for an **admin email** and **password**.
2. Generate a random `SECRET_KEY`.
3. Create `eggslist-backend/.env` with all required values.
4. Build and start every service in Docker.
5. Run database migrations, collect static files, and load US geographic data.
6. Wait for the backend health check, then print the URLs.

> **Note:** The first boot takes several minutes. The backend loads ~40k US zip codes
> with PostGIS coordinates during its initial migration. The setup script polls until
> the backend is healthy (up to 10 minutes). You can watch progress with
> `docker compose logs -f backend` in another terminal.

Once it finishes:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/ |
| Admin panel | http://localhost:8000/admin/ |

Log into the admin panel with the email and password you provided during setup.

### Manual setup (without the wizard)

If you prefer to configure things yourself:

```bash
# 1. Copy the example env file and fill in values
cp eggslist-backend/.env.example eggslist-backend/.env
#    Edit .env — at minimum set SECRET_KEY
#    Optionally set DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD
#    to have an admin account created automatically during migration

# 2. Start the stack
make up
```

See [`eggslist-backend/.env.example`](eggslist-backend/.env.example) for the full list of available environment variables.

### What happens on startup

Every time the backend container starts, the entrypoint script automatically:

1. **Runs migrations** -- applies any pending database schema changes and data migrations.
2. **Collects static files** -- gathers Django admin CSS/JS so the admin panel renders correctly.
3. **Starts Gunicorn** -- serves the API on port 8000.

No manual steps are needed after the initial `make setup`.

### Starting over

To wipe everything (database, volumes, containers) and start fresh:

```bash
make clean          # removes containers and volumes
rm eggslist-backend/.env   # optional: remove .env to re-run the setup wizard
make setup          # re-prompts for credentials, rebuilds everything
```

## Makefile Commands

All commands are run from the repository root.

| Command | Description |
|---------|-------------|
| `make setup` | Interactive first-boot setup (creates `.env`, starts stack) |
| `make up` | Build and start all services (foreground) |
| `make down` | Stop all services |
| `make clean` | Stop all services **and delete volumes** (full reset) |
| `make logs` | Tail logs from all services |
| `make migrate` | Run Django database migrations |
| `make makemigrations` | Generate new migration files |
| `make test` | Run backend test suite |
| `make shell` | Open a Django shell in the backend container |
| `make bash` | Open a bash shell in the backend container |
| `make lint` | Run black, isort, and flake8 checks |
| `make format` | Auto-format backend code with black and isort |
| `make frontend-shell` | Open a shell in the frontend container |

## Development Without Docker

### Backend

Requires Python 3.9+, PostgreSQL with PostGIS, the GDAL system library, and Redis.

```bash
cd eggslist-backend
pip install -r requirements.txt
cp app/settings/local-example.py app/settings/local.py
# Edit local.py as needed (GDAL paths, cookie domain, etc.)
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver
```

> **macOS note:** If you install GDAL via Homebrew, you may need to set library paths in
> `app/settings/local.py`:
> ```python
> GDAL_LIBRARY_PATH = '/opt/homebrew/opt/gdal/lib/libgdal.dylib'
> GEOS_LIBRARY_PATH = '/opt/homebrew/opt/geos/lib/libgeos_c.dylib'
> ```

### Frontend

Requires Node.js and npm.

```bash
cd eggslist-frontend
npm install
BACKEND_URL=http://localhost:8000/api npm run dev
```

The dev server runs at http://localhost:3000 with hot reload.

## Contributing

- Pull requests target the **development** branch.
- The **production** branch is updated only via PR from development.
- Commit format: `Keyword: #issue -- message` (or `Keyword: message` if no issue).
  Keywords: `Feat`, `Fix`, `Refactor`, `Chore`, `Test`.
- Install [pre-commit](https://pre-commit.com/) to auto-run `isort` and `black` on each commit.

## License

All rights reserved.
