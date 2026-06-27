from fastapi import APIRouter, Depends, Query
from core.database import get_db
from repositories.route_repository import RouteRepository
from services.route_service import RouteService
from schemas.route import RouteResponse

router = APIRouter()

def get_route_service(db=Depends(get_db)) -> RouteService:
    repository = RouteRepository(db)
    return RouteService(repository)

@router.get("/route", response_model=RouteResponse)
def route(
    start_lon: float = Query(...),
    start_lat: float = Query(...),
    end_lon: float = Query(...),
    end_lat: float = Query(...),
    service: RouteService = Depends(get_route_service)
):
    return service.shortest_path(start_lon, start_lat, end_lon, end_lat)
