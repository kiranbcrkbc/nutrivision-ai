"""
NutriVision AI - Inference Service
Orchestrates image quality evaluation, model readiness checks, and screening inference.
Enforces medical safety: never generates fake medical diagnoses or random predictions.
"""

import io
import cv2
import numpy as np
from PIL import Image
from typing import Optional, List
from app.schemas.quality import ImageQualityResponse
from app.schemas.inference import InferenceResponse, PredictionItem
from app.services.quality_service import evaluate_image_quality
from app.services.model_service import model_service


def run_screening_inference(
    image_bytes: bytes,
    target_body_part: Optional[str] = None
) -> InferenceResponse:
    """
    Executes end-to-end preliminary screening inference:
    1. Validates image bytes.
    2. Runs technical image quality checks (blur and brightness).
    3. Rejects low-quality images.
    4. Checks model availability state.
    5. Returns structured JSON with safe preliminary screening phrasing.
    """
    normalized_body_part = (target_body_part or "GENERAL").upper().strip()

    # Step 1: Quality Evaluation
    quality_res: ImageQualityResponse = evaluate_image_quality(image_bytes)

    # Step 2: Handle quality rejection
    if quality_res.qualityStatus == "REJECTED":
        return InferenceResponse(
            status="QUALITY_REJECTED",
            modelAvailable=False,
            modelStatus=model_service.get_model_status(),
            inferenceStatus="QUALITY_REJECTED",
            targetBodyPart=normalized_body_part,
            qualityEvaluation=quality_res,
            predictions=[],
            topPrediction=None,
            explainabilityStatus="EXPLAINABILITY_NOT_AVAILABLE",
            message=quality_res.rejectionReason or "Image quality does not meet technical sharpness or illumination requirements."
        )

    # Step 3: Check Model Availability
    if not model_service.is_model_ready():
        # Clean architectural response when no trained weights are installed
        metadata = model_service.get_metadata()
        return InferenceResponse(
            status="MODEL_NOT_AVAILABLE",
            modelAvailable=False,
            modelStatus="MODEL_NOT_AVAILABLE",
            inferenceStatus="MODEL_NOT_CONFIGURED",
            modelName=metadata.get("model_name"),
            modelVersion=metadata.get("model_version"),
            targetBodyPart=normalized_body_part,
            qualityEvaluation=quality_res,
            predictions=[],
            topPrediction=None,
            explainabilityStatus="EXPLAINABILITY_NOT_AVAILABLE",
            message="Image quality evaluation passed (sharpness and illumination verified). AI classification model is not yet configured with trained weights."
        )

    # Step 4: Run Real Model Inference (when model weights are active)
    try:
        predictions = model_service.predict(image_bytes, normalized_body_part)
        top_pred = predictions[0] if predictions else None

        return InferenceResponse(
            status="SUCCESS",
            modelAvailable=True,
            modelStatus="MODEL_READY",
            inferenceStatus="SUCCESS",
            modelName=model_service.active_model_name,
            modelVersion=model_service.active_model_version,
            targetBodyPart=normalized_body_part,
            qualityEvaluation=quality_res,
            predictions=predictions,
            topPrediction=top_pred,
            explainabilityStatus="EXPLAINABILITY_NOT_AVAILABLE",
            message="Preliminary visual pattern screening completed successfully."
        )

    except Exception as e:
        return InferenceResponse(
            status="ERROR",
            modelAvailable=False,
            modelStatus="MODEL_ERROR",
            inferenceStatus="ERROR",
            targetBodyPart=normalized_body_part,
            qualityEvaluation=quality_res,
            predictions=[],
            topPrediction=None,
            explainabilityStatus="EXPLAINABILITY_NOT_AVAILABLE",
            message=f"Inference execution failed: {str(e)}"
        )

