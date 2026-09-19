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

## 📖 Overview

**IGNIS** is a comprehensive solution developed for **Smart India Hackathon (SIH) 2026** — Problem Statement **26162** (NTRO, Ministry of PMO). The system autonomously ingests VIIRS/MODIS satellite data from NASA FIRMS, enriches it with geospatial context (OSM facilities, land cover), and applies an ensemble Machine Learning model to accurately differentiate true **Industrial Fires** from forest fires, agricultural fires, and static thermal anomalies.

When a critical industrial fire is detected, IGNIS triggers real-time WebSocket alerts to a state-of-the-art React dashboard, allowing field operators to view, acknowledge, and resolve incidents instantly.

## ✨ Key Features

- 🛰️ **Automated NASA FIRMS Ingestion**: Celery workers fetch live satellite anomaly data.
- 🧠 **AI Classification Engine**: Ensemble ML model (Random Forest, XGBoost, LightGBM) trained on historical thermal profiles.
- 🗺️ **Geospatial Intelligence**: PostGIS integration for mapping hotspots against industrial infrastructure buffers.
- ⚡ **Real-Time WebSocket Alerts**: Instant push notifications for critical industrial fire detections.
- 📊 **Dynamic Glassmorphism Dashboard**: A visually stunning UI featuring interactive maps, timeline charts, and alert management.
- 🕵️ **Human-in-the-loop Verification**: Feedback mechanism for ground truth updating.

## 🛠️ Tech Stack

### Frontend
- **React.js + Vite**
- **Leaflet.js** for interactive CartoDB mapping
- **Chart.js** for analytics and time-series data
- **Vanilla CSS** with a custom Glassmorphism Dark Theme

### Backend & AI
- **FastAPI** (High-performance async API)
- **Python Data Stack** (`pandas`, `scikit-learn`, `xgboost`, `lightgbm`)
- **Celery & Redis** (Background task scheduling)

### Database
- **PostgreSQL + PostGIS** (Spatial data processing)
- **SQLAlchemy + GeoAlchemy2** (ORM)

---

## 🏗️ Architecture

```mermaid
graph TD
    A[NASA FIRMS API] -->|VIIRS/MODIS Data| B(Celery Workers)
    B -->|Ingestion & Preprocessing| C{Ensemble ML Model}
    C -->|Classified Hotspots| D[(PostgreSQL + PostGIS)]
    
    D <-->|Queries & Geo-Joins| E[FastAPI Backend]
    
    E <-->|REST API| F[React Frontend Dashboard]
    E -.->|WebSocket Push Alerts| F
    
    style A fill:#1a5276,color:#fff
    style B fill:#b9770e,color:#fff
    style C fill:#9b59b6,color:#fff
    style D fill:#229954,color:#fff
    style E fill:#ba4a00,color:#fff
    style F fill:#1abc9c,color:#fff
```

---

## 🚀 Local Setup Instructions

Follow these steps to run the IGNIS platform locally for demonstration purposes.

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

# Create a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI Server
uvicorn app.main:app --reload --port 8000
```
> **Note:** For local mock testing, the API includes Mock Auth and Report generation endpoints so a live PostgreSQL database is not strictly required to launch the UI.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install Node modules
npm install

# Start the Vite Development Server
npm run dev
```

Visit `http://localhost:5173` in your browser to interact with the IGNIS Dashboard.

---

## 📚 API Documentation

Once the backend is running, you can explore the fully interactive Swagger UI documentation generated automatically by FastAPI:

* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📂 Project Structure

```
NASA-FIRMS/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── ml/           # ML model loading, training, evaluation, features
│   │   ├── models/       # SQLAlchemy ORM models (PostGIS)
│   │   ├── routers/      # API endpoint routers
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # FIRMS, OSM, spatial service modules
│   │   ├── tasks/        # Celery background tasks
│   │   └── utils/        # Constants, geo utilities
│   └── tests/            # Backend unit tests
├── frontend/             # React + Vite frontend
│   └── src/
│       ├── components/   # Dashboard, Map, Filters, Common, Analytics
│       ├── hooks/        # Custom React hooks (WebSocket, API)
│       ├── pages/        # Route pages
│       └── styles/       # CSS modules (app, map, glassmorphism)
├── ml_pipeline/          # Standalone ML training pipeline
│   ├── notebooks/        # Jupyter exploration notebooks
│   └── scripts/          # train_model.py (RF + XGBoost + LightGBM)
├── configs/              # Nginx, environment configs
├── data/                 # Models, datasets (gitignored)
├── scripts/              # Data download utilities
├── tests/                # Root test suite (unit, API, integration)
└── docker-compose.yml    # Full stack orchestration (7 services)
```

## 🧠 ML Pipeline

| Metric | Target | Achieved |
|--------|--------|----------|
| Overall Accuracy | > 85% | **99.9%** |
| Macro F1-Score | > 0.82 | **0.999** |
| Industrial Fire Recall | > 90% | **100%** |
| Gas Flare Precision | > 90% | **100%** |

The model uses a **Soft-Voting Ensemble** of Random Forest, XGBoost, and LightGBM trained on 16 engineered features including brightness ratio, FRP, pixel area, persistence hours, recurrence count, and land cover class.

## 🐳 Docker Setup (Full Stack)

```bash
# Start all 7 services (backend, frontend, postgres, redis, celery, nginx, flower)
docker-compose up --build
```

Access the platform at `http://localhost` (Nginx reverse proxy).

---

<div align="center">
  <i>Built with ❤️ for Smart India Hackathon 2026</i>
  <br />
  <sub>Problem Statement 26162 · NTRO · Ministry of PMO</sub>
</div>
