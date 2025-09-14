from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from app.models import Category, CategoryCreate, CategoryUpdate
from app.services.supabase_client import supabase_service
from app.core.security import verify_token

router = APIRouter()
security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to verify admin authentication"""
    payload = verify_token(credentials.credentials)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authenticated")
    return payload

@router.get("/", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    try:
        response = supabase_service.get_client().table("categories").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: int):
    """Get category by ID"""
    try:
        response = supabase_service.get_client().table("categories").select("*").eq("id", category_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Category not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate, admin: dict = Depends(get_current_admin)):
    """Create new category"""
    try:
        response = supabase_service.get_client().table("categories").insert(category.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: int, category: CategoryUpdate, admin: dict = Depends(get_current_admin)):
    """Update category"""
    try:
        # Only update provided fields
        update_data = {k: v for k, v in category.dict().items() if v is not None}
        
        response = supabase_service.get_client().table("categories").update(update_data).eq("id", category_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Category not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{category_id}")
async def delete_category(category_id: int, admin: dict = Depends(get_current_admin)):
    """Delete category"""
    try:
        response = supabase_service.get_client().table("categories").delete().eq("id", category_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Category not found")
        return {"message": "Category deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


