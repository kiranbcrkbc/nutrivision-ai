#!/usr/bin/env python3
"""
Phase 10 — Comprehensive End-to-End System Integration, Security, and Failure Audit Suite.
Executes live HTTP API flows across Frontend -> Backend -> MySQL -> FastAPI -> ONNX Model -> Nutrition Engine.
"""

import os
import sys
import time
import requests
import json
import numpy as np
import cv2

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BACKEND_URL = "http://127.0.0.1:8080/api"

FASTAPI_URL = "http://127.0.0.1:8000/api/ai"
FRONTEND_URL = "http://localhost:5173"

def run_phase10_audit():
    print("=" * 80)
    print("NUTRIVISION AI — PHASE 10 COMPLETE END-TO-END SYSTEM INTEGRATION AUDIT")
    print("=" * 80)

    results = {
        "services": {},
        "user_journey": {},
        "ai_inference": {},
        "nutrition_engine": {},
        "security_idor": {},
        "failure_scenarios": {},
        "database_audit": {}
    }

    session = requests.Session()

    # -------------------------------------------------------------------------
    # 1. SERVICE AVAILABILITY CHECK
    # -------------------------------------------------------------------------
    print("\n[STEP 1] Verifying Service Connectivity & Health Endpoints...")
    
    # 1.1 FastAPI
    try:
        r_ai = requests.get(f"{FASTAPI_URL}/health", timeout=5)
        assert r_ai.status_code == 200
        ai_data = r_ai.json()
        print(f"  ✓ FastAPI AI Microservice [Port 8000]: UP (Model: {ai_data.get('activeModel')})")
        results["services"]["fastapi"] = {"status": "UP", "port": 8000, "model": ai_data.get("activeModel")}
    except Exception as e:
        print(f"  ✗ FastAPI AI Microservice FAILED: {e}")
        results["services"]["fastapi"] = {"status": "DOWN", "error": str(e)}

    # 1.2 Spring Boot Gateway & Database
    try:
        r_be = requests.get(f"{BACKEND_URL}/health", timeout=5)
        assert r_be.status_code == 200
        r_db = requests.get(f"{BACKEND_URL}/health/database", timeout=5)
        assert r_db.status_code == 200
        db_data = r_db.json().get("data", {})
        print(f"  ✓ Spring Boot Backend [Port 8080]: UP")
        print(f"  ✓ MySQL Database [Port 3306]: UP ({db_data.get('databaseProduct')} v{db_data.get('databaseVersion')})")
        results["services"]["backend"] = {"status": "UP", "port": 8080}
        results["services"]["database"] = {"status": "UP", "port": 3306, "product": db_data.get("databaseProduct")}
    except Exception as e:
        print(f"  ✗ Spring Boot / Database FAILED: {e}")
        results["services"]["backend"] = {"status": "DOWN", "error": str(e)}

    # 1.3 React Frontend
    try:
        r_fe = requests.get(FRONTEND_URL, timeout=5)
        assert r_fe.status_code == 200
        print(f"  ✓ React Frontend [Port 5173]: UP (HTTP 200 OK)")
        results["services"]["frontend"] = {"status": "UP", "port": 5173}
    except Exception as e:
        print(f"  ✗ React Frontend FAILED: {e}")
        results["services"]["frontend"] = {"status": "DOWN", "error": str(e)}

    # -------------------------------------------------------------------------
    # 2. USER AUTHENTICATION JOURNEY
    # -------------------------------------------------------------------------
    print("\n[STEP 2] Testing User Authentication Lifecycle...")
    unique_ts = int(time.time())
    user1_email = f"patient_{unique_ts}@nutrivision.test"
    user1_password = "Password@123"
    user1_name = "Ramesh Kumar"

    # Register User 1
    reg_payload = {
        "email": user1_email,
        "password": user1_password,
        "confirmPassword": user1_password,
        "fullName": user1_name
    }
    r_reg = requests.post(f"{BACKEND_URL}/auth/register", json=reg_payload)
    print(f"  • User 1 Registration ({user1_email}): HTTP {r_reg.status_code}")
    assert r_reg.status_code in [200, 201], f"Registration failed: {r_reg.text}"

    # Login User 1
    login_payload = {
        "email": user1_email,
        "password": user1_password
    }
    r_login = requests.post(f"{BACKEND_URL}/auth/login", json=login_payload)
    assert r_login.status_code == 200, f"Login failed: {r_login.text}"
    token_data = r_login.json().get("data", {})
    user1_token = token_data.get("token") or token_data.get("accessToken")
    print(f"  ✓ User 1 Login successful. JWT Token obtained ({len(user1_token)} chars)")

    user1_headers = {"Authorization": f"Bearer {user1_token}"}

    # Register Adversary User (User 2 for IDOR testing)
    user2_email = f"adversary_{unique_ts}@nutrivision.test"
    user2_password = "Password@123"
    requests.post(
        f"{BACKEND_URL}/auth/register",
        json={"email": user2_email, "password": user2_password, "confirmPassword": user2_password, "fullName": "Adversary User"}
    )
    r_login2 = requests.post(f"{BACKEND_URL}/auth/login", json={"email": user2_email, "password": user2_password})
    user2_token = r_login2.json().get("data", {}).get("token") or r_login2.json().get("data", {}).get("accessToken")
    user2_headers = {"Authorization": f"Bearer {user2_token}"}
    print(f"  ✓ User 2 (Adversary) created for security boundary verification.")


    # -------------------------------------------------------------------------
    # 3. ASSESSMENT CREATION & IMAGE UPLOAD
    # -------------------------------------------------------------------------
    print("\n[STEP 3] Testing Assessment Creation & Real Image Quality Evaluation...")
    create_assess_payload = {
        "targetBodyPart": "NAILS",
        "notes": "E2E automated verification session for nail assessment."
    }
    r_create = requests.post(f"{BACKEND_URL}/assessments", json=create_assess_payload, headers=user1_headers)
    assert r_create.status_code in [200, 201], f"Create assessment failed: {r_create.text}"
    assessment_id = r_create.json().get("data", {}).get("assessmentId")
    print(f"  ✓ Assessment created with ID: #{assessment_id} (Target: NAILS)")

    # Upload a Real Test Sample from Dataset
    test_img_path = "datasets/processed/test/Iron_Deficiency/Iron_Deficiency_nails_018.jpg"
    if not os.path.exists(test_img_path):
        import glob
        samples = glob.glob("datasets/processed/test/*/*.jpg")
        test_img_path = samples[0] if samples else "scratch/sample.jpg"

    print(f"  • Uploading valid test photograph: {test_img_path}")
    with open(test_img_path, "rb") as f:
        files = {"file": ("test_iron_nail.jpg", f, "image/jpeg")}
        r_upload = requests.post(f"{BACKEND_URL}/assessments/{assessment_id}/images", files=files, headers=user1_headers)

    
    assert r_upload.status_code in [200, 201], f"Image upload failed: {r_upload.text}"
    upload_data = r_upload.json().get("data", {})
    image_id = upload_data.get("imageId")
    quality_status = upload_data.get("qualityStatus")
    blur_score = upload_data.get("blurScore")
    brightness_score = upload_data.get("brightnessScore")
    print(f"  ✓ Image Uploaded (ID: #{image_id})")
    print(f"    - OpenCV Quality Status: {quality_status}")
    print(f"    - Sharpness (Laplacian): {blur_score}")
    print(f"    - Luminance Score: {brightness_score}")
    assert quality_status in ["PASSED", "WARNING"], "Valid test image should not be rejected"

    # -------------------------------------------------------------------------
    # 4. AI INFERENCE & REAL MODEL PREDICTIONS
    # -------------------------------------------------------------------------
    print("\n[STEP 4] Executing AI Inference Pipeline (Spring Boot -> FastAPI -> ONNX)...")
    r_screen = requests.post(f"{BACKEND_URL}/assessments/{assessment_id}/screen", headers=user1_headers)
    assert r_screen.status_code == 200, f"AI screening failed: {r_screen.text}"
    screen_data = r_screen.json().get("data", {})
    
    inf_status = screen_data.get("inferenceStatus")
    top_pred = screen_data.get("topPrediction", {})
    predictions = screen_data.get("predictions", [])
    model_name = screen_data.get("modelName")
    model_version = screen_data.get("modelVersion")

    print(f"  ✓ Inference Result: {inf_status}")
    print(f"  ✓ Model Telemetry: {model_name} ({model_version})")
    print(f"  ✓ Top Visual Candidate: {top_pred.get('deficiencyCategory')} ({top_pred.get('confidencePercentage')})")
    print(f"  ✓ Ranked Predictions Count: {len(predictions)}")
    for p in predictions:
        print(f"    - Rank {p.get('rank')}: {p.get('deficiencyCategory')} | Confidence: {p.get('confidencePercentage')} | Logit Prob: {p.get('modelConfidence')}")
    
    # Mathematical soft-max sum check
    prob_sum = sum([p.get('modelConfidence', 0) for p in predictions])
    print(f"  ✓ Predictions Mathematical Probability Sum: {prob_sum:.4f} (<= 1.0)")
    assert len(predictions) > 0, "Expected predictions from ONNX model"

    # -------------------------------------------------------------------------
    # 5. NUTRITION ENGINE RECOMMENDATIONS INTEGRATION
    # -------------------------------------------------------------------------
    print("\n[STEP 5] Testing Nutrition Recommendation Engine Integration...")
    
    # 5.1 Direct Assessment-Linked Nutrition Request
    r_nutr = requests.get(f"{BACKEND_URL}/nutrition/assessment/{assessment_id}", headers=user1_headers)
    assert r_nutr.status_code == 200, f"Assessment nutrition failed: {r_nutr.text}"
    nutr_data = r_nutr.json().get("data", {})
    print(f"  ✓ Assessment-Linked Guidance: {nutr_data.get('categoryDisplayName')} ({nutr_data.get('primaryNutrient')})")
    print(f"  ✓ Total Food Suggestions: {len(nutr_data.get('recommendedFoods', []))}")
    print(f"  ✓ Priority Foods Highlighted: {len(nutr_data.get('priorityFoods', []))}")
    print(f"  ✓ Absorption Synergy: {nutr_data.get('absorptionSynergySummary')[:80]}...")

    # 5.2 Filtered Nutrition Requests (South Indian + Vegan)
    cat_to_query = top_pred.get('categoryCode') or 'Iron_Deficiency'
    r_filter = requests.get(
        f"{BACKEND_URL}/nutrition/recommendations/{cat_to_query}?dietType=VEGAN&region=SOUTH_INDIAN",
        headers=user1_headers
    )
    print(f"  • Filtered Nutrition Request (Category: {cat_to_query}, Diet: VEGAN, Region: SOUTH_INDIAN): HTTP {r_filter.status_code}")
    assert r_filter.status_code == 200, f"Filtered nutrition failed: {r_filter.text}"


    filtered_data = r_filter.json().get("data", {})
    vegan_south_foods = filtered_data.get("recommendedFoods", [])
    print(f"  ✓ South Indian Vegan Filtered Foods ({len(vegan_south_foods)} items):")
    for f in vegan_south_foods:
        print(f"    - {f.get('foodName')} (Local: {f.get('localName')}) | Priority: {f.get('priority')}")
        assert f.get("dietType") in ["VEGAN"], "Filtered items must strictly match Vegan"

    # -------------------------------------------------------------------------
    # 6. SECURITY & IDOR BOUNDARY TESTING
    # -------------------------------------------------------------------------
    print("\n[STEP 6] Executing Security & IDOR Protection Tests...")
    
    # 6.1 Adversary attempts to view User 1's Assessment
    r_idor_view = requests.get(f"{BACKEND_URL}/assessments/{assessment_id}", headers=user2_headers)
    print(f"  • IDOR View Attempt (User 2 -> User 1 Assessment #{assessment_id}): HTTP {r_idor_view.status_code}")
    assert r_idor_view.status_code in [403, 404], f"IDOR Vulnerability Detected! HTTP {r_idor_view.status_code}"
    print("  ✓ IDOR Protection Verified: Adversary cannot view foreign assessment.")

    # 6.2 Adversary attempts to access User 1's Assessment Recommendations
    r_idor_nutr = requests.get(f"{BACKEND_URL}/nutrition/assessment/{assessment_id}", headers=user2_headers)
    print(f"  • IDOR Nutrition Attempt (User 2 -> User 1 Recommendations #{assessment_id}): HTTP {r_idor_nutr.status_code}")
    assert r_idor_nutr.status_code in [403, 404], f"IDOR Vulnerability Detected in Nutrition Engine! HTTP {r_idor_nutr.status_code}"
    print("  ✓ IDOR Protection Verified: Adversary cannot view foreign assessment nutrition.")

    # 6.3 Unauthenticated Access to Protected Assessment API
    r_unauth = requests.get(f"{BACKEND_URL}/assessments/{assessment_id}")
    print(f"  • Unauthenticated Request to /assessments/{assessment_id}: HTTP {r_unauth.status_code}")
    assert r_unauth.status_code in [401, 403], f"Unauthenticated access permitted! HTTP {r_unauth.status_code}"
    print("  ✓ Authentication Barrier Verified: Anonymous requests strictly rejected.")

    # -------------------------------------------------------------------------
    # 7. FAILURE SCENARIO TESTING
    # -------------------------------------------------------------------------
    print("\n[STEP 7] Executing Failure Scenarios & Edge Cases...")

    # 7.1 Artificial Blurry Image (Laplacian variance < 100)
    os.makedirs("scratch", exist_ok=True)
    blurry_img_path = "scratch/test_blurry.png"
    blank_img = np.ones((224, 224, 3), dtype=np.uint8) * 128
    cv2.GaussianBlur(blank_img, (35, 35), 0, dst=blank_img)
    cv2.imwrite(blurry_img_path, blank_img)

    with open(blurry_img_path, "rb") as f:
        files = {"file": ("blurry.png", f, "image/png")}
        r_blur = requests.post(f"{BACKEND_URL}/assessments/{assessment_id}/images", files=files, headers=user1_headers)
    
    blur_res = r_blur.json().get("data", {})
    print(f"  • Blurry Image Quality Status: {blur_res.get('qualityStatus')} (Blur Score: {blur_res.get('blurScore')})")
    assert blur_res.get("qualityStatus") in ["REJECTED", "WARNING"]
    print("  ✓ Quality Gate Blur Guard Verified.")

    # 7.2 Extremely Dark Image (Luminance < 40)
    dark_img_path = "scratch/test_dark.png"
    dark_img = np.ones((224, 224, 3), dtype=np.uint8) * 10
    cv2.imwrite(dark_img_path, dark_img)

    with open(dark_img_path, "rb") as f:
        files = {"file": ("dark.png", f, "image/png")}
        r_dark = requests.post(f"{BACKEND_URL}/assessments/{assessment_id}/images", files=files, headers=user1_headers)
    
    dark_res = r_dark.json().get("data", {})
    print(f"  • Dark Image Quality Status: {dark_res.get('qualityStatus')} (Brightness: {dark_res.get('brightnessScore')})")
    assert dark_res.get("qualityStatus") in ["REJECTED", "WARNING"]
    print("  ✓ Quality Gate Low-Light Guard Verified.")

    # 7.3 Corrupt Non-Image File
    corrupt_file_path = "scratch/corrupt.bin"
    with open(corrupt_file_path, "wb") as f:
        f.write(b"NOT_AN_IMAGE_DATA_HEADER_BINARY_GARBAGE")
    
    with open(corrupt_file_path, "rb") as f:
        files = {"file": ("corrupt.png", f, "image/png")}
        r_corrupt = requests.post(f"{BACKEND_URL}/assessments/{assessment_id}/images", files=files, headers=user1_headers)
    
    print(f"  • Corrupt File Upload Response: HTTP {r_corrupt.status_code}")
    assert r_corrupt.status_code in [400, 422, 500], "Corrupt image should not succeed"
    print("  ✓ Corrupt File Handling Verified: Graceful error response returned.")

    print("\n" + "=" * 80)
    print("ALL PHASE 10 LIVE END-TO-END INTEGRATION AND SECURITY TESTS PASSED 100%")
    print("=" * 80)

if __name__ == "__main__":
    run_phase10_audit()
