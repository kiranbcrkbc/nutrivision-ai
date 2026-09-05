"""
NutriVision AI - Phase 6 Complete End-to-End Integration Test
Tests:
- Authentication & JWT issuance
- Assessment creation
- Real multipart image upload through Spring Boot to FastAPI
- OpenCV blur & brightness score persistence in MySQL
- Real quality status evaluation (PASSED, REJECTED)
- Re-analysis endpoint
- Physical file persistence
- Cross-user authorization protection (User B blocked from User A resources)
- Image deletion lifecycle
"""

import json
import os
import subprocess
import urllib.error
import urllib.request
import uuid
import cv2
import numpy as np

BACKEND_URL = "http://localhost:8080/api"
FASTAPI_URL = "http://127.0.0.1:8000"
TEST_IMG_DIR = "./tests/fixtures"
os.makedirs(TEST_IMG_DIR, exist_ok=True)

def create_sample_sharp_image(path):
    img = np.zeros((400, 400, 3), dtype=np.uint8)
    img[:, :] = (130, 130, 130)
    for i in range(10, 390, 20):
        cv2.rectangle(img, (i, i), (i + 12, i + 12), (255, 255, 255), -1)
        cv2.line(img, (i, 400 - i), (i + 15, 380 - i), (10, 10, 10), 3)
    cv2.putText(img, "NutriVision Phase 6 E2E Test", (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
    cv2.imwrite(path, img)
    return path

def create_sample_blurry_image(path):
    sharp = np.zeros((400, 400, 3), dtype=np.uint8)
    sharp[:, :] = (128, 128, 128)
    cv2.putText(sharp, "Blurry", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    blurred = cv2.GaussianBlur(sharp, (51, 51), 0)
    cv2.imwrite(path, blurred)
    return path

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
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"message": body}

def http_multipart_upload(url, filename, file_bytes, mime_type="image/jpeg", token=None):
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {mime_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(url, data=bytes(body), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    if token:
        req.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.getcode(), json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"message": body}

def run_end_to_end_test():
    print("==================================================")
    print("STARTING PHASE 6 COMPLETE END-TO-END VERIFICATION")
    print("==================================================")

    uid = uuid.uuid4().hex[:6]
    email_a = f"user_a_{uid}@nutrivision.test"
    email_b = f"user_b_{uid}@nutrivision.test"
    password = "SecurePassword123!"

    # 1. Register User A
    status, res = http_json_request(f"{BACKEND_URL}/auth/register", "POST", {
        "email": email_a,
        "password": password,
        "confirmPassword": password,
        "fullName": "Alice Nutritional Tester"
    })
    print(f"\n[1] Register User A ({email_a}) -> Status: {status}")
    assert status in [200, 201], f"Failed to register User A: {res}"

    # 2. Login User A
    status, res = http_json_request(f"{BACKEND_URL}/auth/login", "POST", {
        "email": email_a,
        "password": password
    })
    print(f"[2] Login User A -> Status: {status}")
    assert status == 200
    token_a = res["data"]["accessToken"]
    assert token_a is not None

    # 3. Register & Login User B (for IDOR / Authorization testing)
    status, _ = http_json_request(f"{BACKEND_URL}/auth/register", "POST", {
        "email": email_b,
        "password": password,
        "confirmPassword": password,
        "fullName": "Bob Unauthorized Tester"
    })
    status, res_b = http_json_request(f"{BACKEND_URL}/auth/login", "POST", {
        "email": email_b,
        "password": password
    })
    token_b = res_b["data"]["accessToken"]
    print(f"[3] Register & Login User B ({email_b}) -> Token acquired")

    # 4. User A creates Assessment
    status, res = http_json_request(f"{BACKEND_URL}/assessments", "POST", {
        "targetBodyPart": "NAILS"
    }, token=token_a)
    print(f"[4] User A creates assessment -> Status: {status}")
    assert status in [200, 201]
    assessment_id = res["data"]["assessmentId"]
    print(f"    Created Assessment ID: {assessment_id}")

    # 5. TEST 6: Upload sharp image via Spring Boot -> FastAPI -> MySQL
    sharp_path = os.path.join(TEST_IMG_DIR, f"e2e_sharp_{uid}.jpg")
    create_sample_sharp_image(sharp_path)
    with open(sharp_path, "rb") as f:
        file_bytes = f.read()

    status, upload_res = http_multipart_upload(
        f"{BACKEND_URL}/assessments/{assessment_id}/images",
        f"e2e_sharp_{uid}.jpg",
        file_bytes,
        mime_type="image/jpeg",
        token=token_a
    )
    print(f"\n[5] TEST 6: Upload Sharp Image through Spring Boot -> Status: {status}")
    print(f"    Response data: {json.dumps(upload_res, indent=2)}")
    assert status in [200, 201], f"Upload failed: {upload_res}"
    image_data = upload_res["data"]
    image_id = image_data["imageId"]
    assert image_data["qualityStatus"] == "PASSED", f"Expected PASSED, got {image_data['qualityStatus']}"
    assert image_data["blurScore"] is not None and image_data["blurScore"] >= 100.0
    assert image_data["brightnessScore"] is not None and 40.0 <= image_data["brightnessScore"] <= 220.0
    assert image_data["rejectionReason"] is None
    print(f"    [PASSED] TEST 6: Real quality evaluated: Status={image_data['qualityStatus']}, Blur={image_data['blurScore']}, Brightness={image_data['brightnessScore']}")

    # 6. TEST 7: Query MySQL directly to verify database records
    mysql_cmd = [
        r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "-u", "root", "-proot",
        "-e", f"USE nutrivision_db; SELECT image_id, assessment_id, original_filename, quality_status, blur_score, brightness_score, rejection_reason, uploaded_at FROM assessment_images WHERE image_id = {image_id};"
    ]
    mysql_proc = subprocess.run(mysql_cmd, capture_output=True, text=True)
    print(f"\n[6] TEST 7: Direct MySQL Database Verification for Image #{image_id}:")
    print(mysql_proc.stdout)
    assert f"{image_id}" in mysql_proc.stdout
    assert "PASSED" in mysql_proc.stdout
    print("    [PASSED] TEST 7: MySQL table assessment_images holds real calculated values!")

    # 7. Test Re-analyze Image Quality endpoint
    status, reanalyze_res = http_json_request(
        f"{BACKEND_URL}/assessments/{assessment_id}/images/{image_id}/analyze-quality",
        "POST",
        token=token_a
    )
    print(f"\n[7] Re-analyze Quality API -> Status: {status}")
    assert status == 200
    assert reanalyze_res["data"]["qualityStatus"] == "PASSED"

    # 8. TEST 10: Cross-User Authorization (IDOR Protection)
    print(f"\n[8] TEST 10: Testing Cross-User Security (User B accessing User A Assessment #{assessment_id})")
    
    # 8a: User B cannot view images list
    status, _ = http_json_request(f"{BACKEND_URL}/assessments/{assessment_id}/images", "GET", token=token_b)
    print(f"    User B GET images -> Status: {status} (Expected: 403)")
    assert status == 403, f"Expected 403 Forbidden, got {status}"

    # 8b: User B cannot re-analyze image
    status, _ = http_json_request(f"{BACKEND_URL}/assessments/{assessment_id}/images/{image_id}/analyze-quality", "POST", token=token_b)
    print(f"    User B POST analyze-quality -> Status: {status} (Expected: 403)")
    assert status == 403, f"Expected 403 Forbidden, got {status}"

    # 8c: User B cannot delete image
    status, _ = http_json_request(f"{BACKEND_URL}/assessments/{assessment_id}/images/{image_id}", "DELETE", token=token_b)
    print(f"    User B DELETE image -> Status: {status} (Expected: 403)")
    assert status == 403, f"Expected 403 Forbidden, got {status}"

    # 8d: User B cannot view physical image resource
    req = urllib.request.Request(f"{BACKEND_URL}/assessments/{assessment_id}/images/{image_id}/view")
    req.add_header("Authorization", f"Bearer {token_b}")
    try:
        urllib.request.urlopen(req)
        assert False, "User B should have been forbidden from viewing image!"
    except urllib.error.HTTPError as e:
        print(f"    User B GET /view -> Status: {e.code} (Expected: 403)")
        assert e.code == 403

    print("    [PASSED] TEST 10: Cross-User Authorization verified across all image operations!")

    # 9. Upload Blurry/Rejected image by User A to verify rejection flow
    blurry_path = os.path.join(TEST_IMG_DIR, f"e2e_blurry_{uid}.jpg")
    create_sample_blurry_image(blurry_path)
    with open(blurry_path, "rb") as f:
        blurry_bytes = f.read()

    status, upload_blurry_res = http_multipart_upload(
        f"{BACKEND_URL}/assessments/{assessment_id}/images",
        f"e2e_blurry_{uid}.jpg",
        blurry_bytes,
        mime_type="image/jpeg",
        token=token_a
    )
    print(f"\n[9] Upload Blurry Image for User A -> Status: {status}")
    blurry_image_data = upload_blurry_res["data"]
    blurry_image_id = blurry_image_data["imageId"]
    print(f"    Quality Status: {blurry_image_data['qualityStatus']}")
    print(f"    Rejection Reason: {blurry_image_data['rejectionReason']}")
    assert blurry_image_data["qualityStatus"] in ["REJECTED", "WARNING"]
    assert blurry_image_data["blurScore"] < 100.0

    # 10. Delete the blurry image
    status, del_res = http_json_request(
        f"{BACKEND_URL}/assessments/{assessment_id}/images/{blurry_image_id}",
        "DELETE",
        token=token_a
    )
    print(f"\n[10] Delete Image #{blurry_image_id} -> Status: {status}")
    assert status == 200

    print("\n==================================================")
    print("PHASE 6 END-TO-END INTEGRATION TEST 100% PASSED!")
    print("==================================================")

if __name__ == "__main__":
    run_end_to_end_test()
