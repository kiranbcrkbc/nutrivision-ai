"""
NutriVision AI - Image Quality Router
Exposes endpoints for image quality analysis.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.quality import ImageQualityResponse
from app.services.quality_service import evaluate_image_quality

router = APIRouter(tags=["Image Quality Engine"])


@router.post("/analyze-image", response_model=ImageQualityResponse)
@router.post("/quality/check", response_model=ImageQualityResponse)
@router.post("/api/quality/check", response_model=ImageQualityResponse)
async def check_image_quality(file: UploadFile = File(...)) -> ImageQualityResponse:
    """
    Accepts an uploaded image via multipart/form-data and evaluates sharpness & brightness.
    Returns structured JSON with blur score, brightness score, quality status, and feedback.
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided in upload."
        )

    try:
        image_bytes = await file.read()
        if not image_bytes or len(image_bytes) == 0:
            return evaluate_image_quality(b"")

        return evaluate_image_quality(image_bytes)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process image: {str(e)}"
        )
