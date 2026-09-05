# NutriVision AI — Comprehensive Technical Viva & Examiner Guide

**Project Title:** NutriVision AI — AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Evaluation Scope:** Final Year Capstone / College Examination & Technical Viva Readiness  
**Target Level:** Engineering Examiners, Academic Reviewers & Technical Evaluators  

---

## 1. What problem does NutriVision AI solve?
NutriVision AI addresses the global challenge of **"hidden hunger" (micronutrient malnutrition)**, which affects over 2 billion people worldwide. Micronutrient deficiencies (such as Iron, Vitamin A, Vitamin B12, Vitamin C, Vitamin D, and Zinc) often exhibit subtle physical manifestations on the nails, eyes, tongue, skin, lips, and hair (e.g., Koilonychia, Bitot's spots, Atrophic Glossitis, Follicular Hyperkeratosis) before progressing to severe clinical complications.  
Because clinical blood serum assays are invasive, costly, and geographically scarce in rural/underserved communities, NutriVision AI provides an **accessible, non-invasive digital screening prototype** that flags possible visual patterns, estimates mathematical classification probabilities, and offers localized dietary guidance to prompt timely professional medical consultations.

---

## 2. Why did you choose this project?
1. **High Societal & Public Health Impact:** Micronutrient deficiencies disproportionately affect children and pregnant women; non-invasive early awareness can prevent irreversible developmental damage.
2. **Cross-Disciplinary Technical Complexity:** Integrates Computer Vision (OpenCV), Deep Learning (MobileNetV2 CNNs), Microservice Architecture (Spring Boot & FastAPI), Relational Data Modeling (MySQL 8), and Modern Web Engineering (React + TypeScript).
3. **Ethical AI Focus:** Rather than making opaque or hazardous diagnostic claims, it demonstrates how responsible engineering principles (quality gates, top-3 probabilities, medical disclaimers, dietary bio-synergy) should be constructed.

---

## 3. Why React?
- **Component-Driven Reusability:** Modular component hierarchy (`Card`, `Badge`, `PageHeader`, `AssessmentReportModal`, `EmptyState`) ensures a consistent, maintainable UI.
- **Strict Type Safety with TypeScript:** Prevents runtime errors across complex multi-tier data structures (inference responses, quality scores, food matrices).
- **Virtual DOM & Reactive State:** Fast rendering during multi-step camera capture, interactive live demo pipelines, and dynamic filter changes (Vegetarian/Vegan/Regional).
- **Vite Tooling:** Rapid Hot Module Replacement (HMR) and optimized static production bundling.

---

## 4. Why Spring Boot?
- **Enterprise-Grade Architecture:** Spring Boot 3 provides robust dependency injection, inversion of control (IoC), and declarative transaction management (`@Transactional`).
- **Security & Access Control:** Spring Security 6 with stateless JWT Bearer token authentication, BCrypt password hashing, and custom authorization filters.
- **Reliable Persistence:** Spring Data JPA with Hibernate ORM simplifies repository queries, schema migrations, and relational integrity.
- **Clean Gateway Pattern:** Acts as the secure backend facade that coordinates file uploads, ownership authorization, database storage, and dispatch to the downstream AI microservice.

---

## 5. Why FastAPI?
- **Asynchronous High Throughput:** Built on Starlette and ASGI with `uvicorn`, enabling concurrent request handling for compute-heavy tasks.
- **Native Machine Learning Ecosystem:** Python is the standard language for OpenCV and ONNX Runtime; FastAPI provides sub-millisecond overhead for ML inference endpoints.
- **Pydantic Schema Validation:** Enforces strict request/response data contracts and auto-generates interactive OpenAPI documentation (`/docs`).

---

## 6. Why Microservices?
- **Separation of Concerns:** Business logic, user authentication, and transaction management belong in the enterprise Spring Boot backend, while raw computer vision and tensor algebra belong in the Python AI service.
- **Independent Scalability:** If inference volume spikes, the AI service can be scaled horizontally on GPU/CPU clusters without replicating the relational database backend.
- **Technology Heterogeneity:** Leverages the best language for each layer (Java for secure enterprise backend; Python for computer vision and deep learning).

---

## 7. Why OpenCV?
- **Automated Quality Gate:** Evaluates images *before* running neural network inference to avoid the "garbage-in, garbage-out" pitfall.
- **Sharpness Measurement:** Uses the **Laplacian Variance algorithm** ($\sigma^2(\nabla^2 I)$). Blurry images have low second-derivative variance (< 50.0) and are flagged or rejected.
- **Illumination Validation:** Converts images to grayscale and calculates mean pixel intensity to catch underexposed (< 40.0) or overexposed (> 220.0) photographs.

---

## 8. What is MobileNetV2?
- **Efficient Deep Learning Architecture:** Designed specifically for mobile and edge computing with low parameter count (~3.5M parameters).
- **Inverted Residual Blocks & Linear Bottlenecks:** Uses depthwise separable convolutions (which factorize standard convolution into depthwise and pointwise stages), reducing computational complexity by 8–9x while preserving representative feature capacity.
- **ImageNet Transfer Learning:** Pretrained convolutional feature extractor fine-tuned for multi-class visual pattern classification.

---

## 9. Why ONNX (Open Neural Network Exchange)?
- **Cross-Platform Interoperability:** Decouples model training (PyTorch) from production deployment.
- **High-Performance Inference:** ONNX Runtime provides optimized C++ graph execution, layer fusion, and hardware acceleration on standard CPUs without requiring heavy PyTorch/CUDA runtime dependencies.
- **Small Footprint:** Our serialized ONNX model file is only **8.49 MB**, making deployment fast and lightweight.

---

## 10. What is Softmax?
Softmax is the standard activation function applied to the final dense output layer of a multi-class neural network. It transforms raw real-valued output logits ($z_1, z_2, \dots, z_K$) into a valid probability distribution over $K$ mutually exclusive categories:
$$\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^K e^{z_j}}$$
Properties:
1. Each output $\sigma(z)_i \in (0, 1)$.
2. The sum of all class probabilities equals exactly $1.0$ ($\sum \sigma(z)_i = 1$).

---

## 11. What does confidence mean?
In NutriVision AI, **confidence means Model Classification Probability**—the mathematical Softmax score generated by the neural network on the current input tensor relative to the benchmark dataset.  
**It does NOT mean clinical medical certainty.** A 98% confidence score simply indicates that the visual features of the photograph closely match the learned morphological patterns of that category in the training dataset.

---

## 12. How does image quality detection work?
1. **Input:** The uploaded image bytes are decoded into an OpenCV BGR matrix.
2. **Sharpness Evaluation:**
   - Image is converted to single-channel 8-bit grayscale.
   - The Laplacian operator is applied: $L(x, y) = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}$.
   - The variance of $L(x, y)$ is calculated. Sharp edges produce high variance; blurred edges produce low variance.
   - **Threshold:** Variance $\ge 50.0$ = `PASSED`; $< 50.0$ = `REJECTED` (Blurry).
3. **Illumination Evaluation:**
   - Mean grayscale pixel intensity $\mu$ is computed.
   - **Range:** $40.0 \le \mu \le 220.0$ = `PASSED`; $\mu < 40.0$ = `REJECTED` (Too Dark); $\mu > 220.0$ = `REJECTED` (Overexposed).

---

## 13. How does the nutrition engine work?
1. **Rule-Based Mapping:** The Top-1 predicted screening category (e.g., `Iron_Deficiency`, `Vitamin_B12_Deficiency`) links to the `nutrient_guidance` table in MySQL.
2. **Food Item Retrieval:** Queries the `food_items` relational table (containing 33+ seeded Indian & South Indian whole foods like drumstick leaves, curry leaves, amla, ragi, lentils, and fortified grains).
3. **Diet & Region Filtering:** Applies SQL filters for user dietary preferences (`VEGETARIAN`, `VEGAN`, `NON_VEGETARIAN`) and geographical regions (`SOUTH_INDIAN`, `INDIAN`).
4. **Bio-Synergy Advisory:** Surfaces biochemical absorption tips (e.g., pairing non-heme Iron with Vitamin C; avoiding tea/coffee tannins near iron-rich meals).

---

## 14. What database tables are used?
1. `users` — User credentials, encrypted passwords, roles, dietary preferences, preferred language.
2. `roles` & `user_roles` — RBAC mapping (`ROLE_USER`, `ROLE_ADMIN`).
3. `user_profiles` — Extended demographic metadata (age, gender, city).
4. `assessments` — Assessment session tracking, target body region, overall status, timestamps.
5. `assessment_images` — Image file paths, UUID storage names, file sizes, OpenCV sharpness & brightness scores, quality verdicts.
6. `nutrient_guidance` — Educational overview, biological importance, synergy absorption notes.
7. `food_items` — Curated foods with nutrient values, regional availability, serving suggestions, and dietary classifications.

---

## 15. What security measures exist?
- **JWT Authentication:** Stateless HMAC-SHA256 signed JSON Web Tokens attached in `Authorization: Bearer <token>` headers.
- **BCrypt Password Hashing:** 10-round salted password hashing for stored credentials.
- **UUID File Storage:** Uploaded files are renamed using secure UUIDs (`assessment_12_b141d287-...jpg`) in isolated per-assessment directory structures to prevent directory traversal and filename collision attacks.
- **Input Validation:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`) on all REST request DTOs.
- **CORS Protection:** Explicit origin and method whitelisting.

---

## 16. What is IDOR and how is it prevented?
**Insecure Direct Object Reference (IDOR)** occurs when an application exposes a direct reference to an internal database object (such as `/api/assessments/12`) without verifying whether the requesting user owns that object.  
**Prevention in NutriVision AI:**  
In `AssessmentService.java`, every access method calls `verifyOwnershipOrAdmin(currentUser, assessment)`:
```java
boolean isOwner = assessment.getUser().getUserId().equals(user.getUserId());
boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getRoleName() == RoleName.ROLE_ADMIN);
if (!isOwner && !isAdmin) {
    throw new AccessDeniedException("Access Denied: You do not have permission to access assessment #" + assessmentId);
}
```
If User A attempts to view or delete User B's assessment or photographs, the backend immediately throws a `403 Forbidden` response.

---

## 17. What are the limitations of the model?
1. **Synthetic Prototype Dataset:** The model was trained on a synthesized prototype dataset that models classical textbook morphological features. It has not been trained on hospital clinical cohorts.
2. **Visual Overlap:** Certain visual signs (e.g., fatigue pallor or dry skin) can arise from multiple unrelated deficiencies or non-nutritional dermatological conditions.
3. **No Blood Biomarker Direct Sensing:** External visual screening cannot measure exact serum ferritin or serum cobalamin levels.

---

## 18. Why is this not a medical diagnosis?
Medical diagnosis requires comprehensive clinical history, physical doctor palpation, differential diagnosis, and laboratory blood tests. NutriVision AI is an **educational screening prototype** that identifies visual pattern correlations to facilitate early awareness and prompt professional clinical follow-up. It does not prescribe medications, diagnose diseases, or replace physicians.

---

## 19. What improvements would be made with a clinical dataset?
1. **Multi-Center Clinical Trials:** Collecting ethically consented clinical patient photographs across diverse Fitzpatrick skin types, ages, and genders.
2. **Laboratory Ground Truth Labeling:** Ground-truth labels verified against standard biochemical blood assays (Serum Ferritin, CBC, 25-OH-D, Serum B12).
3. **Uncertainty Calibration:** Implementing temperature scaling and Monte Carlo Dropout for well-calibrated confidence intervals.
4. **Clinician-in-the-Loop Feedback:** Real-time doctor verification portal for continuous active learning and validation.

---

## 20. Explain the complete architecture end-to-end.
```
[User Browser / Camera Capture]
         │
         ▼
[React 18 + TypeScript Frontend (Port 5173)]
         │
         │  HTTP REST (Axios) + JWT Bearer
         ▼
[Spring Boot 3 API Gateway (Port 8080)]
   ├── Security Filter & IDOR Ownership Gate
   ├── FileStorageService (UUID Disk Storage)
   ├── AssessmentService & NutritionService
   │     │
   │     ├──► [MySQL 8 Relational Database (Port 3306)]
   │     │     (Users, Assessments, Images, Food Guidance)
   │     │
   │     └──► [FastAPI AI Microservice (Port 8000)]
   │             ├── OpenCV Image Quality Gate (Laplacian Blur & Illumination)
   │             └── MobileNetV2 ONNX Runtime Engine (224x224x3 Tensor Norm $\to$ Softmax)
   ▼
[JSON Results: Quality Verdict + Top-3 Predictions + Diet-Filtered Food Guidance]
   │
   ▼
[React UI: Assessment Detail, Printable PDF Report & 7-Day Meal Plan]
```
