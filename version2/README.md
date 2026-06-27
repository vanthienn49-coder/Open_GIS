# WebGIS Quy Nhơn

Hệ thống thông tin địa lý (GIS) tích hợp cho thành phố Quy Nhơn — hỗ trợ **tìm kiếm địa điểm**, **tìm đường đi ngắn nhất**, và **hiển thị bản đồ tương tác**.

---

## Kiến trúc tổng quan

```
OPEN_GIS/
├── backend/          ← FastAPI (Python) — REST API
│   ├── app.py                 # Entry point
│   ├── requirement.txt        # Python dependencies
│   ├── core/
│   │   ├── config.py          # Cấu hình (DB, CORS, Routing)
│   │   ├── database.py        # Kết nối PostgreSQL (psycopg2)
│   │   ├── exceptions.py      # Exception handlers
│   │   └── logging.py         # Structured logging
│   ├── routes/
│   │   ├── search.py          # /api/search, /api/categories, /api/search/category
│   │   └── routing.py         # /api/route
│   ├── services/
│   │   ├── search_service.py  # Business logic tìm kiếm
│   │   └── route_service.py   # Business logic tìm đường
│   ├── repositories/
│   │   ├── search_repository.py  # SQL queries tìm kiếm
│   │   └── route_repository.py   # SQL queries tìm đường (pgRouting)
│   ├── schemas/
│   │   ├── search.py          # Pydantic models cho search
│   │   └── route.py           # Pydantic models cho routing
│   ├── Webgis_QuyNhon.backup  # Database backup file
│   ├── Dockerfile             # Docker image cho backend
│   ├── Dockerfile.database    # Docker image cho PostgreSQL + PostGIS
│   └── Dockerfile.restore     # Docker image để restore database
│
├── frontend/         ← React + Vite — Giao diện người dùng
│   ├── index.html             # HTML entry point
│   ├── package.json           # Node.js dependencies & scripts
│   ├── vite.config.js         # Vite config (proxy /api → backend)
│   ├── .env                   # Biến môi trường (VITE_API_URL, VITE_GEOSERVER_URL)
│   ├── .env.example           # Mẫu file .env
│   ├── Caddyfile              # Caddy config cho production
│   ├── Dockerfile             # Docker image cho frontend
│   └── src/
│       ├── main.jsx           # React entry point
│       ├── App.jsx            # Router: / → HomePage, /map → MapPage
│       ├── pages/
│       │   ├── HomePage.jsx   # Trang chủ
│       │   └── MapPage.jsx    # Trang bản đồ chính
│       ├── components/
│       │   ├── MapView.jsx       # Bản đồ Leaflet
│       │   ├── SearchBox.jsx     # Ô tìm kiếm
│       │   ├── SearchResult.jsx  # Hiển thị kết quả
│       │   ├── RoutePanel.jsx    # Panel tìm đường
│       │   ├── CategoryFilter.jsx # Lọc theo danh mục
│       │   ├── LayerControl.jsx  # Điều khiển layer
│       │   ├── PlacePopup.jsx    # Popup địa điểm
│       │   └── GPSButton.jsx     # Nút GPS
│       ├── services/
│       │   ├── routeService.js   # Gọi API tìm đường
│       │   ├── geoserver.js      # Kết nối GeoServer (WMS)
│       │   └── mockData.js       # Dữ liệu mẫu
│       └── styles/
│           ├── design-system.css # Design tokens & utilities
│           ├── home.css          # Styles trang chủ
│           └── map.css           # Styles trang bản đồ
│
└── RAILWAY.md        ← Hướng dẫn deploy lên Railway
```

---

## Yêu cầu hệ thống

| Phần mềm       | Phiên bản tối thiểu | Mục đích                                |
|-----------------|----------------------|-----------------------------------------|
| **Python**      | 3.10+                | Chạy backend FastAPI                    |
| **Node.js**     | 18+                  | Chạy frontend Vite + React              |
| **npm**         | 9+                   | Quản lý packages frontend               |
| **PostgreSQL**  | 14+                  | Database chính                          |
| **PostGIS**     | 3.x                  | Extension xử lý dữ liệu không gian     |
| **pgRouting**   | 3.x                  | Extension tìm đường ngắn nhất           |

---

## Hướng dẫn chạy trên Local

### Bước 1: Chuẩn bị Database

Bạn cần cài PostgreSQL với extension **PostGIS** và **pgRouting**.

```bash
# 1. Tạo database
createdb -U postgres Webgis_QuyNhon

# 2. Bật extension
psql -U postgres -d Webgis_QuyNhon -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U postgres -d Webgis_QuyNhon -c "CREATE EXTENSION IF NOT EXISTS pgrouting;"

# 3. Restore dữ liệu từ backup
pg_restore -U postgres -d Webgis_QuyNhon backend/Webgis_QuyNhon.backup
```

> **Lưu ý**: Mặc định backend kết nối tới database trên `localhost:5433`, user `postgres`, password `1708`. Nếu cấu hình khác, hãy set biến môi trường (xem phần [Biến môi trường Backend](#biến-môi-trường-backend)).

---

### Bước 2: Chạy Backend (FastAPI)

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Tạo virtual environment (khuyến nghị)
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# 3. Cài đặt dependencies
pip install -r requirement.txt

# 4. Chạy server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Backend sẽ chạy tại: **http://localhost:8000**

Kiểm tra trạng thái:
- Root: `GET http://localhost:8000/` → `{"status": "running", ...}`
- Health: `GET http://localhost:8000/health` → `{"server": "ok", "database": "ok"}`
- API Docs: `http://localhost:8000/docs` (Swagger UI tự động của FastAPI)

---

### Bước 3: Chạy Frontend (React + Vite)

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

Vite đã cấu hình **proxy** tự động: mọi request đến `/api/*` sẽ được chuyển tới `http://localhost:8000`, nên không cần lo về CORS khi dev local.

---

## API Endpoints

| Method | Endpoint                | Mô tả                         | Params                                            |
|--------|-------------------------|--------------------------------|---------------------------------------------------|
| GET    | `/api/search`           | Tìm kiếm địa điểm theo từ khoá| `keyword` (bắt buộc)                              |
| GET    | `/api/categories`       | Lấy danh sách danh mục        | —                                                 |
| GET    | `/api/search/category`  | Tìm theo danh mục             | `category` (bắt buộc)                             |
| GET    | `/api/route`            | Tìm đường ngắn nhất           | `start_lon`, `start_lat`, `end_lon`, `end_lat`    |
| GET    | `/health`               | Kiểm tra trạng thái server + DB| —                                                 |

---

## Biến môi trường

### Biến môi trường Backend

Cấu hình qua biến môi trường hoặc sử dụng giá trị mặc định trong `backend/core/config.py`:

| Biến                           | Mặc định                              | Mô tả                          |
|-------------------------------|----------------------------------------|---------------------------------|
| `DB_HOST`                     | `localhost`                            | Địa chỉ PostgreSQL             |
| `DB_PORT`                     | `5433`                                 | Port PostgreSQL                 |
| `DB_NAME`                     | `Webgis_QuyNhon`                       | Tên database                   |
| `DB_USER`                     | `postgres`                             | User database                  |
| `DB_PASSWORD`                 | `1708`                                 | Password database              |
| `DATABASE_URL`                | _(trống)_                              | Connection string đầy đủ (nếu set, bỏ qua các DB_* khác) |
| `ALLOWED_ORIGINS`             | `*`                                    | CORS origins (phân cách bằng dấu phẩy) |
| `LOCAL_ROUTE_MAX_SNAP_METERS` | `5000`                                 | Khoảng cách snap tối đa (m)    |
| `ROUTING_API_URL`             | `https://router.project-osrm.org`      | URL OSRM fallback routing      |
| `ROUTING_HTTP_TIMEOUT_SECONDS`| `30`                                   | Timeout gọi routing API (giây) |

### Biến môi trường Frontend

Cấu hình trong file `frontend/.env`:

| Biến                 | Mặc định | Mô tả                                      |
|----------------------|----------|---------------------------------------------|
| `VITE_API_URL`       | `/api`   | URL gốc của backend API                     |
| `VITE_GEOSERVER_URL` | _(trống)_| URL GeoServer (bỏ trống nếu không sử dụng) |

---

## Tech Stack

### Backend
- **FastAPI** `0.128.8` — Web framework
- **Uvicorn** `0.39.0` — ASGI server
- **psycopg2-binary** `2.9.12` — PostgreSQL driver
- **pydantic-settings** `2.2.1` — Quản lý cấu hình

### Frontend
- **React** `19.x` — UI library
- **Vite** `8.x` — Build tool & dev server
- **Leaflet** `1.9.x` + **react-leaflet** `5.x` — Bản đồ tương tác
- **Axios** `1.18.x` — HTTP client
- **React Router DOM** `7.x` — Client-side routing

### Database
- **PostgreSQL** + **PostGIS** — Dữ liệu không gian
- **pgRouting** — Thuật toán tìm đường ngắn nhất

---

## Kiến trúc Backend (Layered + Repository Pattern)

```
Routes (API endpoints)
  ↓
Services (Business Logic)
  ↓
Repositories (Data Access / SQL)
  ↓
PostgreSQL + PostGIS + pgRouting
```

---

## Deploy lên Production

Xem chi tiết tại [RAILWAY.md](./RAILWAY.md) để deploy lên **Railway** với 4 services:
1. `webgis-db` — PostgreSQL + PostGIS + pgRouting
2. `webgis-restore` — Restore database từ backup
3. `webgis-api` — FastAPI backend
4. `webgis-frontend` — Vite build + Caddy static server

---

## Tóm tắt nhanh: Chạy Local

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirement.txt
uvicorn app:app --port 8000 --reload

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại **http://localhost:5173** để sử dụng.
