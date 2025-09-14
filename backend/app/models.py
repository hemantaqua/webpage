from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Category Models
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product Models
class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    category_id: int
    sku: Optional[str] = None
    featured: bool = False
    images: List[str] = []
    videos: List[str] = []
    available_variants: List[str] = []

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    sku: Optional[str] = None
    featured: Optional[bool] = None
    images: Optional[List[str]] = None
    videos: Optional[List[str]] = None
    available_variants: Optional[List[str]] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product with Category relationship
class ProductWithCategory(Product):
    category: Category
    
    class Config:
        from_attributes = True

# Auth Models
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str