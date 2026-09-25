"""Photo variations and outage recovery; no clinical accuracy claim."""
import asyncio
import io
import sys
import threading
from pathlib import Path

import httpx
import pytest
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "ai-service"))
from app.main import app
from app.routers import quality
from app.schemas.quality import ImageQualityResponse
from app.services.content_service import content_service
from app.services.model_service import ModelService
from fastapi.testclient import TestClient

FIXTURES = Path(__file__).parent / "fixtures" / "content"
client = TestClient(app)


def variant(name, change):
    with Image.open(FIXTURES / f"{name}.jpg") as source:
        image = source.convert("RGB")
        image.thumbnail((800, 800))
        if change == "mirror": image = ImageOps.mirror(image)
        if change == "dim": image = ImageEnhance.Brightness(image).enhance(0.8)
        if change == "bright": image = ImageEnhance.Brightness(image).enhance(1.15)
        if change == "blur": image = image.filter(ImageFilter.GaussianBlur(12))
        if change == "dark": image = ImageEnhance.Brightness(image).enhance(0.05)
        out = io.BytesIO()
        image.save(out, "WEBP" if change == "webp" else "JPEG", quality=80)
        return out.getvalue()


@pytest.mark.parametrize("change", ["jpeg", "webp", "mirror", "dim", "bright"])
@pytest.mark.parametrize("region", ["EYES", "NAILS", "TONGUE", "LIPS", "SKIN", "HAIR"])
def test_burger_variations_never_pass(change, region):
    result = client.post("/analyze-image", files={"file": ("photo.jpg", variant("burger", change))}, data={"target_body_part": region})
    assert result.status_code == 200
    assert result.json()["qualityStatus"] == "REJECTED"


@pytest.mark.parametrize("change", ["jpeg", "webp", "mirror", "dim", "bright"])
def test_eye_variations_content_recognized(change):
    assert content_service.check(variant("eye", change), "EYES")["status"] == "ACCEPTED"


@pytest.mark.parametrize("change", ["blur", "dark"])
def test_bad_eye_quality_rejected(change):
    result = client.post("/analyze-image", files={"file": ("photo.jpg", variant("eye", change))}, data={"target_body_part": "EYES"})
    assert result.json()["qualityStatus"] == "REJECTED"


def test_outage_then_same_photo_recovers(monkeypatch):
    actual = content_service.check
    monkeypatch.setattr(content_service, "check", lambda *_: {"status": "UNAVAILABLE", "message": "Please retry"})
    args = dict(files={"file": ("eye.jpg", (FIXTURES / "eye.jpg").read_bytes())}, data={"target_body_part": "EYES"})
    assert client.post("/analyze-image", **args).json()["qualityStatus"] == "PENDING"
    monkeypatch.setattr(content_service, "check", actual)
    assert client.post("/analyze-image", **args).json()["qualityStatus"] == "PASSED"


def test_synthetic_model_does_not_allocate_inference_session():
    model = ModelService()
    assert model.active_model is None
    assert model.get_model_status() == "MODEL_NOT_VALIDATED"


def test_deployment_health_fails_when_photo_model_unavailable(monkeypatch):
    monkeypatch.setattr(content_service, "ready", lambda: False)
    result = client.get("/api/ai/health")
    assert result.status_code == 503
    assert result.json()["photoContentCheck"] == "UNAVAILABLE"


def test_health_responds_while_photo_processing_waits(monkeypatch):
    entered, release = threading.Event(), threading.Event()
    def slow_photo(*_):
        entered.set()
        release.wait(3)
        return ImageQualityResponse(qualityStatus="PENDING")
    monkeypatch.setattr(quality, "evaluate_photo", slow_photo)
    async def run():
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as browser:
            photo = asyncio.create_task(browser.post("/analyze-image", files={"file": ("eye.jpg", b"test")}, data={"target_body_part": "EYES"}))
            try:
                assert await asyncio.to_thread(entered.wait, 1)
                health = await asyncio.wait_for(browser.get("/health"), 1)
                assert health.status_code == 200
                assert not photo.done()
            finally:
                release.set()
                await photo
    asyncio.run(run())
