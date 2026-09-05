from pydantic import BaseModel
from typing import Optional

class ImageQualityResponse(BaseModel):
    qualityStatus: str  # "PASSED" | "REJECTED" | "WARNING"
    blurScore: Optional[float] = None
    brightnessScore: Optional[float] = None
    rejectionReason: Optional[str] = None
