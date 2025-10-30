from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .routes import router as api_router
from .config import Settings

settings = Settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("film-whisperer-backend")

app = FastAPI(title="Film Whisperer Backend")

# CORS for the frontend (http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes under /api/v1
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    logger.info("Health check request")
    return {"status": "ok", "service": "film-whisperer-backend"}
