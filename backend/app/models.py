from pydantic import BaseModel
from typing import List, Optional

class Product(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    images: List[str]
    category_slug: str
    available_variants: List[str] = []

class Category(BaseModel):
    id: int
    name: str
    slug: str
    description: str