"""
IGNIS — FastAPI Application Configuration

Loads all environment variables via Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ----- Application -----
    app_env: str = "development"
    app_debug: bool = True
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    # ----- Database -----
    postgres_user: str = "ignis"
    postgres_password: str = "ignis_secure_password_change_me"
    postgres_db: str = "ignis_db"
    postgres_host: str = "postgres"
    postgres_port: int = 5432
    database_url: str = "postgresql+asyncpg://ignis:ignis_secure_password_change_me@postgres:5432/ignis_db"
    database_url_sync: str = "postgresql://ignis:ignis_secure_password_change_me@postgres:5432/ignis_db"

    # ----- Redis -----
    redis_url: str = "redis://redis:6379/0"

    # ----- Security -----
    secret_key: str = "replace-this-with-a-strong-random-secret-key"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 1440

    # ----- NASA FIRMS -----
    firms_map_key: str = ""
    ingestion_interval_hours: int = 3
    india_bbox: str = "68.0,6.0,97.5,37.5"

    # ----- ML Model -----
    ml_model_path: str = "app/ml/models/classifier_v1.joblib"
    ml_model_version: str = "v1.0"

    # ----- Alerts -----
    alert_frp_threshold: float = 200.0
    alert_industrial_fire_confidence: float = 0.85

    # ----- CORS -----
    cors_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost"

    # ----- Celery -----
    celery_broker_url: str = "redis://redis:6379/1"
    celery_result_backend: str = "redis://redis:6379/2"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def india_bbox_tuple(self) -> tuple:
        """Parse India bounding box as (min_lon, min_lat, max_lon, max_lat)."""
        parts = [float(x.strip()) for x in self.india_bbox.split(",")]
        return tuple(parts)

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


# Singleton settings instance
settings = Settings()
