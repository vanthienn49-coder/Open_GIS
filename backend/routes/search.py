from fastapi import APIRouter
from services.search_service import search_place, search_category, get_categories

router = APIRouter()

@router.get("/search")
def search(keyword: str):
    return search_place(keyword)
@router.get("/categories")
def categories():
    return get_categories()
@router.get("/search/category")
def category(category: str):
    return search_category(category)