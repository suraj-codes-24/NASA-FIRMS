# 🔥 IGNIS — AI-Based Detection & Classification of Industrial Fires and Persistent Thermal Sources

> **Smart India Hackathon (SIH) | Problem Statement ID: 26162**
> **Organization:** National Technical Research Organisation (NTRO)
> **Category:** Software | **Theme:** Disaster Management

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Analysis](#2-problem-analysis)
3. [Proposed Solution](#3-proposed-solution)
4. [System Architecture](#4-system-architecture)
5. [Data Sources & Pipeline](#5-data-sources--pipeline)
6. [AI/ML Model Design](#6-aiml-model-design)
7. [Tech Stack](#7-tech-stack)
8. [Feature List](#8-feature-list)
9. [Frontend UI Design](#9-frontend-ui-design)
10. [Backend API Design](#10-backend-api-design)
11. [Database Schema](#11-database-schema)
12. [UML Diagrams](#12-uml-diagrams)
13. [Workflow Diagrams](#13-workflow-diagrams)
14. [API Endpoints](#14-api-endpoints)
15. [Deployment Architecture](#15-deployment-architecture)
16. [Project Timeline & Milestones](#16-project-timeline--milestones)
17. [Risk Analysis & Mitigation](#17-risk-analysis--mitigation)
18. [Innovation & Uniqueness](#18-innovation--uniqueness)
19. [Future Scope](#19-future-scope)
20. [References](#20-references)

---

## 1. Project Overview

### 1.1 Project Name
**IGNIS** — *Intelligent Geospatial Network for Industrial fire Surveillance*

### 1.2 Tagline
*"Distinguishing Industrial Infernos from Natural Fires — From Space, In Real-Time"*

### 1.3 Abstract

Industrial facilities such as oil refineries, petrochemical complexes, thermal power plants, steel industries, and LNG terminals generate persistent thermal signatures observable from space. Additionally, accidental industrial fires, gas leaks, and explosions pose critical risks to infrastructure, public safety, and the environment.

Current satellite-based monitoring systems like **NASA FIRMS** detect thermal anomalies but **cannot distinguish** between industrial fires, gas flares, agricultural burning, mining activity, and wildfires.

**IGNIS** is an AI-enabled geospatial platform that **automatically identifies, classifies, and monitors** industrial fires and persistent thermal sources by fusing:
- 🛰️ NASA FIRMS thermal anomaly data (MODIS/VIIRS)
- 🏭 OpenStreetMap industrial infrastructure data
- 🌍 MODIS land cover classification
- 📡 Sentinel-2 multispectral satellite imagery
- 🔥 VIIRS Nightfire gas flare data

The system delivers classified results through an interactive **GIS-based web dashboard** with real-time alerts, historical analysis, and exportable reports.

### 1.4 Key Objectives

| # | Objective | Deliverable |
|---|-----------|-------------|
| 1 | Classify and segregate industrial fires from forest fires and natural fires | AI classification model with >85% accuracy |
| 2 | GIS-based visualization as map overlay | Interactive web dashboard with Leaflet.js |
| 3 | Real-time alerting for anomalous thermal events | WebSocket-based notification system |
| 4 | Persistent thermal source monitoring | Time-series analysis pipeline |
| 5 | Historical trend analysis and reporting | Analytics dashboard with export capabilities |

---

## 2. Problem Analysis

### 2.1 Current Limitations of NASA FIRMS

```mermaid
graph LR
    A["NASA FIRMS Satellite"] --> B["Thermal Anomaly Detected"]
    B --> C["Single Label: 'Active Fire'"]
    C --> D["❌ No Classification"]
    
    D --> E["Industrial Fire?"]
    D --> F["Forest Fire?"]
    D --> G["Gas Flare?"]
    D --> H["Agricultural Burn?"]
    D --> I["Wildfire?"]
    
    style D fill:#ff4444,stroke:#cc0000,color:#fff
    style E fill:#ff6b35,stroke:#cc5500,color:#fff
    style F fill:#2ecc71,stroke:#27ae60,color:#fff
    style G fill:#f39c12,stroke:#e67e22,color:#fff
    style H fill:#9b59b6,stroke:#8e44ad,color:#fff
    style I fill:#e74c3c,stroke:#c0392b,color:#fff
```

### 2.2 Why Classification Matters

| Scenario | Consequence of Misclassification |
|----------|----------------------------------|
| Industrial fire labeled as wildfire | Delayed emergency response to critical infrastructure |
| Gas flare labeled as fire | Unnecessary emergency mobilization, resource waste |
| Agricultural burn ignored | Air quality deterioration in populated areas |
| Persistent industrial heat misread | False alarms fatigue, reduced trust in system |

### 2.3 Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| **NTRO** | National security monitoring of critical infrastructure |
| **NDMA/SDMA** | Disaster response coordination |
| **ISRO** | Integration with Indian satellite programs |
| **Industrial Safety Boards** | Facility monitoring & compliance |
| **Fire Services** | Rapid response to genuine fire emergencies |
| **Environmental Agencies** | Pollution & emission tracking from burns |

---

## 3. Proposed Solution

### 3.1 Solution Overview

```mermaid
graph TB
    subgraph "Data Ingestion Layer"
        A["🛰️ NASA FIRMS API<br/>MODIS/VIIRS Hotspots"]
        B["🗺️ OpenStreetMap<br/>Overpass API"]
        C["🌍 MODIS Land Cover<br/>MCD12Q1"]
        D["📡 Sentinel-2<br/>Copernicus Hub"]
        E["🔥 VIIRS Nightfire<br/>Gas Flare Data"]
    end

    subgraph "Processing Layer"
        F["Data Cleaning &<br/>Normalization"]
        G["Spatial Join Engine<br/>GeoPandas + PostGIS"]
        H["Feature Engineering<br/>Pipeline"]
    end

    subgraph "AI/ML Layer"
        I["Random Forest /<br/>XGBoost Classifier"]
        J["Temporal Persistence<br/>Analyzer"]
        K["Anomaly Detection<br/>Module"]
    end

    subgraph "Application Layer"
        L["FastAPI Backend<br/>REST + WebSocket"]
        M["PostgreSQL + PostGIS<br/>Spatial Database"]
    end

    subgraph "Presentation Layer"
        N["React.js Frontend<br/>+ Leaflet.js GIS Map"]
        O["Real-time Alerts<br/>& Notifications"]
        P["Reports & Analytics<br/>Dashboard"]
    end

    A & B & C & D & E --> F
    F --> G --> H
    H --> I & J & K
    I & J & K --> L
    L --> M
    L --> N & O & P
```

### 3.2 Classification Categories

The system classifies each thermal hotspot into one of **6 categories**:

| Category | Color Code | Characteristics |
|----------|-----------|-----------------|
| 🔴 **Industrial Fire** | Red | High FRP, near industrial facility, sudden onset, non-persistent |
| 🟠 **Forest/Wildfire** | Orange | Moderate FRP, forest land cover, spatial spread over time |
| 🟡 **Gas Flare** | Yellow | Low-moderate FRP, highly persistent (24/7), near refineries/gas plants |
| 🟢 **Agricultural Burn** | Green | Low FRP, cropland cover, seasonal pattern, short duration |
| 🔵 **Mining/Thermal** | Blue | Low FRP, persistent, near mining sites |
| ⚪ **Unknown/Unclassified** | Grey | Low confidence classification |

### 3.3 Classification Logic — Decision Flow

```mermaid
flowchart TD
    A["FIRMS Hotspot Detected<br/>lat, lon, FRP, brightness_temp, confidence"] --> B{"Confidence > 50%?"}
    B -->|No| Z["⚪ Discard / Low Confidence"]
    B -->|Yes| C{"Within 2km of<br/>OSM Industrial Facility?"}
    
    C -->|Yes| D{"Persistent > 48hrs<br/>at same location?"}
    D -->|Yes| E["🟡 Gas Flare"]
    D -->|No| F{"FRP > 100 MW?"}
    F -->|Yes| G["🔴 Industrial Fire"]
    F -->|No| H["🔵 Mining/Thermal Source"]
    
    C -->|No| I{"Land Cover Type?"}
    I -->|Forest| J{"Spatial spread<br/>over 24hrs?"}
    J -->|Yes| K["🟠 Forest Fire / Wildfire"]
    J -->|No| L["🟠 Localized Forest Fire"]
    
    I -->|Cropland| M{"Seasonal Pattern?<br/>Oct-Dec / Apr-May"}
    M -->|Yes| N["🟢 Agricultural Burn"]
    M -->|No| O["⚪ Unclassified"]
    
    I -->|Urban/Other| P{"FRP > 50 MW?"}
    P -->|Yes| Q["🔴 Possible Industrial Fire"]
    P -->|No| R["⚪ Unclassified"]
    
    style E fill:#f1c40f,color:#000
    style G fill:#e74c3c,color:#fff
    style H fill:#3498db,color:#fff
    style K fill:#e67e22,color:#fff
    style L fill:#e67e22,color:#fff
    style N fill:#2ecc71,color:#fff
    style Z fill:#95a5a6,color:#fff
    style O fill:#95a5a6,color:#fff
    style R fill:#95a5a6,color:#fff
    style Q fill:#e74c3c,color:#fff
```

---

## 4. System Architecture

### 4.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        CL1["🖥️ Web Browser<br/>React.js + Leaflet.js"]
        CL2["📱 Mobile Browser<br/>Responsive PWA"]
    end

    subgraph "CDN / Reverse Proxy"
        NG["Nginx<br/>Load Balancer + SSL"]
    end

    subgraph "Application Server"
        API["FastAPI<br/>REST API Server"]
        WS["WebSocket Server<br/>Real-time Alerts"]
        CELERY["Celery Workers<br/>Background Tasks"]
    end

    subgraph "Message Broker"
        REDIS["Redis<br/>Cache + Message Queue"]
    end

    subgraph "Database Layer"
        PG["PostgreSQL + PostGIS<br/>Spatial Database"]
    end

    subgraph "ML Pipeline"
        ML["Scikit-learn / XGBoost<br/>Classification Model"]
        FEAT["Feature Engineering<br/>GeoPandas Pipeline"]
    end

    subgraph "External Data Sources"
        FIRMS["NASA FIRMS API"]
        OSM["OpenStreetMap<br/>Overpass API"]
        MODIS["MODIS Land Cover"]
        SENT["Sentinel-2 Hub"]
    end

    subgraph "Scheduled Jobs"
        CRON["APScheduler<br/>Data Ingestion Cron"]
    end

    CL1 & CL2 --> NG
    NG --> API & WS
    API --> REDIS
    API --> PG
    API --> ML
    WS --> REDIS
    CELERY --> PG
    CELERY --> FEAT --> ML
    CRON --> CELERY
    CELERY --> FIRMS & OSM & MODIS & SENT
```

### 4.2 Component Breakdown

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React.js 18 + Leaflet.js + Chart.js | Interactive GIS map, dashboard, charts |
| **Backend API** | FastAPI (Python 3.11) | REST endpoints, WebSocket, auth |
| **Database** | PostgreSQL 16 + PostGIS 3.4 | Spatial data storage & queries |
| **Cache/Queue** | Redis 7 | API caching, Celery message broker |
| **Task Queue** | Celery 5 | Background data ingestion, ML inference |
| **ML Engine** | Scikit-learn + XGBoost + GeoPandas | Classification model training & inference |
| **Scheduler** | APScheduler | Periodic FIRMS data fetching |
| **Reverse Proxy** | Nginx | SSL termination, load balancing |
| **Containerization** | Docker + Docker Compose | Deployment orchestration |

---

## 5. Data Sources & Pipeline

### 5.1 Data Sources Detail

#### 5.1.1 NASA FIRMS (Primary)
| Field | Description |
|-------|-------------|
| **API** | `https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}` |
| **Sensors** | MODIS (Terra/Aqua) + VIIRS (Suomi NPP / NOAA-20) |
| **Resolution** | MODIS: 1km, VIIRS: 375m |
| **Data Fields** | latitude, longitude, brightness, scan, track, acq_date, acq_time, satellite, instrument, confidence, version, bright_t31, frp, daynight, type |
| **Update Frequency** | Every 3 hours (near real-time) |
| **Coverage** | Global |

#### 5.1.2 OpenStreetMap (Industrial Facilities)
| Field | Description |
|-------|-------------|
| **API** | Overpass API (`https://overpass-api.de/api/interpreter`) |
| **Query Tags** | `landuse=industrial`, `man_made=petroleum_well`, `power=plant`, `industrial=*`, `man_made=works` |
| **Data Fields** | name, type, geometry (polygon/point), tags |
| **Use** | Proximity analysis — is hotspot near known industrial facility? |

#### 5.1.3 MODIS Land Cover (MCD12Q1)
| Field | Description |
|-------|-------------|
| **Source** | NASA Earthdata (`https://e4ftl01.cr.usgs.gov`) |
| **Resolution** | 500m |
| **Classification** | IGBP land cover types (17 classes) |
| **Key Classes** | Evergreen Forest, Cropland, Urban, Barren, Water |
| **Use** | Context — what type of land is the hotspot on? |

#### 5.1.4 Sentinel-2 (Optional Enhancement)
| Field | Description |
|-------|-------------|
| **Source** | Copernicus Open Access Hub |
| **Resolution** | 10m (visible), 20m (SWIR) |
| **Bands Used** | B12 (SWIR-2), B11 (SWIR-1), B8A (NIR) |
| **Use** | High-res confirmation of fire events, burn scar detection |

### 5.2 Data Ingestion Pipeline

```mermaid
sequenceDiagram
    participant CRON as ⏰ Scheduler
    participant CELERY as 🔧 Celery Worker
    participant FIRMS as 🛰️ NASA FIRMS
    participant OSM as 🗺️ OpenStreetMap
    participant MODIS as 🌍 MODIS LC
    participant DB as 🗄️ PostGIS DB
    participant ML as 🤖 ML Model
    participant WS as 📡 WebSocket

    CRON->>CELERY: Trigger ingestion (every 3 hrs)
    
    par Parallel Data Fetch
        CELERY->>FIRMS: GET /api/area/csv (India bbox)
        FIRMS-->>CELERY: CSV hotspot data
        CELERY->>OSM: POST /api/interpreter (industrial query)
        OSM-->>CELERY: GeoJSON facilities
    end
    
    CELERY->>CELERY: Parse & Clean Data
    CELERY->>CELERY: Spatial Join (hotspots ↔ facilities)
    CELERY->>CELERY: Land Cover Lookup
    CELERY->>CELERY: Feature Engineering
    
    CELERY->>ML: Classify hotspots
    ML-->>CELERY: Classification results
    
    CELERY->>DB: Store classified hotspots
    CELERY->>DB: Update persistence scores
    
    CELERY->>CELERY: Check alert thresholds
    CELERY->>WS: Push real-time alerts
```

### 5.3 Feature Engineering

The following features are extracted for each FIRMS hotspot before classification:

| # | Feature | Source | Description |
|---|---------|--------|-------------|
| 1 | `brightness` | FIRMS | Brightness temperature (Kelvin) |
| 2 | `frp` | FIRMS | Fire Radiative Power (MW) |
| 3 | `confidence` | FIRMS | Detection confidence (0-100) |
| 4 | `daynight` | FIRMS | Day (D) or Night (N) detection |
| 5 | `scan` × `track` | FIRMS | Pixel area (spatial extent) |
| 6 | `dist_to_nearest_industrial` | FIRMS + OSM | Distance (km) to nearest industrial facility |
| 7 | `industrial_type` | OSM | Type of nearest facility (refinery, power plant, etc.) |
| 8 | `land_cover_class` | MODIS LC | IGBP land cover at hotspot location |
| 9 | `persistence_hours` | FIRMS (historical) | How long has this location been active? |
| 10 | `recurrence_count` | FIRMS (historical) | Number of detections at same location (±1km) in 30 days |
| 11 | `spatial_cluster_size` | FIRMS | Number of hotspots within 5km radius |
| 12 | `spread_rate` | FIRMS (temporal) | Rate of spatial expansion (km/hr) |
| 13 | `month` | Date | Month of detection (seasonality) |
| 14 | `hour` | Time | Hour of detection |
| 15 | `bright_t31` | FIRMS | Channel 31 brightness temperature |
| 16 | `brightness_ratio` | Derived | brightness / bright_t31 ratio |

---

## 6. AI/ML Model Design

### 6.1 Model Architecture

```mermaid
graph LR
    subgraph "Input Features - 16 total"
        F1["Thermal Features<br/>brightness, frp, bright_t31"]
        F2["Spatial Features<br/>dist_industrial, land_cover, cluster_size"]
        F3["Temporal Features<br/>persistence, recurrence, spread_rate"]
        F4["Contextual Features<br/>month, hour, daynight, industrial_type"]
    end

    subgraph "Model Ensemble"
        M1["Random Forest<br/>n_estimators=200"]
        M2["XGBoost<br/>max_depth=8"]
        M3["LightGBM<br/>num_leaves=63"]
    end

    subgraph "Ensemble Method"
        E["Soft Voting /<br/>Stacking Classifier"]
    end

    subgraph "Output"
        O1["🔴 Industrial Fire"]
        O2["🟠 Forest Fire"]
        O3["🟡 Gas Flare"]
        O4["🟢 Agricultural Burn"]
        O5["🔵 Mining/Thermal"]
        O6["⚪ Unclassified"]
    end

    F1 & F2 & F3 & F4 --> M1 & M2 & M3
    M1 & M2 & M3 --> E
    E --> O1 & O2 & O3 & O4 & O5 & O6
```

### 6.2 Training Data Strategy

Since **no labeled dataset exists** for this exact classification, we use a **semi-supervised labeling** approach:

| Strategy | Description |
|----------|-------------|
| **Rule-based labeling** | FIRMS hotspots within 1km of OSM refinery = "Gas Flare" (if persistent) or "Industrial Fire" (if sudden) |
| **Land-cover labeling** | Hotspots on forest land cover with spatial spread = "Forest Fire" |
| **Seasonal labeling** | Hotspots on cropland during Oct-Dec in Punjab/Haryana = "Agricultural Burn" |
| **News correlation** | Cross-reference major fire incidents from news/NIDM reports for ground truth validation |
| **VIIRS Nightfire** | Known gas flare catalog used as positive labels |

### 6.3 Model Training Pipeline

```mermaid
flowchart LR
    A["Raw FIRMS Data<br/>12 months, India"] --> B["Feature Engineering<br/>16 features"]
    B --> C["Semi-supervised<br/>Labeling"]
    C --> D["Train/Val/Test Split<br/>70/15/15"]
    D --> E["Model Training<br/>RF + XGB + LGBM"]
    E --> F["Hyperparameter Tuning<br/>Optuna / GridSearch"]
    F --> G["Evaluation<br/>Accuracy, F1, Confusion Matrix"]
    G --> H{"F1 > 0.85?"}
    H -->|No| F
    H -->|Yes| I["Export Model<br/>joblib / ONNX"]
    I --> J["Deploy to<br/>FastAPI Backend"]
```

### 6.4 Evaluation Metrics

| Metric | Target | Why |
|--------|--------|-----|
| **Overall Accuracy** | > 85% | General correctness |
| **Macro F1-Score** | > 0.82 | Balance across all classes |
| **Industrial Fire Recall** | > 90% | Critical — must not miss industrial fires |
| **Gas Flare Precision** | > 90% | Avoid false alarms on known flares |
| **Confusion Matrix** | Low off-diagonal | Ensure clean class separation |

---

## 7. Tech Stack

### 7.1 Complete Technology Stack

```mermaid
graph TB
    subgraph "Frontend"
        R["React.js 18"]
        L["Leaflet.js 1.9"]
        CJ["Chart.js 4"]
        AX["Axios"]
        MUI["Material UI 5"]
    end

    subgraph "Backend"
        FA["FastAPI"]
        PY["Python 3.11"]
        CEL["Celery 5"]
        APS["APScheduler"]
    end

    subgraph "ML/AI"
        SK["Scikit-learn 1.3"]
        XG["XGBoost 2.0"]
        GP["GeoPandas 0.14"]
        NP["NumPy + Pandas"]
        SH["Shapely 2.0"]
    end

    subgraph "Database"
        PG["PostgreSQL 16"]
        PGI["PostGIS 3.4"]
        RD["Redis 7"]
    end

    subgraph "DevOps"
        DK["Docker"]
        DC["Docker Compose"]
        GH["GitHub Actions"]
        NX["Nginx"]
    end

    R --> FA
    FA --> PG
    FA --> RD
    CEL --> SK & XG & GP
    CEL --> PG
```

### 7.2 Stack Justification

| Layer | Choice | Why (over alternatives) |
|-------|--------|-------------------------|
| **Frontend Framework** | React.js | Component-based, rich ecosystem, SIH judges familiar with it |
| **GIS Library** | Leaflet.js | Lightweight, open-source, excellent plugin ecosystem (vs heavy ArcGIS) |
| **Backend** | FastAPI | Async support, auto-docs (Swagger), native WebSocket support, fastest Python framework |
| **Database** | PostgreSQL + PostGIS | Gold standard for spatial queries, `ST_DWithin`, `ST_Intersects` built-in |
| **ML Framework** | Scikit-learn + XGBoost | Best for tabular data classification, no GPU needed, fast inference |
| **Spatial Processing** | GeoPandas + Shapely | Python-native geospatial, seamless pandas integration |
| **Task Queue** | Celery + Redis | Battle-tested async task processing for periodic data ingestion |
| **Containerization** | Docker | Reproducible environment, easy deployment, SIH demo-friendly |

---

## 8. Feature List

### 8.1 Core Features (MVP)

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| F1 | **Interactive GIS Map** | 🔴 Critical | Leaflet.js map with classified hotspot overlays, zoom, pan, layer toggle |
| F2 | **Real-time FIRMS Ingestion** | 🔴 Critical | Automated pipeline fetching FIRMS data every 3 hours |
| F3 | **AI Classification Engine** | 🔴 Critical | ML model classifying hotspots into 6 categories |
| F4 | **Hotspot Detail Panel** | 🔴 Critical | Click any marker → see classification, confidence, FRP, nearest facility |
| F5 | **Filter & Search** | 🟡 High | Filter by fire type, date range, state, confidence level |
| F6 | **Dashboard Analytics** | 🟡 High | Stats cards, time-series charts, classification pie charts |
| F7 | **Alert System** | 🟡 High | Real-time WebSocket alerts for high-severity industrial fires |

### 8.2 Enhanced Features

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| F8 | **Persistence Tracker** | 🟡 High | Identify and track gas flares and persistent thermal sources |
| F9 | **Industrial Facility Overlay** | 🟡 High | OSM industrial facilities shown on map with buffer zones |
| F10 | **Historical Playback** | 🟢 Medium | Animate hotspot data over time (time slider) |
| F11 | **Report Generation** | 🟢 Medium | Export classified data as PDF/CSV reports |
| F12 | **Heatmap Layer** | 🟢 Medium | Density heatmap of fire events across India |
| F13 | **Comparison View** | 🟢 Medium | Compare fire activity between two date ranges |
| F14 | **User Authentication** | 🟢 Medium | Login/register for admin access |

### 8.3 Stretch Features (If Time Permits)

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| F15 | **Satellite Imagery Overlay** | 🔵 Low | Sentinel-2 true/false color imagery tiles |
| F16 | **Predictive Analytics** | 🔵 Low | Predict fire-prone zones based on historical patterns |
| F17 | **Multi-language Support** | 🔵 Low | Hindi + English interface |
| F18 | **Mobile PWA** | 🔵 Low | Progressive Web App for field use |

---

## 9. Frontend UI Design

### 9.1 UI Mockups

#### Page 1: Main Dashboard — Map View
![Main dashboard showing interactive GIS map of India with classified fire hotspots, filter sidebar, stats cards, and trend charts](C:/Users/suraj/.gemini/antigravity-ide/brain/0998582b-c8e7-48f3-9510-9c7223fe2936/dashboard_main_1788260430452.jpg)

#### Page 2: Analytics & Detail View
![Analytics page with satellite view, hotspot classification details panel, thermal signature comparison, and timeline charts](C:/Users/suraj/.gemini/antigravity-ide/brain/0998582b-c8e7-48f3-9510-9c7223fe2936/analytics_detail_1788260442945.jpg)

#### Page 3: Alerts & Reports
![Alerts management page with severity breakdown, filterable alert table, and alert detail side panel](C:/Users/suraj/.gemini/antigravity-ide/brain/0998582b-c8e7-48f3-9510-9c7223fe2936/alerts_reports_1788260468370.jpg)

### 9.2 Page Structure

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Main map view with stats, filters, and classified markers |
| **Analytics** | `/analytics` | Detailed charts, trends, classification breakdown |
| **Hotspot Detail** | `/hotspot/:id` | Full detail view of a single classified hotspot |
| **Alerts** | `/alerts` | Alert management table with severity and actions |
| **Reports** | `/reports` | Generate and download PDF/CSV reports |
| **Settings** | `/settings` | User preferences, notification settings |
| **Login** | `/login` | Authentication page |

### 9.3 UI Component Hierarchy

```mermaid
graph TD
    APP["App.jsx"] --> NAV["Navbar"]
    APP --> ROUTER["React Router"]
    
    ROUTER --> DASH["DashboardPage"]
    ROUTER --> ANALYTICS["AnalyticsPage"]
    ROUTER --> ALERTS["AlertsPage"]
    ROUTER --> REPORTS["ReportsPage"]
    
    DASH --> MAP["MapContainer"]
    DASH --> SIDEBAR["FilterSidebar"]
    DASH --> STATS["StatsBar"]
    DASH --> TIMELINE["TimelineChart"]
    
    MAP --> MARKERS["HotspotMarkers"]
    MAP --> HEATMAP["HeatmapLayer"]
    MAP --> FACILITIES["FacilityOverlay"]
    MAP --> LEGEND["MapLegend"]
    MAP --> POPUP["DetailPopup"]
    
    SIDEBAR --> DATEFILTER["DateRangeFilter"]
    SIDEBAR --> TYPEFILTER["FireTypeFilter"]
    SIDEBAR --> CONFSLIDER["ConfidenceSlider"]
    SIDEBAR --> REGIONSELECT["RegionSelector"]
    
    STATS --> STATCARD["StatCard x5"]
    
    ANALYTICS --> PIECH["PieChart"]
    ANALYTICS --> BARCH["BarChart"]
    ANALYTICS --> LINECH["LineChart"]
    ANALYTICS --> CLASSDETAIL["ClassificationDetail"]
    
    ALERTS --> ALERTTABLE["AlertTable"]
    ALERTS --> ALERTDETAIL["AlertDetailPanel"]
    ALERTS --> SEVBAR["SeverityBar"]
```

### 9.4 Design System

| Element | Specification |
|---------|--------------|
| **Color Palette** | Dark theme — `#0a0e27` (bg), `#1a1f3a` (card), `#e74c3c` (industrial fire), `#e67e22` (forest fire), `#f1c40f` (gas flare), `#2ecc71` (agri burn), `#3498db` (mining) |
| **Typography** | Inter (headings) + Roboto (body) from Google Fonts |
| **Border Radius** | 12px (cards), 8px (buttons), 20px (badges) |
| **Glassmorphism** | `backdrop-filter: blur(10px); background: rgba(26,31,58,0.7)` |
| **Map Tiles** | CartoDB Dark Matter (dark basemap) |
| **Icons** | Lucide React icons |
| **Animations** | Framer Motion for page transitions, CSS pulse for active fires |

---

## 10. Backend API Design

### 10.1 Backend Architecture

```mermaid
graph TB
    subgraph "FastAPI Application"
        MAIN["main.py<br/>FastAPI App Instance"]
        
        subgraph "Routers"
            R1["hotspots.py<br/>/api/hotspots"]
            R2["alerts.py<br/>/api/alerts"]
            R3["analytics.py<br/>/api/analytics"]
            R4["facilities.py<br/>/api/facilities"]
            R5["reports.py<br/>/api/reports"]
            R6["auth.py<br/>/api/auth"]
            R7["ws.py<br/>/ws/alerts"]
        end

        subgraph "Services"
            S1["FIRMSService<br/>Data ingestion"]
            S2["ClassificationService<br/>ML inference"]
            S3["SpatialService<br/>PostGIS queries"]
            S4["AlertService<br/>Alert management"]
            S5["ReportService<br/>PDF/CSV generation"]
        end

        subgraph "Models"
            M1["Hotspot"]
            M2["Facility"]
            M3["Alert"]
            M4["User"]
            M5["Classification"]
        end
    end

    MAIN --> R1 & R2 & R3 & R4 & R5 & R6 & R7
    R1 --> S1 & S2 & S3
    R2 --> S4
    R3 --> S3
    R5 --> S5
    S1 & S2 & S3 & S4 & S5 --> M1 & M2 & M3 & M4 & M5
```

### 10.2 Project Directory Structure

```
ignis/
├── frontend/                      # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── MapContainer.jsx
│   │   │   │   ├── HotspotMarkers.jsx
│   │   │   │   ├── HeatmapLayer.jsx
│   │   │   │   ├── FacilityOverlay.jsx
│   │   │   │   └── MapLegend.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── StatsBar.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── TimelineChart.jsx
│   │   │   ├── Filters/
│   │   │   │   ├── FilterSidebar.jsx
│   │   │   │   ├── DateRangeFilter.jsx
│   │   │   │   ├── FireTypeFilter.jsx
│   │   │   │   └── ConfidenceSlider.jsx
│   │   │   ├── Alerts/
│   │   │   │   ├── AlertTable.jsx
│   │   │   │   └── AlertDetail.jsx
│   │   │   ├── Analytics/
│   │   │   │   ├── PieChart.jsx
│   │   │   │   ├── BarChart.jsx
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
│   │   │   └── LoginPage.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js
│   │   │   └── useHotspots.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── map.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                       # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI app instance
│   │   ├── config.py             # Settings & environment
│   │   ├── database.py           # SQLAlchemy + PostGIS setup
│   │   ├── routers/
│   │   │   ├── hotspots.py
│   │   │   ├── alerts.py
│   │   │   ├── analytics.py
│   │   │   ├── facilities.py
│   │   │   ├── reports.py
│   │   │   ├── auth.py
│   │   │   └── websocket.py
│   │   ├── models/
│   │   │   ├── hotspot.py
│   │   │   ├── facility.py
│   │   │   ├── alert.py
│   │   │   ├── user.py
│   │   │   └── classification.py
│   │   ├── schemas/
│   │   │   ├── hotspot.py
│   │   │   ├── alert.py
│   │   │   └── analytics.py
│   │   ├── services/
│   │   │   ├── firms_service.py      # NASA FIRMS data fetcher
│   │   │   ├── osm_service.py        # OSM Overpass queries
│   │   │   ├── classification.py     # ML inference service
│   │   │   ├── spatial_service.py    # PostGIS spatial queries
│   │   │   ├── alert_service.py      # Alert generation
│   │   │   └── report_service.py     # PDF/CSV generation
│   │   ├── ml/
│   │   │   ├── model.py             # Model loading & prediction
│   │   │   ├── features.py          # Feature engineering
│   │   │   ├── train.py             # Training script
│   │   │   └── models/              # Saved model files
│   │   │       └── classifier_v1.joblib
│   │   ├── tasks/
│   │   │   ├── celery_app.py
│   │   │   ├── ingestion.py         # Periodic data ingestion
│   │   │   └── classification.py    # Batch classification
│   │   └── utils/
│   │       ├── geo_utils.py
│   │       └── constants.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic/                     # DB migrations
│       └── versions/
│
├── ml_notebooks/                    # Jupyter Notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_model_training.ipynb
│   └── 04_model_evaluation.ipynb
│
├── data/                           # Sample data
│   ├── firms_sample.csv
│   ├── osm_industrial_india.geojson
│   └── land_cover_india.tif
│
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

---

## 11. Database Schema

### 11.1 Entity Relationship Diagram

```mermaid
erDiagram
    HOTSPOT {
        uuid id PK
        float latitude
        float longitude
        geometry point "PostGIS POINT"
        float brightness
        float bright_t31
        float frp
        int confidence
        varchar satellite
        varchar instrument
        date acq_date
        time acq_time
        char daynight
        float scan
        float track
        varchar classification
        float classification_confidence
        uuid nearest_facility_id FK
        float dist_to_facility
        varchar land_cover_class
        float persistence_hours
        int recurrence_count
        timestamp created_at
        timestamp updated_at
    }

    FACILITY {
        uuid id PK
        varchar name
        varchar facility_type
        geometry geom "PostGIS POLYGON/POINT"
        varchar osm_id
        varchar state
        varchar district
        jsonb tags
        timestamp last_updated
    }

    ALERT {
        uuid id PK
        uuid hotspot_id FK
        varchar severity "critical/high/medium/low"
        varchar alert_type
        varchar message
        varchar status "active/acknowledged/resolved"
        timestamp triggered_at
        timestamp resolved_at
    }

    CLASSIFICATION_LOG {
        uuid id PK
        uuid hotspot_id FK
        varchar predicted_class
        float confidence_score
        jsonb feature_vector
        varchar model_version
        timestamp classified_at
    }

    USER_ACCOUNT {
        uuid id PK
        varchar email
        varchar password_hash
        varchar role "admin/viewer"
        timestamp created_at
    }

    HOTSPOT ||--o{ ALERT : "triggers"
    HOTSPOT ||--o{ CLASSIFICATION_LOG : "classified_by"
    FACILITY ||--o{ HOTSPOT : "nearest_to"
```

### 11.2 Key PostGIS Queries

```sql
-- Find all hotspots within 2km of any industrial facility
SELECT h.*, f.name AS facility_name, f.facility_type,
       ST_Distance(h.point::geography, f.geom::geography) AS distance_m
FROM hotspots h
JOIN facilities f ON ST_DWithin(h.point::geography, f.geom::geography, 2000)
WHERE h.acq_date >= CURRENT_DATE - INTERVAL '7 days';

-- Identify persistent thermal sources (same location, >48hrs)
SELECT latitude, longitude, COUNT(*) AS detections,
       MAX(acq_date) - MIN(acq_date) AS duration_days
FROM hotspots
WHERE acq_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ST_SnapToGrid(point, 0.01)
HAVING COUNT(*) > 5 AND MAX(acq_date) - MIN(acq_date) > 2;

-- Classification breakdown by state
SELECT f.state, h.classification, COUNT(*) AS count
FROM hotspots h
JOIN facilities f ON h.nearest_facility_id = f.id
WHERE h.acq_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY f.state, h.classification
ORDER BY count DESC;
```

---

## 12. UML Diagrams

### 12.1 Use Case Diagram

```mermaid
graph TB
    subgraph "Actors"
        U["👤 NTRO Analyst"]
        A["👤 Admin"]
        S["⏰ System Scheduler"]
    end

    subgraph "IGNIS System"
        UC1["View classified hotspots on map"]
        UC2["Filter hotspots by type/date/region"]
        UC3["View hotspot classification details"]
        UC4["Receive real-time fire alerts"]
        UC5["Analyze historical fire trends"]
        UC6["Generate fire reports as PDF/CSV"]
        UC7["View industrial facility overlay"]
        UC8["Track persistent thermal sources"]
        UC9["Manage alert settings"]
        UC10["Ingest FIRMS data periodically"]
        UC11["Run ML classification pipeline"]
        UC12["Manage users and roles"]
        UC13["Export data"]
        UC14["Playback historical timeline"]
    end

    U --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC14
    A --> UC9 & UC12 & UC13
    S --> UC10 & UC11
```

### 12.2 Class Diagram

```mermaid
classDiagram
    class Hotspot {
        +UUID id
        +float latitude
        +float longitude
        +float brightness
        +float frp
        +int confidence
        +str classification
        +float classification_confidence
        +datetime acq_datetime
        +get_features() dict
        +classify() str
        +get_nearest_facility() Facility
    }

    class Facility {
        +UUID id
        +str name
        +str facility_type
        +Geometry geom
        +str state
        +get_nearby_hotspots(radius_km) List~Hotspot~
        +get_buffer_zone() Geometry
    }

    class Alert {
        +UUID id
        +str severity
        +str alert_type
        +str status
        +datetime triggered_at
        +acknowledge()
        +resolve()
        +escalate()
    }

    class ClassificationService {
        +model sklearn_BaseEstimator
        +load_model(path)
        +predict(features) str
        +predict_batch(feature_list) List~str~
        +get_confidence(features) float
    }

    class FIRMSService {
        +api_key str
        +base_url str
        +fetch_hotspots(bbox, date_range) List~Hotspot~
        +parse_csv(data) DataFrame
        +get_active_fires(country) List~Hotspot~
    }

    class SpatialService {
        +db PostGIS
        +find_nearest_facility(point, radius) Facility
        +get_land_cover(point) str
        +spatial_join(hotspots, facilities) DataFrame
        +calculate_persistence(point, days) float
    }

    class AlertService {
        +check_thresholds(hotspot) Alert
        +create_alert(hotspot, severity) Alert
        +broadcast_alert(alert) void
        +get_active_alerts() List~Alert~
    }

    Hotspot --> Facility : nearest_facility
    Hotspot --> Alert : triggers
    ClassificationService --> Hotspot : classifies
    FIRMSService --> Hotspot : creates
    SpatialService --> Hotspot : enriches
    SpatialService --> Facility : queries
    AlertService --> Alert : manages
    AlertService --> Hotspot : monitors
```

### 12.3 Sequence Diagram — Hotspot Classification Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend
    participant API as FastAPI Backend
    participant DB as PostGIS Database
    participant ML as ML Model

    User->>Frontend: Opens Dashboard
    Frontend->>API: GET /api/hotspots?date=today&type=all
    API->>DB: SELECT * FROM hotspots WHERE acq_date = today
    DB-->>API: List of classified hotspots
    API-->>Frontend: JSON response with classified data
    Frontend->>Frontend: Render markers on Leaflet map

    User->>Frontend: Clicks on a hotspot marker
    Frontend->>API: GET /api/hotspots/{id}/details
    API->>DB: SELECT hotspot + facility + classification_log
    DB-->>API: Full hotspot details
    API-->>Frontend: Detailed classification info
    Frontend->>Frontend: Show detail popup/panel

    User->>Frontend: Applies filter (Industrial Fires only)
    Frontend->>API: GET /api/hotspots?type=industrial_fire&confidence_min=70
    API->>DB: SELECT WHERE classification = industrial_fire AND confidence > 70
    DB-->>API: Filtered hotspots
    API-->>Frontend: Updated data
    Frontend->>Frontend: Re-render filtered markers
```

### 12.4 Sequence Diagram — Real-time Alert Flow

```mermaid
sequenceDiagram
    participant CRON as ⏰ Scheduler
    participant WORKER as 🔧 Celery Worker
    participant FIRMS as 🛰️ NASA FIRMS API
    participant ML as 🤖 ML Model
    participant DB as 🗄️ PostGIS DB
    participant ALERT as 🚨 Alert Service
    participant WS as 📡 WebSocket
    participant UI as 🖥️ React Frontend

    CRON->>WORKER: Trigger data ingestion
    WORKER->>FIRMS: Fetch latest hotspots (India)
    FIRMS-->>WORKER: New hotspot data

    loop For each new hotspot
        WORKER->>WORKER: Engineer features
        WORKER->>ML: Classify hotspot
        ML-->>WORKER: Classification + confidence
        WORKER->>DB: Store classified hotspot

        alt Classification = Industrial Fire AND FRP > 200
            WORKER->>ALERT: Create HIGH severity alert
            ALERT->>DB: Store alert
            ALERT->>WS: Broadcast alert
            WS->>UI: Push notification
            UI->>UI: Show toast + blinking marker
        end
    end
```

### 12.5 State Diagram — Alert Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Detected: ML classifies high-risk hotspot

    Detected --> Active: Alert created
    Active --> Acknowledged: Analyst reviews
    Acknowledged --> Investigating: Team dispatched
    Investigating --> Resolved: Fire contained / False alarm
    Investigating --> Escalated: Severity increased

    Escalated --> Resolved: Eventually resolved

    Resolved --> [*]: Alert closed

    Active --> AutoResolved: Hotspot disappears after 24hrs
    AutoResolved --> [*]: Auto-closed
```

---

## 13. Workflow Diagrams

### 13.1 End-to-End System Workflow

```mermaid
flowchart TB
    START["🚀 System Start"] --> CRON["⏰ Scheduled Job<br/>Every 3 hours"]
    
    CRON --> FETCH["📡 Fetch Data"]
    
    subgraph FETCH["Data Fetching"]
        F1["FIRMS API<br/>Latest hotspots for India"]
        F2["OSM Overpass<br/>Industrial facilities - cached daily"]
        F3["Land Cover<br/>MODIS MCD12Q1 - cached monthly"]
    end
    
    FETCH --> PROCESS["⚙️ Data Processing"]
    
    subgraph PROCESS["Processing Pipeline"]
        P1["Parse and clean<br/>FIRMS CSV data"]
        P2["Deduplicate<br/>against existing DB records"]
        P3["Spatial join<br/>hotspots with facilities"]
        P4["Land cover lookup<br/>at hotspot coordinates"]
        P5["Calculate persistence<br/>and recurrence features"]
        P6["Engineer 16<br/>classification features"]
    end
    
    PROCESS --> CLASSIFY["🤖 AI Classification"]
    
    subgraph CLASSIFY["ML Inference"]
        C1["Load trained model"]
        C2["Predict class<br/>+ confidence score"]
        C3["Apply post-processing<br/>rules and thresholds"]
    end
    
    CLASSIFY --> STORE["🗄️ Store Results"]
    
    subgraph STORE["Database Storage"]
        D1["Insert classified<br/>hotspots to PostGIS"]
        D2["Update persistence<br/>scores"]
        D3["Log classification<br/>details"]
    end
    
    STORE --> ALERT["🚨 Alert Engine"]
    
    subgraph ALERT["Alert Processing"]
        A1["Check severity<br/>thresholds"]
        A2["Generate alerts<br/>for critical events"]
        A3["Push via WebSocket<br/>to connected clients"]
    end
    
    ALERT --> SERVE["🖥️ Serve to Frontend"]
    
    subgraph SERVE["User Interface"]
        U1["Update map markers<br/>with new data"]
        U2["Refresh dashboard<br/>stats and charts"]
        U3["Show alert<br/>notifications"]
    end
```

### 13.2 User Interaction Workflow

```mermaid
flowchart LR
    A["User opens IGNIS"] --> B["Dashboard loads<br/>with default view"]
    B --> C["Map shows today's<br/>classified hotspots"]
    
    C --> D{"User action?"}
    
    D -->|"Click marker"| E["View hotspot details<br/>Type, FRP, facility, confidence"]
    D -->|"Apply filters"| F["Filter by type, date,<br/>region, confidence"]
    D -->|"Toggle layers"| G["Show/hide facility buffers,<br/>heatmap, satellite"]
    D -->|"View analytics"| H["Charts, trends,<br/>classification breakdown"]
    D -->|"Check alerts"| I["Alert table,<br/>acknowledge/resolve"]
    D -->|"Generate report"| J["Select parameters,<br/>export PDF/CSV"]
    D -->|"Time slider"| K["Playback historical<br/>hotspot animation"]
    
    E & F & G & H & I & J & K --> D
```

---

## 14. API Endpoints

### 14.1 Complete REST API Specification

#### Hotspots

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| `GET` | `/api/hotspots` | List classified hotspots | `date_from`, `date_to`, `type`, `confidence_min`, `state`, `bbox`, `limit`, `offset` |
| `GET` | `/api/hotspots/{id}` | Get hotspot details | — |
| `GET` | `/api/hotspots/{id}/history` | Get hotspot location history | `days` |
| `GET` | `/api/hotspots/latest` | Get most recent ingestion | `limit` |
| `GET` | `/api/hotspots/heatmap` | Get heatmap data points | `date_from`, `date_to`, `type` |

#### Facilities

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| `GET` | `/api/facilities` | List industrial facilities | `type`, `state`, `bbox` |
| `GET` | `/api/facilities/{id}` | Get facility details | — |
| `GET` | `/api/facilities/{id}/hotspots` | Hotspots near a facility | `radius_km`, `days` |

#### Analytics

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| `GET` | `/api/analytics/summary` | Dashboard summary stats | `date_from`, `date_to` |
| `GET` | `/api/analytics/timeline` | Time-series fire counts | `date_from`, `date_to`, `interval` |
| `GET` | `/api/analytics/classification` | Classification breakdown | `date_from`, `date_to`, `state` |
| `GET` | `/api/analytics/top-states` | States with most fires | `type`, `limit` |
| `GET` | `/api/analytics/persistence` | Persistent source list | `min_hours`, `limit` |

#### Alerts

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| `GET` | `/api/alerts` | List alerts | `severity`, `status`, `date_from`, `date_to` |
| `GET` | `/api/alerts/{id}` | Get alert details | — |
| `PUT` | `/api/alerts/{id}/acknowledge` | Acknowledge an alert | — |
| `PUT` | `/api/alerts/{id}/resolve` | Resolve an alert | `resolution_note` |

#### Reports

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|-------------|
| `POST` | `/api/reports/generate` | Generate report | Body: `date_range`, `type`, `format` |
| `GET` | `/api/reports/{id}/download` | Download generated report | — |

#### WebSocket

| Protocol | Endpoint | Description |
|----------|----------|-------------|
| `WS` | `/ws/alerts` | Real-time alert stream |

### 14.2 Sample API Response

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "latitude": 19.0456,
      "longitude": 72.8893,
      "brightness": 412.5,
      "frp": 287.3,
      "confidence": 94,
      "satellite": "VIIRS",
      "acq_datetime": "2024-01-15T08:45:00Z",
      "daynight": "D",
      "classification": {
        "type": "industrial_fire",
        "confidence": 0.94,
        "model_version": "v1.2"
      },
      "nearest_facility": {
        "id": "f5e6d7c8-a1b2-3456-cdef-789012345678",
        "name": "IOCL Refinery Mumbai",
        "type": "oil_refinery",
        "distance_km": 1.2
      },
      "land_cover": "industrial",
      "persistence_hours": 72,
      "recurrence_30d": 15
    }
  ]
}
```

---

## 15. Deployment Architecture

### 15.1 Docker Compose Setup

```mermaid
graph TB
    subgraph "Docker Compose Stack"
        subgraph "nginx:latest"
            NG["Nginx<br/>Port 80/443"]
        end

        subgraph "ignis-frontend"
            FE["React Build<br/>Served by Nginx"]
        end

        subgraph "ignis-backend"
            BE["FastAPI<br/>Port 8000"]
        end

        subgraph "ignis-worker"
            WK["Celery Worker<br/>ML + Ingestion"]
        end

        subgraph "ignis-scheduler"
            SC["Celery Beat<br/>Periodic Tasks"]
        end

        subgraph "postgres:16-postgis"
            DB["PostgreSQL<br/>+ PostGIS<br/>Port 5432"]
        end

        subgraph "redis:7"
            RD["Redis<br/>Port 6379"]
        end
    end

    NG --> FE
    NG --> BE
    BE --> DB & RD
    WK --> DB & RD
    SC --> RD

    USER["🌐 Browser"] --> NG
```

### 15.2 Environment Variables

```env
# .env.example
FIRMS_MAP_KEY=your_nasa_firms_api_key
DATABASE_URL=postgresql://ignis:password@postgres:5432/ignis_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-secret-key-here
INGESTION_INTERVAL_HOURS=3
INDIA_BBOX=68.0,6.0,97.5,37.5
ML_MODEL_PATH=app/ml/models/classifier_v1.joblib
ALERT_FRP_THRESHOLD=200
```

---

## 16. Project Timeline & Milestones

### 16.1 Development Phases (SIH Timeline)

```mermaid
gantt
    title IGNIS Development Timeline
    dateFormat  YYYY-MM-DD
    
    section Phase 1: Foundation
    Research & Data Exploration       :p1, 2024-01-01, 5d
    Database Schema & PostGIS Setup   :p2, after p1, 3d
    FIRMS API Integration             :p3, after p1, 4d
    OSM Data Ingestion                :p4, after p2, 3d

    section Phase 2: ML Pipeline
    Feature Engineering Pipeline      :p5, after p3, 5d
    Semi-supervised Labeling          :p6, after p5, 4d
    Model Training & Evaluation       :p7, after p6, 5d
    Model Optimization                :p8, after p7, 3d

    section Phase 3: Backend
    FastAPI Setup & Routers           :p9, after p4, 4d
    Classification Service            :p10, after p8, 3d
    Alert & WebSocket Service         :p11, after p10, 3d
    Celery Workers & Scheduler        :p12, after p11, 3d

    section Phase 4: Frontend
    React Setup & Routing             :p13, after p9, 3d
    Leaflet Map & Markers             :p14, after p13, 5d
    Dashboard & Charts                :p15, after p14, 4d
    Filter Sidebar & Alerts UI        :p16, after p15, 3d

    section Phase 5: Integration
    End-to-End Integration            :p17, after p12, 4d
    Docker Compose Deployment         :p18, after p17, 2d
    Testing & Bug Fixes               :p19, after p18, 4d
    Demo Preparation                  :p20, after p19, 3d
```

### 16.2 Milestone Checklist

| Milestone | Target | Status |
|-----------|--------|--------|
| M1: FIRMS data successfully ingested | Week 1 | ⬜ |
| M2: PostGIS database operational | Week 1 | ⬜ |
| M3: Feature engineering pipeline working | Week 2 | ⬜ |
| M4: ML model trained with >80% accuracy | Week 3 | ⬜ |
| M5: FastAPI backend serving classified data | Week 4 | ⬜ |
| M6: Leaflet map rendering classified markers | Week 5 | ⬜ |
| M7: Real-time alerts functional | Week 6 | ⬜ |
| M8: Full dashboard with analytics | Week 7 | ⬜ |
| M9: Docker deployment working | Week 8 | ⬜ |
| M10: Demo-ready with sample data | Week 8 | ⬜ |

---

## 17. Risk Analysis & Mitigation

| # | Risk | Probability | Impact | Mitigation Strategy |
|---|------|------------|--------|---------------------|
| R1 | **No labeled training data** | High | High | Semi-supervised labeling using OSM + land cover + VIIRS Nightfire as proxy labels |
| R2 | **FIRMS API rate limits** | Medium | Medium | Cache data locally, batch requests, use API key for higher limits |
| R3 | **OSM incomplete for Indian industries** | Medium | Medium | Supplement with manual tagging of major refineries, power plants from government databases |
| R4 | **Low ML model accuracy** | Medium | High | Ensemble methods (RF + XGB + LGBM), iterative feature engineering, rule-based fallback |
| R5 | **Satellite revisit gap (not real-time)** | Low | Medium | Set correct expectations — "near real-time" (3-hour updates), not instantaneous |
| R6 | **PostGIS performance on large datasets** | Low | Medium | Spatial indexing (GIST), query optimization, pagination |
| R7 | **Team skill gaps** | Medium | Medium | Divide work by expertise, use well-documented libraries, pair programming |
| R8 | **Demo day connectivity issues** | Low | High | Pre-load sample data, have offline demo mode with cached responses |

---

## 18. Innovation & Uniqueness

### 18.1 What Makes IGNIS Different

| Aspect | Existing Systems | IGNIS |
|--------|-----------------|-------|
| **Classification** | Binary (fire/no-fire) | 6-class taxonomy with confidence scores |
| **Context Awareness** | None — treats all hotspots equally | Spatial context from OSM + land cover |
| **Persistence Analysis** | Not available | Time-series tracking of persistent sources |
| **Industrial Focus** | General fire monitoring | Specifically designed for industrial safety |
| **Anomaly Detection** | Missing | Detects unusual FRP spikes at industrial sites |
| **GIS Integration** | Basic map pins | Rich interactive layers with facility buffers, heatmaps, time sliders |

### 18.2 Novel Contributions

1. **Multi-source fusion classifier** — First system to combine FIRMS + OSM + land cover + temporal persistence for fire classification
2. **Industrial safety early warning** — Detects anomalous thermal events at known industrial facilities before they become disasters
3. **Gas flare vs fire discrimination** — Critical distinction that no existing public system makes
4. **Semi-supervised labeling framework** — Reusable approach for creating training data where none exists

---

## 19. Future Scope

| # | Enhancement | Description |
|---|-------------|-------------|
| 1 | **Deep Learning on Satellite Imagery** | Train CNN on Sentinel-2 image patches for pixel-level fire classification |
| 2 | **Integration with ISRO Satellites** | Use INSAT-3D/3DR thermal data for India-specific monitoring |
| 3 | **Drone Integration** | Accept thermal drone feeds for close-range verification |
| 4 | **Air Quality Correlation** | Integrate CPCB air quality data to assess pollution impact of fires |
| 5 | **Predictive Fire Risk Modeling** | ML model predicting fire probability based on weather, season, industrial activity |
| 6 | **Multi-country Expansion** | Scale to other countries with industrial zones |
| 7 | **API for Third-party Integration** | Public API for other disaster management systems |
| 8 | **Automated Incident Reports** | AI-generated incident summaries sent to NDMA/SDMA |
| 9 | **Crowd-sourced Verification** | Allow field workers to verify/correct classifications via mobile app |

---

## 20. References

| # | Reference | URL |
|---|-----------|-----|
| 1 | NASA FIRMS — Fire Information for Resource Management System | https://firms.modaps.eosdis.nasa.gov |
| 2 | MODIS Active Fire Product (MCD14ML) | https://modis-fire.umd.edu |
| 3 | VIIRS Active Fire Product (VNP14IMG) | https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/viirs-i-band-375-m-active-fire-data |
| 4 | OpenStreetMap Overpass API | https://overpass-api.de |
| 5 | MODIS Land Cover (MCD12Q1) | https://lpdaac.usgs.gov/products/mcd12q1v061 |
| 6 | Sentinel-2 — Copernicus Open Access Hub | https://scihub.copernicus.eu |
| 7 | VIIRS Nightfire (Gas Flare Detection) | https://eogdata.mines.edu/products/vnf |
| 8 | PostGIS Spatial Database | https://postgis.net |
| 9 | Scikit-learn Machine Learning | https://scikit-learn.org |
| 10 | XGBoost Documentation | https://xgboost.readthedocs.io |
| 11 | Leaflet.js Interactive Maps | https://leafletjs.com |
| 12 | FastAPI Framework | https://fastapi.tiangolo.com |
| 13 | Smart India Hackathon | https://sih.gov.in |

---

> **Document Version:** 1.0
> **Last Updated:** September 2026
> **Team:** [Your Team Name]
> **Institution:** [Your College Name]

---

*This document serves as the comprehensive pre-project blueprint for IGNIS. All architectural decisions, technology choices, and design specifications outlined here form the foundation for development.*
