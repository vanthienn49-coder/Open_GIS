import psycopg2
from core.config import settings

def get_connection():
    if settings.DATABASE_URL:
        return psycopg2.connect(settings.DATABASE_URL, connect_timeout=settings.DB_TIMEOUT)

    return psycopg2.connect(
        host=settings.DB_HOST,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
        connect_timeout=settings.DB_TIMEOUT,
    )

def get_db():
    """
    FastAPI Dependency that provides a database connection and ensures it is closed.
    """
    conn = None
    try:
        conn = get_connection()
        yield conn
    finally:
        if conn:
            conn.close()
