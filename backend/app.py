from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.search import router as search_router
from routes.routing import router as routing_router

app = FastAPI(
    title="WebGIS Quy Nhơn",
    description="API tìm kiếm địa điểm và tìm đường",
    version="1.0.0"
)

# Cho phép Frontend Angular truy cập
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Khi deploy nên thay bằng domain frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các API
app.include_router(search_router, prefix="/api", tags=["Search"])
app.include_router(routing_router, prefix="/api", tags=["Routing"])

# API kiểm tra server
@app.get("/")
def root():
    return {
        "status": "running",
        "project": "WebGIS Quy Nhơn"
    }

# API kiểm tra kết nối
@app.get("/health")
def health():
    return {
        "server": "ok"
    }