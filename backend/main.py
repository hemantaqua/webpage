from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app import api

load_dotenv()

app = FastAPI(
    title="My Website API",
    description="API for the company website.",
    version="1.0.0"
)

# CORS configuration
CLIENT_ORIGIN_URL = os.getenv("CLIENT_ORIGIN_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CLIENT_ORIGIN_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "API is running"}