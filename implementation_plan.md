# 🔥 IGNIS — Complete Implementation Plan

> **Project**: AI-Based Detection & Classification of Industrial Fires and Persistent Thermal Sources
> **Source**: `PRE_PROJECT_DOCUMENT.md` (SIH Problem Statement ID: 26162, NTRO)
> **Date**: September 2026

---

## 1. Project Understanding

### 1.1 Problem Statement
NASA FIRMS detects thermal anomalies globally but labels everything as "Active Fire" — it **cannot distinguish** between industrial fires, gas flares, agricultural burns, wildfires, or mining thermal sources. This creates false alarm fatigue, delayed emergency response, and misallocation of disaster-management resources.

### 1.2 Solution — IGNIS
A full-stack AI-enabled geospatial platform that:
1. **Ingests** NASA FIRMS (MODIS/VIIRS) thermal anomaly data for India
2. **Enriches** each hotspot with proximity to OSM industrial facilities, MODIS/ESA land cover, temporal persistence, and spatial clustering
3. **Classifies** each hotspot into 6 categories using an ensemble ML model (RF + XGBoost + LightGBM)
4. **Serves** classified results via FastAPI REST + WebSocket APIs
5. **Visualizes** results on an interactive Leaflet.js GIS dashboard with filtering, analytics, alerts, and reports
6. **Alerts** stakeholders in real-time via WebSocket for high-severity industrial fires

### 1.3 Classification Taxonomy (6 classes)

| Label | Class | Color | Key Indicators |
|-------|-------|-------|----------------|
| 0 | 🔴 Industrial Fire | Red | High FRP, near industrial facility, sudden onset |
| 1 | 🟠 Forest/Wildfire | Orange | Moderate FRP, forest land cover, spatial spread |
| 2 | 🟡 Gas Flare | Yellow | Low-moderate FRP, highly persistent, near refineries |
| 3 | 🟢 Agricultural Burn | Green | Low FRP, cropland, seasonal (Oct-Dec / Apr-May) |
| 4 | 🔵 Mining/Thermal | Blue | Low FRP, persistent, near mining sites |
| 5 | ⚪ Unclassified | Grey | Low confidence |

---

## 2. Requirements Inventory

### DATA Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| DATA-001 | Ingest NASA FIRMS MODIS hotspot data (1km resolution) | CORE | §5.1.1 | Critical | — | Ingestion pipeline | CSV parsed, records in DB |
| DATA-002 | Ingest NASA FIRMS VIIRS hotspot data (375m resolution, SNPP + NOAA-20) | CORE | §5.1.1 | Critical | — | Ingestion pipeline | CSV parsed, records in DB |
| DATA-003 | FIRMS fields: latitude, longitude, brightness, scan, track, acq_date, acq_time, satellite, instrument, confidence, version, bright_t31, frp, daynight, type | CORE | §5.1.1 | Critical | DATA-001/002 | Validation | All 15 columns present |
| DATA-004 | Fetch OSM industrial facilities via Overpass API (tags: landuse=industrial, man_made=petroleum_well, power=plant, industrial=*, man_made=works) | CORE | §5.1.2 | Critical | — | OSM service | GeoJSON with name, type, geometry, tags |
| DATA-005 | MODIS Land Cover MCD12Q1 (IGBP 17-class, 500m) or ESA WorldCover (10m) | CORE | §5.1.3 | Critical | — | Land cover lookup | Class returned for any India coordinate |
| DATA-006 | VIIRS Nightfire gas flare catalog for positive label validation | HIGH | §6.2 | High | — | Training labeling | Known flare locations usable |
| DATA-007 | Sentinel-2 multispectral imagery (B12, B11, B8A) for fire confirmation | OPTIONAL | §5.1.4 | Low | — | Enhancement | — |
| DATA-008 | India bounding box: 68.0, 6.0, 97.5, 37.5 | CORE | §15.2 | Critical | — | Config | Correct bbox used in all queries |
| DATA-009 | Historical FIRMS data (12+ months for training) | CORE | §6.3 | Critical | DATA-001/002 | ML training | Sufficient temporal coverage |

### ML Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| ML-001 | 16 engineered features per hotspot | CORE | §5.3 | Critical | DATA-001..006 | Feature engineering | All 16 features computed |
| ML-002 | Semi-supervised labeling (rule-based + land cover + seasonal + VIIRS Nightfire + news correlation) | CORE | §6.2 | Critical | ML-001 | Labeling pipeline | Labels assigned with documented rules |
| ML-003 | Ensemble model: Random Forest (n=200) + XGBoost (depth=8) + LightGBM (leaves=63) | CORE | §6.1 | Critical | ML-002 | Model training | 3 models trained |
| ML-004 | Soft Voting / Stacking classifier ensemble | CORE | §6.1 | Critical | ML-003 | Ensemble | Ensemble predictions working |
| ML-005 | Train/Val/Test split: 70/15/15 | CORE | §6.3 | Critical | ML-002 | Data splitting | No leakage, correct ratios |
| ML-006 | Hyperparameter tuning with Optuna / GridSearch | CORE | §6.3 | High | ML-003 | Tuning | Best params documented |
| ML-007 | Overall accuracy > 85% | CORE | §6.4 | Critical | ML-004 | Evaluation | Metric achieved |
| ML-008 | Macro F1-score > 0.82 | CORE | §6.4 | Critical | ML-004 | Evaluation | Metric achieved |
| ML-009 | Industrial Fire recall > 90% | CORE | §6.4 | Critical | ML-004 | Evaluation | Metric achieved |
| ML-010 | Gas Flare precision > 90% | CORE | §6.4 | Critical | ML-004 | Evaluation | Metric achieved |
| ML-011 | Confusion matrix with low off-diagonal values | CORE | §6.4 | High | ML-004 | Evaluation | Matrix visualized |
| ML-012 | Model export as joblib / ONNX | CORE | §6.3 | Critical | ML-006 | Serialization | Model file loadable |
| ML-013 | Temporal persistence analyzer | CORE | §3.1 | High | DATA-009 | Analysis module | Persistence hours computed |
| ML-014 | Anomaly detection module for unusual FRP spikes | CORE | §3.1 | High | ML-001 | Anomaly module | Anomalies flagged |

### GIS Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| GIS-001 | Spatial join: hotspots ↔ industrial facilities (within 2km) | CORE | §3.3, §11.2 | Critical | DATA-001, DATA-004 | GeoPandas/PostGIS | Correct distance calculations |
| GIS-002 | Land cover lookup at hotspot coordinates | CORE | §5.3 | Critical | DATA-005 | Raster lookup | IGBP class returned |
| GIS-003 | PostGIS POINT geometry for every hotspot | CORE | §11.1 | Critical | DATA-001 | DB model | Valid geometry column |
| GIS-004 | PostGIS POLYGON/POINT for facilities | CORE | §11.1 | Critical | DATA-004 | DB model | Valid geometry column |
| GIS-005 | ST_DWithin, ST_Intersects spatial queries | CORE | §11.2 | Critical | GIS-003, GIS-004 | PostGIS | Correct query results |
| GIS-006 | Spatial clustering (hotspots within 5km radius) | CORE | §5.3 | High | DATA-001 | Feature eng. | Cluster size computed |
| GIS-007 | Spread rate calculation (km/hr) | CORE | §5.3 | High | DATA-009 | Feature eng. | Rate computed from temporal data |
| GIS-008 | ST_SnapToGrid for persistence grouping | CORE | §11.2 | High | GIS-003 | PostGIS | Grouped correctly |
| GIS-009 | Geographic distance (not planar) for all calculations | CORE | §5.3 | Critical | — | All spatial | Geography type used |
| GIS-010 | GIST spatial indexing for performance | CORE | §17 R6 | High | GIS-003 | PostGIS | Index created |

### BACKEND Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| BE-001 | FastAPI application (Python 3.11) | CORE | §4.2 | Critical | — | Backend | App starts, docs available |
| BE-002 | 7 router modules: hotspots, alerts, analytics, facilities, reports, auth, websocket | CORE | §10.1 | Critical | BE-001 | Routers | All routers mounted |
| BE-003 | 5 service modules: FIRMS, Classification, Spatial, Alert, Report | CORE | §10.1 | Critical | BE-002 | Services | Services functional |
| BE-004 | SQLAlchemy ORM + PostGIS (GeoAlchemy2) | CORE | §10.2 | Critical | BE-001 | Database layer | Models mapped to tables |
| BE-005 | Celery 5 task queue with Redis broker | CORE | §4.2 | Critical | BE-001 | Task queue | Tasks execute |
| BE-006 | APScheduler for periodic data ingestion (every 3 hours) | CORE | §4.2 | Critical | BE-005 | Scheduler | Cron fires, ingestion runs |
| BE-007 | WebSocket endpoint /ws/alerts for real-time alerts | CORE | §14.1 | High | BE-001 | WebSocket | Alerts push to clients |
| BE-008 | Alembic database migrations | CORE | §10.2 | High | BE-004 | Migrations | Schema versioned |
| BE-009 | JWT authentication (admin/viewer roles) | MEDIUM | §8.2 F14 | Medium | BE-001 | Auth | Login/token working |
| BE-010 | PDF/CSV report generation | MEDIUM | §8.2 F11 | Medium | BE-003 | Report service | Files downloadable |
| BE-011 | Redis caching for API responses | HIGH | §4.2 | High | BE-001 | Cache | Cached responses served |
| BE-012 | Pydantic schemas for request/response validation | CORE | §10.2 | Critical | BE-002 | Schemas | Validation works |
| BE-013 | CORS middleware for frontend access | CORE | — | Critical | BE-001 | Middleware | Frontend can call API |

### API Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| API-001 | GET /api/hotspots (with filters: date, type, confidence, state, bbox, pagination) | CORE | §14.1 | Critical | BE-002 | Hotspots router | Returns filtered list |
| API-002 | GET /api/hotspots/{id} — hotspot detail | CORE | §14.1 | Critical | BE-002 | Hotspots router | Returns full detail |
| API-003 | GET /api/hotspots/{id}/history — location history | CORE | §14.1 | High | BE-002 | Hotspots router | Returns temporal data |
| API-004 | GET /api/hotspots/latest — most recent ingestion | CORE | §14.1 | Critical | BE-002 | Hotspots router | Returns latest data |
| API-005 | GET /api/hotspots/heatmap — heatmap data points | CORE | §14.1 | High | BE-002 | Hotspots router | Returns lat/lon/weight |
| API-006 | GET /api/facilities (with filters: type, state, bbox) | CORE | §14.1 | Critical | BE-002 | Facilities router | Returns facilities |
| API-007 | GET /api/facilities/{id} | CORE | §14.1 | High | BE-002 | Facilities router | Returns detail |
| API-008 | GET /api/facilities/{id}/hotspots — nearby hotspots | CORE | §14.1 | High | BE-002 | Facilities router | Returns spatial query |
| API-009 | GET /api/analytics/summary — dashboard stats | CORE | §14.1 | Critical | BE-002 | Analytics router | Returns counts |
| API-010 | GET /api/analytics/timeline — time-series counts | CORE | §14.1 | High | BE-002 | Analytics router | Returns series |
| API-011 | GET /api/analytics/classification — breakdown | CORE | §14.1 | High | BE-002 | Analytics router | Returns per-class |
| API-012 | GET /api/analytics/top-states | CORE | §14.1 | High | BE-002 | Analytics router | Returns ranked states |
| API-013 | GET /api/analytics/persistence — persistent sources | CORE | §14.1 | High | BE-002 | Analytics router | Returns persistent list |
| API-014 | GET /api/alerts + PUT acknowledge/resolve | CORE | §14.1 | High | BE-002 | Alerts router | CRUD works |
| API-015 | POST /api/reports/generate + GET download | MEDIUM | §14.1 | Medium | BE-002 | Reports router | File generated |
| API-016 | WS /ws/alerts — real-time alert stream | CORE | §14.1 | High | BE-007 | WebSocket | Messages pushed |
| API-017 | POST /api/auth/login + /api/auth/register | MEDIUM | §14.1 | Medium | BE-009 | Auth router | JWT issued |

### FRONTEND Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| UI-001 | React.js 18 + Vite frontend | CORE | §7.1 | Critical | — | Frontend app | App builds and serves |
| UI-002 | Leaflet.js 1.9 interactive GIS map with CartoDB Dark Matter tiles | CORE | §9.4 | Critical | UI-001 | MapContainer | Map renders |
| UI-003 | Color-coded classified hotspot markers (6 colors per doc) | CORE | §3.2 | Critical | UI-002 | HotspotMarkers | Correct colors |
| UI-004 | Click marker → detail popup (classification, confidence, FRP, facility) | CORE | §8.1 F4 | Critical | UI-002 | DetailPopup | Popup shows |
| UI-005 | Filter sidebar: date range, fire type, confidence slider, region | CORE | §8.1 F5 | High | UI-001 | FilterSidebar | Filters work |
| UI-006 | Dashboard stats bar (5 stat cards) | CORE | §8.1 F6 | High | UI-001 | StatsBar | Cards show real data |
| UI-007 | Time-series line chart | CORE | §8.1 F6 | High | UI-001 | TimelineChart | Chart renders |
| UI-008 | Pie chart (classification breakdown) | CORE | §9.3 | High | UI-001 | PieChart | Chart renders |
| UI-009 | Bar chart (analytics) | CORE | §9.3 | High | UI-001 | BarChart | Chart renders |
| UI-010 | Industrial facility overlay with buffer zones | HIGH | §8.2 F9 | High | UI-002 | FacilityOverlay | Facilities on map |
| UI-011 | Heatmap layer | MEDIUM | §8.2 F12 | Medium | UI-002 | HeatmapLayer | Density shown |
| UI-012 | Map legend | CORE | §9.3 | Critical | UI-002 | MapLegend | Legend visible |
| UI-013 | Real-time alert toast notifications via WebSocket | HIGH | §8.1 F7 | High | API-016 | useWebSocket | Toasts appear |
| UI-014 | Alert management table (severity, status, actions) | HIGH | §9.2 | High | UI-001 | AlertTable | Table works |
| UI-015 | Analytics page with charts and classification detail | HIGH | §9.2 | High | UI-001 | AnalyticsPage | Page renders |
| UI-016 | Reports page (generate PDF/CSV) | MEDIUM | §9.2 | Medium | UI-001 | ReportsPage | Export works |
| UI-017 | Historical playback time slider | MEDIUM | §8.2 F10 | Medium | UI-002 | TimeSlider | Animation works |
| UI-018 | Login/Settings pages | MEDIUM | §9.2 | Medium | UI-001 | Auth pages | Auth flow works |
| UI-019 | Dark theme design system per §9.4 specs | CORE | §9.4 | Critical | UI-001 | CSS/Theme | Matches spec |
| UI-020 | Framer Motion page transitions, CSS pulse for active fires | CORE | §9.4 | High | UI-001 | Animations | Smooth animations |
| UI-021 | React Router with routes: /, /analytics, /hotspot/:id, /alerts, /reports, /settings, /login | CORE | §9.2 | Critical | UI-001 | Router | All routes work |
| UI-022 | Material UI 5 component library | CORE | §7.1 | High | UI-001 | UI framework | MUI components used |
| UI-023 | Lucide React icons | CORE | §9.4 | High | UI-001 | Icons | Icons render |
| UI-024 | Inter + Roboto Google Fonts | CORE | §9.4 | High | UI-001 | Typography | Fonts loaded |
| UI-025 | Glassmorphism card styling per spec | CORE | §9.4 | High | UI-001 | CSS | Visual match |
| UI-026 | Responsive design (desktop + mobile browser PWA) | HIGH | §4.1 | High | UI-001 | Layout | Works on mobile |
| UI-027 | Comparison view (two date ranges) | MEDIUM | §8.2 F13 | Medium | UI-001 | ComparisonView | Side-by-side works |
| UI-028 | Axios HTTP client for API calls | CORE | §7.1 | Critical | UI-001 | api.js service | API calls work |

### DATABASE Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| DB-001 | PostgreSQL 16 + PostGIS 3.4 | CORE | §4.2 | Critical | — | Database | DB running with PostGIS |
| DB-002 | HOTSPOT table with all fields from §11.1 ERD | CORE | §11.1 | Critical | DB-001 | Schema | Table created |
| DB-003 | FACILITY table with all fields from §11.1 ERD | CORE | §11.1 | Critical | DB-001 | Schema | Table created |
| DB-004 | ALERT table with lifecycle (active/acknowledged/resolved) | CORE | §11.1 | Critical | DB-001 | Schema | Table created |
| DB-005 | CLASSIFICATION_LOG table with feature_vector jsonb | CORE | §11.1 | Critical | DB-001 | Schema | Table created |
| DB-006 | USER_ACCOUNT table (email, password_hash, role) | MEDIUM | §11.1 | Medium | DB-001 | Schema | Table created |
| DB-007 | UUID primary keys on all tables | CORE | §11.1 | Critical | DB-001 | Schema | UUIDs used |
| DB-008 | GIST spatial indexes | CORE | §17 R6 | High | DB-002 | Performance | Indexes created |
| DB-009 | Redis 7 for caching + Celery broker | CORE | §4.2 | Critical | — | Cache/Queue | Redis running |

### INFRASTRUCTURE Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| INFRA-001 | Docker + Docker Compose deployment | CORE | §15.1 | Critical | ALL | Docker | Stack starts |
| INFRA-002 | 7 containers: nginx, frontend, backend, worker, scheduler, postgres, redis | CORE | §15.1 | Critical | INFRA-001 | docker-compose.yml | All services healthy |
| INFRA-003 | Nginx reverse proxy (SSL termination, load balancing) | CORE | §4.2 | High | INFRA-001 | Nginx config | Proxy works |
| INFRA-004 | Celery Beat scheduler container | CORE | §15.1 | Critical | BE-005 | Scheduler | Periodic tasks fire |
| INFRA-005 | .env.example with all environment variables from §15.2 | CORE | §15.2 | Critical | — | Config | All vars documented |
| INFRA-006 | GitHub Actions CI/CD | MEDIUM | §7.1 | Medium | — | CI/CD | Pipeline runs |

### TESTING Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| TEST-001 | Data validation tests | CORE | Phase rules | High | DATA-* | Tests | Tests pass |
| TEST-002 | Preprocessing tests | CORE | Phase rules | High | ML-001 | Tests | Tests pass |
| TEST-003 | Feature engineering tests | CORE | Phase rules | High | ML-001 | Tests | Tests pass |
| TEST-004 | ML pipeline tests (training, prediction) | CORE | Phase rules | High | ML-003 | Tests | Tests pass |
| TEST-005 | API endpoint tests | CORE | Phase rules | High | API-* | Tests | Tests pass |
| TEST-006 | Integration tests (end-to-end) | CORE | Phase rules | High | ALL | Tests | Tests pass |
| TEST-007 | Spatial query tests | CORE | Phase rules | High | GIS-* | Tests | Tests pass |

### OPTIONAL/FUTURE Requirements

| ID | Requirement | Type | Source Section | Priority | Dependency | Component | Verification |
|----|-------------|------|---------------|----------|------------|-----------|-------------|
| FUT-001 | Sentinel-2 satellite imagery overlay | OPTIONAL | §8.3 F15 | Low | — | — | — |
| FUT-002 | Predictive fire risk modeling | OPTIONAL | §8.3 F16 | Low | — | — | — |
| FUT-003 | Multi-language support (Hindi + English) | OPTIONAL | §8.3 F17 | Low | — | — | — |
| FUT-004 | Progressive Web App (PWA) | OPTIONAL | §8.3 F18 | Low | — | — | — |
| FUT-005 | CNN on Sentinel-2 image patches | FUTURE | §19 | Future | — | — | — |
| FUT-006 | ISRO satellite integration | FUTURE | §19 | Future | — | — | — |
| FUT-007 | Drone thermal feed integration | FUTURE | §19 | Future | — | — | — |
| FUT-008 | CPCB air quality correlation | FUTURE | §19 | Future | — | — | — |
| FUT-009 | Multi-country expansion | FUTURE | §19 | Future | — | — | — |
| FUT-010 | Public API for third-party integration | FUTURE | §19 | Future | — | — | — |
| FUT-011 | Automated incident reports to NDMA/SDMA | FUTURE | §19 | Future | — | — | — |
| FUT-012 | Crowd-sourced verification mobile app | FUTURE | §19 | Future | — | — | — |

---

## 3. Data Verification Report

### 3.1 Downloaded Data Inventory

| # | File | Size | Records | Columns | Date Range | Status |
|---|------|------|---------|---------|------------|--------|
| 1 | `firms/firms_modis_india.csv` | 20.5 MB | 272,763 | 15 (brightness, bright_t31) | 2024-09-16 → 2026-04-30 | ✓ COMPLETE |
| 2 | `firms/firms_viirs_snpp_india.csv` | 132.3 MB | 1,767,208 | 15 (bright_ti4, bright_ti5) | 2024-09-16 → 2026-04-27 | ✓ COMPLETE |
| 3 | `firms/firms_viirs_noaa20_india.csv` | 148.6 MB | 1,934,697 | 15 (bright_ti4, bright_ti5) | 2024-09-16 → 2026-05-31 | ✓ COMPLETE |
| 4 | `firms/firms_viirs_snpp_india_historical.csv` | 274.2 MB | 3,662,968 | 15 | 2016-10-30 → 2020-11-22 | ✓ COMPLETE |
| 5 | `osm/osm_all_industrial_india.csv` | 4.5 MB | 88,596 | 8 (osm_id, type, lat, lon, name, facility_type, operator, source_fuel) | — | ✓ COMPLETE |
| 6 | `osm/` (12 JSON files) | ~122 MB total | Various | OSM Overpass elements | — | ✓ COMPLETE |
| 7 | `nightfire/india_known_flares_reference.csv` | 3 KB | 48 | 6 (name, lat, lon, type, state, operator) | — | ⚠ NEEDS VALIDATION |
| 8 | `nightfire/vnf_raw_download.csv.gz` | 8.5 KB | Unreadable | — | — | ✗ NEEDS INVESTIGATION |
| 9 | `landcover/esa_worldcover_india_links.json` | 3.6 MB | 210 tiles (links only) | — | — | ⚠ LINKS ONLY — NO RASTER DATA |
| 10 | `ignis_training_dataset.csv` | 153.6 MB | 813,848 | 29 | — | ⚠ NEEDS VALIDATION |
| 11 | `ignis_training_dataset_v2.csv` | 25.3 MB | 200,000 | 19 (all 16 features + ml_label) | — | ✓ USABLE BUT SEE ISSUES |

### 3.2 Detailed Data Issues

#### Issue 1: Column Name Mismatch Between MODIS and VIIRS
- **MODIS** uses `brightness` and `bright_t31`
- **VIIRS** uses `bright_ti4` and `bright_ti5`
- **Impact**: Feature engineering must handle column harmonization
- **Action**: Create unified schema mapping during preprocessing

#### Issue 2: VIIRS Confidence is Categorical, Not Numeric
- VIIRS confidence values are `n` (nominal), `l` (low), `h` (high) — NOT 0-100 numeric
- MODIS confidence is numeric (0-100)
- **Impact**: The doc's §5.3 feature `confidence (0-100)` only applies to MODIS; VIIRS needs encoding
- **Action**: Map VIIRS confidence: `l=30, n=50, h=90` (standard FIRMS convention)

#### Issue 3: Training Dataset v1 Has Only Binary Labels
- `ignis_training_dataset.csv` (v1): 786,474 label=0 and 27,374 label=1 — only 2 classes
- This does NOT match the 6-class taxonomy required by the document
- **Action**: Use **v2** as the primary training dataset, or re-generate labels

#### Issue 4: Training Dataset v2 Extreme Class Imbalance
- Label 5 (Unclassified): 196,663 (98.3%)
- Label 0 (Industrial Fire): 1,046 (0.5%)
- Label 1 (Forest Fire): 306 (0.15%)
- Label 2 (Gas Flare): 725 (0.36%)
- Label 3 (Agricultural Burn): 851 (0.43%)
- Label 4 (Mining): 409 (0.2%)
- **Impact**: Model will be heavily biased toward "Unclassified"
- **Action**: Stratified sampling, SMOTE oversampling, class weights, or undersample majority class during training

#### Issue 5: Land Cover Data Not Downloaded (Links Only)
- `esa_worldcover_india_links.json` contains 210 tile URLs but **no actual raster TIF files**
- The URLs contain temporary SAS tokens that have likely expired
- **Impact**: Cannot perform land cover lookups without actual raster data
- **Action**: Download actual land cover raster tiles or use an alternative approach

#### Issue 6: VIIRS Nightfire Data Corrupted/Insufficient
- `vnf_raw_download.csv.gz` is only 8.5 KB — too small to contain meaningful data
- The 48-record `india_known_flares_reference.csv` is useful but small
- **Impact**: Limited gas flare ground-truth data
- **Action**: The 48-record reference file is adequate for validation; supplement with OSM refinery proximity

#### Issue 7: V2 Training Data Has "Unknown" Land Cover
- Many records show `land_cover_class: Unknown` — suggests land cover raster wasn't available during generation
- **Action**: Re-derive land cover after downloading actual raster data, or proceed with Unknown as a feature value

### 3.3 Data vs Requirements Comparison

| Required Dataset (from Doc) | Downloaded? | Correct Format? | Date Range | Coverage | Missing Fields | Status | Action |
|----------------------------|-------------|-----------------|------------|----------|----------------|--------|--------|
| NASA FIRMS MODIS (India) | ✓ | ✓ CSV, 15 cols | Sep 2024 – Apr 2026 | India bbox | None | ✓ COMPLETE | Ready to use |
| NASA FIRMS VIIRS SNPP (India) | ✓ | ✓ CSV, 15 cols | Sep 2024 – Apr 2026 | India bbox | None | ✓ COMPLETE | Harmonize col names |
| NASA FIRMS VIIRS NOAA-20 (India) | ✓ | ✓ CSV, 15 cols | Sep 2024 – May 2026 | India bbox | None | ✓ COMPLETE | Harmonize col names |
| FIRMS Historical (for training) | ✓ | ✓ CSV | Oct 2016 – Nov 2020 | India bbox | None | ✓ COMPLETE | Good historical depth |
| OSM Industrial Facilities | ✓ | ✓ CSV + JSON | Static | India | None | ✓ COMPLETE | Ready to use |
| MODIS Land Cover MCD12Q1 / ESA WorldCover | ⚠ Links only | ✗ No raster | — | — | Actual raster files | ⚠ INCOMPLETE | Must download raster OR use alternative |
| VIIRS Nightfire Catalog | ⚠ Partial | ✓ CSV | Static | India | Full VNF dataset | ⚠ PARTIAL | 48 known flares adequate for validation |
| Sentinel-2 Imagery | ✗ Not downloaded | — | — | — | All | ✗ OPTIONAL | Skip — marked optional in doc |

---

## 4. Additional Data Required

### 4.1 Land Cover Raster (CRITICAL)

| Aspect | Detail |
|--------|--------|
| **What** | ESA WorldCover 10m or MODIS MCD12Q1 500m raster tiles for India |
| **Why** | Required by ML-001 feature #8 `land_cover_class`, GIS-002, and classification decision flow §3.3 |
| **Which component** | Feature engineering pipeline, spatial service |
| **Format** | GeoTIFF (.tif) |
| **Coverage** | India bounding box (68.0, 6.0, 97.5, 37.5) |
| **Size** | ~2-5 GB for ESA WorldCover India tiles; ~200 MB for MODIS MCD12Q1 |
| **Storage** | `data/landcover/` |
| **Priority** | **MANDATORY** — classification cannot work without land cover |

> [!IMPORTANT]
> **Recommended approach**: Rather than downloading ~5GB of WorldCover raster tiles, we can implement a **simplified land cover lookup** using the existing OSM data (industrial vs non-industrial) combined with a lightweight API call, OR download just the MODIS MCD12Q1 product which is smaller. Alternatively, we can use the `land_cover_class` column already present in the v2 training dataset (even though many are "Unknown") and treat land cover as a feature that degrades gracefully.

### 4.2 No Other Mandatory Downloads Required

All other data sources referenced in the document are either:
- Already downloaded (FIRMS, OSM, Nightfire reference)
- Optional (Sentinel-2 — marked as "Optional Enhancement" in §5.1.4)
- Available via real-time API calls (FIRMS API for ongoing ingestion, OSM Overpass for periodic refresh)

---

## 5. Implementation Architecture

### 5.1 Complete Data Flow

```
NASA FIRMS API (MODIS/VIIRS)          OSM Overpass API          Land Cover Raster
         ↓                                  ↓                        ↓
    CSV Download                      GeoJSON Response          GeoTIFF Tiles
         ↓                                  ↓                        ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                        DATA INGESTION LAYER                             │
  │  Parse CSV → Validate → Deduplicate → Harmonize MODIS/VIIRS columns   │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                     SPATIAL ENRICHMENT LAYER                            │
  │  Spatial Join (hotspot↔facility) → Land Cover Lookup → Persistence    │
  │  Distance calc → Industrial type → Cluster size → Spread rate          │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                     FEATURE ENGINEERING LAYER                           │
  │  16 features: brightness, frp, confidence, daynight, pixel_area,       │
  │  dist_to_industrial, industrial_type, land_cover, persistence_hours,   │
  │  recurrence_count, cluster_size, spread_rate, month, hour, bright_t31, │
  │  brightness_ratio                                                       │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                        ML CLASSIFICATION LAYER                          │
  │  Ensemble: Random Forest + XGBoost + LightGBM → Soft Voting/Stacking  │
  │  Output: class label (0-5) + confidence score                           │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                         STORAGE LAYER                                   │
  │  PostgreSQL + PostGIS: hotspots, facilities, alerts, classification_log │
  │  Redis: API cache + Celery broker                                       │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                      APPLICATION LAYER                                  │
  │  FastAPI: REST endpoints + WebSocket alerts                             │
  │  Celery Workers: background ingestion + batch classification            │
  │  APScheduler / Celery Beat: periodic triggers (every 3 hrs)            │
  └───────────────────────────────┬──────────────────────────────────────────┘
                                  ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                     PRESENTATION LAYER                                  │
  │  React.js 18 + Leaflet.js + Chart.js + Material UI                     │
  │  Pages: Dashboard, Analytics, Alerts, Reports, Settings, Login          │
  │  Real-time: WebSocket alert toasts + marker updates                     │
  └──────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Component Responsibilities

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Data Ingestion** | Python (pandas, requests) | Fetch FIRMS CSV, parse, validate, harmonize MODIS/VIIRS schemas |
| **Spatial Engine** | GeoPandas, Shapely, PostGIS | Spatial joins, distance calculations, clustering, land cover lookup |
| **Feature Pipeline** | pandas, NumPy | Compute all 16 ML features from raw + spatial data |
| **ML Training** | scikit-learn, XGBoost, LightGBM, Optuna | Train/tune/evaluate ensemble classifier |
| **ML Inference** | joblib-loaded model | Real-time classification of new hotspots |
| **Database** | PostgreSQL 16 + PostGIS 3.4 | Spatial storage, queries, persistence |
| **Cache/Queue** | Redis 7 | API response caching, Celery message broker |
| **API Server** | FastAPI | REST endpoints, WebSocket, request validation |
| **Task Workers** | Celery 5 | Background ingestion, batch classification |
| **Scheduler** | Celery Beat / APScheduler | Trigger ingestion every 3 hours |
| **Frontend** | React.js 18, Vite, Leaflet.js, Chart.js, MUI 5 | Interactive dashboard, map, charts, alerts |
| **Reverse Proxy** | Nginx | SSL, load balancing, static file serving |
| **Containers** | Docker Compose | Orchestrate all 7 services |

---

## 6. Project Structure

```
ignis/
├── frontend/                          # React.js Frontend (Vite)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── MapContainer.jsx
│   │   │   │   ├── HotspotMarkers.jsx
│   │   │   │   ├── HeatmapLayer.jsx
│   │   │   │   ├── FacilityOverlay.jsx
│   │   │   │   ├── MapLegend.jsx
│   │   │   │   └── DetailPopup.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── StatsBar.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── TimelineChart.jsx
│   │   │   ├── Filters/
│   │   │   │   ├── FilterSidebar.jsx
│   │   │   │   ├── DateRangeFilter.jsx
│   │   │   │   ├── FireTypeFilter.jsx
│   │   │   │   ├── ConfidenceSlider.jsx
│   │   │   │   └── RegionSelector.jsx
│   │   │   ├── Alerts/
│   │   │   │   ├── AlertTable.jsx
│   │   │   │   └── AlertDetail.jsx
│   │   │   ├── Analytics/
│   │   │   │   ├── PieChart.jsx
│   │   │   │   ├── BarChart.jsx
│   │   │   │   ├── LineChart.jsx
│   │   │   │   └── ClassificationDetail.jsx
│   │   │   └── Common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Loader.jsx
│   │   │       └── Badge.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── HotspotDetailPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js
│   │   │   └── useHotspots.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── map.css
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/                           # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app instance, middleware, startup
│   │   ├── config.py                 # Pydantic Settings (env vars)
│   │   ├── database.py               # SQLAlchemy engine + PostGIS session
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── hotspots.py           # /api/hotspots/*
│   │   │   ├── alerts.py             # /api/alerts/*
│   │   │   ├── analytics.py          # /api/analytics/*
│   │   │   ├── facilities.py         # /api/facilities/*
│   │   │   ├── reports.py            # /api/reports/*
│   │   │   ├── auth.py               # /api/auth/*
│   │   │   └── websocket.py          # /ws/alerts
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── hotspot.py
│   │   │   ├── facility.py
│   │   │   ├── alert.py
│   │   │   ├── user.py
│   │   │   └── classification.py
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── hotspot.py
│   │   │   ├── alert.py
│   │   │   ├── analytics.py
│   │   │   ├── facility.py
│   │   │   ├── report.py
│   │   │   └── auth.py
│   │   ├── services/                 # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── firms_service.py      # FIRMS API data fetcher
│   │   │   ├── osm_service.py        # OSM Overpass queries
│   │   │   ├── classification.py     # ML inference service
│   │   │   ├── spatial_service.py    # PostGIS spatial queries
│   │   │   ├── alert_service.py      # Alert creation + broadcast
│   │   │   └── report_service.py     # PDF/CSV generation
│   │   ├── ml/                       # ML components
│   │   │   ├── __init__.py
│   │   │   ├── model.py              # Model loading & prediction
│   │   │   ├── features.py           # Feature engineering (16 features)
│   │   │   ├── train.py              # Training script
│   │   │   ├── evaluate.py           # Evaluation metrics
│   │   │   └── models/               # Saved model artifacts
│   │   │       └── .gitkeep
│   │   ├── tasks/                    # Celery tasks
│   │   │   ├── __init__.py
│   │   │   ├── celery_app.py         # Celery config
│   │   │   ├── ingestion.py          # Periodic data ingestion task
│   │   │   └── classification.py     # Batch classification task
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── geo_utils.py          # Coordinate validation, CRS helpers
│   │       └── constants.py          # Fire types, colors, thresholds
│   ├── alembic/                      # DB migrations
│   │   ├── alembic.ini
│   │   ├── env.py
│   │   └── versions/
│   ├── requirements.txt
│   └── Dockerfile
│
├── ml_pipeline/                      # ML training pipeline (offline)
│   ├── notebooks/
│   │   ├── 01_data_exploration.ipynb
│   │   ├── 02_feature_engineering.ipynb
│   │   ├── 03_model_training.ipynb
│   │   └── 04_model_evaluation.ipynb
│   ├── scripts/
│   │   ├── prepare_training_data.py
│   │   ├── train_model.py
│   │   ├── evaluate_model.py
│   │   └── export_model.py
│   └── configs/
│       └── training_config.yaml
│
├── data/                             # Data directory (existing)
│   ├── raw/                          # Original downloaded files
│   │   ├── firms/
│   │   ├── osm/
│   │   ├── nightfire/
│   │   └── landcover/
│   ├── processed/                    # Cleaned, harmonized data
│   └── models/                       # Trained model artifacts
│
├── tests/
│   ├── __init__.py
│   ├── unit/
│   │   ├── test_features.py
│   │   ├── test_geo_utils.py
│   │   └── test_classification.py
│   ├── integration/
│   │   ├── test_ingestion_pipeline.py
│   │   └── test_spatial_queries.py
│   └── api/
│       ├── test_hotspots_api.py
│       ├── test_alerts_api.py
│       └── test_analytics_api.py
│
├── configs/
│   └── nginx.conf                    # Nginx reverse proxy config
│
├── scripts/
│   ├── init_db.py                    # Database initialization
│   ├── seed_facilities.py            # Load OSM facilities into DB
│   ├── seed_hotspots.py              # Load historical FIRMS data
│   └── download_landcover.py         # Download land cover raster
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

## 7. Implementation Roadmap

### Phase 0 — Environment & Project Setup
| Aspect | Detail |
|--------|--------|
| **Objective** | Set up project skeleton, virtual environments, dependencies |
| **Requirements** | INFRA-005 |
| **Files** | `.env.example`, `requirements.txt`, `package.json`, `docker-compose.yml`, `.gitignore`, project directories |
| **Dependencies** | None |
| **Tasks** | Create directory structure, initialize Python venv, initialize React+Vite, configure Docker Compose skeleton |
| **Validation** | Backend server starts, frontend dev server starts, Docker Compose builds |

### Phase 1 — Data Preprocessing & Harmonization
| Aspect | Detail |
|--------|--------|
| **Objective** | Clean, validate, and harmonize all FIRMS data (MODIS + VIIRS); resolve column name differences |
| **Requirements** | DATA-001, DATA-002, DATA-003, DATA-008, DATA-009 |
| **Files** | `ml_pipeline/scripts/prepare_training_data.py`, `backend/app/ml/features.py` |
| **Dependencies** | Phase 0, downloaded data |
| **Tasks** | Harmonize MODIS (brightness/bright_t31) ↔ VIIRS (bright_ti4/bright_ti5), encode VIIRS categorical confidence, validate lat/lon within India bbox, remove duplicates, create unified DataFrame |
| **Validation** | Unified CSV with consistent columns, no nulls in critical fields, correct India coverage |

### Phase 2 — Spatial Data & Feature Engineering
| Aspect | Detail |
|--------|--------|
| **Objective** | Implement all 16 ML features: spatial join with OSM facilities, land cover lookup, persistence, clustering |
| **Requirements** | ML-001, GIS-001..009, DATA-004, DATA-005, DATA-006 |
| **Files** | `backend/app/ml/features.py`, `backend/app/utils/geo_utils.py`, `scripts/seed_facilities.py` |
| **Dependencies** | Phase 1, OSM data, land cover data |
| **Tasks** | Spatial join (BallTree/KDTree for facility proximity), land cover class assignment, persistence hours calculation, recurrence count, spatial cluster size, spread rate, brightness ratio, time features |
| **Validation** | All 16 features computed for sample data, feature distributions plausible |

### Phase 3 — Semi-Supervised Labeling
| Aspect | Detail |
|--------|--------|
| **Objective** | Implement rule-based labeling per §6.2 strategy; address v2 class imbalance |
| **Requirements** | ML-002 |
| **Files** | `ml_pipeline/scripts/prepare_training_data.py` |
| **Dependencies** | Phase 2 |
| **Tasks** | Implement labeling rules (OSM proximity → Industrial/Gas Flare, land cover → Forest/Agri, seasonal → Agri, VIIRS Nightfire → Gas Flare), validate labels against known flare reference, balance classes |
| **Validation** | Label distribution reasonable (not 98% one class), labels match decision flow in §3.3 |

### Phase 4 — ML Model Training & Evaluation
| Aspect | Detail |
|--------|--------|
| **Objective** | Train RF + XGBoost + LightGBM ensemble; tune hyperparameters; evaluate against §6.4 targets |
| **Requirements** | ML-003..ML-012 |
| **Files** | `ml_pipeline/scripts/train_model.py`, `ml_pipeline/scripts/evaluate_model.py`, `ml_pipeline/configs/training_config.yaml` |
| **Dependencies** | Phase 3 |
| **Tasks** | 70/15/15 split (stratified, no temporal leakage), train 3 models, Optuna tuning, soft voting ensemble, evaluate accuracy/F1/recall/precision, confusion matrix, export joblib |
| **Validation** | Accuracy >85%, Macro F1 >0.82, Industrial Fire recall >90%, Gas Flare precision >90% |

### Phase 5 — Database Setup (PostgreSQL + PostGIS)
| Aspect | Detail |
|--------|--------|
| **Objective** | Create PostGIS database, ORM models, Alembic migrations, seed data |
| **Requirements** | DB-001..DB-009 |
| **Files** | `backend/app/database.py`, `backend/app/models/*.py`, `alembic/`, `scripts/init_db.py`, `scripts/seed_*.py` |
| **Dependencies** | Phase 0 (Docker for PostgreSQL), Phase 1 (data to seed) |
| **Tasks** | Docker PostgreSQL + PostGIS, SQLAlchemy models matching §11.1 ERD, Alembic initial migration, GIST indexes, seed OSM facilities, seed historical hotspots |
| **Validation** | Tables created, spatial queries return correct results, seed data loaded |

### Phase 6 — FastAPI Backend (Core)
| Aspect | Detail |
|--------|--------|
| **Objective** | Implement FastAPI app with all routers, services, schemas |
| **Requirements** | BE-001..BE-013, API-001..API-017 |
| **Files** | `backend/app/main.py`, `backend/app/config.py`, `backend/app/routers/*.py`, `backend/app/services/*.py`, `backend/app/schemas/*.py` |
| **Dependencies** | Phase 5 (database), Phase 4 (trained model) |
| **Tasks** | FastAPI app + CORS, Pydantic settings, all 7 routers, all 5 services, Pydantic schemas, ML inference service, Swagger docs |
| **Validation** | All endpoints return correct data, Swagger UI functional |

### Phase 7 — Celery Workers & Scheduler
| Aspect | Detail |
|--------|--------|
| **Objective** | Background task queue for periodic FIRMS ingestion and batch classification |
| **Requirements** | BE-005, BE-006, INFRA-004 |
| **Files** | `backend/app/tasks/celery_app.py`, `backend/app/tasks/ingestion.py`, `backend/app/tasks/classification.py` |
| **Dependencies** | Phase 6 (API services), Phase 5 (database) |
| **Tasks** | Celery + Redis config, ingestion task (fetch → clean → enrich → classify → store), classification task, Celery Beat schedule (every 3 hours) |
| **Validation** | Task triggers, data flows through pipeline, new hotspots appear in DB |

### Phase 8 — WebSocket Alerts
| Aspect | Detail |
|--------|--------|
| **Objective** | Real-time alert system via WebSocket |
| **Requirements** | BE-007, API-016 |
| **Files** | `backend/app/routers/websocket.py`, `backend/app/services/alert_service.py` |
| **Dependencies** | Phase 7 (ingestion triggers alerts) |
| **Tasks** | WebSocket endpoint, alert threshold checks (FRP >200 for industrial fires), alert lifecycle (active→acknowledged→resolved), broadcast to connected clients |
| **Validation** | WebSocket client receives alerts when high-FRP hotspot is classified |

### Phase 9 — React Frontend (Core)
| Aspect | Detail |
|--------|--------|
| **Objective** | Build React + Vite + Leaflet.js dashboard with dark theme |
| **Requirements** | UI-001..UI-028 |
| **Files** | `frontend/src/**/*` |
| **Dependencies** | Phase 6 (API endpoints to consume) |
| **Tasks** | Vite project, React Router (7 routes), design system (dark theme, glassmorphism, Inter/Roboto fonts), Leaflet map with CartoDB Dark Matter, color-coded markers, filter sidebar, stats bar, charts (Chart.js), alert table, detail popup/panel, MUI components, Framer Motion animations |
| **Validation** | All pages render, map shows classified markers, filters work, charts display real API data |

### Phase 10 — Frontend Advanced Features
| Aspect | Detail |
|--------|--------|
| **Objective** | Heatmap, facility overlay, time slider, reports, WebSocket alerts |
| **Requirements** | UI-010..UI-018, UI-020 |
| **Files** | `frontend/src/components/Map/HeatmapLayer.jsx`, `FacilityOverlay.jsx`, etc. |
| **Dependencies** | Phase 9 |
| **Tasks** | Leaflet.heat heatmap layer, facility markers with buffer circles, time slider animation, report generation UI, WebSocket hook for live alerts, toast notifications, login page |
| **Validation** | All enhanced features functional with real data |

### Phase 11 — Integration & End-to-End Testing
| Aspect | Detail |
|--------|--------|
| **Objective** | Full pipeline integration: FIRMS → Ingestion → Classification → DB → API → Frontend |
| **Requirements** | TEST-001..TEST-007 |
| **Files** | `tests/**/*` |
| **Dependencies** | Phases 1-10 |
| **Tasks** | Unit tests (features, geo_utils, classification), API tests (all endpoints), integration tests (end-to-end pipeline), spatial query tests |
| **Validation** | All tests pass, real data flows through entire system |

### Phase 12 — Docker Compose & Deployment
| Aspect | Detail |
|--------|--------|
| **Objective** | Containerize all 7 services, Nginx reverse proxy |
| **Requirements** | INFRA-001..INFRA-005 |
| **Files** | `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `configs/nginx.conf` |
| **Dependencies** | Phase 11 |
| **Tasks** | Backend Dockerfile, Frontend Dockerfile (multi-stage build), Nginx config, Docker Compose with all 7 services, health checks, volume mounts |
| **Validation** | `docker-compose up` starts entire stack, accessible at http://localhost |

### Phase 13 — Documentation & Final Audit
| Aspect | Detail |
|--------|--------|
| **Objective** | Complete README, API docs, architecture docs; final requirement audit |
| **Requirements** | All |
| **Files** | `README.md`, Swagger auto-docs, inline docs |
| **Dependencies** | Phase 12 |
| **Tasks** | Setup guide, data acquisition instructions, training instructions, deployment guide, API usage guide, environment variables guide, troubleshooting, final requirements matrix audit |
| **Validation** | Every requirement has evidence of implementation |

---

## 8. ML Model Specification

### 8.1 Problem Formulation
- **Type**: Multi-class classification (6 classes)
- **Target variable**: `ml_label` ∈ {0, 1, 2, 3, 4, 5}
- **Input features**: 16 engineered features (see §5.3 of document)

### 8.2 Feature List

| # | Feature | Type | Preprocessing |
|---|---------|------|---------------|
| 1 | `brightness` | Numeric | StandardScaler |
| 2 | `frp` | Numeric | Log-transform + StandardScaler |
| 3 | `confidence` | Numeric | Map VIIRS categorical → numeric |
| 4 | `daynight` | Categorical | Binary encode (D=1, N=0) |
| 5 | `pixel_area` (scan × track) | Numeric | StandardScaler |
| 6 | `dist_to_nearest_industrial` | Numeric | Log-transform + StandardScaler |
| 7 | `industrial_type` | Categorical | LabelEncoder / OneHotEncoder |
| 8 | `land_cover_class` | Categorical | LabelEncoder / OneHotEncoder |
| 9 | `persistence_hours` | Numeric | Log-transform |
| 10 | `recurrence_count` | Numeric | StandardScaler |
| 11 | `spatial_cluster_size` | Numeric | Log-transform |
| 12 | `spread_rate` | Numeric | Log-transform |
| 13 | `month` | Numeric | Cyclical encoding (sin/cos) |
| 14 | `hour` | Numeric | Cyclical encoding (sin/cos) |
| 15 | `bright_t31` | Numeric | StandardScaler |
| 16 | `brightness_ratio` | Numeric | StandardScaler |

### 8.3 Data Leakage Prevention
- No future temporal data in training set
- Train/val/test split by time (not random) to prevent temporal leakage
- OSM facility data is static — no leakage risk
- Land cover is annual — no leakage risk

### 8.4 Class Imbalance Strategy
The v2 dataset has 98.3% Unclassified. Strategy:
1. **Undersample** Unclassified to ~5,000 records
2. **SMOTE** on minority classes to ~2,000 each
3. **Class weights** in model training (inversely proportional to frequency)
4. **Stratified** train/val/test split

### 8.5 Candidate Models

| Model | Key Hyperparameters | Why |
|-------|-------------------|-----|
| Random Forest | n_estimators=200, max_depth=None, min_samples_split=5 | Robust baseline, handles mixed feature types |
| XGBoost | max_depth=8, learning_rate=0.1, n_estimators=300 | Strong on tabular data, handles imbalance natively |
| LightGBM | num_leaves=63, learning_rate=0.1, n_estimators=300 | Fast, handles categorical features natively |
| **Ensemble** | Soft Voting or Stacking with Logistic Regression meta-learner | Combines strengths, reduces variance |

### 8.6 Evaluation
- **Primary**: Macro F1-score (balances across all classes)
- **Secondary**: Overall accuracy, per-class precision/recall
- **Critical**: Industrial Fire recall >90%, Gas Flare precision >90%
- **Visualization**: Confusion matrix, ROC curves, feature importance

---

## 9. Technical Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | **Extreme class imbalance in v2 training data** (98% Unclassified) | HIGH | Resampling (SMOTE + undersample), class weights, evaluate with macro F1 not accuracy |
| 2 | **Land cover raster data not downloaded** | HIGH | Use simplified approach: OSM-derived land use + "Unknown" as valid feature value; download MODIS MCD12Q1 if needed |
| 3 | **VIIRS confidence is categorical (n/l/h) not numeric** | MEDIUM | Map to numeric values using FIRMS standard convention |
| 4 | **PostGIS setup complexity on Windows** | MEDIUM | Use Docker container for PostgreSQL+PostGIS |
| 5 | **FIRMS API rate limits** | LOW | Use pre-downloaded data for training; API calls only for real-time ingestion |
| 6 | **Model performance may not meet targets** | MEDIUM | Iterative feature engineering, rule-based fallback classifier as safety net |
| 7 | **Docker Compose memory usage (7 containers)** | MEDIUM | Optimize container resource limits, use lightweight base images |
| 8 | **OSM data may have incomplete Indian industrial coverage** | MEDIUM | Supplement with india_known_flares_reference.csv for key facilities |

---

## 10. Required Tools & Libraries

### Python Backend
```
fastapi, uvicorn, sqlalchemy, geoalchemy2, alembic, psycopg2-binary,
celery, redis, apscheduler, pydantic, pydantic-settings,
pandas, numpy, geopandas, shapely, pyproj, rasterio,
scikit-learn, xgboost, lightgbm, optuna, joblib,
python-jose, passlib, bcrypt, python-multipart,
reportlab, httpx, python-dotenv
```

### Frontend (npm)
```
react, react-dom, react-router-dom, vite,
leaflet, react-leaflet, leaflet.heat, leaflet.markercluster,
chart.js, react-chartjs-2,
@mui/material, @mui/icons-material, @emotion/react, @emotion/styled,
lucide-react, framer-motion, axios, date-fns
```

### Infrastructure
```
Docker, Docker Compose, Nginx, PostgreSQL 16 + PostGIS 3.4, Redis 7
```

---

## 11. Validation Strategy

| Phase | Validation Method |
|-------|-------------------|
| Data preprocessing | Assert column counts, null checks, lat/lon in India bbox, date ranges |
| Feature engineering | Statistical summaries, feature correlation matrix, no NaN in features |
| ML training | Cross-validation scores, learning curves, overfitting checks |
| ML evaluation | Accuracy >85%, F1 >0.82, Industrial Fire recall >90%, confusion matrix |
| Database | Spatial query correctness (ST_DWithin results), data integrity |
| API endpoints | Pytest with httpx TestClient, response schema validation |
| Frontend | Visual inspection, browser dev tools, API integration verification |
| Integration | End-to-end: ingest sample → classify → display on map |
| Docker | `docker-compose up` successful, all services healthy, accessible |

---

## 12. Recommended Implementation Order

```
Phase 0  → Environment & Project Setup (1 day)
Phase 1  → Data Preprocessing & Harmonization (2 days)
Phase 2  → Spatial Data & Feature Engineering (3 days)
Phase 3  → Semi-Supervised Labeling (2 days)
Phase 4  → ML Model Training & Evaluation (3 days)
Phase 5  → Database Setup (PostgreSQL + PostGIS) (2 days)
Phase 6  → FastAPI Backend (Core) (4 days)
Phase 7  → Celery Workers & Scheduler (2 days)
Phase 8  → WebSocket Alerts (1 day)
Phase 9  → React Frontend (Core) (5 days)
Phase 10 → Frontend Advanced Features (3 days)
Phase 11 → Integration & Testing (3 days)
Phase 12 → Docker Compose & Deployment (2 days)
Phase 13 → Documentation & Final Audit (1 day)
```

**Total estimated: ~34 working days**

---

## Open Questions

> [!IMPORTANT]
> **Q1: Land Cover Data Strategy** — The document specifies MODIS MCD12Q1 (§5.1.3), but you downloaded ESA WorldCover links (which expired). Should we:
> - **(A)** Download MODIS MCD12Q1 raster (~200MB for India)?
> - **(B)** Use the `land_cover_class` column already in ignis_training_dataset_v2.csv (even though many are "Unknown")?
> - **(C)** Derive a simplified land cover from OSM data (industrial/urban vs rural) without raster?
> - **(D)** All of the above — use OSM-derived for real-time, actual raster for training?

> [!IMPORTANT]
> **Q2: Training Data** — Should we use the existing `ignis_training_dataset_v2.csv` (200K records, 6 classes but extreme imbalance) or re-generate training labels from scratch using the raw FIRMS + OSM data?

> [!WARNING]
> **Q3: The v2 training data has 98.3% Unclassified labels** — this will produce a model that predicts Unclassified for almost everything. We need to address this before training. The recommended approach is aggressive rebalancing (undersample Unclassified to ~3,000, SMOTE minority classes to ~2,000 each). Is this acceptable?

> [!NOTE]
> **Q4: Docker vs Local Development** — For initial development phases (0-10), do you want to run PostgreSQL+PostGIS+Redis via Docker Compose while developing the backend/frontend locally? Or develop entirely within Docker from the start?
