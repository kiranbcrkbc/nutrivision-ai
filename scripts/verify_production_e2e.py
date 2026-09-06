"""
NutriVision AI - Production End-to-End Automated Verification Script
Tests full workflow across Frontend, Backend Gateway, AI Microservice, and TiDB Cloud MySQL.
"""

import os
import sys
import time
import json
import uuid
import requests

BACKEND_BASE_URL = os.getenv("BACKEND_URL", "https://kiranbcrkbc-nutrivision-backend.onrender.com").rstrip("/")
AI_BASE_URL = os.getenv("AI_URL", "https://kiranbcrkbc-nutrivision-ai-service.onrender.com").rstrip("/")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://kiranbcrkbc-nutrivision-ai.onrender.com").rstrip("/")

print("=" * 80)
print(" NUTRIVISION AI - PRODUCTION VERIFICATION SUITE")
print(f" Backend URL:  {BACKEND_BASE_URL}")
print(f" AI URL:       {AI_BASE_URL}")
print(f" Frontend URL: {FRONTEND_URL}")
print("=" * 80)

def run_tests():
    results = {}
    session = requests.Session()
    
    # -------------------------------------------------------------------------
    # 1. Frontend Check
    # -------------------------------------------------------------------------
    print("\n[1/11] Checking Frontend Availability...")
    try:
        r = session.get(FRONTEND_URL, timeout=15)
        if r.status_code == 200 and "<!doctype html>" in r.text.lower():
            print(f"  [PASS] Frontend is UP (HTTP {r.status_code})")
            results["frontend"] = "PASS"
        else:
            print(f"  [FAIL] Frontend returned HTTP {r.status_code}")
            results["frontend"] = f"FAIL (HTTP {r.status_code})"
    except Exception as e:
        print(f"  [FAIL] Frontend connection error: {e}")
        results["frontend"] = f"FAIL ({e})"

    # -------------------------------------------------------------------------
    # 2. AI Microservice Check
    # -------------------------------------------------------------------------
    print("\n[2/11] Checking AI Microservice Health...")
    try:
        r = session.get(f"{AI_BASE_URL}/api/ai/health", timeout=15)
        if r.status_code == 200:
            ai_data = r.json()
            print(f"  [PASS] AI Service is UP: status={ai_data.get('status')}, model={ai_data.get('activeModel')}")
            results["ai_service"] = "PASS"
        else:
            print(f"  [FAIL] AI Service returned HTTP {r.status_code}")
            results["ai_service"] = f"FAIL (HTTP {r.status_code})"
    except Exception as e:
        print(f"  [FAIL] AI Service connection error: {e}")
        results["ai_service"] = f"FAIL ({e})"

    # -------------------------------------------------------------------------
    # 3. Backend Gateway Health Check
    # -------------------------------------------------------------------------
    print("\n[3/11] Checking Backend Gateway Health (/api/health)...")
    try:
        r = session.get(f"{BACKEND_BASE_URL}/api/health", timeout=20)
        if r.status_code == 200:
            be_data = r.json()
            print(f"  [PASS] Backend Gateway is UP (HTTP 200): {be_data.get('message')}")
            results["backend_health"] = "PASS"
        else:
            print(f"  [FAIL] Backend Gateway returned HTTP {r.status_code}: {r.text[:100]}")
            results["backend_health"] = f"FAIL (HTTP {r.status_code})"
            return results
    except Exception as e:
        print(f"  [FAIL] Backend connection error: {e}")
        results["backend_health"] = f"FAIL ({e})"
        return results

    # -------------------------------------------------------------------------
    # 4. Backend Database Health Check (TiDB Cloud MySQL)
    # -------------------------------------------------------------------------
    print("\n[4/11] Checking Database Health (/api/health/database)...")
    try:
        r = session.get(f"{BACKEND_BASE_URL}/api/health/database", timeout=15)
        if r.status_code == 200:
            db_data = r.json()
            payload = db_data.get("data", {})
            print(f"  [PASS] TiDB Cloud Database is UP: product={payload.get('databaseProduct')}, version={payload.get('databaseVersion')}")
            results["database_health"] = "PASS"
        else:
            print(f"  [FAIL] Database health returned HTTP {r.status_code}: {r.text[:100]}")
            results["database_health"] = f"FAIL (HTTP {r.status_code})"
            return results
    except Exception as e:
        print(f"  [FAIL] Database health probe error: {e}")
        results["database_health"] = f"FAIL ({e})"
        return results

    # -------------------------------------------------------------------------
    # 5. Backend -> AI Microservice Internal Health Check
    # -------------------------------------------------------------------------
    print("\n[5/11] Checking Backend -> AI Communication (/api/health/ai)...")
    try:
        r = session.get(f"{BACKEND_BASE_URL}/api/health/ai", timeout=15)
        if r.status_code == 200:
            ai_bridge = r.json()
            print(f"  [PASS] Backend -> AI Bridge Verified: {ai_bridge.get('message')}")
            results["backend_ai_bridge"] = "PASS"
        else:
            print(f"  [FAIL] Backend -> AI bridge returned HTTP {r.status_code}")
            results["backend_ai_bridge"] = f"FAIL (HTTP {r.status_code})"
    except Exception as e:
        print(f"  [FAIL] Backend -> AI probe error: {e}")
        results["backend_ai_bridge"] = f"FAIL ({e})"

    # -------------------------------------------------------------------------
    # 6. User Registration & Password Hashing in TiDB
    # -------------------------------------------------------------------------
    test_email = f"prod_verify_{uuid.uuid4().hex[:8]}@nutrivision.ai"
    test_password = "SecureProdPassword2026!"
    test_name = "Production Verification User"
    
    print(f"\n[6/11] Testing User Registration ({test_email})...")
    try:
        reg_payload = {
            "email": test_email,
            "password": test_password,
            "fullName": test_name,
            "dietaryPreference": "VEGETARIAN",
            "preferredLanguage": "en"
        }
        r = session.post(f"{BACKEND_BASE_URL}/api/auth/register", json=reg_payload, timeout=15)
        if r.status_code in [200, 201]:
            print(f"  [PASS] User successfully registered in TiDB Cloud MySQL.")
            results["registration"] = "PASS"
        else:
            print(f"  [FAIL] Registration failed (HTTP {r.status_code}): {r.text[:150]}")
            results["registration"] = f"FAIL (HTTP {r.status_code})"
            return results
    except Exception as e:
        print(f"  [FAIL] Registration request error: {e}")
        results["registration"] = f"FAIL ({e})"
        return results

    # -------------------------------------------------------------------------
    # 7. User Login & JJWT Token Generation
    # -------------------------------------------------------------------------
    print(f"\n[7/11] Testing User Login & JJWT Issuance...")
    token = None
    try:
        login_payload = {
            "email": test_email,
            "password": test_password
        }
        r = session.post(f"{BACKEND_BASE_URL}/api/auth/login", json=login_payload, timeout=15)
        if r.status_code == 200:
            auth_resp = r.json().get("data", {})
            token = auth_resp.get("token")
            print(f"  [PASS] Authentication successful. JJWT token received (length: {len(token) if token else 0})")
            results["login"] = "PASS"
        else:
            print(f"  [FAIL] Login failed (HTTP {r.status_code}): {r.text[:150]}")
            results["login"] = f"FAIL (HTTP {r.status_code})"
            return results
    except Exception as e:
        print(f"  [FAIL] Login request error: {e}")
        results["login"] = f"FAIL ({e})"
        return results

    auth_headers = {
        "Authorization": f"Bearer {token}"
    }

    # -------------------------------------------------------------------------
    # 8. User Profile Retrieval (/api/auth/me)
    # -------------------------------------------------------------------------
    print("\n[8/11] Testing Authenticated Profile Retrieval (/api/auth/me)...")
    try:
        r = session.get(f"{BACKEND_BASE_URL}/api/auth/me", headers=auth_headers, timeout=15)
        if r.status_code == 200:
            user_data = r.json().get("data", {})
            print(f"  [PASS] Authenticated user profile: email={user_data.get('email')}, name={user_data.get('fullName')}")
            results["auth_profile"] = "PASS"
        else:
            print(f"  [FAIL] Profile fetch failed (HTTP {r.status_code}): {r.text[:150]}")
            results["auth_profile"] = f"FAIL (HTTP {r.status_code})"
    except Exception as e:
        print(f"  [FAIL] Profile request error: {e}")
        results["auth_profile"] = f"FAIL ({e})"

    # -------------------------------------------------------------------------
    # 9. Create Assessment in TiDB Cloud
    # -------------------------------------------------------------------------
    print("\n[9/11] Creating New Assessment (Target: EYES)...")
    assessment_id = None
    try:
        assess_payload = {
            "targetBodyPart": "EYES",
            "symptoms": ["DRY_EYES", "NIGHT_BLINDNESS"]
        }
        r = session.post(f"{BACKEND_BASE_URL}/api/assessments", json=assess_payload, headers=auth_headers, timeout=15)
        if r.status_code in [200, 201]:
            assess_data = r.json().get("data", {})
            assessment_id = assess_data.get("assessmentId")
            print(f"  [PASS] Assessment created with ID: {assessment_id} (Status: {assess_data.get('status')})")
            results["assessment_creation"] = "PASS"
        else:
            print(f"  [FAIL] Assessment creation failed (HTTP {r.status_code}): {r.text[:150]}")
            results["assessment_creation"] = f"FAIL (HTTP {r.status_code})"
    except Exception as e:
        print(f"  [FAIL] Assessment creation error: {e}")
        results["assessment_creation"] = f"FAIL ({e})"

    # -------------------------------------------------------------------------
    # 10. Nutrition Guidance & Recommendations
    # -------------------------------------------------------------------------
    print("\n[10/11] Testing Nutrition Guidance Endpoints...")
    try:
        r = session.get(f"{BACKEND_BASE_URL}/api/nutrition/guidance/VITAMIN_A_DEFICIENCY", headers=auth_headers, timeout=15)
        if r.status_code == 200:
            guidance = r.json().get("data", {})
            print(f"  [PASS] Retrieved Guidance for: {guidance.get('nutrientName')}")
            results["nutrition_guidance"] = "PASS"
        else:
            print(f"  [FAIL] Nutrition guidance returned HTTP {r.status_code}")
            results["nutrition_guidance"] = f"FAIL (HTTP {r.status_code})"
    except Exception as e:
        print(f"  [FAIL] Nutrition guidance error: {e}")
        results["nutrition_guidance"] = f"FAIL ({e})"

    # -------------------------------------------------------------------------
    # 11. Full End-to-End Summary
    # -------------------------------------------------------------------------
    all_passed = all(v == "PASS" for v in results.values())
    results["full_e2e"] = "PASS" if all_passed else "FAIL"

    print("\n" + "=" * 80)
    print(" VERIFICATION SUMMARY")
    print("=" * 80)
    for k, v in results.items():
        print(f"  {k:25} : {v}")
    print("=" * 80)
    return results

if __name__ == "__main__":
    run_tests()
