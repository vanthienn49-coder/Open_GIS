import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import Error as Psycopg2Error

from core.config import settings
from core.database import get_connection
from core.exceptions import (
    BaseAPIException, 
    api_exception_handler, 
    database_exception_handler, 
    global_exception_handler
)
from core.logging import setup_logging
from routes.search import router as search_router
from routes.routing import router as routing_router

# Initialize structured logging
logger = setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API tìm kiếm địa điểm và tìm đường, kiến trúc Layered + Repository Pattern",
    version="1.0.0"
)

# Exception handlers registration
app.add_exception_handler(BaseAPIException, api_exception_handler)
app.add_exception_handler(Psycopg2Error, database_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

allowed_origins = (
    ["*"]
    if settings.ALLOWED_ORIGINS == "*"
    else [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes registration
app.include_router(search_router, prefix=settings.API_V1_STR, tags=["Search"])
app.include_router(routing_router, prefix=settings.API_V1_STR, tags=["Routing"])

@app.get("/")
def root():
    return {
        "status": "running",
        "project": settings.PROJECT_NAME
    }

@app.get("/health")
def health():
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            cur.fetchone()
        conn.close()
    except Exception as exc:
        logger.error(f"Healthcheck failed: {exc}")
        raise HTTPException(status_code=503, detail="database unavailable")

    return {"server": "ok", "database": "ok"}