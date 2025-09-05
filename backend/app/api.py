from fastapi import APIRouter, HTTPException
from typing import List
from . import data
from .models import Category, Product

router = APIRouter()

@router.get("/categories", response_model=List[Category])
async def get_all_categories():
    return data.CATEGORIES

@router.get("/categories/{category_slug}", response_model=Category)
async def get_category_by_slug(category_slug: str):
    for category in data.CATEGORIES:
        if category.slug == category_slug:
            return category
    raise HTTPException(status_code=404, detail="Category not found")

@router.get("/products", response_model=List[Product])
async def get_products(category: str = None):
    if category:
        return [p for p in data.PRODUCTS if p.category_slug == category]
    return data.PRODUCTS

@router.get("/products/{product_slug}", response_model=Product)
async def get_product_by_slug(product_slug: str):
    for product in data.PRODUCTS:
        if product.slug == product_slug:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

@router.post("/inquiry")
async def handle_inquiry(inquiry: dict):
    # In a real app, you would process this: save to DB, send an email, etc.
    print(f"Received inquiry: {inquiry}")
    return {"message": "Inquiry received successfully!"}