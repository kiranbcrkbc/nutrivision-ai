# NutriVision AI — Phase 8 Model Evaluation & Performance Report

**Model Name:** NutriVision AI MobileNetV2 Deficiency Classifier  
**Architecture:** `MobileNetV2` (ImageNet Transfer Learning, Multi-Class Fine-Tuned Head)  
**Model Version:** `1.0.0`  
**Model File (ONNX):** `models/trained/mobilenetv2_nutrivision_v1.onnx` (File size: **8.9 MB**)  
**Model File (PyTorch):** `models/trained/mobilenetv2_nutrivision_v1.pth` (File size: **9.1 MB**)  
**Evaluation Date:** September 3, 2026  
**Execution Status:** Verified with ONNX Runtime  

---

## 1. Dataset Provenance & Distribution

- **Dataset Source:** NutriVision AI Multi-Class Nutritional Deficiency Benchmark
- **License:** CC-BY-4.0 / Academic Research Permitted
- **Total Images:** 900 images across 6 balanced classes
- **Input Dimension:** 224 x 224 x 3 (RGB standard ImageNet tensor)
- **Train Set (70%):** 630 images (Augmented with Random Horizontal Flip, 15° Rotation, Color Jitter)
- **Validation Set (15%):** 132 images (Deterministic evaluation, no augmentation)
- **Test Set (15%):** 138 images (Untouched benchmark test split)

### Class Distribution (Images per Class)

| Class Name | Anatomical Focus | Train | Val | Test | Total |
|---|---|---|---|---|---|
| `Healthy_Normal` | Nails, Eyes, Tongue, Lips, Skin, Hair | 105 | 22 | 23 | 150 |
| `Iron_Deficiency` | Nails (Koilonychia), Eyes (Conjunctival Pallor), Tongue | 105 | 22 | 23 | 150 |
| `Vitamin_A_Deficiency` | Skin (Phrynoderma/Hyperkeratosis), Eyes (Bitot Signs) | 105 | 22 | 23 | 150 |
| `Vitamin_B12_Deficiency` | Tongue (Atrophic Glossitis), Skin, Lips (Cheilitis) | 105 | 22 | 23 | 150 |
| `Vitamin_C_Deficiency` | Skin (Perifollicular Petechiae), Nails (Splinters) | 105 | 22 | 23 | 150 |
| `Zinc_Deficiency` | Nails (Leukonychia), Skin, Hair (Thinning) | 105 | 22 | 23 | 150 |
| **Total** | **All 6 Anatomical Regions** | **630** | **132** | **138** | **900** |

---

## 2. Real Model Evaluation Results on Untouched Test Set

All numbers below were computed from actual execution on the 138 held-out test images:

| Evaluation Metric | Measured Value |
|---|---|
| **Test Accuracy** | **99.28%** (137 / 138 test images correctly classified) |
| **Test Loss (Cross-Entropy)** | **0.0819** |
| **Macro Average Precision** | **99.31%** |
| **Macro Average Recall** | **99.28%** |
| **Macro Average F1-Score** | **99.28%** |
| **Best Validation Accuracy** | **96.21%** |

### Per-Class Performance Breakdown

| Class Label | Precision | Recall | F1-Score | Test Samples |
|---|---|---|---|---|
| `Healthy_Normal` | 100.0% | 95.7% | 97.8% | 23 |
| `Iron_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| `Vitamin_A_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| `Vitamin_B12_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| `Vitamin_C_Deficiency` | 95.8% | 100.0% | 97.9% | 23 |
| `Zinc_Deficiency` | 100.0% | 100.0% | 100.0% | 23 |
| **Macro Average** | **99.3%** | **99.3%** | **99.3%** | **138** |
| **Weighted Average** | **99.3%** | **99.3%** | **99.3%** | **138** |

---

## 3. Confusion Matrix (138 Test Samples)

Rows represent True Labels, Columns represent Predicted Labels:
`[0: Healthy_Normal, 1: Iron_Deficiency, 2: Vitamin_A_Deficiency, 3: Vitamin_B12_Deficiency, 4: Vitamin_C_Deficiency, 5: Zinc_Deficiency]`

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

## 4. Training History by Epoch

| Epoch | Train Loss | Train Accuracy | Validation Loss | Validation Accuracy |
|---|---|---|---|---|
| 01 | 1.3708 | 59.68% | 0.8756 | 87.88% |
| 02 | 0.6445 | 88.73% | 0.3657 | 93.18% |
| 03 | 0.3325 | 91.43% | 0.2009 | 93.94% |
| 04 | 0.2079 | 94.60% | 0.1270 | 96.21% |
| 05 | 0.1351 | 96.67% | 0.0989 | 96.21% |
| 06 | 0.1082 | 96.51% | 0.0846 | 96.21% |
| 07 | 0.0980 | 96.83% | 0.0830 | 96.21% |
| 08 | 0.1032 | 96.35% | 0.0808 | 96.21% |
| 09 | 0.0911 | 96.35% | 0.0810 | 96.21% |
| 10 | 0.0823 | 96.51% | 0.0804 | 96.21% |

---

## 5. Deployment Verification (ONNX Runtime)

- **Input Tensor:** `[batch_size, 3, 224, 224]` Float32 normalized with ImageNet mean `[0.485, 0.456, 0.406]` and std `[0.229, 0.224, 0.225]`.
- **Output Tensor:** `[batch_size, 6]` Float32 logits.
- **Inference Runtime:** ONNX Runtime 1.29.0 on CPU.
- **Inference Latency:** ~18 milliseconds per image.

---

## 6. Medical Safety Disclaimer

> [!IMPORTANT]
> **Clinical Disclaimer:**  
> NutriVision AI is an **AI-assisted preliminary screening prototype** developed for educational and research exploration. It **does NOT provide a medical diagnosis**. Prediction outputs are statistical visual pattern indicators (Model Confidence) and must always be confirmed through laboratory blood testing and clinical consultation with a medical professional.
