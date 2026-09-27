from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from typing import List

from app.database import get_db
from app.models.spatial import Alert, Hotspot
from app.schemas.spatial import AlertResponse, AlertUpdate

router = APIRouter()

from sqlalchemy.orm import selectinload

@router.get("", response_model=List[AlertResponse])
async def list_alerts(db: AsyncSession = Depends(get_db)):
    query = await db.execute(
        select(Alert)
        .options(selectinload(Alert.hotspot).selectinload(Hotspot.nearest_facility))
        .order_by(Alert.created_at.desc())
    )
    return query.scalars().all()

async def _get_alert_with_relations(alert_id: int, db: AsyncSession) -> Alert:
    query = await db.execute(
        select(Alert)
        .options(selectinload(Alert.hotspot).selectinload(Hotspot.nearest_facility))
        .filter(Alert.id == alert_id)
    )
    alert = query.scalars().one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/{alert_id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(alert_id: int, db: AsyncSession = Depends(get_db)):
    alert = await _get_alert_with_relations(alert_id, db)
    alert.status = "ACKNOWLEDGED"
    alert.is_read = True
    await db.commit()
    await db.refresh(alert)
    return alert

@router.put("/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: int,
    request: AlertUpdate,
    db: AsyncSession = Depends(get_db)
):
    alert = await _get_alert_with_relations(alert_id, db)
    alert.status = "RESOLVED"
    alert.is_read = True
    alert.resolution_note = request.resolution_note
    await db.commit()
    await db.refresh(alert)
    return alert

@router.put("/{alert_id}/notes", response_model=AlertResponse)
async def update_alert_notes(
    alert_id: int,
    request: AlertUpdate,
    db: AsyncSession = Depends(get_db)
):
    alert = await _get_alert_with_relations(alert_id, db)
    alert.resolution_note = request.resolution_note
    await db.commit()
    await db.refresh(alert)
    return alert

