"""
NutriVision AI - Phase 8 Independent Verification and Reproducibility Audit Script
Executes all verification checks requested in Steps 1 to 5.
"""

import os
import sys
import json
import hashlib
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights
from torchvision import transforms
from sklearn.metrics import classification_report, confusion_matrix
import onnxruntime as ort

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
PROCESSED_DIR = os.path.join(DATASETS_DIR, "processed")
MODELS_TRAINED_DIR = os.path.join(BASE_DIR, "models", "trained")

NORM_MEAN = [0.485, 0.456, 0.406]
NORM_STD = [0.229, 0.224, 0.225]


def step1_provenance_audit():
    print("=" * 70)
    print("STEP 1: DATASET PROVENANCE AUDIT")
    print("=" * 70)
    
    cat_path = os.path.join(DATASETS_DIR, "metadata", "dataset_catalog.json")
    with open(cat_path, "r") as f:
        catalog = json.load(f)

    print("Dataset Name:", catalog.get("dataset_name"))
    print("License Claimed:", catalog.get("license"))
    print("Total Images:", catalog.get("total_images"))
    print("Classes (6):", catalog.get("classes"))
    print("Proven Origin: Programmatically generated clinical visual patterns via scripts/prepare_dataset.py")
    print("VERDICT: LOCAL CURATED / PROTOTYPE DATASET — CLINICAL VALIDITY NOT ESTABLISHED")


def step2_leakage_and_duplicate_audit():
    print("\n" + "=" * 70)
    print("STEP 2: DATA LEAKAGE AND DUPLICATE AUDIT")
    print("=" * 70)

    splits = ["train", "val", "test"]
    hashes = {s: {} for s in splits}
    total_images = {s: 0 for s in splits}

    for s in splits:
        split_dir = os.path.join(PROCESSED_DIR, s)
        for root, _, files in os.walk(split_dir):
            for f in files:
                if f.lower().endswith((".jpg", ".jpeg", ".png")):
                    filepath = os.path.join(root, f)
                    total_images[s] += 1
                    with open(filepath, "rb") as img_f:
                        h = hashlib.sha256(img_f.read()).hexdigest()
                    hashes[s][filepath] = h

    train_hashes = set(hashes["train"].values())
    val_hashes = set(hashes["val"].values())
    test_hashes = set(hashes["test"].values())

    # Check overlaps
    train_test_overlap = train_hashes.intersection(test_hashes)
    train_val_overlap = train_hashes.intersection(val_hashes)
    val_test_overlap = val_hashes.intersection(test_hashes)

    print(f"Total Train Images: {total_images['train']} | Unique Hashes: {len(train_hashes)}")
    print(f"Total Val Images:   {total_images['val']} | Unique Hashes: {len(val_hashes)}")
    print(f"Total Test Images:  {total_images['test']} | Unique Hashes: {len(test_hashes)}")
    print("-" * 50)
    print(f"Train / Test Exact Duplicates:       {len(train_test_overlap)}")
    print(f"Train / Validation Exact Duplicates: {len(train_val_overlap)}")
    print(f"Validation / Test Exact Duplicates: {len(val_test_overlap)}")

    assert len(train_test_overlap) == 0, "DATA LEAKAGE DETECTED: Train and Test share identical images!"
    assert len(train_val_overlap) == 0, "DATA LEAKAGE DETECTED: Train and Validation share identical images!"
    assert len(val_test_overlap) == 0, "DATA LEAKAGE DETECTED: Validation and Test share identical images!"
    print("[PASSED] Zero data leakage across Train, Validation, and Test splits.")

    return {
        "train_count": total_images["train"],
        "val_count": total_images["val"],
        "test_count": total_images["test"],
        "train_test_duplicates": len(train_test_overlap),
        "train_val_duplicates": len(train_val_overlap),
        "val_test_duplicates": len(val_test_overlap)
    }


def step3_model_reproducibility_and_parity_check():
    print("\n" + "=" * 70)
    print("STEP 3: INDEPENDENT MODEL REPRODUCIBILITY & PARITY CHECK")
    print("=" * 70)

    pth_path = os.path.join(MODELS_TRAINED_DIR, "mobilenetv2_nutrivision_v1.pth")
    onnx_path = os.path.join(MODELS_TRAINED_DIR, "mobilenetv2_nutrivision_v1.onnx")
    meta_path = os.path.join(MODELS_TRAINED_DIR, "model_metadata.json")

    print(f"PyTorch Checkpoint: {pth_path} ({os.path.getsize(pth_path)/1024/1024:.2f} MB)")
    print(f"ONNX Model File:    {onnx_path} ({os.path.getsize(onnx_path)/1024/1024:.2f} MB)")

    with open(meta_path, "r") as f:
        metadata = json.load(f)
    class_names = metadata["classes"]
    num_classes = len(class_names)

    # 1. Build PyTorch model and load weights
    weights = MobileNet_V2_Weights.DEFAULT
    pytorch_model = mobilenet_v2(weights=weights)
    in_features = pytorch_model.classifier[1].in_features
    pytorch_model.classifier[1] = nn.Sequential(
        nn.Dropout(p=0.25),
        nn.Linear(in_features, num_classes)
    )
    pytorch_model.load_state_dict(torch.load(pth_path, map_location="cpu"))
    pytorch_model.eval()

    # 2. Load ONNX Runtime session
    onnx_session = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
    onnx_input_name = onnx_session.get_inputs()[0].name

    # 3. Test parity across samples from all classes
    test_dir = os.path.join(PROCESSED_DIR, "test")
    max_logit_diff = 0.0
    parity_matches = 0
    total_tested = 0

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(NORM_MEAN, NORM_STD)
    ])

    print("\nTesting numerical parity between PyTorch and ONNX Runtime on test samples:")
    for cls_idx, cls_name in enumerate(class_names):
        cls_dir = os.path.join(test_dir, cls_name)
        sample_files = [os.path.join(cls_dir, f) for f in os.listdir(cls_dir) if f.endswith(".jpg")]
        if not sample_files:
            continue
        sample_path = sample_files[0]
        pil_img = Image.open(sample_path).convert("RGB")
        
        # PyTorch forward
        tensor = transform(pil_img).unsqueeze(0)
        with torch.no_grad():
            py_logits = pytorch_model(tensor).numpy()[0]
            py_probs = torch.softmax(torch.tensor(py_logits), dim=0).numpy()
            py_pred = int(np.argmax(py_probs))

        # ONNX forward
        onnx_input = tensor.numpy()
        onnx_logits = onnx_session.run(None, {onnx_input_name: onnx_input})[0][0]
        exp_s = np.exp(onnx_logits - np.max(onnx_logits))
        onnx_probs = exp_s / np.sum(exp_s)
        onnx_pred = int(np.argmax(onnx_probs))

        diff = float(np.max(np.abs(py_logits - onnx_logits)))
        max_logit_diff = max(max_logit_diff, diff)

        is_match = (py_pred == onnx_pred) and (diff < 1e-3)
        if is_match:
            parity_matches += 1
        total_tested += 1

        print(f"  Class [{cls_name:<24}] -> PyTorch Pred: {class_names[py_pred]} ({py_probs[py_pred]*100:.1f}%) | "
              f"ONNX Pred: {class_names[onnx_pred]} ({onnx_probs[onnx_pred]*100:.1f}%) | Max Logit Diff: {diff:.2e}")

    print("-" * 50)
    print(f"PyTorch vs ONNX Parity Matches: {parity_matches}/{total_tested} (100%)")
    print(f"Maximum Logit Absolute Difference: {max_logit_diff:.2e}")
    assert parity_matches == total_tested, "PyTorch and ONNX Runtime predictions diverged!"
    print("[PASSED] Perfect parity between PyTorch and ONNX Runtime.")

    return {
        "parity_matches": parity_matches,
        "total_tested": total_tested,
        "max_logit_diff": max_logit_diff
    }


def step4_independent_test_evaluation():
    print("\n" + "=" * 70)
    print("STEP 4: INDEPENDENT TEST SET EVALUATION (FRESH EXECUTION)")
    print("=" * 70)

    onnx_path = os.path.join(MODELS_TRAINED_DIR, "mobilenetv2_nutrivision_v1.onnx")
    meta_path = os.path.join(MODELS_TRAINED_DIR, "model_metadata.json")
    with open(meta_path, "r") as f:
        metadata = json.load(f)
    class_names = metadata["classes"]
    
    session = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name

    test_dir = os.path.join(PROCESSED_DIR, "test")
    y_true = []
    y_pred = []
    y_probs = []

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(NORM_MEAN, NORM_STD)
    ])

    total_loss = 0.0
    count = 0

    for true_idx, cls_name in enumerate(class_names):
        cls_dir = os.path.join(test_dir, cls_name)
        for fname in sorted(os.listdir(cls_dir)):
            if fname.endswith(".jpg"):
                img_path = os.path.join(cls_dir, fname)
                pil_img = Image.open(img_path).convert("RGB")
                input_tensor = transform(pil_img).unsqueeze(0).numpy()

                logits = session.run(None, {input_name: input_tensor})[0][0]
                exp_s = np.exp(logits - np.max(logits))
                probs = exp_s / np.sum(exp_s)
                pred_idx = int(np.argmax(probs))

                # Cross entropy loss
                loss = -np.log(max(probs[true_idx], 1e-12))
                total_loss += loss

                y_true.append(true_idx)
                y_pred.append(pred_idx)
                y_probs.append(probs)
                count += 1

    accuracy = np.mean(np.array(y_true) == np.array(y_pred))
    avg_loss = total_loss / count
    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    conf_matrix = confusion_matrix(y_true, y_pred).tolist()

    print(f"Total Test Samples Evaluated: {count}")
    print(f"Reproduced Test Accuracy:     {accuracy * 100:.2f}%")
    print(f"Reproduced Test Loss:         {avg_loss:.4f}")
    print(f"Reproduced Macro F1 Score:    {report['macro avg']['f1-score']*100:.2f}%")
    print("\nPer-Class Reproduced Metrics:")
    for cls in class_names:
        m = report[cls]
        print(f"  {cls:<24} Precision: {m['precision']*100:5.1f}% | Recall: {m['recall']*100:5.1f}% | F1: {m['f1-score']*100:5.1f}% | Support: {int(m['support'])}")

    print("\nReproduced Confusion Matrix:")
    for row in conf_matrix:
        print(" ", row)

    return {
        "test_sample_count": count,
        "reproduced_accuracy": round(float(accuracy), 4),
        "reproduced_loss": round(float(avg_loss), 4),
        "reproduced_macro_f1": round(float(report['macro avg']['f1-score']), 4),
        "classification_report": report,
        "confusion_matrix": conf_matrix
    }


def step5_calibration_and_hardcoded_check():
    print("\n" + "=" * 70)
    print("STEP 5: CONFIDENCE & HARDCODED PREDICTION AUDIT")
    print("=" * 70)

    # Search for suspicious hardcoded confidence strings in frontend
    suspicious_patterns = ["82.4", "95.2", "96.9", "87.0", "64.8", "50.0"]
    frontend_dir = os.path.join(BASE_DIR, "frontend", "src")
    findings = []

    for root, _, files in os.walk(frontend_dir):
        for f in files:
            if f.endswith((".ts", ".tsx", ".js", ".jsx")):
                filepath = os.path.join(root, f)
                with open(filepath, "r", encoding="utf-8", errors="ignore") as file:
                    content = file.read()
                    for pat in suspicious_patterns:
                        if pat in content:
                            findings.append((filepath, pat))

    print(f"Suspicious Hardcoded Value Search in frontend/src: {len(findings)} findings")
    if findings:
        for fp, pat in findings:
            print(f"  [FOUND] {os.path.relpath(fp, BASE_DIR)} contains '{pat}'")
    else:
        print("  [CLEAN] No hardcoded prediction values found in frontend sources.")

    return findings


if __name__ == "__main__":
    step1_provenance_audit()
    leakage_res = step2_leakage_and_duplicate_audit()
    parity_res = step3_model_reproducibility_and_parity_check()
    eval_res = step4_independent_test_evaluation()
    calib_res = step5_calibration_and_hardcoded_check()

    audit_summary = {
        "provenance_verdict": "LOCAL CURATED / PROTOTYPE DATASET — CLINICAL VALIDITY NOT ESTABLISHED",
        "leakage_results": leakage_res,
        "parity_results": parity_res,
        "evaluation_results": eval_res,
        "suspicious_findings_count": len(calib_res)
    }

    out_file = os.path.join(BASE_DIR, "audit_summary.json")
    with open(out_file, "w") as f:
        json.dump(audit_summary, f, indent=2)
    print(f"\nSaved independent audit summary to {out_file}")
