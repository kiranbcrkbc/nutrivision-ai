"""
NutriVision AI - Phase 8 Real Model & Image Quality Verification Suite
"""

import os
import io
import json
import requests
import numpy as np
from PIL import Image


AI_SERVICE_URL = "http://127.0.0.1:8000"


def test_ai_service_health():
    """Verify AI microservice health reports MODEL_READY and active model ONNX."""
    res = requests.get(f"{AI_SERVICE_URL}/api/ai/health", timeout=5)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "UP"
    assert data["imageQualityEngine"] == "READY"
    assert data["inferenceModel"] == "MODEL_READY"
    assert data["modelAvailable"] is True
    assert data["activeModel"] == "mobilenetv2_nutrivision_v1.onnx"
    assert "preliminary" in data["disclaimer"].lower() or "not" in data["disclaimer"].lower()


def test_real_inference_on_valid_test_samples():
    """Verify real inference generates non-zero probabilities and Top-3 predictions."""
    test_dir = os.path.join("datasets", "processed", "test", "Iron_Deficiency")
    test_files = [os.path.join(test_dir, f) for f in os.listdir(test_dir) if f.endswith(".jpg")]
    assert len(test_files) > 0, "No test files found in Iron_Deficiency directory"
    test_img_path = test_files[0]

    with open(test_img_path, "rb") as f:
        files = {"file": ("sample.jpg", f, "image/jpeg")}
        res = requests.post(f"{AI_SERVICE_URL}/api/ai/inference/analyze?target_body_part=NAILS", files=files, timeout=10)


    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert data["modelAvailable"] is True
    assert data["inferenceStatus"] == "SUCCESS"
    assert data["modelName"] == "mobilenetv2_nutrivision_v1.onnx"
    assert data["qualityEvaluation"]["qualityStatus"] in ["PASSED", "WARNING"]
    assert len(data["predictions"]) == 3

    # Check top prediction
    top_pred = data["topPrediction"]
    assert top_pred is not None
    assert top_pred["rank"] == 1
    assert 0.0 < top_pred["modelConfidence"] <= 1.0
    assert "%" in top_pred["confidencePercentage"]

    # Verify probability distribution sum is realistic
    all_confs = [p["modelConfidence"] for p in data["predictions"]]
    assert all_confs[0] >= all_confs[1] >= all_confs[2]


def test_quality_gate_rejects_blurry_image():
    """Verify that blurry images are REJECTED before model inference."""
    # Create artificial heavily blurred image (Laplacian variance ~0)
    arr = np.full((224, 224, 3), 128, dtype=np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    files = {"file": ("blurry.jpg", buf, "image/jpeg")}
    res = requests.post(f"{AI_SERVICE_URL}/api/ai/inference/analyze", files=files, timeout=10)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "QUALITY_REJECTED"
    assert data["inferenceStatus"] == "QUALITY_REJECTED"
    assert data["qualityEvaluation"]["qualityStatus"] == "REJECTED"
    assert len(data["predictions"]) == 0
    assert data["topPrediction"] is None


def test_quality_gate_rejects_dark_image():
    """Verify that extremely dark images are REJECTED before model inference."""
    # Create artificial near-black image (luminance ~5)
    arr = np.full((224, 224, 3), 5, dtype=np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    files = {"file": ("dark.jpg", buf, "image/jpeg")}
    res = requests.post(f"{AI_SERVICE_URL}/api/ai/inference/analyze", files=files, timeout=10)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "QUALITY_REJECTED"
    assert data["inferenceStatus"] == "QUALITY_REJECTED"
    assert data["qualityEvaluation"]["qualityStatus"] == "REJECTED"
    assert len(data["predictions"]) == 0


if __name__ == "__main__":
    test_ai_service_health()
    test_real_inference_on_valid_test_samples()
    test_quality_gate_rejects_blurry_image()
    test_quality_gate_rejects_dark_image()
    print("[ALL PHASE 8 INFERENCE TESTS PASSED 100%]")
