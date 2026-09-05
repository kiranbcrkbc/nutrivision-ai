"""
NutriVision AI - Comprehensive Phase 8 End-to-End Verification
"""

import os
import json
import requests
import onnxruntime as ort
import numpy as np

def run_verification():
    print("=" * 65)
    print("NUTRI-VISION AI - PHASE 8 END-TO-END VERIFICATION")
    print("=" * 65)

    # 1. Check physical model files
    onnx_path = os.path.abspath("models/trained/mobilenetv2_nutrivision_v1.onnx")
    pth_path = os.path.abspath("models/trained/mobilenetv2_nutrivision_v1.pth")
    meta_path = os.path.abspath("models/trained/model_metadata.json")

    assert os.path.exists(onnx_path), "ONNX model missing"
    assert os.path.exists(pth_path), "PTH model missing"
    assert os.path.exists(meta_path), "Metadata missing"

    onnx_size = os.path.getsize(onnx_path)
    pth_size = os.path.getsize(pth_path)

    print(f"TEST 1 - Physical Model Files: OK (ONNX: {onnx_size/1024/1024:.2f} MB, PTH: {pth_size/1024/1024:.2f} MB)")

    # 2. Test ONNX Runtime directly
    sess = ort.InferenceSession(onnx_path)
    dummy_tensor = np.random.randn(1, 3, 224, 224).astype(np.float32)
    out = sess.run(None, {sess.get_inputs()[0].name: dummy_tensor})[0]
    print(f"TEST 2 - ONNX Runtime Direct Session: OK (Output shape: {out.shape})")

    # 3. Test FastAPI health endpoint
    health_res = requests.get("http://127.0.0.1:8000/api/ai/health")
    assert health_res.status_code == 200
    health = health_res.json()
    assert health["modelAvailable"] is True
    assert health["inferenceModel"] == "MODEL_READY"
    active_m = health.get("activeModel")
    print(f"TEST 3 - AI Service Health: OK (Active Model: {active_m})")

    # 4. Test inference on multiple real test classes
    test_dir = "datasets/processed/test"
    classes = [c for c in os.listdir(test_dir) if os.path.isdir(os.path.join(test_dir, c))]
    print("\nTEST 4 - Multi-class real sample inference testing:")
    for c in sorted(classes):
        class_folder = os.path.join(test_dir, c)
        files = [os.path.join(class_folder, f) for f in os.listdir(class_folder) if f.endswith(".jpg")]
        if not files:
            continue
        sample = files[0]
        with open(sample, "rb") as f:
            resp = requests.post("http://127.0.0.1:8000/api/ai/inference/analyze", files={"file": ("test.jpg", f, "image/jpeg")})
        res_data = resp.json()
        top = res_data.get("topPrediction", {})
        cat = top.get("deficiencyCategory")
        conf_pct = top.get("confidencePercentage")
        status = res_data.get("status")
        print(f"  Class [{c:<24}] -> Top: {cat} ({conf_pct}) | Status: {status}")

    print("\n[ALL END-TO-END VERIFICATIONS COMPLETED SUCCESSFULLY]")


if __name__ == "__main__":
    run_verification()
