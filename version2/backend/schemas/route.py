from pydantic import BaseModel, Field
from typing import List, Optional

class RouteRequest(BaseModel):
    start_lon: float = Field(..., description="Longitude of starting point")
    start_lat: float = Field(..., description="Latitude of starting point")
    end_lon: float = Field(..., description="Longitude of ending point")
    end_lat: float = Field(..., description="Latitude of ending point")

class RouteResponse(BaseModel):
    provider: str
    start_node: Optional[int] = None
    end_node: Optional[int] = None
    distance_m: float
    duration_s: Optional[float] = None
    coordinates: List[List[float]]

    class Config:
        from_attributes = True
