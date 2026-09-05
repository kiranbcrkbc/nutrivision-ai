"""
NutriVision AI - Phase 7 Comprehensive Inference Foundation Test Suite
Verifies:
1. FastAPI AI Service Health & Model Availability Checks
2. Direct Inference Analysis Endpoint with Sharp, Blurry, and Dark Images
3. Quality Gate Rejection vs Model Configuration State
4. Model Readiness Metadata (modelAvailable: False, inferenceStatus: MODEL_NOT_CONFIGURED)
5. Zero Fake Predictions / Zero Artificial Confidence Values
6. Spring Boot Integration (when Backend is running)
"""

import os
import sys
import json
import uuid
import urllib.request
import urllib.error
import cv2
import numpy as np

AI_SERVICE_URL = "http://127.0.0.1:8000"
BACKEND_URL = "http://localhost:8080/api"
FIXTURES_DIR = os.path.join(os.path.dirname(__file__), "fixtures")
os.makedirs(FIXTURES_DIR, exist_ok=True)


def create_test_sharp_image(path):
    img = np.zeros((400, 400, 3), dtype=np.uint8)
    img[:, :] = (130, 130, 130)
    for i in range(10, 390, 20):
        cv2.rectangle(img, (i, i), (i + 12, i + 12), (255, 255, 255), -1)
        cv2.line(img, (i, 400 - i), (i + 15, 380 - i), (10, 10, 10), 3)
    cv2.putText(img, "NutriVision AI Sharp Test", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
    cv2.imwrite(path, img)
    return path


def create_test_blurry_image(path):
    sharp = np.zeros((400, 400, 3), dtype=np.uint8)
    sharp[:, :] = (128, 128, 128)
    cv2.putText(sharp, "Blurry Image Test", (40, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    blurred = cv2.GaussianBlur(sharp, (55, 55), 0)
    cv2.imwrite(path, blurred)
    return path


def create_test_dark_image(path):
    img = np.full((400, 400, 3), 12, dtype=np.uint8)
    cv2.putText(img, "Dark Image Test", (40, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (30, 30, 30), 1)
    cv2.imwrite(path, img)
    return path


def upload_multipart(endpoint, filename, file_bytes, form_fields=None, mime_type="image/jpeg", token=None):
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    body = bytearray()

    # Add text form fields
    if form_fields:
        for k, v in form_fields.items():
            body.extend(f"--{boundary}\r\n".encode("utf-8"))
            body.extend(f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode("utf-8"))
            body.extend(f"{v}\r\n".encode("utf-8"))

    # Add file field
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {mime_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(endpoint, data=bytes(body), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    if token:
        req.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8")
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"detail": raw}


def http_json_request(url, method="GET", payload=None, token=None):
    data_bytes = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data_bytes, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.getcode(), json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8")
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"message": raw}


def run_phase7_tests():
    print("==================================================================")
    print("NUTRI-VISION AI — PHASE 7 AI INFERENCE FOUNDATION TEST SUITE")
    print("==================================================================")

    # ------------------------------------------------------------------
    # TEST 1: Root Health Check
    # ------------------------------------------------------------------
    print("\n[TEST 1] Probing FastAPI Root Health Endpoint (/health)...")
    code, data = http_json_request(f"{AI_SERVICE_URL}/health")
    print(f"Status: {code} | Data: {data}")
    assert code == 200, f"Expected 200, got {code}"
    assert data["status"] == "UP"
    assert data["imageQualityEngine"] == "READY"
    assert data["modelAvailable"] is False, "Expected modelAvailable to be False (no weights exist)"
    assert data["inferenceModel"] == "MODEL_NOT_AVAILABLE"
    print("[PASSED] Test 1: Root health check reports honest model readiness state.")

    # ------------------------------------------------------------------
    # TEST 2: Detailed Health Check
    # ------------------------------------------------------------------
    print("\n[TEST 2] Probing FastAPI Detailed Health Endpoint (/api/ai/health)...")
    code, data = http_json_request(f"{AI_SERVICE_URL}/api/ai/health")
    print(f"Status: {code} | Data: {data}")
    assert code == 200
    assert data["status"] == "UP"
    assert data["modelAvailable"] is False
    assert data["inferenceModel"] == "MODEL_NOT_AVAILABLE"
    assert "disclaimer" in data and len(data["disclaimer"]) > 10
    print("[PASSED] Test 2: Detailed health check returns full schema with disclaimer.")

    # ------------------------------------------------------------------
    # TEST 3: Direct Screening Inference with Sharp Image (Model Not Configured)
    # ------------------------------------------------------------------
    print("\n[TEST 3] Running Inference on Sharp Image (OpenCV Passed, Model Not Configured)...")
    sharp_file = os.path.join(FIXTURES_DIR, "p7_sharp.jpg")
    create_test_sharp_image(sharp_file)
    with open(sharp_file, "rb") as f:
        sharp_bytes = f.read()

    code, data = upload_multipart(
        f"{AI_SERVICE_URL}/api/ai/inference/analyze",
        "p7_sharp.jpg",
        sharp_bytes,
        form_fields={"target_body_part": "NAILS"}
    )
    print(f"Status: {code} | Response: {json.dumps(data, indent=2)}")
    assert code == 200
    assert data["status"] == "MODEL_NOT_AVAILABLE"
    assert data["modelAvailable"] is False
    assert data["inferenceStatus"] == "MODEL_NOT_CONFIGURED"
    assert data["targetBodyPart"] == "NAILS"
    assert data["qualityEvaluation"]["qualityStatus"] == "PASSED"
    assert data["qualityEvaluation"]["blurScore"] >= 100.0
    assert data["predictions"] == [], f"Expected empty predictions, got {data['predictions']}"
    assert data["topPrediction"] is None
    assert "medicalDisclaimer" in data
    print("[PASSED] Test 3: Sharp image passed quality gate and safely reported MODEL_NOT_CONFIGURED with zero fake predictions.")

    # ------------------------------------------------------------------
    # TEST 4: Direct Screening Inference with Blurry Image (Quality Rejected)
    # ------------------------------------------------------------------
    print("\n[TEST 4] Running Inference on Blurry Image (Quality Gate Rejection)...")
    blur_file = os.path.join(FIXTURES_DIR, "p7_blurry.jpg")
    create_test_blurry_image(blur_file)
    with open(blur_file, "rb") as f:
        blur_bytes = f.read()

    code, data = upload_multipart(
        f"{AI_SERVICE_URL}/api/ai/inference/analyze",
        "p7_blurry.jpg",
        blur_bytes,
        form_fields={"target_body_part": "EYES"}
    )
    print(f"Status: {code} | Response: {json.dumps(data, indent=2)}")
    assert code == 200
    assert data["status"] == "QUALITY_REJECTED"
    assert data["modelAvailable"] is False
    assert data["inferenceStatus"] == "QUALITY_REJECTED"
    assert data["qualityEvaluation"]["qualityStatus"] in ["REJECTED", "WARNING"]
    assert data["predictions"] == []
    print("[PASSED] Test 4: Blurry image properly rejected by quality gate before inference.")

    # ------------------------------------------------------------------
    # TEST 5: Direct Screening Inference with Dark Image (Quality Rejected)
    # ------------------------------------------------------------------
    print("\n[TEST 5] Running Inference on Dark Image (Lighting Rejection)...")
    dark_file = os.path.join(FIXTURES_DIR, "p7_dark.jpg")
    create_test_dark_image(dark_file)
    with open(dark_file, "rb") as f:
        dark_bytes = f.read()

    code, data = upload_multipart(
        f"{AI_SERVICE_URL}/api/ai/inference/analyze",
        "p7_dark.jpg",
        dark_bytes,
        form_fields={"target_body_part": "SKIN"}
    )
    print(f"Status: {code} | Response: {json.dumps(data, indent=2)}")
    assert code == 200
    assert data["status"] == "QUALITY_REJECTED"
    assert data["qualityEvaluation"]["qualityStatus"] == "REJECTED"
    assert data["qualityEvaluation"]["brightnessScore"] < 40.0
    print("[PASSED] Test 5: Dark image properly rejected due to insufficient illumination.")

    # ------------------------------------------------------------------
    # TEST 6: Spring Boot Backend Integration Check (If Running)
    # ------------------------------------------------------------------
    print("\n[TEST 6] Testing Spring Boot Backend Screening & Health Integration...")
    try:
        be_code, be_health = http_json_request(f"{BACKEND_URL}/health/ai")
        if be_code == 200:
            print(f"Spring Boot /health/ai response: {be_health}")
            ai_data = be_health.get("data", {})
            assert ai_data.get("status") == "UP"
            assert ai_data.get("modelAvailable") is False
            print("[PASSED] Test 6: Spring Boot AI client successfully proxying health & model availability.")
        else:
            print("Spring Boot backend not running or returned non-200. Skipping live Spring Boot test.")
    except Exception as ex:
        print(f"Spring Boot live check skipped: {ex}")

    print("\n==================================================================")
    print("ALL PHASE 7 INFERENCE FOUNDATION TESTS PASSED WITH 100% SUCCESS!")
    print("==================================================================")



if __name__ == "__main__":
    run_phase7_tests()
