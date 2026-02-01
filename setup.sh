#!/usr/bin/env bash
# Interactive first-boot setup for Eggslist.
# Prompts for admin credentials, generates .env, and starts the stack.

set -euo pipefail

ENV_FILE="eggslist-backend/.env"
ENV_EXAMPLE="eggslist-backend/.env.example"
SKIP_SETUP=false

# ── Check for existing .env ──────────────────────────────────────────
if [ -f "$ENV_FILE" ]; then
    printf "\n%s already exists.\n" "$ENV_FILE"
    read -rp "Overwrite and reconfigure? [y/N] " answer
    case "$answer" in
        [yY]|[yY][eE][sS]) ;;
        *)
            echo "Keeping existing .env. Starting the stack..."
            docker compose up --build -d
            SKIP_SETUP=true
            ;;
    esac
fi

if [ "$SKIP_SETUP" = false ]; then

    # ── Collect admin credentials ────────────────────────────────────
    printf "\n=== Eggslist First-Boot Setup ===\n\n"

    while true; do
        read -rp "Admin email: " ADMIN_EMAIL
        if [ -n "$ADMIN_EMAIL" ]; then break; fi
        echo "Email is required."
    done

    while true; do
        read -srp "Admin password: " ADMIN_PASSWORD
        echo
        if [ -n "$ADMIN_PASSWORD" ]; then break; fi
        echo "Password is required."
    done

    # ── Generate SECRET_KEY ──────────────────────────────────────────
    SECRET_KEY=$(python3 -c "
import secrets, string
chars = string.ascii_letters + string.digits + string.punctuation
print(''.join(secrets.choice(chars) for _ in range(50)))
" 2>/dev/null || openssl rand -base64 48)

    # ── Write .env from example ──────────────────────────────────────
    if [ ! -f "$ENV_EXAMPLE" ]; then
        echo "Error: $ENV_EXAMPLE not found." >&2
        exit 1
    fi

    cp "$ENV_EXAMPLE" "$ENV_FILE"

    # Helper: replace a KEY=value line in .env (handles special chars in value)
    set_env() {
        local key="$1" value="$2"
        if grep -q "^${key}=" "$ENV_FILE"; then
            # Use awk to avoid sed delimiter issues with special chars
            awk -v k="$key" -v v="$value" 'BEGIN{FS=OFS="="} $1==k{$0=k"="v} 1' \
                "$ENV_FILE" > "${ENV_FILE}.tmp" && mv "${ENV_FILE}.tmp" "$ENV_FILE"
        else
            echo "${key}=${value}" >> "$ENV_FILE"
        fi
    }

    set_env "SECRET_KEY" "$SECRET_KEY"
    set_env "DJANGO_SUPERUSER_EMAIL" "$ADMIN_EMAIL"
    set_env "DJANGO_SUPERUSER_PASSWORD" "$ADMIN_PASSWORD"

    printf "\n.env written to %s\n" "$ENV_FILE"

    # ── Start the stack ──────────────────────────────────────────────
    printf "\nStarting containers...\n"
    docker compose up --build -d

fi

# ── Wait for backend health check ───────────────────────────────────
HEALTH_URL="http://localhost:8000/api/health/"
MAX_ATTEMPTS=300
ATTEMPT=0

printf "Waiting for backend to be ready "
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
        printf " done!\n"
        printf "\n=== Eggslist is running! ===\n"
        printf "  Frontend : http://localhost:3000\n"
        printf "  Backend  : http://localhost:8000\n"
        printf "  Admin    : http://localhost:8000/admin/\n\n"
        exit 0
    fi
    printf "."
    sleep 2
    ATTEMPT=$((ATTEMPT + 1))
done

printf " timed out.\n"
echo "Backend did not become healthy in $((MAX_ATTEMPTS * 2))s."
echo "Check logs with: docker compose logs backend"
exit 1
