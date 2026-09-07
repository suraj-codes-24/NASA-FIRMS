import logging
import datetime
import numpy as np
import pandas as pd
import joblib
import os
from celery import shared_task
from sqlalchemy import select

from app.database import SyncSessionLocal
from app.models.spatial import Hotspot, Facility, MLClassificationEnum, ClassificationLog, Alert
from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)

# Load model globally for celery worker
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "models", "classifier_v1.joblib")
ensemble_model = None

def get_model():
    global ensemble_model
    if ensemble_model is None:
        try:
            ensemble_model = joblib.load(MODEL_PATH)
            logger.info("Loaded ML model successfully.")
        except Exception as e:
            logger.error(f"Failed to load ML model from {MODEL_PATH}: {e}")
    return ensemble_model

@shared_task
def process_hotspots_batch(hotspot_ids: list[int]):
    """
    Background task to process a batch of ingested hotspots:
    1. Spatial enrichment (distance to industry)
    2. ML Classification
    3. Save results
    """
    start_time = datetime.datetime.utcnow()
    logger.info(f"Processing batch of {len(hotspot_ids)} hotspots...")
    
    model_artifact = get_model()
    if not model_artifact:
        logger.error("Cannot process batch, model not loaded.")
        return False
        
    ensemble = model_artifact["ensemble"]
    feature_names = model_artifact["feature_names"]
    label_encoders = model_artifact["label_encoders"]
    target_encoder = model_artifact["target_encoder"]
    label_names_map = model_artifact["label_names"] # dict {0: 'Industrial Fire', etc}
    
    # Reverse map strings to Enum values
    enum_map = {
        0: MLClassificationEnum.INDUSTRIAL_FIRE,
        1: MLClassificationEnum.FOREST_FIRE,
        2: MLClassificationEnum.GAS_FLARE,
        3: MLClassificationEnum.AGRICULTURAL_BURN,
        4: MLClassificationEnum.MINING_THERMAL,
        5: MLClassificationEnum.UNCLASSIFIED
    }

    with SyncSessionLocal() as db:
        # Load hotspots
        hotspots = db.query(Hotspot).filter(Hotspot.id.in_(hotspot_ids)).all()
        if not hotspots:
            return True
            
        features_list = []
        
        for h in hotspots:
            # Simple spatial enrichment: find nearest facility
            # In a real heavy system we'd use PostGIS `<->` operator in bulk
            # For now we do it per hotspot as an example
            query = select(Facility).order_by(
                Facility.geom.distance_centroid(h.geom)
            ).limit(1)
            nearest = db.execute(query).scalars().first()
            
            if nearest:
                h.nearest_facility_id = nearest.id
                h.dist_to_industry_m = 0.0 # We would calculate exact haversine here using PostGIS ST_Distance
                industrial_type = nearest.facility_type
            else:
                h.dist_to_industry_m = 99999.0
                industrial_type = "unknown"
                
            # Default values for complex temporal features for new ingestions
            h.persistence_hours = 0.0
            h.spatial_cluster_size = 1
            h.land_cover_class = "Unknown"
            
            # Construct feature dict matching the ML model's expected features
            feat = {
                "brightness": h.brightness,
                "frp": h.frp,
                "confidence": h.confidence,
                "pixel_area": h.pixel_area or 1.0,
                "dist_to_industry_m": h.dist_to_industry_m,
                "persistence_hours": h.persistence_hours,
                "recurrence_count": 1,
                "spatial_cluster_size": h.spatial_cluster_size,
                "spread_rate": 0.0,
                "month": h.acq_date.month,
                "hour": h.acq_date.hour,
                "bright_t31": h.bright_t31,
                "brightness_ratio": (h.brightness / h.bright_t31) if h.bright_t31 else 1.0,
                
                # Categorical unencoded
                "daynight": h.daynight,
                "industrial_type": industrial_type,
                "land_cover_class": h.land_cover_class
            }
            features_list.append(feat)
            
        # Convert to DataFrame
        df = pd.DataFrame(features_list)
        
        # Encode categoricals using the saved label encoders
        for col, le in label_encoders.items():
            if col in df.columns:
                # Handle unseen labels by filling with unknown and mapping to a safe class or existing unknown
                df[col] = df[col].astype(str).fillna("unknown")
                # Using a trick for unseen labels during inference
                known_classes = set(le.classes_)
                df[col] = df[col].apply(lambda x: x if x in known_classes else "unknown")
                # Append 'unknown' to classes if not present to avoid transform error, or safely map
                if "unknown" not in le.classes_:
                    le.classes_ = np.append(le.classes_, "unknown")
                df[col + "_encoded"] = le.transform(df[col])
        
        # Extract the exact feature matrix needed by the model
        X = df[feature_names].values.astype(np.float32)
        
        # Predict using the voting classifier
        # For soft voting, we average predict_proba
        probs = np.zeros((len(X), len(target_encoder.classes_)))
        for est in ensemble.estimators_:
            probs += est.predict_proba(X)
        probs /= len(ensemble.estimators_)
        
        y_pred_enc = np.argmax(probs, axis=1)
        max_probs = np.max(probs, axis=1)
        
        y_pred = target_encoder.inverse_transform(y_pred_enc)
        
        end_time = datetime.datetime.utcnow()
        exec_time = (end_time - start_time).total_seconds() * 1000.0
        
        # Update hotspots and create logs
        for i, h in enumerate(hotspots):
            label_id = int(y_pred[i])
            ml_enum_val = enum_map.get(label_id, MLClassificationEnum.UNCLASSIFIED)
            h.ml_label = ml_enum_val
            h.classification_confidence = float(max_probs[i]) * 100.0
            
            # Create classification log
            log = ClassificationLog(
                hotspot_id=h.id,
                model_version=model_artifact.get("version", "v1.0"),
                predicted_label=ml_enum_val,
                probability_scores=str(probs[i].tolist()),
                execution_time_ms=exec_time / len(hotspots)
            )
            db.add(log)
            
            # Check for Alerts
            if ml_enum_val == MLClassificationEnum.INDUSTRIAL_FIRE and h.frp > 100.0:
                alert = Alert(hotspot_id=h.id, alert_type="HIGH_FRP_INDUSTRIAL_FIRE")
                db.add(alert)
                
        db.commit()
        
    logger.info(f"Processed and classified {len(hotspot_ids)} hotspots.")
    return True
