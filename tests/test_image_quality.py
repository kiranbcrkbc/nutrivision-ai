"""
NutriVision AI - Phase 6 Test Suite
Tests FastAPI image quality engine and OpenCV calculations across test image conditions using Python standard library.
"""

import cv2
import numpy as np
import os
import json
import urllib.request
import urllib.error
import mimetypes
import uuid

BASE_URL = "http://127.0.0.1:8000"
TEST_IMG_DIR = "./tests/fixtures"
os.makedirs(TEST_IMG_DIR, exist_ok=True)

def create_sharp_image(path):
    img = np.zeros((400, 400, 3), dtype=np.uint8)
    img[:, :] = (120, 120, 120)
    for i in range(10, 390, 20):
        cv2.rectangle(img, (i, i), (i + 10, i + 10), (255, 255, 255), -1)
        cv2.line(img, (i, 400 - i), (i + 15, 380 - i), (0, 0, 0), 3)
    cv2.putText(img, "NutriVision AI Sharp Sample", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.imwrite(path, img)
    return path

def create_blurry_image(path):
    sharp_img = np.zeros((400, 400, 3), dtype=np.uint8)
    sharp_img[:, :] = (128, 128, 128)
    cv2.putText(sharp_img, "Blur Test", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    blurred = cv2.GaussianBlur(sharp_img, (51, 51), 0)
    cv2.imwrite(path, blurred)
    return path

def create_dark_image(path):
    img = np.full((400, 400, 3), 15, dtype=np.uint8)
    cv2.putText(img, "Dark", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (35, 35, 35), 1)
    cv2.imwrite(path, img)
    return path

def create_bright_image(path):
    img = np.full((400, 400, 3), 245, dtype=np.uint8)
    cv2.putText(img, "Bright", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    cv2.imwrite(path, img)
    return path

def upload_multipart(endpoint, filename, file_bytes, mime_type="image/jpeg"):
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {mime_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(endpoint, data=bytes(body), method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    
    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.getcode()
            res_body = resp.read().decode("utf-8")
            return status_code, json.loads(res_body)
    except urllib.error.HTTPError as e:
        status_code = e.code
        res_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(res_body)
        except Exception:
            parsed = {"detail": res_body}
        return status_code, parsed

def run_tests():
    print("==================================================")
    print("RUNNING NUTRI-VISION AI IMAGE QUALITY TEST SUITE")
    print("==================================================")

    # Health Check
    with urllib.request.urlopen(f"{BASE_URL}/health") as resp:
        health_data = json.loads(resp.read().decode("utf-8"))
        print("\nTEST 1: Health Check")
        print("Response:", health_data)
        assert resp.getcode() == 200
        assert health_data["status"] == "UP"
        print("[PASSED] TEST 1")

    # 1. Sharp Image
    sharp_path = os.path.join(TEST_IMG_DIR, "sharp_sample.jpg")
    create_sharp_image(sharp_path)
    with open(sharp_path, "rb") as f:
        file_bytes = f.read()
    status_code, data = upload_multipart(f"{BASE_URL}/api/quality/check", "sharp_sample.jpg", file_bytes)
    print("\nTEST 2: Sharp Image Check")
    print(f"Status: {status_code}, Response: {data}")
    assert status_code == 200
    assert data["qualityStatus"] == "PASSED", f"Expected PASSED, got {data['qualityStatus']}"
    assert data["blurScore"] >= 100.0, f"Expected blurScore >= 100, got {data['blurScore']}"
    assert 40.0 <= data["brightnessScore"] <= 220.0
    print("[PASSED] TEST 2")

    # 2. Blurry Image
    blur_path = os.path.join(TEST_IMG_DIR, "blurry_sample.jpg")
    create_blurry_image(blur_path)
    with open(blur_path, "rb") as f:
        file_bytes = f.read()
    status_code, data = upload_multipart(f"{BASE_URL}/api/quality/check", "blurry_sample.jpg", file_bytes)
    print("\nTEST 3: Blurry Image Check")
    print(f"Status: {status_code}, Response: {data}")
    assert status_code == 200
    assert data["qualityStatus"] in ["REJECTED", "WARNING"], f"Expected REJECTED or WARNING, got {data['qualityStatus']}"
    assert data["blurScore"] < 100.0, f"Expected blurScore < 100, got {data['blurScore']}"
    print("[PASSED] TEST 3")

    # 3. Dark Image
    dark_path = os.path.join(TEST_IMG_DIR, "dark_sample.jpg")
    create_dark_image(dark_path)
    with open(dark_path, "rb") as f:
        file_bytes = f.read()
    status_code, data = upload_multipart(f"{BASE_URL}/api/quality/check", "dark_sample.jpg", file_bytes)
    print("\nTEST 4: Dark Image Check")
    print(f"Status: {status_code}, Response: {data}")
    assert status_code == 200
    assert data["qualityStatus"] == "REJECTED", f"Expected REJECTED, got {data['qualityStatus']}"
    assert data["brightnessScore"] < 40.0, f"Expected brightnessScore < 40, got {data['brightnessScore']}"
    print("[PASSED] TEST 4")

    # 4. Bright Image
    bright_path = os.path.join(TEST_IMG_DIR, "bright_sample.jpg")
    create_bright_image(bright_path)
    with open(bright_path, "rb") as f:
        file_bytes = f.read()
    status_code, data = upload_multipart(f"{BASE_URL}/api/quality/check", "bright_sample.jpg", file_bytes)
    print("\nTEST 5: Bright Image Check")
    print(f"Status: {status_code}, Response: {data}")
    assert status_code == 200
    assert data["qualityStatus"] == "REJECTED", f"Expected REJECTED, got {data['qualityStatus']}"
    assert data["brightnessScore"] > 220.0, f"Expected brightnessScore > 220, got {data['brightnessScore']}"
    print("[PASSED] TEST 5")

    # 5. Invalid / Corrupted Image
    print("\nTEST 11: Invalid / Corrupted Image Check")
    corrupt_bytes = b"CORRUPTED_NON_IMAGE_BINARY_PAYLOAD"
    status_code, data = upload_multipart(f"{BASE_URL}/api/quality/check", "corrupt.jpg", corrupt_bytes)
    print(f"Status: {status_code}, Response: {data}")
    assert status_code == 200 or status_code == 400
    if status_code == 200:
        assert data["qualityStatus"] == "REJECTED"
    print("[PASSED] TEST 11")

    print("\n==================================================")
    print("ALL FASTAPI IMAGE QUALITY TESTS PASSED PERFECTLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
