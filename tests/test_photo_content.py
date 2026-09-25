"""Real-image regression controls, not a clinical or population accuracy benchmark."""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "ai-service"))
from app.main import app
from app.services.content_service import ContentService, content_service
from app.services.inference_service import run_screening_inference

FIXTURES = Path(__file__).parent / "fixtures" / "content"
client = TestClient(app)


@pytest.mark.parametrize("region", ["EYES", "LIPS", "TONGUE", "NAILS", "HAIR", "SKIN"])
def test_burger_rejected_at_upload_and_inference(region):
    data = (FIXTURES / "burger.jpg").read_bytes()
    result = client.post("/analyze-image", files={"file": ("burger.jpg", data, "image/jpeg")}, data={"target_body_part": region})
    assert result.status_code == 200
    assert result.json()["qualityStatus"] == "REJECTED"
    assert "Please upload" in result.json()["rejectionReason"]
    assert "unrelated" in result.json()["rejectionReason"]
    outcome = run_screening_inference(data, region)
    assert outcome.status == "IMAGE_REJECTED"
    assert outcome.predictions == [] and outcome.topPrediction is None


@pytest.mark.parametrize("file,region", [("eye", "EYES"), ("tongue", "TONGUE"), ("lips", "LIPS"), ("nails", "NAILS")])
def test_real_body_photo_recognized(file, region):
    assert content_service.check((FIXTURES / f"{file}.jpg").read_bytes(), region)["status"] == "ACCEPTED"


@pytest.mark.parametrize("file,region", [("eye", "NAILS"), ("tongue", "EYES"), ("lips", "HAIR"), ("nails", "TONGUE")])
def test_mismatched_body_area_rejected(file, region):
    assert content_service.check((FIXTURES / f"{file}.jpg").read_bytes(), region)["status"] == "REJECTED"


def test_valid_photo_passes_upload_but_never_becomes_diagnosis():
    data = (FIXTURES / "eye.jpg").read_bytes()
    result = client.post("/analyze-image", files={"file": ("eye.jpg", data, "image/jpeg")}, data={"target_body_part": "EYES"})
    assert result.json()["qualityStatus"] == "PASSED"
    outcome = run_screening_inference(data, "EYES")
    assert outcome.status == "SCREENING_UNAVAILABLE"
    assert outcome.contentEvaluation["status"] == "ACCEPTED"
    assert outcome.predictions == []


def test_model_outage_fails_closed():
    unavailable = ContentService()
    unavailable.load_attempted = True
    assert unavailable.check((FIXTURES / "eye.jpg").read_bytes(), "EYES")["status"] == "UNAVAILABLE"


def test_missing_body_area_does_not_bypass_upload_check():
    response = client.post("/analyze-image", files={"file": ("eye.jpg", (FIXTURES / "eye.jpg").read_bytes(), "image/jpeg")})
    assert response.json()["qualityStatus"] == "REJECTED"
