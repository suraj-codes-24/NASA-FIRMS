"""
IGNIS — Seed OSM Facilities into Database

Loads industrial facilities from data/osm/osm_all_industrial_india.csv
into the facilities table.

Usage:
    python scripts/seed_facilities.py
"""

import sys
import os
import csv

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from geoalchemy2.elements import WKTElement
from app.database import SyncSessionLocal
from app.models.spatial import Facility

OSM_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "osm", "osm_all_industrial_india.csv")


def main():
    if not os.path.exists(OSM_CSV):
        print(f"❌ OSM CSV not found: {OSM_CSV}")
        return

    print(f"📂 Loading facilities from {OSM_CSV}...")

    with open(OSM_CSV, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"   Found {len(rows)} facility records.")

    with SyncSessionLocal() as db:
        inserted = 0
        for row in rows:
            osm_id = row.get("osm_id", "")
            lat = float(row.get("lat", 0))
            lon = float(row.get("lon", 0))
            if not osm_id or lat == 0 or lon == 0:
                continue

            exists = db.query(Facility).filter(Facility.osm_id == osm_id).first()
            if exists:
                continue

            facility = Facility(
                osm_id=osm_id,
                name=row.get("name", None),
                facility_type=row.get("facility_type", row.get("type", "industrial")),
                geom=WKTElement(f"POINT({lon} {lat})", srid=4326),
            )
            db.add(facility)
            inserted += 1

        db.commit()

    print(f"✅ Inserted {inserted} new facilities.")


if __name__ == "__main__":
    main()
