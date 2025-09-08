from fastapi import APIRouter, HTTPException
from typing import List, Optional
from email.message import EmailMessage
import os
import requests
import smtplib, ssl

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in backend/.env")

def sb_headers():
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

def sb_get(path: str, params: Optional[dict] = None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    r = requests.get(url, headers=sb_headers(), params=params or {})
    if not r.ok:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()

router = APIRouter()

@router.get("/categories")
async def get_all_categories():
    # ?select=*&order=name.asc
    return sb_get("categories", params={"select": "*", "order": "name.asc"})

@router.get("/categories/{category_slug}")
async def get_category_by_slug(category_slug: str):
    data = sb_get("categories", params={"slug": f"eq.{category_slug}", "select": "*"})
    if not data:
        raise HTTPException(status_code=404, detail="Category not found")
    return data[0]

@router.get("/products")
async def get_products(category: Optional[str] = None):
    if not category:
        return sb_get("products", params={"select": "*", "order": "created_at.desc"})
    # find category id by slug
    cats = sb_get("categories", params={"slug": f"eq.{category}", "select": "id"})
    if not cats:
        return []
    cat_id = cats[0]["id"]
    return sb_get("products", params={"category_id": f"eq.{cat_id}", "select": "*", "order": "created_at.desc"})

@router.get("/products/{product_slug}")
async def get_product_by_slug(product_slug: str):
    data = sb_get("products", params={"slug": f"eq.{product_slug}", "select": "*"})
    if not data:
        raise HTTPException(status_code=404, detail="Product not found")
    return data[0]

@router.post("/inquiry")
async def handle_inquiry(inquiry: dict):
    required = ["name", "email", "phone", "message"]
    missing = [k for k in required if not inquiry.get(k)]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    contact_from = os.getenv("CONTACT_FROM", smtp_user or "")
    contact_to = os.getenv("CONTACT_TO", "")

    if not (smtp_host and smtp_user and smtp_pass and contact_to):
        raise HTTPException(status_code=500, detail="Email not configured on server")

    to_list = [e.strip() for e in contact_to.split(",") if e.strip()]

    subject = f"New Inquiry from {inquiry.get('name')} - Hemant Aqua Solutions"
    lines = [
        "You have a new website inquiry:",
        "",
        f"Name: {inquiry.get('name')}",
        f"Email: {inquiry.get('email')}",
        f"Phone: {inquiry.get('phone')}",
        f"Subject: {inquiry.get('subject') or '(not provided)'}",
        "",
        "Message:",
        inquiry.get('message', ''),
    ]
    body = "\n".join(lines)

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = contact_from
    msg["To"] = ", ".join(to_list)
    # Optional: reply-to goes to the customer
    msg["Reply-To"] = inquiry.get("email", contact_from)
    msg.set_content(body)

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to send email: {e}")

    return {"message": "Inquiry received successfully!"}