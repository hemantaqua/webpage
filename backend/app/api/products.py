from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from app.models import Product, ProductCreate, ProductUpdate, ProductWithCategory
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

@router.get("/search", response_model=List[ProductWithCategory])
async def search_products(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, description="Maximum number of results"),
    offset: int = Query(0, description="Number of results to skip"),
    admin: dict = Depends(get_current_admin)
):
    """Search products by name, SKU, or description"""
    try:
        print(f"Search query received: {q}")
        
        # Use Supabase's text search with ilike for case-insensitive search
        search_pattern = f"%{q}%"
        print(f"Search pattern: {search_pattern}")
        
        # Start with a simple search by name to get it working
        client = supabase_service.get_client()
        query = client.table("products").select("*").ilike("name", search_pattern)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        print("Executing query...")
        products_response = query.execute()
        print(f"Query executed successfully, found {len(products_response.data) if products_response.data else 0} products")
        
        if not products_response.data:
            return []
        
        # Get all categories for the found products
        category_ids = list(set([item['category_id'] for item in products_response.data if item['category_id']]))
        print(f"Fetching categories for IDs: {category_ids}")
        
        categories_response = client.table("categories").select("*").in_("id", category_ids).execute()
        categories_dict = {cat['id']: cat for cat in categories_response.data}
        print(f"Found {len(categories_dict)} categories")
        
        # Transform the data
        products = []
        for item in products_response.data:
            # Ensure arrays are never None
            images = item.get('images') or []
            videos = item.get('videos') or []
            available_variants = item.get('available_variants') or []
            
            # Get category data
            category_data = categories_dict.get(item['category_id'], {})
            
            product_data = {
                'id': item['id'],
                'category_id': item['category_id'],
                'name': item['name'],
                'slug': item['slug'],
                'description': item.get('description'),
                'images': images,
                'sku': item.get('sku'),
                'featured': item['featured'],
                'created_at': item['created_at'],
                'videos': videos,
                'available_variants': available_variants,
                'category': category_data
            }
            products.append(product_data)
        
        print(f"Returning {len(products)} products")
        return products
    except Exception as e:
        print(f"Error searching products: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ProductWithCategory])
async def get_products(
    category_id: Optional[int] = Query(None),
    featured: Optional[bool] = Query(None),
    limit: int = Query(100),
    offset: int = Query(0)
):
    """Get all products with optional filtering"""
    try:
        # First get products
        query = supabase_service.get_client().table("products").select("*")
        
        # Apply filters
        if category_id:
            query = query.eq("category_id", category_id)
        if featured is not None:
            query = query.eq("featured", featured)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        products_response = query.execute()
        
        if not products_response.data:
            return []
        
        # Get all categories
        categories_response = supabase_service.get_client().table("categories").select("*").execute()
        categories_dict = {cat['id']: cat for cat in categories_response.data}
        
        # Transform the data
        products = []
        for item in products_response.data:
            # Ensure arrays are never None
            images = item.get('images') or []
            videos = item.get('videos') or []
            available_variants = item.get('available_variants') or []
            
            # Get category data
            category_data = categories_dict.get(item['category_id'], {})
            
            product_data = {
                'id': item['id'],
                'category_id': item['category_id'],
                'name': item['name'],
                'slug': item['slug'],
                'description': item.get('description'),
                'images': images,
                'sku': item.get('sku'),
                'featured': item['featured'],
                'created_at': item['created_at'],
                'videos': videos,
                'available_variants': available_variants,
                'category': category_data
            }
            products.append(product_data)
        
        return products
    except Exception as e:
        print(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=ProductWithCategory)
async def get_product(product_id: int):
    """Get product by ID"""
    try:
        # Get product
        product_response = supabase_service.get_client().table("products").select("*").eq("id", product_id).execute()
        
        if not product_response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        item = product_response.data[0]
        
        # Get category
        category_response = supabase_service.get_client().table("categories").select("*").eq("id", item['category_id']).execute()
        category_data = category_response.data[0] if category_response.data else {}
        
        # Transform the data
        images = item.get('images') or []
        videos = item.get('videos') or []
        available_variants = item.get('available_variants') or []
        
        product_data = {
            'id': item['id'],
            'category_id': item['category_id'],
            'name': item['name'],
            'slug': item['slug'],
            'description': item.get('description'),
            'images': images,
            'sku': item.get('sku'),
            'featured': item['featured'],
            'created_at': item['created_at'],
            'videos': videos,
            'available_variants': available_variants,
            'category': category_data
        }
        
        return product_data
    except Exception as e:
        print(f"Error fetching product: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Product)
async def create_product(product: ProductCreate, admin: dict = Depends(get_current_admin)):
    """Create new product"""
    try:
        response = supabase_service.get_client().table("products").insert(product.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: int, product: ProductUpdate, admin: dict = Depends(get_current_admin)):
    """Update product"""
    try:
        # Only update provided fields
        update_data = {k: v for k, v in product.dict().items() if v is not None}
        
        response = supabase_service.get_client().table("products").update(update_data).eq("id", product_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{product_id}")
async def delete_product(product_id: int, admin: dict = Depends(get_current_admin)):
    """Delete product"""
    try:
        response = supabase_service.get_client().table("products").delete().eq("id", product_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bulk")
async def bulk_operations(
    operation: str,
    product_ids: List[int],
    admin: dict = Depends(get_current_admin)
):
    """Bulk operations on products"""
    try:
        if operation == "delete":
            response = supabase_service.get_client().table("products").delete().in_("id", product_ids).execute()
            return {"message": f"Deleted {len(response.data)} products"}
        elif operation == "feature":
            response = supabase_service.get_client().table("products").update({"featured": True}).in_("id", product_ids).execute()
            return {"message": f"Featured {len(response.data)} products"}
        elif operation == "unfeature":
            response = supabase_service.get_client().table("products").update({"featured": False}).in_("id", product_ids).execute()
            return {"message": f"Unfeatured {len(response.data)} products"}
        else:
            raise HTTPException(status_code=400, detail="Invalid operation")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
