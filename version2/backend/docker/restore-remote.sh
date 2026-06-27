#!/bin/bash
set -e

BACKUP_FILE="/restore/Webgis_QuyNhon.backup"

echo "=== Remote database restore ==="
echo "Target: $PGHOST:$PGPORT/$PGDATABASE"

# Wait for database to be ready
for i in $(seq 1 30); do
  if pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" 2>/dev/null; then
    echo "Database is ready"
    break
  fi
  echo "Waiting for database... ($i/30)"
  sleep 2
done

# Create required extensions
PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -c "CREATE EXTENSION IF NOT EXISTS unaccent;"
PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -c "CREATE EXTENSION IF NOT EXISTS postgis;"
PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
  -c "CREATE EXTENSION IF NOT EXISTS pgrouting;"

# Restore
PGPASSWORD="$PGPASSWORD" pg_restore \
  --no-owner \
  --no-privileges \
  --host="$PGHOST" \
  --port="$PGPORT" \
  --username="$PGUSER" \
  --dbname="$PGDATABASE" \
  "$BACKUP_FILE" || true

echo "=== Restore complete ==="
