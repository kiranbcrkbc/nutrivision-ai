"""
NutriVision AI - Image Quality Evaluation Service
Provides technical image quality analysis (sharpness via Laplacian variance, luminance via mean grayscale intensity).
DOES NOT perform medical diagnosis - strictly technical quality assurance.
"""

import io
import cv2
import numpy as np
from PIL import Image
from app.core.config import settings
from app.schemas.quality import ImageQualityResponse

BLUR_REJECT_THRESHOLD = 70.0
BLUR_ACCEPT_THRESHOLD = settings.blur_laplacian_threshold  # Default: 100.0
BRIGHTNESS_MIN_REJECT = settings.min_brightness_luminance   # Default: 40.0
BRIGHTNESS_MIN_WARN = 60.0
BRIGHTNESS_MAX_WARN = 200.0
BRIGHTNESS_MAX_REJECT = settings.max_brightness_luminance   # Default: 220.0


def evaluate_image_quality(image_bytes: bytes) -> ImageQualityResponse:
    """
    Evaluates image quality using OpenCV Laplacian variance for blur and mean grayscale luminance for brightness.
    Strictly technical quality analysis — DOES NOT perform medical diagnosis.
    """
    if not image_bytes or len(image_bytes) == 0:
        return ImageQualityResponse(
            qualityStatus="REJECTED",
            blurScore=None,
            brightnessScore=None,
            rejectionReason="Empty or invalid image data provided."
        )

    # 1. Decode image via OpenCV
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Fallback to PIL if OpenCV direct decode fails on specific formats
    if img is None:
        try:
            pil_img = Image.open(io.BytesIO(image_bytes))
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        except Exception:
            return ImageQualityResponse(
                qualityStatus="REJECTED",
                blurScore=None,
                brightnessScore=None,
                rejectionReason="Invalid or corrupted image format. Unable to decode."
            )

    if img is None or img.size == 0:
        return ImageQualityResponse(
            qualityStatus="REJECTED",
            blurScore=None,
            brightnessScore=None,
            rejectionReason="Invalid or corrupted image format. Unable to decode."
        )

    # 2. Convert to grayscale for OpenCV operations
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 3. Calculate Laplacian variance for blur/sharpness score
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    blur_score = round(laplacian_var, 2)

    # 4. Calculate mean luminance for brightness score
    mean_luminance = float(np.mean(gray))
    brightness_score = round(mean_luminance, 2)

    # 5. Quality Decision Logic
    # 5a. Rejection: Severe underexposure
    if brightness_score < BRIGHTNESS_MIN_REJECT:
        return ImageQualityResponse(
            qualityStatus="REJECTED",
            blurScore=blur_score,
            brightnessScore=brightness_score,
            rejectionReason=f"Image is too dark (brightness score: {brightness_score}, minimum: {BRIGHTNESS_MIN_REJECT:.0f}). Please capture the image in a well-lit environment."
        )

    # 5b. Rejection: Severe overexposure
    if brightness_score > BRIGHTNESS_MAX_REJECT:
        return ImageQualityResponse(
            qualityStatus="REJECTED",
            blurScore=blur_score,
            brightnessScore=brightness_score,
            rejectionReason=f"Image is too bright (brightness score: {brightness_score}, maximum: {BRIGHTNESS_MAX_REJECT:.0f}). Please reduce excessive lighting or flash glare."
        )

    # 5c. Rejection: Severe blur
    if blur_score < BLUR_REJECT_THRESHOLD:
        return ImageQualityResponse(
            qualityStatus="REJECTED",
            blurScore=blur_score,
            brightnessScore=brightness_score,
            rejectionReason=f"Image is too blurry (sharpness score: {blur_score}, threshold: {BLUR_ACCEPT_THRESHOLD:.0f}). Please hold the camera steady and capture a clearer photograph."
        )

    # 5d. Warning: Borderline blur
    if blur_score < BLUR_ACCEPT_THRESHOLD:
        return ImageQualityResponse(
            qualityStatus="WARNING",
            blurScore=blur_score,
            brightnessScore=brightness_score,
            rejectionReason=f"Image sharpness is slightly below ideal threshold (sharpness score: {blur_score}). A clearer photograph is recommended for optimal accuracy."
        )

    # 5e. Warning: Borderline dim lighting
    if brightness_score < BRIGHTNESS_MIN_WARN:
        return ImageQualityResponse(
            qualityStatus="WARNING",
            blurScore=blur_score,
            brightnessScore=brightness_score,
            rejectionReason=f"Image lighting is slightly dim (brightness score: {brightness_score}). Higher illumination is recommended."
        )

    # 5f. Warning: Borderline bright lighting
    if brightness_score > BRIGHTNESS_MAX_WARN:
        return ImageQualityResponse(
            qualityStatus="WARNING",
            blurScore=blur_score,
            brightnessScore=brightness_score,
            rejectionReason=f"Image lighting is slightly bright (brightness score: {brightness_score}). Moderate illumination is recommended."
        )

    # 5g. Passed
    return ImageQualityResponse(
        qualityStatus="PASSED",
        blurScore=blur_score,
        brightnessScore=brightness_score,
        rejectionReason=None
    )
