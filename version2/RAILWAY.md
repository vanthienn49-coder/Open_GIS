# Railway Deployment

This project uses four Railway services:

- `webgis-db`: PostgreSQL 17 with PostGIS and pgRouting, initialized from the backup file.
- `webgis-api`: FastAPI backend.
- `webgis-frontend`: Vite build served by Caddy.
- `webgis-restore`: one-off database restore job; it exits after the initial import.

## Services Configuration

### 1. Database (`webgis-db`)

- **Dockerfile**: `backend/Dockerfile.database`
- **Volume**: Mount persistent volume at `/var/lib/postgresql/data`
- **Environment variables**:
  - `PGDATA=/var/lib/postgresql/data/pgdata`
  - `POSTGRES_DB=Webgis_QuyNhon`
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=<generate-secure-password>`

### 2. Backend API (`webgis-api`)

- **Dockerfile**: `backend/Dockerfile`
- **Root directory**: `backend/`
- **Environment variables**:
  - `DB_HOST=webgis-db.railway.internal`
  - `DB_PORT=5432`
  - `DB_NAME=Webgis_QuyNhon`
  - `DB_USER=postgres`
  - `DB_PASSWORD=<same-as-db>`
  - `ALLOWED_ORIGINS=https://<frontend-domain>`
  - `PORT=8000`
  - `LOCAL_ROUTE_MAX_SNAP_METERS=5000`
  - `ROUTING_API_URL=https://router.project-osrm.org`
  - `ROUTING_HTTP_TIMEOUT_SECONDS=30`

### 3. Frontend (`webgis-frontend`)

- **Dockerfile**: `frontend/Dockerfile`
- **Root directory**: `frontend/`
- **Build args**:
  - `VITE_API_URL=https://<backend-public-url>/api`
  - `VITE_GEOSERVER_URL=` (leave empty if no GeoServer)
- **Environment variables**:
  - `PORT=8080`

### 4. Database Restore (`webgis-restore`)

- **Dockerfile**: `backend/Dockerfile.restore`
- **Root directory**: `backend/`
- Only redeploy when you intentionally need to restore the database from backup.
- **Environment variables**:
  - `PGHOST=webgis-db.railway.internal`
  - `PGPORT=5432`
  - `PGDATABASE=Webgis_QuyNhon`
  - `PGUSER=postgres`
  - `PGPASSWORD=<same-as-db>`

## Deployment Order

1. Deploy `webgis-db` first and wait for it to be healthy.
2. Deploy `webgis-restore` to import the backup data.
3. Deploy `webgis-api` and verify `/health` returns `{"server": "ok", "database": "ok"}`.
4. Deploy `webgis-frontend` with the correct `VITE_API_URL` pointing to the backend's public URL.

## Notes

- `DB_PASSWORD` must be supplied through environment variables; no password is stored in source control.
- The frontend uses Caddy for static hosting with SPA routing support.
- CORS is configured via the `ALLOWED_ORIGINS` variable on the backend.
