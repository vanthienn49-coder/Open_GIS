#!/bin/bash
set -e

BACKUP_FILE="/docker-entrypoint-initdb.d/20-webgis.backup"

echo "=== Restoring WebGIS database from backup ==="

# Create the unaccent extension (required by search queries)
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS unaccent;"
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pgrouting;"

# Restore the backup
pg_restore \
  --no-owner \
  --no-privileges \
  --dbname="$POSTGRES_DB" \
  --username="$POSTGRES_USER" \
  "$BACKUP_FILE" || true

echo "=== Database restore complete ==="
