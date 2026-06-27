import os
from typing import Optional

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "WebGIS Quy Nhơn"
    API_V1_STR: str = "/api"
    
    # CORS
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")
    
    # Database
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_NAME: str = os.getenv("DB_NAME", "Webgis_QuyNhon")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "1708")
    DB_PORT: str = os.getenv("DB_PORT", "5433")
    DB_TIMEOUT: int = int(os.getenv("DB_TIMEOUT", "10"))

    # Routing
    LOCAL_ROUTE_MAX_SNAP_METERS: float = float(
        os.getenv("LOCAL_ROUTE_MAX_SNAP_METERS", "5000")
    )
    ROUTING_API_URL: str = os.getenv(
        "ROUTING_API_URL", "https://router.project-osrm.org"
    ).rstrip("/")
    ROUTING_HTTP_TIMEOUT_SECONDS: float = float(
        os.getenv("ROUTING_HTTP_TIMEOUT_SECONDS", "30")
    )

    class Config:
        case_sensitive = True

settings = Settings()
