from fastapi import Request, status
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("webgis")

class BaseAPIException(Exception):
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class NotFoundException(BaseAPIException):
    def __init__(self, message: str = "Not Found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class DatabaseException(BaseAPIException):
    def __init__(self, message: str = "Database Error"):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR)

class ValidationException(BaseAPIException):
    def __init__(self, message: str = "Validation Error"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)

class ExternalServiceException(BaseAPIException):
    def __init__(self, message: str = "External Service Error"):
        super().__init__(message, status.HTTP_502_BAD_GATEWAY)

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error. Please try again later."},
    )

async def api_exception_handler(request: Request, exc: BaseAPIException):
    logger.warning(f"API Error ({exc.status_code}): {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )

from psycopg2 import Error as Psycopg2Error

async def database_exception_handler(request: Request, exc: Psycopg2Error):
    logger.error(f"Database error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Database is currently unavailable."},
    )
