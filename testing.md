# Backend Security Upgrades — Testing Checklist

## Completed

- [x] Phase 1: Remove dead dependencies and update tooling
- [x] Phase 2: Django 4.0 → 4.2 migration
- [x] Phase 3: Upgrade non-Django dependencies
- [x] Phase 4: Python 3.12 / Bookworm Docker upgrade

## Testing Steps

### 1. Verify pip dependency resolution
Run a dry-run pip install to check that all updated packages in `requirements.txt` resolve without conflicts. No database needed.

### 2. Run docker-compose build
Build the Docker image with Python 3.12/Bookworm and verify it completes successfully.
```bash
docker-compose build
```

### 3. Run docker-compose up and verify services start
Start all services (backend, PostgreSQL+PostGIS, Redis) and verify they start cleanly.
```bash
docker-compose up
```

### 4. Run Django system checks and migrations check
Inside the running container:
```bash
docker-compose exec backend python manage.py check
docker-compose exec backend python manage.py migrate --check
```

### 5. Run Django test suite
Inside the running container:
```bash
docker-compose exec backend python manage.py test
```

### 6. Smoke test API endpoints
With services running, verify key endpoints respond:
- `GET /api/health/`
- `GET /api/store/products/`
- `GET /api/blogs/`
- Admin panel loads
- JWT auth works (login, token refresh)
- Geographic filtering works (PostGIS)
- Image upload via CKEditor works (if S3 configured)
