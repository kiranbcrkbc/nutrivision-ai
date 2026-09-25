"""Regression checks for the reported unrelated-image and fabricated-result bugs."""
import io
import sys
from pathlib import Path

import numpy as np
import pytest
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "ai-service"))
from app.main import app
from app.services.inference_service import run_screening_inference
from app.services.quality_service import evaluate_image_quality
from app.services.model_service import model_service

client = TestClient(app)

def photo(kind="noise", size=(320, 320), format="PNG"):
    rng = np.random.default_rng(42)
    img = Image.fromarray(rng.integers(70, 190, (*size, 3), dtype=np.uint8))
    if kind == "dark": img = Image.new("RGB", size, (0, 0, 0))
    if kind == "bright": img = Image.new("RGB", size, (255, 255, 255))
    if kind == "blur": img = Image.new("RGB", size, (125, 125, 125))
    if kind == "phone":
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle((85, 30, 235, 295), 16, fill=(30, 30, 30))
        draw.rectangle((95, 50, 225, 265), fill=(90, 150, 180))
    out = io.BytesIO(); img.save(out, format=format); return out.getvalue()

@pytest.mark.parametrize("body", ["EYES", "NAILS", "SKIN", "HAIR", "LIPS", "TONGUE"])
def test_unrelated_photo_never_gets_deficiency(body):
    result = run_screening_inference(photo("phone"), body)
    assert result.status == "IMAGE_REJECTED"
    assert not result.predictions and result.topPrediction is None
    assert not result.modelAvailable

@pytest.mark.parametrize("kind", ["dark", "bright", "blur"])
def test_unusable_photo_is_rejected(kind):
    result = run_screening_inference(photo(kind), "EYES")
    assert result.status == "QUALITY_REJECTED"
    assert not result.predictions

@pytest.mark.parametrize("data", [b"", b"not a photograph", b"\x89PNG\r\n\x1a\n"])
def test_corrupt_image(data):
    assert evaluate_image_quality(data).qualityStatus == "REJECTED"

def test_low_resolution():
    assert "too small" in evaluate_image_quality(photo(size=(100, 100))).rejectionReason

def test_unsupported_format():
    assert evaluate_image_quality(photo(format="BMP")).qualityStatus == "REJECTED"

@pytest.mark.parametrize("format", ["PNG", "JPEG", "WEBP"])
def test_multipart_formats_return_honest_outcome(format):
    result = client.post("/api/ai/inference/analyze", files={"file": ("image." + format.lower(), photo(format=format), "image/" + format.lower())}, data={"target_body_part": "EYES"})
    assert result.status_code == 200, result.text
    assert result.json()["status"] == "IMAGE_REJECTED"
    assert result.json()["predictions"] == []

def test_oversized_upload():
    result = client.post("/api/ai/inference/analyze", files={"file": ("image.png", b"x" * (10 * 1024 * 1024 + 1), "image/png")}, data={"target_body_part": "EYES"})
    assert result.status_code == 413

def test_invalid_body_area():
    assert run_screening_inference(photo(), "PHONE").status == "INVALID_BODY_PART"

def test_health_separates_loading_from_validation():
    result = client.get("/api/ai/health")
    assert result.status_code == 200
    assert result.json()["screeningAvailable"] is False
    assert model_service.get_metadata()["evaluation_metrics"] is None

def test_model_cannot_be_called_to_bypass_validation():
    with pytest.raises(RuntimeError):
        model_service.predict(photo("phone"), "EYES")
