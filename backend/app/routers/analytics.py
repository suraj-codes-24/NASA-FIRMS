from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List

from app.database import get_db
from app.models.spatial import Hotspot, Alert, MLClassificationEnum
from app.schemas.spatial import AnalyticsSummaryResponse, ClassificationCount, TimelineDataPoint

router = APIRouter()

@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary(db: AsyncSession = Depends(get_db)):
    # Total hotspots
    total_query = await db.execute(select(func.count(Hotspot.id)))
    total_hotspots = total_query.scalar() or 0
    
    # Active industrial fires
    industrial_query = await db.execute(
        select(func.count(Hotspot.id))
        .where(Hotspot.ml_label == MLClassificationEnum.INDUSTRIAL_FIRE)
    )
    active_industrial_fires = industrial_query.scalar() or 0
    
    # High severity alerts
    high_alerts_query = await db.execute(
        select(func.count(Alert.id))
        .where(Alert.severity.in_(["HIGH", "CRITICAL"]))
        .where(Alert.status != "RESOLVED")
    )
    high_severity_alerts = high_alerts_query.scalar() or 0
    
    # Unverified classifications
    unverified_query = await db.execute(
        select(func.count(Hotspot.id))
        .where(Hotspot.is_user_verified == False)
        .where(Hotspot.ml_label != MLClassificationEnum.UNCLASSIFIED)
    )
    unverified_classifications = unverified_query.scalar() or 0

    return AnalyticsSummaryResponse(
        total_hotspots=total_hotspots,
        active_industrial_fires=active_industrial_fires,
        high_severity_alerts=high_severity_alerts,
        unverified_classifications=unverified_classifications
    )

@router.get("/classification", response_model=List[ClassificationCount])
async def get_classification_breakdown(db: AsyncSession = Depends(get_db)):
    query = await db.execute(
        select(Hotspot.ml_label, func.count(Hotspot.id))
        .group_by(Hotspot.ml_label)
    )
    results = query.all()
    return [ClassificationCount(label=r[0], count=r[1]) for r in results]

@router.get("/timeline", response_model=List[TimelineDataPoint])
async def get_timeline(db: AsyncSession = Depends(get_db)):
    # Simple cast to Date for postgres
    query = await db.execute(
        select(func.date(Hotspot.acq_date).label('date'), func.count(Hotspot.id))
        .group_by('date')
        .order_by('date')
    )
    results = query.all()
    return [TimelineDataPoint(date=str(r[0]), count=r[1]) for r in results]

@router.get("/top-states", response_model=list)
async def get_top_states(
    ml_label: MLClassificationEnum = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """
    Get states ranked by hotspot count. Requires facility join for state info.
    """
    from app.models.spatial import Facility
    query = (
        select(Facility.state, func.count(Hotspot.id).label("count"))
        .join(Facility, Hotspot.nearest_facility_id == Facility.id)
        .where(Facility.state.isnot(None))
        .group_by(Facility.state)
        .order_by(func.count(Hotspot.id).desc())
        .limit(limit)
    )
    if ml_label:
        query = query.where(Hotspot.ml_label == ml_label)
    
    result = await db.execute(query)
    return [{"state": r[0], "count": r[1]} for r in result.all()]

@router.get("/persistence", response_model=list)
async def get_persistent_sources(
    min_hours: float = 48.0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """
    Get persistent thermal sources that have been active longer than min_hours.
    """
    query = (
        select(Hotspot)
        .where(Hotspot.persistence_hours >= min_hours)
        .order_by(Hotspot.persistence_hours.desc())
        .limit(limit)
    )
    result = await db.execute(query)
    return result.scalars().all()
