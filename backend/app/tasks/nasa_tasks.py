import logging
import datetime
import requests
import pandas as pd
import io
from celery import shared_task
from geoalchemy2.elements import WKTElement

from app.database import SyncSessionLocal
from app.models.spatial import Hotspot, MLClassificationEnum
from app.config import settings

logger = logging.getLogger(__name__)

# Public NASA FIRMS URLs for South Asia (Fallback if no MAP_KEY)
PUBLIC_MODIS_URL = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_South_Asia_24h.csv"
PUBLIC_VIIRS_URL = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_South_Asia_24h.csv"

@shared_task
def fetch_nasa_firms_data():
    """
    Scheduled task to pull active fire data from NASA FIRMS,
    insert new hotspots, and trigger the ML pipeline.
    """
    logger.info("Starting NASA FIRMS ingestion task...")
    
    urls_to_fetch = []
    
    if settings.firms_map_key:
        # If MAP KEY is provided, use the Area API for India's Bounding Box
        bbox = settings.india_bbox
        # VIIRS SNPP 24h
        urls_to_fetch.append(f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{settings.firms_map_key}/VIIRS_SNPP_NRT/{bbox}/1")
        # MODIS 24h
        urls_to_fetch.append(f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{settings.firms_map_key}/MODIS_NRT/{bbox}/1")
    else:
        # Fallback to public South Asia 24h CSVs
        logger.warning("No FIRMS_MAP_KEY provided. Falling back to public 24-hr South Asia CSVs.")
        urls_to_fetch = [PUBLIC_MODIS_URL, PUBLIC_VIIRS_URL]

    all_hotspots_df = []
    
    for url in urls_to_fetch:
        try:
            logger.info(f"Fetching data from: {url.split(settings.firms_map_key)[0] if settings.firms_map_key else url}")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # The API returns 'No fires for this area and date' if empty
            if 'No fires' in response.text:
                continue
                
            df = pd.read_csv(io.StringIO(response.text))
            
            # Standardize columns to match our database
            # NASA CSVs might vary slightly between MODIS and VIIRS
            df['satellite'] = df.get('satellite', 'Unknown')
            df['instrument'] = df.get('instrument', 'Unknown')
            df['daynight'] = df.get('daynight', 'D')
            
            all_hotspots_df.append(df)
        except Exception as e:
            logger.error(f"Error fetching from NASA FIRMS: {e}")
            
    if not all_hotspots_df:
        logger.info("No data fetched from NASA FIRMS.")
        return False
        
    combined_df = pd.concat(all_hotspots_df, ignore_index=True)
    logger.info(f"Fetched {len(combined_df)} total records from NASA FIRMS.")
    
    # Process and insert to database
    with SyncSessionLocal() as db:
        new_hotspot_ids = []
        
        # Deduplication based on lat/lon/acq_date could be added here, 
        # but for demonstration we insert all fetched records as new if they don't exactly match
        
        for _, row in combined_df.iterrows():
            # Combine acq_date and acq_time if available, or just use current time for NRT
            acq_date_str = str(row.get('acq_date', datetime.datetime.utcnow().date()))
            acq_time_str = str(row.get('acq_time', '0000')).zfill(4) # '1420' -> 14:20
            
            try:
                acq_dt = datetime.datetime.strptime(f"{acq_date_str} {acq_time_str}", "%Y-%m-%d %H%M")
            except:
                acq_dt = datetime.datetime.utcnow()
            
            lat = float(row.get('latitude', 0))
            lon = float(row.get('longitude', 0))
            point = f"POINT({lon} {lat})"
            
            # Check if this exact point and time already exists to avoid 24h duplication
            exists = db.query(Hotspot).filter(
                Hotspot.latitude == lat,
                Hotspot.longitude == lon,
                Hotspot.acq_date == acq_dt
            ).first()
            
            if exists:
                continue
                
            hotspot = Hotspot(
                latitude=lat,
                longitude=lon,
                geom=WKTElement(point, srid=4326),
                brightness=float(row.get('brightness', row.get('bright_ti4', 0))),
                bright_t31=float(row.get('bright_t31', row.get('bright_ti5', 0))),
                frp=float(row.get('frp', 0)),
                confidence=float(row.get('confidence', 0)) if str(row.get('confidence')).isnumeric() else 50.0, # some VIIRS use 'n', 'l', 'h'
                satellite=str(row.get('satellite')),
                instrument=str(row.get('instrument')),
                daynight=str(row.get('daynight')),
                pixel_area=1.0,
                acq_date=acq_dt,
                ml_label=MLClassificationEnum.UNCLASSIFIED
            )
            
            db.add(hotspot)
            db.flush() # flush to get the ID
            new_hotspot_ids.append(hotspot.id)
            
        db.commit()
        
    logger.info(f"Inserted {len(new_hotspot_ids)} new unique hotspots into database.")
    
    if new_hotspot_ids:
        # Trigger the ML pipeline
        from app.tasks.ml_tasks import process_hotspots_batch
        process_hotspots_batch.delay(new_hotspot_ids)
        logger.info(f"Enqueued {len(new_hotspot_ids)} hotspots for ML processing.")
        
    return True
