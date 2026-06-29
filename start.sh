#!/bin/sh
# Production startup: wait for DB, run migrations, start server.

echo "[startup] Running database migrations..."
MAX_RETRIES=12
RETRIES=0

until npx prisma migrate deploy; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "[startup] FATAL: Migrations failed after $MAX_RETRIES attempts. Check DATABASE_URL."
    exit 1
  fi
  echo "[startup] Migration attempt $RETRIES/$MAX_RETRIES failed. Retrying in 5 seconds..."
  sleep 5
done

echo "[startup] Migrations complete. Starting server on PORT=${PORT:-3000}..."
exec node_modules/.bin/react-router-serve ./build/server/index.js
