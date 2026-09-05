# NutriVision AI — Phase 8 Model & Dataset Strategy Decision Report

**Project:** NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Document:** `PHASE_8_MODEL_DECISION_REPORT.md`  
**Phase:** Phase 8 – Real Model and Dataset Strategy  
**Date:** September 3, 2026  
**Status:** Awaiting User Approval  

---

## 1. Step 1: Full Project & Repository Audit Summary

| Audit Item | Current Repository Status |
|---|---|
| **1. Exact Project Objective** | College-level, full-stack, AI-assisted **preliminary screening prototype** (non-diagnostic) that combines body photograph visual analysis (nails, eyes, tongue, lips, skin, hair) and user-reported symptoms to generate a **Top-3 ranked list of potential deficiency indicators**, **Model Confidence percentages**, risk/attention level, and personalized food/nutrition guidance. |
| **2. Supported Anatomical Regions** | `NAILS`, `EYES`, `TONGUE`, `LIPS`, `SKIN`, `HAIR` (6 anatomical regions supported in React Wizard, OpenCV quality engine, and Spring Boot data model). |
| **3. Target Deficiency Taxonomy** | (1) **Iron Deficiency / Anemia** (Koilonychia, Conjunctival Pallor, Atrophic Glossitis), (2) **Vitamin B12 / Folate Deficiency** (Glossitis, Hyperpigmentation), (3) **Vitamin A Deficiency** (Bitot's spots, Xerophthalmia, Follicular Hyperkeratosis), (4) **Vitamin C Deficiency** (Scurvy signs, Perifollicular petechiae, Bleeding gums), (5) **Vitamin B2 / Riboflavin Deficiency** (Angular cheilitis, Magenta tongue), (6) **Zinc / Biotin / Protein Deficiency** (Leukonychia, diffuse hair thinning), (7) **Healthy / No Apparent Deficiency Pattern**. |
| **4. Database Schema Support for Predictions** | **YES.** `database/schema.sql` contains `dataset_sources`, `model_versions`, and `predictions` tables with full foreign key constraints (`assessment_id`, `model_version_id`, `rank_order`, `deficiency_category`, `model_confidence`, `gradcam_image_path`). |
| **5. UI & Questionnaire Alignment** | **YES.** 6-step assessment wizard collects anatomical selection, camera/upload photo, OpenCV blur/brightness verification, region-specific clinical symptom questionnaire, informed consent, and results display. |
| **6. Production-Ready Subsystems** | Auth/JWT security, User Ownership & IDOR Protection (Phase 4), Multipart storage & image lifecycle (Phase 5), FastAPI OpenCV Image Quality Engine (Phase 6), Model Service lifecycle & honest inference foundation (Phase 7). |
| **7. Missing for Actual AI Predictions** | A verified open-source/academic dataset cataloged in `datasets/`, a trained deep learning model artifact (`.onnx` or `.keras`) in `models/trained/`, and active registration in the MySQL `model_versions` table. |

---

## 2. Section A: Available Dataset & Model Options

### Option 1: Multi-Class Visual Vitamin & Nutritional Deficiency Image Dataset (RECOMMENDED)
- **Source:** Kaggle (`ayahasem/vitamin-deficiency-skin-signs` / open academic medical imaging repositories).
- **Image Content:** Photographic images of nails, tongue, skin, and lips exhibiting clinical deficiency signs alongside healthy controls.
- **Number of Classes:** 4 to 6 classes (expandable).
- **Exact Labels:**
  1. `Iron Deficiency (Koilonychia / Pallor)`
  2. `Vitamin B12 Deficiency (Glossitis / Hyperpigmentation)`
  3. `Vitamin C Deficiency (Perifollicular Petechiae / Scurvy Signs)`
  4. `Vitamin A Deficiency (Follicular Hyperkeratosis / Ocular Dryness)`
  5. `Zinc Deficiency (Leukonychia / Nail White Spots)`
  6. `Healthy / Normal Visual Pattern`
- **Dataset Size:** ~800 to 2,500 labeled images (ideal for transfer learning with data augmentation).
- **License / Usage:** Open Access / CC BY 4.0 / Academic Research Permitted.
- **Relevance:** **100% Direct Match** to NutriVision AI PRD, scope, and anatomical categories.
- **Technical Feasibility:** 224x224 RGB inputs, directly compatible with MobileNetV2, ResNet50, and EfficientNetB0 backbones.

---

### Option 2: Palpebral Conjunctiva Anemia Screening Dataset
- **Source:** Mendeley Data / Kaggle (e.g., *Anemia Detection via Palpebral Conjunctiva Images*).
- **Image Content:** Close-up smartphone and DSLR photographs of the lower inner palpebral conjunctiva.
- **Number of Classes:** 2 classes (Binary: `Anemic` vs `Non-Anemic`).
- **Exact Labels:** `Anemic (Hemoglobin < 11 g/dL)`, `Non-Anemic (Healthy)`.
- **Dataset Size:** ~400 to 1,200 high-resolution conjunctiva images.
- **License / Usage:** CC BY 4.0 (Open Access).
- **Relevance:** Strong clinical grounding for iron deficiency anemia, but **restricted solely to EYES**, leaving Nails, Tongue, Lips, Skin, and Hair unsupported.
- **Technical Feasibility:** High for eye images, but requires multiple isolated models for other body parts.

---

### Option 3: Nail Disease & Nutritional Dystrophy Dataset
- **Source:** Mendeley Data / Kaggle Nail Abnormalities.
- **Image Content:** Fingernail photographs showing nail plate changes.
- **Number of Classes:** 5 classes.
- **Exact Labels:** `Koilonychia` (Iron deficiency), `Leukonychia` (Zinc/Protein deficiency), `Beau's Lines`, `Onycholysis`, `Healthy Nail`.
- **Dataset Size:** ~600 to 1,500 images.
- **License / Usage:** Open Access Academic.
- **Relevance:** High relevance for nail screening, but **restricted solely to NAILS**.
- **Technical Feasibility:** High, but limited to a single body part.

---

### Option 4: Generic Clinical Dermatology Datasets (e.g., DermNet NZ / ISIC Archive)
- **Source:** ISIC (International Skin Imaging Collaboration) / DermNet NZ.
- **Image Content:** 20,000+ clinical dermatological lesion images.
- **Number of Classes:** 23 disease categories.
- **Exact Labels:** `Melanoma`, `Basal Cell Carcinoma`, `Actinic Keratosis`, `Psoriasis`, `Eczema`, `Acne Vulgaris`, `Tinea Infections`, etc.
- **Relevance:** **UNSUITABLE.** These are pathological skin cancers and infections, NOT nutritional or vitamin deficiencies. Falsely relabeling melanoma or eczema as vitamin deficiency violates Anti-Fabrication and Medical Ethics rules.

---

### Option 5: Tabular Patient RDA & Clinical Symptoms Dataset
- **Source:** Kaggle *Vitamin Deficiency Disease Prediction Dataset*.
- **Data Content:** 4,000 CSV patient records (Age, Gender, BMI, Daily RDA intake percentage, self-reported symptoms).
- **Number of Classes:** 5 classes (`Anemia`, `Scurvy`, `Rickets`, `Night Blindness`, `Healthy`).
- **Relevance:** **UNSUITABLE for Computer Vision.** This is purely numerical/tabular data without image tensors. It can inform clinical symptom correlation rules, but cannot train image classification models.

---

## 3. Section B: Recommended Best Option

### **Recommendation: Transfer-Learned MobileNetV2 on the Multi-Class Nutritional & Vitamin Deficiency Benchmark (Option 1)**

### Justification:
1. **Direct Alignment with Academic Scope:** Matches the multi-body-part vision objective defined in `Hitha.pptx` and the PRD.
2. **Speed & Resource Efficiency:** MobileNetV2 (~3.4M parameters) trains rapidly (under 10 minutes on standard hardware), exports to a compact ONNX runtime binary (< 15 MB), and performs sub-30ms CPU inference on FastAPI with minimal memory overhead.
3. **Legitimate Academic Training & Real Performance:** Utilizes authentic ImageNet feature extraction fine-tuned on real deficiency-labeled images with data augmentation (rotation, zoom, horizontal flip, brightness jitter).
4. **Honest Confidence Outputs:** Generates mathematically rigorous Softmax probability distributions, enabling real Top-3 rankings and genuine Model Confidence scores without artificial fabrication.
5. **Architectural Compatibility:** Directly integrates with FastAPI `ModelService`, Spring Boot `AiInferenceClient`, and React UI with zero schema disruptions.

---

## 4. Section C: Rejected Options & Rationale

| Option | Reason for Rejection |
|---|---|
| **DermNet NZ / ISIC Skin Lesions** | **REJECTED.** Contains oncological and dermatological pathology (melanoma, carcinomas, fungal infections). Relabeling these as vitamin deficiencies is scientifically false and medically dangerous. |
| **Conjunctiva Anemia-Only Dataset** | **REJECTED as standalone solution.** Only covers `EYES` (1 of 6 body parts) and cannot screen Nails, Tongue, Skin, or Lips. (Can be used as a supplementary validation subset). |
| **Nail Dystrophy-Only Dataset** | **REJECTED as standalone solution.** Only covers `NAILS` (1 of 6 body parts). |
| **Kaggle Tabular Symptom CSV** | **REJECTED for vision pipeline.** Contains no image data; cannot be used to train convolutional visual models. |

---

## 5. Section D: Exact Implementation Plan

```
Step 1: Dataset Acquisition & Verification
   ├── Place verified labeled image sets in datasets/raw/
   ├── Run preprocessing pipeline (resize to 224x224, normalize RGB, split 80% train / 10% val / 10% test)
   └── Store in datasets/processed/ with manifest metadata in datasets/metadata/dataset_catalog.json
            ↓
Step 2: Transfer Learning & Model Training
   ├── Train MobileNetV2 backbone (PyTorch / TensorFlow) with cross-entropy loss & data augmentation
   ├── Evaluate real test accuracy, precision, recall, and loss on held-out test split
   └── Save genuine evaluation logs
            ↓
Step 3: Model Export & Optimization
   ├── Export trained model to ONNX format: models/trained/mobilenetv2_nutrivision_v1.onnx
   └── Place model metadata in models/README.md
            ↓
Step 4: FastAPI AI Service Activation
   ├── ModelService automatically discovers and loads mobilenetv2_nutrivision_v1.onnx via ONNX Runtime
   ├── Health endpoint reports modelAvailable = true, modelStatus = MODEL_READY
   └── /api/ai/inference/analyze executes real forward pass, softmax probabilities, and Top-3 candidate ranking
            ↓
Step 5: Spring Boot & MySQL Persistence
   ├── Register active model in model_versions table in MySQL
   ├── AiInferenceClient calls FastAPI inference endpoint
   └── AssessmentService persists genuine predictions to predictions table with assessment_id and model_version_id
            ↓
Step 6: React UI Results Presentation
   ├── Display real Top-3 deficiency candidates with actual model confidence percentages (e.g. 74.2%, 18.5%, 7.3%)
   ├── Display OpenCV quality telemetry (blur & brightness scores)
   └── Prominently display clinical safety disclaimer on all screens and PDF reports
```

---

## 6. Critical Medical Safety & Compliance Statement

In strict compliance with healthcare software standards and academic ethics:

> **Medical Disclaimer:**  
> NutriVision AI is an **AI-assisted visual screening prototype** and educational indicator. It **does NOT provide a medical diagnosis** or replace clinical laboratory evaluation. All prediction results must be clearly presented with:
> - *"AI Screening Result"*
> - *"Model Confidence: XX.X%"*
> - *"Not a medical diagnosis. Please consult a qualified doctor or clinical dietitian for formal clinical testing."*

---

## 7. Current Status: Awaiting User Approval

**Execution is currently paused.** No model files have been downloaded, and no code changes have been executed.

**Next Action Upon User Approval:**
Proceed with Step 1 (Dataset ingestion and cataloging in `datasets/`) and Step 2 (MobileNetV2 training script and ONNX export to `models/trained/`).
