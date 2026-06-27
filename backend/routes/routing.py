from fastapi import APIRouter
from services.route_service import shortest_path

router = APIRouter()

@router.get("/route")
def route(
    start_lon: float,
    start_lat: float,
    end_lon: float,
    end_lat: float
):
    return shortest_path(
        start_lon,
        start_lat,
        end_lon,
        end_lat
    )