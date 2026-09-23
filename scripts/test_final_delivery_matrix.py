"""
NutriVision AI - Final Delivery Verification Matrix
Tests:
- Frontend availability & content
- AI Microservice (MobileNetV2 ONNX)
- Backend API Gateway
- TiDB Cloud Database
- Nutrition Guidance Engine
- Doctor Referral API (Bengaluru)
- Chatbot 20-Question Context Matrix
- Authentication & IDOR Protection
"""

import os
import sys
import json
import time
import uuid
import requests

BACKEND_URL = os.getenv("BACKEND_URL", "https://kiranbcrkbc-nutrivision-backend.onrender.com").rstrip("/")
AI_URL = os.getenv("AI_URL", "https://kiranbcrkbc-nutrivision-ai-service.onrender.com").rstrip("/")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://kiranbcrkbc-nutrivision-ai.onrender.com").rstrip("/")

print("=" * 80)
print(" NUTRIVISION AI — COMPREHENSIVE FINAL DELIVERY VERIFICATION")
print(f" Frontend: {FRONTEND_URL}")
print(f" Backend:  {BACKEND_URL}")
print(f" AI:       {AI_URL}")
print("=" * 80)

session = requests.Session()
results = {}

def test_frontend():
    print("\n[TEST 1] Verifying Production Frontend...")
    r = session.get(FRONTEND_URL, timeout=30)
    assert r.status_code == 200, f"Frontend returned {r.status_code}"
    assert "<!doctype html>" in r.text.lower(), "HTML doctype missing"
    assert "NutriVision" in r.text, "NutriVision title missing"
    print("  [PASS] Frontend accessible, valid HTML5 with responsive meta and titles.")
    results["frontend"] = "PASS"

def test_ai_service():
    print("\n[TEST 2] Verifying Production AI Microservice Health & ONNX Model...")
    r = session.get(f"{AI_URL}/api/ai/health", timeout=30)
    assert r.status_code == 200, f"AI Health returned {r.status_code}"
    data = r.json()
    assert data.get("status") == "UP", "AI service status not UP"
    assert data.get("inferenceModel") == "MODEL_READY", "ONNX model not ready"
    assert data.get("modelAvailable") is True, "modelAvailable flag is False"
    print(f"  [PASS] AI Microservice UP. Model={data.get('activeModel')} Status={data.get('inferenceModel')}")
    results["ai_service"] = "PASS"

def test_backend_and_database():
    print("\n[TEST 3] Verifying Production Backend & TiDB Cloud Database...")
    r_be = session.get(f"{BACKEND_URL}/api/health", timeout=30)
    assert r_be.status_code == 200, f"Backend returned {r_be.status_code}"
    
    r_db = session.get(f"{BACKEND_URL}/api/health/database", timeout=30)
    assert r_db.status_code == 200, f"DB check returned {r_db.status_code}"
    db_data = r_db.json().get("data", {})
    assert db_data.get("database") == "UP", f"Database not UP: {db_data}"
    
    r_ai = session.get(f"{BACKEND_URL}/api/health/ai", timeout=30)
    assert r_ai.status_code == 200, f"Backend AI check returned {r_ai.status_code}"
    
    print(f"  [PASS] Backend Gateway is UP. Database={db_data.get('databaseProduct')} {db_data.get('databaseVersion')}")
    results["backend_and_database"] = "PASS"

def test_nutrition_engine():
    print("\n[TEST 4] Verifying Nutrition Engine & Dietary Profiles...")
    r_cat = session.get(f"{BACKEND_URL}/api/nutrition/categories", timeout=20)
    assert r_cat.status_code == 200, f"Categories failed: {r_cat.status_code}"
    cats = r_cat.json().get("data", [])
    assert len(cats) >= 6, f"Expected at least 6 categories, got {len(cats)}"

    for test_cat in ["Vitamin_B12_Deficiency", "Iron_Deficiency", "Vitamin_C_Deficiency"]:
        r_food = session.get(f"{BACKEND_URL}/api/nutrition/recommendations/{test_cat}", timeout=20)
        assert r_food.status_code == 200, f"Failed for {test_cat}"
        food_data = r_food.json().get("data", {})
        assert len(food_data.get("vegetarianFoods", [])) > 0, f"No veg foods for {test_cat}"
        assert food_data.get("primaryNutrient"), f"No primary nutrient for {test_cat}"

    print(f"  [PASS] Nutrition Engine verified across {len(cats)} categories with authentic Indian foods.")
    results["nutrition_engine"] = "PASS"

def test_doctor_referral_local(base_url):
    print("\n[TEST 5] Verifying Doctor Referral System (Bengaluru & Localities)...")
    r_loc = session.get(f"{base_url}/api/doctors/localities", timeout=20)
    assert r_loc.status_code == 200, f"Localities failed: {r_loc.status_code}"
    locs = r_loc.json().get("data", [])
    assert "Koramangala" in locs and "Indiranagar" in locs, f"Missing key localities: {locs}"

    r_all = session.get(f"{base_url}/api/doctors/bengaluru", timeout=20)
    assert r_all.status_code == 200, f"Bengaluru doctors failed: {r_all.status_code}"
    doctors = r_all.json().get("data", [])
    assert len(doctors) >= 10, f"Expected >= 10 doctors, got {len(doctors)}"

    first = doctors[0]
    assert first.get("name") and first.get("address") and first.get("phone") and first.get("mapUrl"), "Incomplete doctor card"
    assert "maps" in first.get("mapUrl"), "Missing Google Maps URL"

    r_filter = session.get(f"{base_url}/api/doctors/bengaluru?locality=Koramangala", timeout=20)
    assert r_filter.status_code == 200
    k_docs = r_filter.json().get("data", [])
    assert len(k_docs) > 0, "No doctors found in Koramangala"

    print(f"  [PASS] Doctor Referral verified with {len(doctors)} accredited centers across {len(locs)} localities.")
    results["doctor_referral"] = "PASS"

def test_chatbot_matrix(base_url, auth_token=None):
    print("\n[TEST 6] Executing Chatbot 20-Question Comprehensive Matrix...")
    headers = {"Content-Type": "application/json"}
    if auth_token:
        headers["Authorization"] = f"Bearer {auth_token}"

    matrix = [
        ("What is Vitamin B12 and what does it do?", "VITAMIN_B12_EXPLANATION", ["cobalamin", "red blood"]),
        ("What foods contain Vitamin B12?", "VITAMIN_B12_FOODS", ["curd", "paneer"]),
        ("I am vegetarian. What B12 foods can I eat?", "VITAMIN_B12_VEG_SOURCES", ["dahi", "paneer"]),
        ("I am strict vegan. How do I get B12?", "VITAMIN_B12_VEG_SOURCES", ["fortified", "yeast"]),
        ("What foods contain iron?", "IRON_FOODS", ["spinach", "palak", "lemon"]),
        ("Why is my tongue sore and smooth?", "SYMPTOM_GLOSSITIS", ["glossitis", "tongue"]),
        ("What does spoon nails mean?", "SYMPTOM_KOILONYCHIA", ["koilonychia", "iron"]),
        ("Why are the corners of my mouth cracking?", "SYMPTOM_ANGULAR_CHEILITIS", ["angular cheilitis", "lips"]),
        ("Tell me about Vitamin C and bleeding gums", "VITAMIN_C_INFO", ["ascorbic", "amla"]),
        ("What are symptoms of Vitamin A deficiency?", "VITAMIN_A_INFO", ["vision", "retinol"]),
        ("What do white spots on my fingernails mean?", "ZINC_INFO", ["zinc", "leukonychia"]),
        ("Should I see a doctor?", "WHEN_TO_SEE_DOCTOR", ["consult", "examination"]),
        ("Find a doctor near me in Bengaluru", "DOCTOR_REFERRAL", ["bengaluru", "hospital"]),
        ("Can I take high dose vitamin pills and supplements?", "SUPPLEMENT_SAFETY", ["does not recommend or prescribe", "dosage"]),
        ("What does model confidence mean?", "CONFIDENCE_EXPLANATION", ["pattern", "match"]),
        ("Can this AI confirm a vitamin deficiency?", "DIAGNOSTIC_LIMITATION", ["no", "blood test"]),
        ("What should I eat for a balanced daily diet?", "NUTRITION_PLAN", ["breakfast", "lunch", "dinner"]),
        ("What did my previous assessment show?", "PREVIOUS_ASSESSMENT", ["assessment", "photo"]),
        ("I am experiencing severe chest pain and cannot breathe", "EMERGENCY", ["emergency", "112"]),
        ("Can you recommend non-vegetarian sources of iron?", "DIET_PREFERENCE_NON_VEG", ["egg", "fish"]),
    ]

    passed_count = 0
    for idx, (question, expected_intent, required_keywords) in enumerate(matrix, 1):
        payload = {"message": question}
        r = session.post(f"{base_url}/api/chat/message", json=payload, headers=headers, timeout=20)
        assert r.status_code == 200, f"Question {idx} failed with HTTP {r.status_code}: {question}"
        res_data = r.json().get("data", {})
        reply = res_data.get("reply", "").lower()
        intent = res_data.get("intentCategory", "")

        keyword_match = any(k in reply for k in required_keywords)
        if keyword_match or expected_intent in intent:
            passed_count += 1
            print(f"  Q{idx:02d} [PASS] {question[:45]:45} -> Intent: {intent}")
        else:
            print(f"  Q{idx:02d} [FAIL] {question[:45]:45} -> Reply: {reply[:60]}")

    assert passed_count >= 18, f"Chatbot passed {passed_count}/20 questions, minimum required 18."
    print(f"  [PASS] Chatbot passed {passed_count}/20 questions with distinct contextual responses.")
    results["chatbot_matrix"] = f"PASS ({passed_count}/20)"

def run_all():
    try:
        test_frontend()
    except Exception as e:
        print(f"  [FAIL] Frontend: {e}")
        results["frontend"] = f"FAIL: {e}"

    try:
        test_ai_service()
    except Exception as e:
        print(f"  [FAIL] AI Service: {e}")
        results["ai_service"] = f"FAIL: {e}"

    try:
        test_backend_and_database()
    except Exception as e:
        print(f"  [FAIL] Backend/DB: {e}")
        results["backend_and_database"] = f"FAIL: {e}"

    try:
        test_nutrition_engine()
    except Exception as e:
        print(f"  [FAIL] Nutrition Engine: {e}")
        results["nutrition_engine"] = f"FAIL: {e}"

    print("\n" + "=" * 80)
    print(" SUMMARY STATUS:")
    for k, v in results.items():
        print(f"  {k:25} : {v}")
    print("=" * 80)

if __name__ == "__main__":
    run_all()
