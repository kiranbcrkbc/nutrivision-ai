"""
Vitamin Deficiency - Core Configuration
"""

import os
from pydantic import BaseModel, Field


class Settings(BaseModel):
    app_name: str = "Vitamin Deficiency ML Engine"
    app_env: str = Field(default_factory=lambda: os.getenv("APP_ENV", "development"))
    host: str = Field(default_factory=lambda: os.getenv("HOST", "127.0.0.1"))
    port: int = Field(default_factory=lambda: int(os.getenv("PORT", "8000")))
    active_model_version: str = Field(default_factory=lambda: os.getenv("ACTIVE_MODEL_VERSION", "v1.0.0-mobilenetv2"))
    models_dir: str = Field(default_factory=lambda: os.getenv("MODELS_DIR", "./models/trained"))

    # Image Quality Thresholds
    blur_laplacian_threshold: float = Field(
        default_factory=lambda: float(os.getenv("BLUR_LAPLACIAN_THRESHOLD", "100.0"))
    )
    min_brightness_luminance: float = Field(
        default_factory=lambda: float(os.getenv("MIN_BRIGHTNESS_LUMINANCE", "40.0"))
    )
    max_brightness_luminance: float = Field(
        default_factory=lambda: float(os.getenv("MAX_BRIGHTNESS_LUMINANCE", "220.0"))
    )
    min_image_width: int = Field(default_factory=lambda: int(os.getenv("MIN_IMAGE_WIDTH", "224")))
    min_image_height: int = Field(default_factory=lambda: int(os.getenv("MIN_IMAGE_HEIGHT", "224")))


settings = Settings()
