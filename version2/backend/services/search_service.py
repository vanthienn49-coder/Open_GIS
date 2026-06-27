from typing import List
from repositories.search_repository import SearchRepository
from schemas.search import PlaceResponse, CategoryListResponse

class SearchService:
    def __init__(self, repository: SearchRepository):
        self.repository = repository

    def search_place(self, keyword: str) -> List[PlaceResponse]:
        rows = self.repository.search_place(keyword)
        
        result = []
        for i, row in enumerate(rows):
            result.append(
                PlaceResponse(
                    id=i + 1,
                    name=row[0],
                    category=row[1] if row[1] else "",
                    address=row[2] if row[2] else "",
                    lat=row[3],
                    lng=row[4]
                )
            )
        return result

    def get_categories(self) -> CategoryListResponse:
        rows = self.repository.get_categories()
        
        categories = []
        for row in rows:
            categories.append(row[0].replace("_", " "))
            
        return CategoryListResponse(categories=categories)

    def search_category(self, category: str) -> List[PlaceResponse]:
        rows = self.repository.search_category(category)
        
        result = []
        for i, row in enumerate(rows):
            result.append(
                PlaceResponse(
                    id=i + 1,
                    name=row[0],
                    category=row[1].replace("_", " ") if row[1] else "",
                    address=row[2] if row[2] else "",
                    lat=row[3],
                    lng=row[4]
                )
            )
        return result
