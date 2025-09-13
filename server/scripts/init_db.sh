#!/usr/bin/env bash
set -euo pipefail

# ===== Config (override via env vars or CLI args) =====
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_SUPERUSER="${DB_SUPERUSER:-postgres}"   # a user that can CREATE ROLE/DB
DB_NAME="${DB_NAME:-app}"
DB_USER="${DB_USER:-app}"
DB_PASSWORD="${DB_PASSWORD:-app}"
INIT_SQL="${1:-./001_init_v2.sql}"         # or pass path as first arg

echo "==> Using:"
echo "    host=$DB_HOST port=$DB_PORT superuser=$DB_SUPERUSER"
echo "    db=$DB_NAME user=$DB_USER init_sql=$INIT_SQL"

# ===== Preflight =====
command -v psql >/dev/null 2>&1 || { echo "ERROR: psql not found. Install PostgreSQL client."; exit 1; }
[ -f "$INIT_SQL" ] || { echo "ERROR: Init SQL not found at $INIT_SQL"; exit 1; }

# ===== Ensure role exists =====
echo "==> Ensuring role '$DB_USER' exists..."
ROLE_EXISTS=$(psql "host=$DB_HOST port=$DB_PORT user=$DB_SUPERUSER dbname=postgres" -Atqc \
  "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER';" || true)
if [[ "$ROLE_EXISTS" != "1" ]]; then
  psql "host=$DB_HOST port=$DB_PORT user=$DB_SUPERUSER dbname=postgres" -v ON_ERROR_STOP=1 -c \
    "CREATE ROLE \"$DB_USER\" LOGIN PASSWORD '$DB_PASSWORD';"
  echo "    Created role $DB_USER"
else
  echo "    Role $DB_USER already exists"
fi

# ===== Ensure database exists (owned by app role) =====
echo "==> Ensuring database '$DB_NAME' exists..."
DB_EXISTS=$(psql "host=$DB_HOST port=$DB_PORT user=$DB_SUPERUSER dbname=postgres" -Atqc \
  "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" || true)
if [[ "$DB_EXISTS" != "1" ]]; then
  psql "host=$DB_HOST port=$DB_PORT user=$DB_SUPERUSER dbname=postgres" -v ON_ERROR_STOP=1 -c \
    "CREATE DATABASE \"$DB_NAME\" WITH OWNER = \"$DB_USER\" ENCODING='UTF8' TEMPLATE=template0;"
  echo "    Created database $DB_NAME (owner $DB_USER)"
else
  echo "    Database $DB_NAME already exists"
fi

# ===== Apply init schema as the app user =====
echo "==> Applying init SQL..."
PGPASSWORD="$DB_PASSWORD" psql "host=$DB_HOST port=$DB_PORT user=$DB_USER dbname=$DB_NAME" \
  -v ON_ERROR_STOP=1 -f "$INIT_SQL"

# ===== Verify a few objects exist =====
echo "==> Verifying schema objects..."
PGPASSWORD="$DB_PASSWORD" psql "host=$DB_HOST port=$DB_PORT user=$DB_USER dbname=$DB_NAME" -Atqc \
  "SELECT 'ok' WHERE EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='app' AND tablename IN ('client','asset','beneficiary_designation'));" \
  | grep -q 'ok' && echo "    ✓ app.client / app.asset / app.beneficiary_designation present" || {
    echo "    ! Verification failed; check SQL output above."; exit 1; }

echo "==> Done. Database '$DB_NAME' is initialized."
