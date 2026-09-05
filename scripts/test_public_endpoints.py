import requests
import json

FRONTEND_URL = "https://kiranbcrkbc-nutrivision-ai.onrender.com"
BACKEND_URL = "https://kiranbcrkbc-nutrivision-backend.onrender.com"
BACKEND_FALLBACK = "https://nutrivision-backend-f9dd.onrender.com"
AI_URL = "https://kiranbcrkbc-nutrivision-ai-service.onrender.com"

print("=" * 70)
print("TESTING PUBLIC URLS WITH USERNAME kiranbcrkbc")
print("=" * 70)

# 1. Frontend
try:
    r_fe = requests.get(FRONTEND_URL, timeout=10)
    print(f"[FRONTEND] {FRONTEND_URL} -> HTTP {r_fe.status_code} ({'OK' if r_fe.status_code == 200 else 'FAIL'})")
except Exception as e:
    print(f"[FRONTEND] {FRONTEND_URL} -> Error: {e}")

# 2. Backend
for b_url in [BACKEND_URL, BACKEND_FALLBACK]:
    try:
        r_be = requests.get(f"{b_url}/api/health", timeout=10)
        print(f"[BACKEND] {b_url}/api/health -> HTTP {r_be.status_code}: {r_be.text[:100]}")
    except Exception as e:
        print(f"[BACKEND] {b_url} -> Error: {e}")

# 3. AI Service
try:
    r_ai = requests.get(f"{AI_URL}/api/ai/health", timeout=10)
    print(f"[AI SERVICE] {AI_URL}/api/ai/health -> HTTP {r_ai.status_code}: {r_ai.text[:100]}")
except Exception as e:
    print(f"[AI SERVICE] {AI_URL} -> Error: {e}")

print("=" * 70)
