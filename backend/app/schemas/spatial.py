import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from app.models.spatial import MLClassificationEnum

class FacilityBase(BaseModel):
    osm_id: str
    name: Optional[str] = None
    facility_type: str
    latitude: float
    longitude: float

class FacilityResponse(FacilityBase):
    id: int
    created_at: datetime.datetime
    
    model_config = ConfigDict(from_attributes=True)

class ClassificationLogBase(BaseModel):
    model_version: str
    predicted_label: MLClassificationEnum
    probability_scores: Optional[str] = None
    execution_time_ms: Optional[float] = None

class HotspotIngest(BaseModel):
    latitude: float
    longitude: float
    brightness: float
    bright_t31: float
    frp: float
    confidence: float
    satellite: str
    instrument: str
    daynight: str
    pixel_area: Optional[float] = None
    acq_date: datetime.datetime

class HotspotResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    brightness: float
    bright_t31: float
    frp: float
    confidence: float
    satellite: str
    acq_date: datetime.datetime
    
    # Enriched fields
    land_cover_class: Optional[str] = None
    dist_to_industry_m: Optional[float] = None
    persistence_hours: float
    spatial_cluster_size: int
    
    # ML fields
    ml_label: MLClassificationEnum
    classification_confidence: Optional[float] = None
    is_user_verified: bool
    
    model_config = ConfigDict(from_attributes=True)

class HotspotVerifyRequest(BaseModel):
    verified_label: MLClassificationEnum
    user_id: Optional[str] = None
    notes: Optional[str] = None

class VerificationLogResponse(BaseModel):
    id: int
    hotspot_id: int
    original_label: MLClassificationEnum
    verified_label: MLClassificationEnum
    user_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime.datetime
    
    model_config = ConfigDict(from_attributes=True)

class AlertBase(BaseModel):
    hotspot_id: int
    alert_type: str
    severity: str
    status: str
    is_read: bool

class AlertResponse(AlertBase):
    id: int
    created_at: datetime.datetime
    resolution_note: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class AlertUpdate(BaseModel):
    resolution_note: Optional[str] = None

class AnalyticsSummaryResponse(BaseModel):
    total_hotspots: int
    active_industrial_fires: int
    high_severity_alerts: int
    unverified_classifications: int

class ClassificationCount(BaseModel):
    label: MLClassificationEnum
    count: int

class TimelineDataPoint(BaseModel):
    date: str
    count: int
