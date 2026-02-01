# Eggslist Modernization — TODO

## Goal

Eggslist is a virtual farmer's market (Django REST backend + Nuxt.js frontend) that was built as a working prototype with configuration and infrastructure shortcuts — secrets baked into Docker images, Redis bundled in the app container, hardcoded settings, no local dev orchestration, and aging dependencies. The app works, but the infrastructure isn't ready for reliable production operation or easy onboarding of new developers.

The goal of this modernization effort is to make the project **deployable, maintainable, and developer-friendly** without rewriting application logic. Specifically:

1. **12-factor configuration** — All settings come from environment variables with sensible defaults. The app starts and runs locally with zero mandatory external services (Stripe, Sentry, OAuth, S3 all degrade gracefully when unconfigured).
2. **Clean containerization** — One process per container, no root, no build-time secrets, no bundled infrastructure services. A single `docker-compose up` gives a developer a fully working local environment (PostGIS, Redis, backend).
3. **CI/CD that doesn't bake config** — The deploy pipeline builds a generic image and injects configuration at runtime via the hosting platform's env var system, not Docker build secrets.
4. **Current dependencies** — Address EOL runtimes and frameworks (Python 3.9, Django 4.0, Nuxt 2/Vue 2) to stay on supported versions with security patches.
5. **Documentation** — READMEs that let a new developer clone the repo and have it running locally without tribal knowledge.

Each task below is scoped so it can be planned and implemented independently. The "Completed" section shows what's already been done; "Remaining" lists what's left, in rough priority order.

## Completed

- [x] **Task 1-3: Settings refactor** — All settings driven by env vars with sensible defaults. Integrations (Sentry, Stripe, email, OAuth) are optional with graceful degradation. `USE_S3` toggle for storage, `REDIS_URL` configurable.
- [x] **Task 4: Update CI/CD workflow** — Deploy workflow no longer bakes `.env` into images. Uses modern `GITHUB_OUTPUT` syntax, correct Dockerfile path. Added parallel `build_frontend` job alongside `build_backend`, with `BACKEND_URL` and `OG_IMAGE_URL` passed as build args from secrets. Triggers on both backend and frontend path changes.
- [x] **Task 5: Frontend Dockerfile and deployment** — Multi-stage Dockerfile (node:18-alpine builder + nginx:stable-alpine server), `.dockerignore`, custom `nginx.conf` with SPA fallback (`200.html`), gzip, and static asset caching. Frontend service added to `docker-compose.yml` on port 3000.
- [x] **Task 6: Dockerfile and entrypoint rewrite** — Multi-stage build on Bullseye, non-root user, no baked-in `.env` or bundled Redis, conditional `collectstatic`, `.dockerignore`, `docker-compose.yml` for local dev.
- [x] **Task 7: Update backend README** — Rewritten with Docker setup, env var table (all optional integrations documented), non-Docker setup, common commands, and settings system overview.
- [x] **Task 8: Update frontend README** — Rewritten with Docker and non-Docker setup, env vars (`BACKEND_URL`, `OG_IMAGE_URL`), npm scripts, project structure, and standalone Docker build instructions.
- [x] **Task 9: Dependency audit** — Full audit written to `DEPENDENCY_AUDIT.md`. Critical: Pillow 9.0.1 (CVEs), Django 4.0.2 (EOL), Python 3.9 (EOL). Important: Vue 2/Nuxt 2 (EOL), outdated Stripe/Sentry SDKs. Phased upgrade strategy included.
- [x] **Task 10: Production hardening** — Health check endpoint at `/api/health/`, `HEALTHCHECK` in both Dockerfiles, `docker-compose.prod.yml` with restart policies and prod-like env, `ALLOWED_HOSTS`/`CORS_ORIGIN_ALLOW_ALL`/`CORS_ALLOWED_ORIGINS` made configurable via env vars.
- [x] **Task 11: Development experience** — `docker-compose.override.yml` with source mount and `manage.py runserver` for hot-reload, `Makefile` with targets for up/down/migrate/test/shell/lint/format/clean.

## Remaining

The dependency audit (`DEPENDENCY_AUDIT.md`) identified concrete upgrade work. Key next steps:

### Task 12: Backend security upgrades (critical)

- Upgrade Pillow 9.0.1 to 11.x (multiple critical CVEs)
- Upgrade Django 4.0.2 to 4.2 LTS (EOL since April 2023)
- Upgrade Python 3.9 to 3.12, Debian Bullseye to Bookworm in Dockerfile
- Update django-environ, sentry-sdk, stripe, and other outdated packages

### Task 13: Frontend migration to Nuxt 3 / Vue 3

- Vue 2 and Nuxt 2 reached EOL December 2023
- Migrate Vuex to Pinia, replace Vue 2-only plugins, move from Webpack 4 to Vite
- Substantial effort — see `DEPENDENCY_AUDIT.md` for details
