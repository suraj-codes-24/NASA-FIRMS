"""
IGNIS — FastAPI Application Entry Point

Main application instance with middleware, routers, and lifecycle events.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, close_db

# Configure structured logging
logging.basicConfig(
    level=logging.DEBUG if settings.app_debug else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ignis")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup and shutdown events."""
    logger.info("🔥 IGNIS starting up...")
    logger.info(f"   Environment: {settings.app_env}")
    logger.info(f"   Debug: {settings.app_debug}")

    # Initialize database tables (development only)
    if settings.app_env == "development":
        await init_db()
        logger.info("   Database tables initialized")

    logger.info("🔥 IGNIS is ready!")
    yield

    # Shutdown
    logger.info("🔥 IGNIS shutting down...")
    await close_db()
    logger.info("   Database connections closed")


# Create FastAPI app
app = FastAPI(
    title="IGNIS — Industrial Fire Surveillance",
    description=(
        "AI-enabled geospatial platform for detection, classification, "
        "and monitoring of industrial fires and persistent thermal sources "
        "using NASA FIRMS satellite data."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Health Check -----
@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "ignis-backend",
        "version": "1.0.0",
        "environment": settings.app_env,
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "IGNIS API",
        "description": "Intelligent Geospatial Network for Industrial fire Surveillance",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# ----- Router Registration -----
# Routers will be imported and mounted here as they are implemented
from app.routers import hotspots, facilities, analytics, alerts, websocket
from app.routers import reports, auth
app.include_router(hotspots.router, prefix="/api/v1")
app.include_router(facilities.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(websocket.router, tags=["WebSocket"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
