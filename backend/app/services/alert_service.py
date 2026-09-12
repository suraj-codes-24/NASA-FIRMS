"""
IGNIS — Alert Service

Handles alert lifecycle management:
- Creating alerts when high-severity hotspots are classified
- Broadcasting alerts via WebSocket
- Acknowledging and resolving alerts
"""

import logging
from sqlalchemy.orm import Session

from app.models.spatial import Alert, Hotspot, MLClassificationEnum

logger = logging.getLogger("ignis.services.alert")

# Thresholds for automatic alert generation
FRP_CRITICAL_THRESHOLD = 200.0  # MW
FRP_HIGH_THRESHOLD = 100.0


def create_alert_if_needed(db: Session, hotspot: Hotspot) -> Alert | None:
    """
    Check if a classified hotspot warrants an alert.
    Industrial fires with FRP > threshold trigger alerts automatically.
    """
    if hotspot.ml_label == MLClassificationEnum.INDUSTRIAL_FIRE:
        if hotspot.frp and hotspot.frp > FRP_CRITICAL_THRESHOLD:
            severity = "CRITICAL"
            alert_type = "CRITICAL_INDUSTRIAL_FIRE"
        elif hotspot.frp and hotspot.frp > FRP_HIGH_THRESHOLD:
            severity = "HIGH"
            alert_type = "HIGH_FRP_INDUSTRIAL_FIRE"
        else:
            severity = "MEDIUM"
            alert_type = "INDUSTRIAL_FIRE_DETECTED"
    elif hotspot.ml_label == MLClassificationEnum.GAS_FLARE:
        if hotspot.frp and hotspot.frp > FRP_HIGH_THRESHOLD:
            severity = "HIGH"
            alert_type = "ABNORMAL_GAS_FLARE"
        else:
            return None  # Normal gas flares don't trigger alerts
    else:
        return None

    alert = Alert(
        hotspot_id=hotspot.id,
        alert_type=alert_type,
        severity=severity,
        status="NEW",
    )
    db.add(alert)
    logger.info(f"Alert created: {alert_type} (severity={severity}) for hotspot {hotspot.id}")
    return alert


def acknowledge_alert(db: Session, alert_id: int) -> Alert | None:
    """Mark an alert as acknowledged."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = "ACKNOWLEDGED"
        alert.is_read = True
        db.commit()
    return alert


def resolve_alert(db: Session, alert_id: int, note: str = None) -> Alert | None:
    """Mark an alert as resolved with an optional resolution note."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.status = "RESOLVED"
        alert.is_read = True
        alert.resolution_note = note
        db.commit()
    return alert


def get_active_alerts(db: Session, limit: int = 50):
    """Return all non-resolved alerts, newest first."""
    return (
        db.query(Alert)
        .filter(Alert.status != "RESOLVED")
        .order_by(Alert.created_at.desc())
        .limit(limit)
        .all()
    )
