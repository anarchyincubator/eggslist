# Makefile for common Eggslist development operations.
# Wraps docker compose commands for convenience.

.PHONY: up down logs migrate makemigrations test shell bash lint format frontend-shell clean

up:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	docker compose exec backend python manage.py migrate

makemigrations:
	docker compose exec backend python manage.py makemigrations

test:
	docker compose exec backend python manage.py test

shell:
	docker compose exec backend python manage.py shell

bash:
	docker compose exec backend bash

lint:
	docker compose exec backend black --check .
	docker compose exec backend isort --check-only .
	docker compose exec backend flake8 .

format:
	docker compose exec backend black .
	docker compose exec backend isort .

frontend-shell:
	docker compose exec frontend sh

clean:
	docker compose down -v
