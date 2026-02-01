# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eggslist is a virtual farmer's market web application connecting local farmers/gardeners with consumers. It's a full-stack app with a Django REST API backend and a Nuxt.js (Vue 2) frontend, organized as two independent subdirectories:

- `eggslist-backend/` — Python/Django REST Framework API
- `eggslist-frontend/` — Nuxt.js 2 (Vue 2) SPA (SSR disabled, static target)

## Common Commands

### Backend (`eggslist-backend/`)

```bash
# Run development server
python manage.py runserver

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Formatting and linting (pre-commit hooks run isort + black automatically)
black .
isort .
flake8 .

# Run tests
python manage.py test
```

### Frontend (`eggslist-frontend/`)

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

Backend requires: GDAL library, PostgreSQL with PostGIS, Redis, `.env` file (see backend README for required vars), `app/settings/local.py` (copy from `local-example.py`).

Frontend requires: `BACKEND_URL` env var pointing to the API server.
