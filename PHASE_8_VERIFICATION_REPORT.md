# Phase 8 Independent Verification and Reproducibility Audit Report

**System:** NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Audit Type:** Strict Independent Reproducibility & Provenance Verification  
**Audit Date:** September 3, 2026  
**Auditor:** Independent Automated Verification Engine  
**Final Project Status Verdict:** **FUNCTIONALLY WORKING BUT DATASET CLINICAL VALIDITY NOT ESTABLISHED**

---

## 1. Dataset Provenance & Authenticity Verdict

| Audit Check | Finding | Status |
|---|---|---|
| **Claimed Dataset Name** | `NutriVision AI Multi-Class Nutritional Deficiency Benchmark` | Defined in `datasets/metadata/dataset_catalog.json` |
| **Exact Image Origin** | **Programmatically Generated** via `scripts/prepare_dataset.py` using clinical morphological parameterization | **Synthesized Prototype Data** |
| **External Source URL** | None (No hospital, clinical trial, or external PACS images downloaded) | N/A |
| **Class Authenticity** | 6 classes parameterized from medical textbooks (koilonychia, Bitot spots, atrophic glossitis, petechiae, leukonychia, healthy tissue) | Synthesized Prototype Patterns |
| **Dataset Provenance Verdict** | **LOCAL CURATED / PROTOTYPE DATASET — CLINICAL VALIDITY NOT ESTABLISHED** | **Documented & Flagged** |

> [!IMPORTANT]
> **Clinical Dataset Provenance Notice:**  
> The 900 images in the dataset were generated locally using clinical feature parameterization (HSV skin tone distributions, elliptical nail plates, crescent lunulae, follicular hyperkeratosis, petechial clusters, depapillated lingual erythema) to establish an end-to-end technical pipeline. **They are not clinical patient photographs**. The system is strictly an educational screening prototype.

---

## 2. Data Leakage & Duplicate Audit Results

Strict hash checks (SHA-256 and MD5) were performed across all 900 images in `datasets/processed/`:

| Metric | Measured Value | Threshold / Expected | Result |
|---|---|---|---|
| **Total Processed Images** | **900** (630 Train, 132 Val, 138 Test) | 900 balanced | **VERIFIED** |
| **Unique Image Hashes** | **900 / 900 (100% unique)** | 900 unique | **VERIFIED** |
| **Train / Test Exact Duplicates** | **0** | 0 | **PASSED (No Leakage)** |
| **Train / Validation Duplicates** | **0** | 0 | **PASSED (No Leakage)** |
| **Validation / Test Duplicates** | **0** | 0 | **PASSED (No Leakage)** |
| **Data Augmentation Isolation** | Applied **ONLY** during `train` phase (`RandomHorizontalFlip`, `RandomRotation(15°)`, `ColorJitter`) | Val and Test untouched | **PASSED** |
| **Test Set Integrity** | Preprocessed to standard $224\times 224$ RGB with ImageNet normalization without augmentation | Untouched benchmark split | **PASSED** |

---

## 3. Independent Model Reproducibility & Parity Check

We loaded both the PyTorch checkpoint (`.pth`) and the ONNX model (`.onnx`) and evaluated them on test samples from all 6 classes:

| Class Label | PyTorch Prediction (Prob) | ONNX Prediction (Prob) | Max Logit Absolute Difference | Parity Status |
|---|---|---|---|---|
| `Healthy_Normal` | `Healthy_Normal` (50.0%) | `Healthy_Normal` (50.0%) | $3.34\times 10^{-6}$ | **MATCH (100%)** |
| `Iron_Deficiency` | `Iron_Deficiency` (95.2%) | `Iron_Deficiency` (95.2%) | $4.77\times 10^{-6}$ | **MATCH (100%)** |
| `Vitamin_A_Deficiency` | `Vitamin_A_Deficiency` (87.0%) | `Vitamin_A_Deficiency` (87.0%) | $1.67\times 10^{-6}$ | **MATCH (100%)** |
| `Vitamin_B12_Deficiency` | `Vitamin_B12_Deficiency` (95.0%) | `Vitamin_B12_Deficiency` (95.0%) | $6.91\times 10^{-6}$ | **MATCH (100%)** |
| `Vitamin_C_Deficiency` | `Vitamin_C_Deficiency` (64.8%) | `Vitamin_C_Deficiency` (64.8%) | $1.85\times 10^{-6}$ | **MATCH (100%)** |
| `Zinc_Deficiency` | `Zinc_Deficiency` (96.9%) | `Zinc_Deficiency` (96.9%) | $1.79\times 10^{-6}$ | **MATCH (100%)** |

- **Total Test Sample Parity:** **6 / 6 (100.0%)**
- **Maximum Logit Difference:** **$6.91\times 10^{-6}$** (well below the $1.0\times 10^{-3}$ threshold)
- **Model Files Verified on Disk:**
  - `models/trained/mobilenetv2_nutrivision_v1.onnx` (**8.49 MB**)
  - `models/trained/mobilenetv2_nutrivision_v1.pth` (**8.75 MB**)
  - `models/trained/model_metadata.json` (**3.65 KB**)

---

## 4. Fresh Independent Test Evaluation Metrics

An independent test evaluation script (`scripts/independent_audit_phase8.py`) ran a fresh forward pass over all 138 test images:

| Metric | Previously Reported | Independently Reproduced | Delta |
|---|---|---|---|
| **Test Accuracy** | 99.28% | **99.28%** (137/138) | $\pm 0.00\%$ |
| **Test Cross-Entropy Loss** | 0.0819 | **0.0819** | $\pm 0.0000$ |
| **Macro F1 Score** | 99.28% | **99.28%** | $\pm 0.00\%$ |
| **Macro Precision** | 99.31% | **99.31%** | $\pm 0.00\%$ |
| **Macro Recall** | 99.28% | **99.28%** | $\pm 0.00\%$ |

### Fresh Per-Class Performance

| Class Label | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| `Healthy_Normal` | 100.0% | 95.7% | 97.8% | 23 |
| `Iron_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| `Vitamin_A_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| `Vitamin_B12_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| `Vitamin_C_Deficiency` | 95.8% | 100.0% | 97.9% | 23 |
| `Zinc_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |

### Fresh Confusion Matrix ($6\times 6$)
```text
               Pred: 0   1   2   3   4   5
True: Healthy    [ 22,  0,  0,  0,  1,  0 ]
True: Iron       [  0, 23,  0,  0,  0,  0 ]
True: Vit A      [  0,  0, 23,  0,  0,  0 ]
True: Vit B12    [  0,  0,  0, 23,  0,  0 ]
True: Vit C      [  0,  0,  0,  0, 23,  0 ]
True: Zinc       [  0,  0,  0,  0,  0, 23 ]
```

---

## 5. Confidence, Softmax Calibration & Hardcoded Values Audit

1. **Softmax Calibration:**
   - Raw ONNX model logits are exponentiated and normalized with $\text{Softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}$.
   - Top-3 probabilities strictly sum to $\le 1.0$, sorted in descending order ($p_1 \ge p_2 \ge p_3$).
2. **Codebase Grep Audit:**
   - No hardcoded deficiency predictions in assessment pages.
   - `LandingPage.tsx` demonstration card was updated with explicit wording:  
     *"Demonstration Preview UI — Model confidence reflects visual classification probability and does not represent medical certainty."*
3. **Medical Disclaimer Enforcement:**
   - All assessment and results screens display prominent non-diagnostic screening notices.

---

## 6. End-to-End System & Architecture Integration

```
[React Frontend] (Port 5173 / Production Build)
       │
       ▼ (REST API / Multipart Upload)
[Spring Boot Backend] (Port 8080 - AssessmentService)
       │
       ▼ (HTTP / Multipart Proxy)
[FastAPI AI Service] (Port 8000 - /api/ai/inference/analyze)
       │
       ├─► [OpenCV Quality Engine] (Sharpness >= 100, Luminance 40-220)
       │         │
       │         └─► Blurry / Dark Image ──► REJECTED (No Model Inference)
       │
       └─► [Real ONNX MobileNetV2] (mobilenetv2_nutrivision_v1.onnx)
                 │
                 └─► Top-3 Softmax Probabilities & Pattern Descriptions
```

### Verification Checks Executed
- `tests/test_phase8_inference.py`: **PASSED (100%)**
- `tests/verify_phase8_e2e.py`: **PASSED (100%)**
- `scripts/independent_audit_phase8.py`: **PASSED (100%)**
- Backend Tests: `mvn test` $\rightarrow$ **BUILD SUCCESS**
- Frontend Production Build: `npm run build` $\rightarrow$ **Built in 54.70s (0 errors)**

---

## 7. Final Honest Status Verdict

### **VERDICT: B. FUNCTIONALLY WORKING BUT DATASET CLINICAL VALIDITY NOT VERIFIED**

* **Summary:** The end-to-end technical machine learning pipeline, OpenCV image quality gating, ONNX Runtime inference, Spring Boot backend, and React UI are **100% functionally working, mathematically consistent, reproducible, and free of data leakage**. However, because the dataset was generated programmatically from clinical morphological specifications rather than collected from clinical patient trials, its **clinical diagnostic validity is not established**. The system correctly operates as an **educational preliminary screening prototype**.
