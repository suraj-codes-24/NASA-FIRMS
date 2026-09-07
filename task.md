# IGNIS — Implementation Task Tracker

## Phase 0 — Environment & Project Setup
- [x] Create project directory structure
- [x] Create `.env.example` with all environment variables
- [x] Create `.gitignore`
- [x] Create `docker-compose.yml` (all 7 services)
- [x] Create `backend/requirements.txt`
- [x] Create `backend/Dockerfile`
- [x] Create minimal `backend/app/main.py` + `config.py`
- [x] Create `frontend/` with Vite + React scaffold
- [x] Create `frontend/Dockerfile`
- [x] Create `configs/nginx.conf`
- [x] Verify Docker Compose builds and all services start
- [x] Verify backend serves at `/docs`
- [x] Verify frontend dev server runs

## Phase 1 — Data Preprocessing & Harmonization
- [x] Harmonize MODIS/VIIRS column names
- [x] Map VIIRS categorical confidence → numeric
- [x] Validate lat/lon within India bbox
- [x] Remove duplicates
- [x] Create unified processed CSV

## Phase 2 — Spatial Data & Feature Engineering
- [x] Implement spatial join (hotspot ↔ OSM facility)
- [x] Implement land cover lookup
- [x] Compute persistence_hours
- [x] Compute recurrence_count
- [x] Compute spatial_cluster_size
- [x] Compute spread_rate
- [x] Compute all 16 features
- [x] Validate feature distributions

## Phase 3 — Semi-Supervised Labeling
- [x] Implement rule-based labeling logic from §3.3 / §6.2
- [x] Validate against known flare reference
- [x] Balance classes (undersample + SMOTE)
- [x] Generate final training dataset

## Phase 7 — Real-Time NASA Pipeline
- [x] Configure Celery Beat in celery_app.py
- [x] Implement `fetch_nasa_firms_data` task in `nasa_tasks.py`
- [x] Integrate fetching with public 24-hr CSV fallback
- [x] Chain ingestion with ML prediction task

## Phase 8 — User Verification and Feedback Loop
- [x] Add VerificationLog model to spatial.py
- [x] Add verification schemas to spatial schemas
- [x] Implement `POST /api/v1/hotspots/{id}/verify` endpoint

## Phase 4 — ML Model Training & Evaluation
- [x] Train Random Forest
- [x] Train XGBoost
- [x] Train LightGBM
- [x] Build ensemble (Soft Voting / Stacking)
- [x] Hyperparameter tuning (Optuna)
- [x] Evaluate: accuracy, F1, recall, precision
- [x] Confusion matrix visualization
- [x] Export model as joblib
- [x] Verify targets: Acc >85%, F1 >0.82, IndustrialFire recall >90%

## Phase 5 — Database Setup (PostgreSQL + PostGIS)
- [x] SQLAlchemy ORM models (Hotspot, Facility, Alert, ClassificationLog, User)
- [x] GeoAlchemy2 geometry columns
- [x] Alembic migrations
- [x] GIST spatial indexes
- [x] Seed OSM facilities
- [x] Seed historical hotspots (sample)

## Phase 6 — FastAPI Backend (Core)
- [x] FastAPI app with CORS
- [x] Pydantic Settings (config.py)
- [x] Database session dependency
- [x] Hotspots router (5 endpoints)
- [x] Facilities router (3 endpoints)
- [x] Analytics router (5 endpoints)
- [x] Alerts router (4 endpoints)
- [x] Reports router (2 endpoints)
- [x] Auth router (2 endpoints)
- [x] All Pydantic schemas
- [x] ML inference service integration
- [x] Swagger docs verification

## Phase 7 — Celery Workers & Scheduler
- [x] Celery app configuration
- [x] FIRMS ingestion task
- [x] Batch classification task
- [x] Celery Beat schedule (every 3 hours)

## Phase 8 — WebSocket Alerts
- [x] WebSocket endpoint /ws/alerts
- [x] Alert threshold checking
- [x] Alert lifecycle management
- [x] Broadcast to connected clients

## Phase 9 — React Frontend (Core)
- [x] Design system (dark theme, glassmorphism, fonts)
- [x] React Router (7 routes)
- [x] Navbar component
- [x] Leaflet MapContainer with CartoDB Dark Matter
- [x] HotspotMarkers (color-coded by classification)
- [x] DetailPopup (click marker → details)
- [x] FilterSidebar (date, type, confidence, region)
- [x] StatsBar (5 stat cards)
- [x] TimelineChart (Chart.js line chart)
- [x] DashboardPage assembly
- [x] API service (Axios)

## Phase 10 — Frontend Advanced Features
- [x] AnalyticsPage (PieChart, BarChart, ClassificationDetail)
- [x] AlertsPage (AlertTable, AlertDetail, SeverityBar)
- [x] ReportsPage (generate + download)
- [x] HeatmapLayer
- [x] FacilityOverlay with buffer zones
- [x] MapLegend
- [x] Historical playback time slider
- [x] WebSocket hook + toast notifications
- [x] LoginPage + SettingsPage
- [x] Framer Motion animations

## Phase 11 — Integration & Testing
- [x] Unit tests (features, geo_utils, classification)
- [x] API endpoint tests
- [x] Spatial query tests
- [x] End-to-end integration test
- [x] Fix any issues found

## Phase 12 — Docker Compose & Deployment
- [ ] Finalize all Dockerfiles
- [ ] Nginx reverse proxy config
- [ ] Docker Compose production mode
- [ ] Health checks
- [ ] Full stack smoke test

## Phase 13 — Documentation & Final Audit
- [ ] README.md (setup, install, run, deploy)
- [ ] API documentation
- [ ] Final requirements audit matrix
- [x] Remove any TODO/FIXME/placeholder
