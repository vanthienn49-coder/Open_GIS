from typing import List
from fastapi import APIRouter, Depends, Query
from core.database import get_db
from repositories.search_repository import SearchRepository
from services.search_service import SearchService
from schemas.search import PlaceResponse, CategoryListResponse

router = APIRouter()

def get_search_service(db=Depends(get_db)) -> SearchService:
    repository = SearchRepository(db)
    return SearchService(repository)

@router.get("/search", response_model=List[PlaceResponse])
def search(keyword: str = Query(..., min_length=1), service: SearchService = Depends(get_search_service)):
    return service.search_place(keyword)

@router.get("/categories", response_model=CategoryListResponse)
def categories(service: SearchService = Depends(get_search_service)):
    return service.get_categories()

@router.get("/search/category", response_model=List[PlaceResponse])
def category(category: str = Query(..., min_length=1), service: SearchService = Depends(get_search_service)):
    return service.search_category(category)