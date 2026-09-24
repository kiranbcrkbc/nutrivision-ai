"""
Vitamin Deficiency - Inference Schemas
Data models for AI model inference and screening results.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.quality import ImageQualityResponse


class PredictionItem(BaseModel):
    rank: int
    categoryCode: Optional[str] = None  # e.g., "Iron_Deficiency"
    deficiencyCategory: str
    modelConfidence: float = Field(..., ge=0.0, le=1.0)
    confidencePercentage: str  # e.g., "84.5%"
    possiblePatternDescription: str  # e.g., "Possible visual pattern associated with Vitamin B12 deficiency"



class InferenceResponse(BaseModel):
    status: str  # "SUCCESS" | "QUALITY_REJECTED" | "MODEL_NOT_AVAILABLE" | "ERROR"
    modelAvailable: bool = False
    modelStatus: str = "MODEL_NOT_AVAILABLE"  # "MODEL_READY" | "MODEL_NOT_AVAILABLE" | "MODEL_LOADING" | "MODEL_ERROR"
    inferenceStatus: str = "MODEL_NOT_CONFIGURED"  # "SUCCESS" | "QUALITY_REJECTED" | "MODEL_NOT_CONFIGURED" | "ERROR"
    modelName: Optional[str] = None
    modelVersion: Optional[str] = None
    targetBodyPart: Optional[str] = None
    qualityEvaluation: Optional[ImageQualityResponse] = None
    predictions: List[PredictionItem] = []
    topPrediction: Optional[PredictionItem] = None
    explainabilityStatus: str = "EXPLAINABILITY_NOT_AVAILABLE"  # "READY" | "EXPLAINABILITY_NOT_AVAILABLE"
    gradcamPath: Optional[str] = None
    message: Optional[str] = None
    medicalDisclaimer: str = (
        "Vitamin Deficiency provides AI-based preliminary screening indicators only. "
        "This is not a medical diagnosis. Always consult a qualified healthcare professional for clinical advice."
    )

