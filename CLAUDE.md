# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eggslist is a virtual farmer's market web application connecting local farmers/gardeners with consumers. It's a full-stack app with a Django REST API backend and a Nuxt.js (Vue 2) frontend, organized as two independent subdirectories:

- `eggslist-backend/` — Python/Django REST Framework API
- `eggslist-frontend/` — Nuxt.js 2 (Vue 2) SPA (SSR disabled, static target)

## Common Commands

### Docker (primary workflow, from repo root)

```bash
make setup           # Interactive first-boot: creates .env, starts stack, waits for health
make up              # Build and start all services (foreground)
make down            # Stop all services
make clean           # Stop all services and delete volumes (full reset)
make logs            # Tail logs from all services
make migrate         # Run Django migrations in the running backend container
make makemigrations  # Generate new migration files
make test            # Run backend test suite
make shell           # Django shell in backend container
make bash            # Bash shell in backend container
make lint            # Run black, isort, flake8 checks
make format          # Auto-format backend code with black and isort
make frontend-shell  # Shell in frontend container
```

### Backend (`eggslist-backend/`, without Docker)

```bash
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
black .
isort .
flake8 .
python manage.py test
```

### Frontend (`eggslist-frontend/`, without Docker)

```bash
npm install
npm run dev          # Dev server at localhost:3000
npm run build        # Production build
npm run generate     # Static site generation
npm run lint         # ESLint check
npm run lintfix      # ESLint auto-fix
npm run lint:style   # StyleLint CSS/SCSS
```

## Architecture

### Backend

**Settings system:** `app/settings/` contains `base.py`, `development.py`, `production.py`. Local dev uses `local.py` (copied from `local-example.py`). The `ENVIRONMENT` env var (`local`/`development`/`prod`) selects which settings module loads.

**Django apps** under `eggslist/`:
- **users** — Registration, JWT + social auth (Google/Facebook), seller verification workflow, Stripe Connect integration
- **store** — Product catalog with geographic filtering (PostGIS), categories, transactions, engagement tracking, sale statistics
- **blogs** — Blog articles with CKEditor rich text
- **site_configuration** — Geographic location hierarchy (country → state → city → zip code with PostGIS points), FAQs, team members, testimonials
- **utils** — Shared utilities: Stripe payment helpers, social auth, email sending, code generation/verification, Redis-based user location caching, API view mixins, pagination, model mixins (`NameSlugModel`, `TitleSlugModel`)

**API patterns:** Each app has an `api/` subdirectory with views, serializers, and URL configs. All API routes are under `/api/`. JWT authentication via `djangorestframework-simplejwt`. Custom permissions like `IsVerifiedSeller`. Filtering via `django-filter`.

**Key infrastructure:** PostgreSQL + PostGIS, Redis for caching/sessions, DigitalOcean Spaces (S3-compatible) for media/static, Stripe for payments, Sentry for error tracking.

### Frontend

**Routing:** File-based via Nuxt (`pages/` directory). Key routes: `/catalog/`, `/catalog/product`, `/product/` (management), `/profile/`, `/blogs/`, `/social/` (OAuth callbacks).

**State management (Vuex):** `store/` directory — `auth.js` (tokens, login/register), `user.js` (profile), `products.js` (catalog/filters), `seller.js` (seller dashboard), `categories.js`, `blog.js`, `quotes.js` (inquiries), `index.js` (global: window size, cities, location, auth modal visibility).

**API communication:** Axios with `BACKEND_URL` env var as base URL. Cookies for location data, localStorage for tokens.

**Styling:** SCSS with global variables (`variables.scss`), responsive breakpoints (`responsive.scss`), and helpers (`helpers.scss`) auto-injected via `@nuxtjs/style-resources`.

## Code Style

### Backend
- **Line length:** 99 characters (black, isort, flake8 all configured to this)
- **Formatter:** black (configured in `pyproject.toml`, excludes migrations)
- **Import sorting:** isort (configured in `.isort.cfg`)
- **Pre-commit hooks:** Install pre-commit, then hooks run isort + black on each commit

### Frontend
- **Linter:** ESLint with Vue recommended + Prettier + Nuxt rules

## Commit Message Convention

Format: `Keyword: #issue -- message` (or `Keyword: message` if no issue)

Keywords: `Feat`, `Fix`, `Refactor`, `Chore`, `Test`

Subject line ≤ 50 chars. Body lines ≤ 80 chars.

Examples: `Feat: #24 -- Implement Google and Facebook auth`, `Fix: Location Cookie Mechanics`

## Branch Strategy

- PRs target **development** branch
- **production** branch updated only via PR from development
- Production commits: `Release Month Day: message`

## Environment Setup

**Docker (recommended):** Run `make setup` from the repo root. It prompts for admin credentials, generates `eggslist-backend/.env` from `.env.example`, and brings up all services. The backend entrypoint automatically runs migrations, `collectstatic`, and starts Gunicorn. First boot is slow (~5 min) due to the GIS zip code data migration.

**Without Docker:** Backend requires GDAL library, PostgreSQL with PostGIS, Redis, `.env` file (see `.env.example`), and `app/settings/local.py` (copy from `local-example.py`). Frontend requires `BACKEND_URL` env var pointing to the API server.

## Key Migration Notes

- `users/migrations/0009_create_superuser.py` — Creates an admin user from `DJANGO_SUPERUSER_EMAIL`/`DJANGO_SUPERUSER_PASSWORD` env vars. Idempotent: skips if vars are empty or user already exists.
- `site_configuration/migrations/0002_add_locations.py` and `0009_readd_locations.py` — Load ~40k US zip codes with PostGIS coordinates from a bundled CSV. This is the slow part of first boot.
