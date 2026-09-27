<div align="center">
  <img src="https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge" alt="SIH 2026" />
  <img src="https://img.shields.io/badge/Problem%20Statement-26162-blue?style=for-the-badge" alt="PS 26162" />
  <img src="https://img.shields.io/badge/NTRO-Ministry%20of%20PMO-darkblue?style=for-the-badge" alt="NTRO" />
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  
  <br />
  <br />

  <h1>🔥 IGNIS</h1>
  <h3>Intelligent Geospatial Network for Industrial fire Surveillance</h3>
  <p>An AI-powered geospatial platform leveraging NASA FIRMS data to detect, classify, and monitor industrial fires in real-time.</p>
</div>

---

## 🚀 Live Demonstration (Jury Ready)

The IGNIS platform is globally deployed and ready for live evaluation. 

**🌐 Live Application:** [https://frontend-five-lyart-7gyyyiyia4.vercel.app](https://frontend-five-lyart-7gyyyiyia4.vercel.app)  
*(Backup Link: [https://frontend-kkpcsj1tu-vision-x345.vercel.app](https://frontend-kkpcsj1tu-vision-x345.vercel.app))*

**🔐 Demo Credentials:**
- **Email:** `admin@ignis.gov`
- **Password:** `admin123`

---

## 📖 Overview

**IGNIS** is a comprehensive solution developed for **Smart India Hackathon (SIH) 2026** — Problem Statement **26162** (NTRO, Ministry of PMO). The system autonomously ingests VIIRS/MODIS satellite data from NASA FIRMS, enriches it with geospatial context (OSM facilities, land cover), and applies a trained **Random Forest Machine Learning model** to accurately differentiate true **Industrial Fires** from forest fires, agricultural fires, and static thermal anomalies.

When a critical industrial fire is detected, IGNIS triggers real-time WebSocket alerts to a state-of-the-art React dashboard, allowing field operators to view, acknowledge, and resolve incidents instantly.

## ✨ Key Features

- 🛰️ **Automated NASA FIRMS Ingestion**: Background tasks fetch live satellite anomaly data every 10 minutes.
- 🧠 **AI Classification Engine**: A `scikit-learn` Random Forest Soft-Voting Classifier trained on 10,000+ historical thermal profiles.
- 🗺️ **Geospatial Intelligence**: PostGIS integration for mapping hotspots against industrial infrastructure buffers.
- ⚡ **Real-Time Alerting**: Instant WebSocket push notifications and external Webhook dispatch for CRITICAL industrial fire detections.
- 🔒 **Secure Authentication**: JWT-based OAuth2 secure login and registration system.
- 📊 **Dynamic Glassmorphism Dashboard**: A visually stunning UI featuring interactive maps, timeline charts, and tactical intelligence screens.

## 🛠️ Tech Stack & Cloud Infrastructure

### Frontend (Hosted on Vercel)
- **React.js + Vite**
- **Framer Motion** for tactical HUD animations
- **Leaflet.js** for interactive CartoDB mapping
- **Chart.js** for analytics and time-series data

### Backend & AI (Hosted on Render)
- **FastAPI** (High-performance async API)
- **Python Data Stack** (`pandas`, `scikit-learn`, `numpy`)
- **APScheduler** (Background NASA FIRMS ingestion polling)

### Database (Hosted on Neon serverless PostgreSQL)
- **PostgreSQL + PostGIS** (Spatial data processing)
- **SQLAlchemy + GeoAlchemy2** (Async ORM)

---

## 🏗️ Cloud Architecture

```mermaid
graph TD
    A[NASA FIRMS API] -->|VIIRS/MODIS Data| B(Render: Backend Workers)
    B -->|Spatial Enrichment| C{Random Forest ML}
    C -->|Classified Hotspots| D[(Neon: PostgreSQL + PostGIS)]
    
    D <-->|Queries & Geo-Joins| E[Render: FastAPI Backend]
    
    E <-->|JWT Auth & REST API| F[Vercel: React Frontend]
    E -.->|WebSocket Push Alerts| F
    
    style A fill:#1a5276,color:#fff
    style B fill:#b9770e,color:#fff
    style C fill:#9b59b6,color:#fff
    style D fill:#229954,color:#fff
    style E fill:#ba4a00,color:#fff
    style F fill:#000,color:#fff
```

---

## 💻 Alternative: Local Deployment

If you prefer to run the application locally on your own machine instead of using the live link:

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed on your system.

### Boot the Platform
Open your terminal in the project root directory and run:

```bash
docker-compose up -d --build
```
*Note: The first build may take ~2 minutes to compile heavy geospatial libraries (GDAL, GeoPandas).*

- Open your browser and navigate to: **http://localhost:5173**
- The backend automatically pre-seeds the database! Log in with `admin@ignis.gov` / `admin123`.

### Test the Live Pipeline Locally
1. Navigate to the **Settings** page via the sidebar.
2. Click **"FORCE IMMEDIATE SYNC"**.
3. IGNIS will immediately fetch the latest global telemetry from NASA, run it through the Machine Learning inference engine, and populate the map!

---

## 🛑 Troubleshooting

- **No data appearing on the map?** Navigate to Settings and hit the "Force Immediate Sync" button. NASA satellites only pass over intermittently, so live data updates naturally every few hours.
