from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import AdminLogin, Token
from app.core.security import verify_password, create_access_token
from app.services.supabase_client import supabase_service
from datetime import timedelta
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()

# Simple admin credentials (in production, use proper user management)
ADMIN_CREDENTIALS = {
    "admin": "admin123"  # username: password
}

@router.post("/login", response_model=Token)
async def login(admin_login: AdminLogin):
    """Admin login endpoint"""
    username = admin_login.username
    password = admin_login.password
    
    # Check credentials
    if username not in ADMIN_CREDENTIALS:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if ADMIN_CREDENTIALS[username] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": username, "role": "admin"}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout():
    """Admin logout endpoint"""
    return {"message": "Successfully logged out"}

@router.get("/me")
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current admin info"""
    from app.core.security import verify_token
    
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {
        "username": payload.get("sub"),
        "role": payload.get("role")
    }
