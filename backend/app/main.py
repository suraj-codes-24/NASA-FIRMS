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
        try:
            await init_db()
            logger.info("   Database tables initialized")
        except Exception as e:
            logger.warning(f"   Database connection failed (mock mode active): {e}")

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

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
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
        "commit": "c7a62ff",
    }


@app.get("/test-debug", tags=["System"])
async def test_debug():
    import traceback
    try:
        from app.database import async_session_factory
        from app.models.spatial import Hotspot, Facility
        from app.schemas.spatial import HotspotResponse
        from sqlalchemy import select
        from sqlalchemy.orm import joinedload
        
        async with async_session_factory() as db:
            query = (
                select(Hotspot)
                .options(joinedload(Hotspot.nearest_facility))
                .filter(Hotspot.nearest_facility_id == 10)
                .order_by(Hotspot.acq_date.desc())
                .limit(200)
            )
            result = await db.execute(query)
            hotspots = result.scalars().unique().all()
            validated = [HotspotResponse.model_validate(h) for h in hotspots]
            return {"count": len(validated), "sample": validated[0].model_dump(mode="json") if validated else None}
    except Exception as e:
        return {"error": str(e), "traceback": traceback.format_exc()}


# ----- Router Registration -----
# Routers will be imported and mounted here as they are implemented
from app.routers import hotspots, facilities, analytics, alerts, websocket
from app.routers import reports, auth, settings as settings_router
app.include_router(hotspots.router, prefix="/api/v1")
app.include_router(facilities.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(websocket.router, tags=["WebSocket"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(settings_router.router, prefix="/api/v1/settings", tags=["Settings"])
