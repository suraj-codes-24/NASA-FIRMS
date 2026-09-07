from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.spatial import Facility
from app.schemas.spatial import FacilityResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/facilities", tags=["Facilities"])

@router.get("", response_model=List[FacilityResponse])
async def get_facilities(
    limit: int = Query(100, ge=1, le=1000),
    facility_type: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve industrial facilities.
    """
    query = select(Facility).limit(limit)
    if facility_type:
        query = query.filter(Facility.facility_type == facility_type)
        
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{facility_id}", response_model=FacilityResponse)
async def get_facility(
    facility_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a specific industrial facility by ID.
    """
    facility = await db.get(Facility, facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
        
    return facility
