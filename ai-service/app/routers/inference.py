"""
NutriVision AI - Inference Router
Exposes endpoints for AI-based preliminary visual pattern screening.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from app.schemas.inference import InferenceResponse
from app.services.inference_service import run_screening_inference

router = APIRouter(tags=["AI Screening & Inference Engine"])


@router.post("/inference/analyze", response_model=InferenceResponse)
@router.post("/analyze", response_model=InferenceResponse)
async def analyze_deficiency_screening(
    file: UploadFile = File(...),
    target_body_part: Optional[str] = Form(None)
) -> InferenceResponse:
    """
    Accepts an uploaded image and target anatomical region.
    Performs image quality validation, checks model availability, and executes inference if model is ready.
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided in upload."
        )

    try:
        image_bytes = await file.read()
        if not image_bytes or len(image_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty image data provided."
            )

        return run_screening_inference(image_bytes, target_body_part)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Inference request processing failed: {str(e)}"
        )
