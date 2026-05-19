from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db
from .routers import discovery, posts

settings = get_settings()

app = FastAPI(
    title="API de Posts Mosaic",
    description="API propia para posts Mosaic con PostgreSQL, headers de usuario y discovery desde Unsplash.",
    version="1.0.0",
)

origins = ["https://proyecto2-pin-1.onrender.com", settings["frontend_origin"]]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys(origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Backend funcionando"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


app.include_router(posts.router)
app.include_router(discovery.router)
