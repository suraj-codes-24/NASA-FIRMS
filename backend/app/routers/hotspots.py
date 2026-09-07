from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from geoalchemy2.elements import WKTElement

from app.database import get_db
from app.models.spatial import Hotspot, Facility, MLClassificationEnum, VerificationLog
from app.schemas.spatial import HotspotIngest, HotspotResponse, FacilityResponse, HotspotVerifyRequest, VerificationLogResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/hotspots", tags=["Hotspots"])

@router.post("/ingest", status_code=202)
async def ingest_hotspots(
    hotspots: List[HotspotIngest],
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Ingest a batch of hotspots. Enqueues them for background ML processing via Celery.
    """
    # Insert hotspots into DB initially as UNCLASSIFIED
    db_hotspots = []
    for h in hotspots:
        point = f"POINT({h.longitude} {h.latitude})"
        hotspot = Hotspot(
            latitude=h.latitude,
            longitude=h.longitude,
            geom=WKTElement(point, srid=4326),
            brightness=h.brightness,
            bright_t31=h.bright_t31,
            frp=h.frp,
            confidence=h.confidence,
            satellite=h.satellite,
            instrument=h.instrument,
            daynight=h.daynight,
            pixel_area=h.pixel_area,
            acq_date=h.acq_date,
            ml_label=MLClassificationEnum.UNCLASSIFIED
        )
        db.add(hotspot)
        db_hotspots.append(hotspot)
    
    await db.commit()
    
    # Enqueue celery task for spatial enrichment and ML classification
    hotspot_ids = [h.id for h in db_hotspots]
    
    # We will import celery tasks here to avoid circular imports
    from app.tasks.ml_tasks import process_hotspots_batch
    process_hotspots_batch.delay(hotspot_ids)
    
    return {"message": f"Ingested {len(hotspot_ids)} hotspots for processing.", "ids": hotspot_ids}

@router.get("", response_model=List[HotspotResponse])
async def get_hotspots(
    limit: int = Query(100, ge=1, le=1000),
    ml_label: MLClassificationEnum = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve hotspots with optional filtering.
    """
    query = select(Hotspot).order_by(Hotspot.acq_date.desc()).limit(limit)
    if ml_label:
        query = query.filter(Hotspot.ml_label == ml_label)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{hotspot_id}/nearest-facilities", response_model=List[FacilityResponse])
async def get_nearest_facilities(
    hotspot_id: int,
    limit: int = 5,
    db: AsyncSession = Depends(get_db)
):
    """
    Get the nearest industrial facilities to a given hotspot.
    """
    hotspot = await db.get(Hotspot, hotspot_id)
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found")
        
    # Query facilities ordered by distance to this hotspot
    query = select(Facility).order_by(
        Facility.geom.distance_centroid(hotspot.geom)
    ).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/{hotspot_id}/verify", response_model=VerificationLogResponse)
async def verify_hotspot_classification(
    hotspot_id: int,
    request: HotspotVerifyRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Field agents or experts use this to verify or correct the ML classification.
    """
    hotspot = await db.get(Hotspot, hotspot_id)
    if not hotspot:
        raise HTTPException(status_code=404, detail="Hotspot not found")
        
    original_label = hotspot.ml_label
    
    # Create the verification log
    log = VerificationLog(
        hotspot_id=hotspot_id,
        original_label=original_label,
        verified_label=request.verified_label,
        user_id=request.user_id,
        notes=request.notes
    )
    db.add(log)
    
    # Update the hotspot
    hotspot.ml_label = request.verified_label
    hotspot.is_user_verified = True
    
    await db.commit()
    await db.refresh(log)
    
    return log
