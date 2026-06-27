from pydantic import BaseModel, Field
from typing import List, Optional

class PlaceResponse(BaseModel):
    id: int
    name: str
    category: str
    address: str
    lat: float
    lng: float

    class Config:
        from_attributes = True

class CategoryListResponse(BaseModel):
    categories: List[str]

class SearchRequest(BaseModel):
    keyword: str = Field(..., min_length=1, description="Keyword to search for in name, category or address")
