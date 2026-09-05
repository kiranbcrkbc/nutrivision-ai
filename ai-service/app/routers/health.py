"""
NutriVision AI - Health & System Status Router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.model_service import model_service

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    imageQualityEngine: str
    inferenceModel: str
    modelAvailable: bool
    activeModel: Optional[str] = None
    disclaimer: str


@router.get("/health")
def get_simple_health() -> Dict[str, Any]:
    """Simple health check endpoint."""
    return {
        "service": "nutrivision-ai-service",
        "status": "UP",
        "imageQualityEngine": "READY",
        "inferenceModel": model_service.get_model_status(),
        "modelAvailable": model_service.is_model_ready()
    }


@router.get("/api/ai/health", response_model=HealthResponse)
def get_detailed_health() -> HealthResponse:
    """Detailed health check endpoint reporting quality engine and model status."""
    meta = model_service.get_metadata()
    return HealthResponse(
        status="UP",
        service="NutriVision AI Inference Engine",
        version="1.0.0",
        imageQualityEngine="READY",
        inferenceModel=model_service.get_model_status(),
        modelAvailable=model_service.is_model_ready(),
        activeModel=meta.get("model_name"),
        disclaimer=(
            "Results provided by NutriVision AI are AI-based preliminary assessments or possible indicators only. "
            "They are not medically certified diagnoses."
        )
    )

