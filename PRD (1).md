# NutriVision AI
## AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System
### Product Requirements Document (PRD)

---

## 1. Document Information

| Field | Value |
|---|---|
| Project Name | NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System |
| Document Name | Product Requirements Document (PRD.md) |
| Version | 1.0 |
| Date | September 2, 2026 |
| Prepared As | Senior Product Manager / AI-ML Solution Architect / Healthcare Software Requirements Analyst / Technical Documentation Specialist deliverable |
| Document Purpose | To define the complete functional, non-functional, AI/ML, and technical requirements for NutriVision AI, a college-level, full-stack, AI-assisted preliminary vitamin-deficiency indicator and nutrition-guidance web application, based on the uploaded project reference deck (`Hitha.pptx`) and the uploaded 30-feature project scope image. |
| Source Documents | (1) `Hitha.pptx` — "Vitamin Deficiency Identification Using Image Processing" academic project report/deck; (2) Project Scope image — "30 Scope of the Project: AI-Based Vitamin Deficiency Identification System" |

---

## 2. Executive Summary

NutriVision AI is a college-level, full-stack, AI-assisted web application that produces a **preliminary, non-diagnostic assessment** of possible vitamin/nutritional deficiency indicators. It combines (a) image analysis of user-submitted photographs of specific body parts (skin, eyes, tongue, lips, nails, hair, and face where supported), (b) user-reported symptoms, and (c) a trained classification model to generate a **Top-3 ranked list of possible deficiency indicators**, each with a **Model Confidence score**, an associated **risk/attention level**, and **personalized food and nutrition recommendations**. The system also provides health reports, historical tracking, progress trends, an educational chatbot, multilingual/voice accessibility features, and an administrative back office for dataset, model, and user oversight.

The system is explicitly a **research/educational prototype**, not a certified medical device. It must never present its output as a clinical diagnosis, and every result screen and report must carry a medical disclaimer. The uploaded reference PPT reports project outcome claims (e.g., "95% accuracy") from the source academic deck; this PRD treats those as **unverified project claims**, not validated performance guarantees, and requires all real performance numbers to come from actual, documented model evaluation.

The recommended technology stack prioritizes free and open-source tools throughout (React/Vite frontend, Spring Boot backend, FastAPI-based Python AI/ML microservice, MySQL Community Edition database), enabling the system to be built and run entirely without mandatory paid subscriptions.

---

## 3. Product Vision

To give any user, particularly in low-access or rural settings, a free, fast, non-invasive, AI-assisted first indicator of possible vitamin/nutritional deficiency risk from a photograph and a short symptom questionnaire — paired with clear, actionable, personalized nutrition guidance — while always directing the user toward qualified medical professionals for actual diagnosis and treatment.

---

## 4. Problem Statement

Vitamin and nutritional deficiencies are widespread and frequently go undiagnosed until symptoms are severe, because the standard diagnostic pathway (laboratory blood tests, clinical physical examination, dietary questionnaires, specialized functional tests) is:

- **Costly** — lab tests and specialist consultations carry financial barriers.
- **Slow** — long waiting periods for test results and appointments.
- **Inaccessible** — limited laboratory/specialist availability in rural and underserved areas.
- **Subjective / inconsistent** — clinical visual inspection depends on examiner experience, with no permanent record for comparison; dietary questionnaires are prone to recall bias.

There is no free, easily accessible, preliminary screening tool that lets a user get an early, AI-assisted indication of possible deficiency risk from a photo and symptoms, alongside nutrition guidance, before deciding whether formal medical testing is warranted.

---

## 5. Project Goals

1. Provide an accessible, camera/photo-based preliminary screening experience for common vitamin/nutrition deficiency indicators.
2. Combine image-derived visual features with self-reported symptoms to improve preliminary indicator relevance over image analysis alone.
3. Communicate results responsibly — via Model Confidence, Top-3 predictions, and risk levels — without implying medical certainty.
4. Translate results into actionable, personalized food and nutrition guidance.
5. Support the user's ongoing awareness of their nutritional status through history and progress tracking.
6. Build the system entirely on free/open-source technologies suitable for a student/college budget and local development.
7. Provide a transparent AI feasibility position for every AI feature, distinguishing what is realistically buildable as a prototype from what requires future clinical-grade research.

---

## 6. Project Objectives

Derived from the uploaded PPT (Section 1.2 Objectives) and the scope image, reframed with explicit safety language:

- **O1 — Personalized Healthcare Guidance:** Provide dynamic, location-aware doctor/specialist referral suggestions tied to the predicted deficiency category, together with dietary recommendations filterable by diet type (e.g., vegetarian, non-vegetarian, vegan, regional).
- **O2 — AI-Assisted Preliminary Prediction:** Execute image-based analysis to produce a **possible deficiency indicator**, gated by an image-quality check, and always reported with an explicit **Model Confidence** score (never as medical certainty). *(The source PPT names "Wavelet Transform" as part of a validated prediction objective, while the accompanying architecture diagram specifies a CNN-based pipeline — see Section 55 Ambiguities. The prototype's default feature-extraction/classification approach is CNN-based, consistent with the architecture diagram and literature review; Wavelet Transform is flagged as an open technique choice, not a firm requirement.)*
- **O3 — Real-Time Health Monitoring:** Allow continuous tracking of a user's health status by storing prior assessment reports and displaying progress trends on a dashboard.
- **O4 — Non-Invasive, Free Screening:** Replace or supplement costly, slow lab-based screening with a free, image + symptom based preliminary check.
- **O5 — Remote Healthcare Support:** Make preliminary screening usable where labs and specialists are not readily available.

---

## 7. Target Users

| User Type | Description |
|---|---|
| General Public / End User | Individuals wanting a free, quick, preliminary check of possible nutritional deficiency indicators and food/nutrition guidance. |
| Rural / Remote-Area Users | Users with limited access to laboratories or specialists, for whom a non-invasive screening tool has outsized value. |
| Health-Conscious Users | Users tracking their nutrition and wellness over time via history and progress features. |
| Administrators | Project/college-project maintainers managing users, datasets, models, analytics, and feedback. |
| (Future) Healthcare Professionals | Referral-side stakeholders who could eventually receive referred cases (out of scope for the prototype's own workflow, but referenced by the doctor-referral feature). |

---

## 8. User Personas

**Persona 1 — "Anita," 32, Remote-Area Homemaker**
Lives in a small town with no easy access to a diagnostic lab. Notices brittle nails and mouth soreness. Wants a free, fast way to check "is this something I should worry about?" before committing time and money to a clinic visit. Needs simple language, not medical jargon, and wants food suggestions she can act on immediately.

**Persona 2 — "Rahul," 24, Health-Conscious Student**
Tracks fitness and diet. Curious whether his diet is missing something, notices minor skin/hair changes. Wants a quick assessment, wants to compare results over time (progress tracking), and is comfortable with a "confidence score, not diagnosis" framing.

**Persona 3 — "Dr./Admin — Project Maintainer / College Evaluator"**
Needs to see system-wide analytics: how many assessments were run, how the model is performing, whether predictions are biased across skin tones, and how users are giving feedback — to evaluate and improve the prototype as a system, not a clinical product.

---

## 9. Project Scope

### 9.1 In Scope (Prototype-Buildable Core)
- User registration/login/profile management
- Image upload (single and multiple), image-quality checking
- Symptom-based questionnaire input
- AI-based image analysis producing Top-3 possible deficiency indicators with Model Confidence and a risk/attention level
- Personalized food recommendations and a basic nutrition plan
- Downloadable health report with disclaimer
- Assessment history and basic progress tracking
- Feedback capture
- Admin dashboard: user management, assessment monitoring, prediction analytics, feedback management
- Secure authentication, encrypted storage of images and personal data

### 9.2 Out of Scope (Not Part of the Prototype)
- Any function that issues a certified medical diagnosis or replaces a clinician
- Direct integration with real hospital/clinic booking systems
- Real laboratory-instrument integration
- Payment processing / commercial transactions
- Regulatory medical-device certification (e.g., FDA/CE) activities

### 9.3 Prototype Scope (Build, but Explicitly Limited)
- AI Chatbot — rule-based/FAQ-plus-LLM-assisted informational bot, not a clinical assistant
- Doctor referral — a directory/suggestion feature (e.g., static or map-based specialist listing), not a live booking or EHR integration
- Model explainability (Grad-CAM) — visual heat-map overlay for demonstration/interpretability, not a certified clinical explanation
- Multilingual support — a limited initial language set, expandable
- Voice input / text-to-speech — browser-API based, best-effort across devices/browsers

### 9.4 Future Scope (Explicitly Deferred)
- Native mobile application (Android/iOS)
- Real-time (live) camera-frame continuous analysis beyond capture-and-submit
- Laboratory-test result integration
- Large-scale dataset expansion and continuous/automated model retraining pipelines
- Cloud production deployment at scale, telemedicine integration
- Population-level health-pattern analytics

---

## 10. Complete Feature List

The following 30 features are extracted directly from the uploaded project scope image, cross-checked against the uploaded PPT. Each is a required capability of NutriVision AI unless marked Future Scope.

| ID | Feature |
|---|---|
| F01 | Multi-Vitamin Deficiency Detection |
| F02 | Multi-Body-Part Analysis |
| F03 | Multiple Image Upload |
| F04 | AI-Based Image Quality Checking |
| F05 | Confidence Score |
| F06 | Top-3 Predictions |
| F07 | Symptom-Based Assessment |
| F08 | Personalized Food Recommendations |
| F09 | Personalized Nutrition Plan |
| F10 | AI Medical/Nutrition Chatbot |
| F11 | Medical-Term Explanation |
| F12 | Doctor Referral System |
| F13 | Severity / Risk-Level Indication |
| F14 | Health Report Generation |
| F15 | User (Assessment) History |
| F16 | Progress Tracking |
| F17 | Multilingual Support |
| F18 | Voice-Based Interaction |
| F19 | Text-to-Speech |
| F20 | Mobile Application (Future) |
| F21 | Real-Time Camera Analysis |
| F22 | Dataset Expansion |
| F23 | Model Improvement |
| F24 | Model Explainability (Grad-CAM) |
| F25 | Bias and Diversity Analysis |
| F26 | Secure User Data |
| F27 | Admin Dashboard |
| F28 | Feedback System |
| F29 | Laboratory-Test Integration (Future Scope) |
| F30 | Cloud Deployment |

Supplementary capabilities named in the PPT that support the above (folded into the FR list, not separately numbered): image pre-processing (resize, denoise, normalize, ROI detection), feature extraction (color/texture/shape/statistical features), classification module, and an offline model-training pipeline.

---

## 11. Functional Requirements

Each feature from Section 10 is decomposed into functional requirements (FR). Priority: **P0** = must-have for prototype demo, **P1** = important, should ship, **P2** = nice-to-have/stretch, **Future** = deferred.

| Req ID | Feature | Description | User Role | Priority | Acceptance Criteria |
|---|---|---|---|---|---|
| FR-001 | F01 Multi-Vitamin Detection | System classifies an assessment into one or more of a defined set of deficiency categories (e.g., Vitamin A, B-complex/B12, C, D, iron-related) or "no clear indicator found." | User | P0 | Given a valid image + symptoms, system returns a category label set from the defined taxonomy with no crash, within the performance target (Section 12). |
| FR-002 | F02 Multi-Body-Part Analysis | User selects a body part (skin, eyes, tongue, lips, nails, hair; face if supported) before/при image upload, and the model pipeline is body-part-aware. | User | P0 | Selecting a body part routes the image to the correct preprocessing/model path; UI reflects the selected part throughout the flow. |
| FR-003 | F03 Multiple Image Upload | User may upload 2+ images (same or different body parts) in one assessment session. | User | P1 | User can add/remove multiple images before submitting; all are used or clearly attributed in the result. |
| FR-004 | F04 Image Quality Checking | Before analysis, system automatically evaluates uploaded image for blur, darkness, low resolution, and poor framing/positioning. | User | P0 | Poor-quality image is rejected with a specific, actionable message ("image too dark — retake in better lighting") and re-upload is offered; good images pass through automatically. |
| FR-005 | F05 Confidence Score | Every prediction is shown with a numeric/percentage **Model Confidence**, explicitly labeled as such (never "accuracy" or "certainty"). | User | P0 | Result screen displays "Model Confidence: XX%" next to each Top-3 item; label text never uses "diagnosis confidence" or implies certainty. |
| FR-006 | F06 Top-3 Predictions | System returns the three most likely categories (or fewer if fewer are plausible), ranked, each with its own confidence score. | User | P0 | Result screen lists up to 3 ranked categories with individual confidence values summing to a sensible probability distribution. |
| FR-007 | F07 Symptom-Based Assessment | User completes a structured symptom questionnaire (checkbox/multi-select of common deficiency-related symptoms) alongside image upload; symptom data is combined with image features for the final prediction. | User | P0 | Assessment cannot be submitted without at least the minimum required symptom fields (or explicit "no symptoms" selection); submitted symptoms are stored with the assessment and influence chatbot/report content. |
| FR-008 | F08 Personalized Food Recommendations | Based on the predicted deficiency category and stated dietary preference (vegetarian/non-vegetarian/vegan/regional), system returns a curated food list. | User | P0 | Recommendation list changes appropriately when diet-preference filter changes; list is relevant to the predicted category (validated against a curated reference table). |
| FR-009 | F09 Personalized Nutrition Plan | System generates a basic daily/weekly nutrient-focused meal outline derived from the predicted category and user preferences. | User | P1 | User can view/download a structured plan (not just a food list) covering at least a 7-day outline. |
| FR-010 | F10 AI Chatbot | Conversational interface answers user questions about vitamins, symptoms, nutrition, and the system's own prediction, using disclaimer-safe language. | User | P1 | Chatbot responds to at least the defined FAQ intent set and to context questions about the user's latest result; every chatbot session surfaces the medical disclaimer at first use. |
| FR-011 | F11 Medical-Term Explanation | Complex medical/nutrition terminology appearing in results or reports is explained in plain language (tooltip, glossary, or inline expansion). | User | P1 | Every clinical term shown in a report has an associated plain-language explanation accessible within 1 click/tap. |
| FR-012 | F12 Doctor Referral System | System suggests relevant healthcare-professional categories (e.g., dietitian, dermatologist, general physician) based on the predicted concern, optionally filtered by user location. | User | P1 (Prototype) | Result screen shows at least one relevant referral suggestion type per predicted category; location filter narrows results when location is provided. Directory-based, not a live booking integration (see 9.3). |
| FR-013 | F13 Severity / Risk-Level Indication | Each result is tagged with a risk level: Low concern / Moderate concern / Needs medical evaluation — explicitly labeled as a risk indicator, not a diagnosis. | User | P0 | Every assessment result displays exactly one of the three risk labels with a visible disclaimer that it is not a diagnosis. |
| FR-014 | F14 Health Report Generation | User can generate/download a report (PDF) containing prediction, confidence, symptoms, food/nutrition recommendations, and the medical disclaimer. | User | P0 | Generated PDF contains all listed sections and the disclaimer text verbatim; report is downloadable and re-generatable from history. |
| FR-015 | F15 Assessment/User History | User can view a list of past assessments with date, predicted category, confidence, and risk level. | User | P1 | History list is paginated/sortable by date; selecting an entry reopens the full result view. |
| FR-016 | F16 Progress Tracking | User can view symptom/prediction trend over time (e.g., a simple chart of risk level or confidence across assessments). | User | P1 | At least 2 historical assessments produce a visible trend chart; single-assessment users see an appropriate empty/placeholder state. |
| FR-017 | F17 Multilingual Support | UI text is available in multiple languages (e.g., English, Kannada, Hindi, Telugu, Tamil, as named in the source PPT slide 4.2/Scope image). | User | P2 | User can switch language from a menu; at minimum, English + one additional language ship in the prototype; all static UI strings are externalized for translation. |
| FR-018 | F18 Voice-Based Interaction | User can dictate symptoms via speech-to-text (browser Web Speech API) instead of typing. | User | P2 | On a supported browser, tapping the mic icon transcribes speech into the symptom text field; unsupported browsers show a graceful fallback message. |
| FR-019 | F19 Text-to-Speech | System can read result/report/recommendation text aloud (browser SpeechSynthesis API). | User | P2 | A "listen" control reads the visible result text aloud on supported browsers; control is hidden/disabled gracefully where unsupported. |
| FR-020 | F20 Mobile Application | Native/hybrid mobile app version of the system. | User | Future | Explicitly out of prototype build; documented as future scope only (Section 55/Section 9.4). |
| FR-021 | F21 Real-Time Camera Analysis | User can capture an image directly via device camera (in-browser capture) instead of only uploading from gallery. | User | P1 | Camera capture button opens device camera (where browser/device support exists) and the captured frame is usable as the assessment image; continuous/live frame-by-frame analysis is Future Scope, single-frame capture is Prototype scope. |
| FR-022 | F22 Dataset Expansion | Ability to combine/ingest additional labeled images from public datasets to grow the training set. | Admin | P2 | Admin can add a new dataset source record; pipeline documentation shows how new images are incorporated into retraining. |
| FR-023 | F23 Model Improvement | Ability to compare/swap model architectures (e.g., CNN, MobileNet, EfficientNet, ResNet) and record evaluation metrics. | Admin | P2 | Admin dashboard shows at least model version, architecture, and evaluation metric history for at least 2 trained model versions. |
| FR-024 | F24 Model Explainability (Grad-CAM) | System can generate a Grad-CAM heat-map overlay showing which image regions most influenced a prediction. | User/Admin | P1 (Prototype) | For a supported model architecture, the result view can display a heat-map overlay on the submitted image; UI explicitly labels this as "AI region-of-interest visualization," not medical proof. |
| FR-025 | F25 Bias and Diversity Analysis | Admin-facing analysis of model performance across skin tones, lighting conditions, ages, and image quality bands. | Admin | P1 | Admin dashboard shows at least one breakdown table/chart of prediction accuracy or confidence stratified by an available demographic/quality dimension in the labeled evaluation set. |
| FR-026 | F26 Secure User Data | All personal data and images are protected via authentication, encryption at rest/in transit, and access control. | System | P0 | Passwords hashed (never plaintext); data in transit uses HTTPS/TLS; images/PII in the database are access-controlled to the owning user and authorized admins only. |
| FR-027 | F27 Admin Dashboard | Central admin view: user management, assessment monitoring, prediction analytics, dataset management, model management, feedback management, bias/diversity view. | Admin | P0 | Each named admin capability is reachable from a single admin navigation shell; admin actions are role-gated from regular users. |
| FR-028 | F28 Feedback System | User can submit feedback (e.g., rating + comment) on prediction usefulness. | User | P1 | Feedback is stored, timestamped, linked to the relevant assessment, and visible in the Admin Feedback Management view. |
| FR-029 | F29 Laboratory-Test Integration | User can enter lab test values (e.g., blood test results) to be combined with symptoms/images for a more informed indicator. | User | Future | Not built in the prototype; documented as Future Scope only (Section 41). |
| FR-030 | F30 Cloud Deployment | Application is deployable to a cloud platform for remote access. | Admin/DevOps | P2 | A documented, reproducible deployment path exists (containerized) to at least one free-tier-capable cloud target; local Docker deployment is the P0 baseline, cloud deployment itself is P2/stretch. |

---

## 12. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Image analysis and prediction should complete within a few seconds per assessment under normal load (PPT 4.3), consistent with a single-image inference target of ≤5–10 seconds on prototype-scale infrastructure. The system must handle multiple concurrent users/image inputs without significant slowdown. |
| **Security** | Authentication via hashed credentials + token-based sessions (e.g., JWT). Role-based access control for User vs Admin. Protection against common web vulnerabilities (injection, XSS, CSRF) at a level appropriate for a college prototype. |
| **Privacy** | Uploaded images and personal/health-adjacent data are treated as sensitive; stored with access control; users can request deletion of their own data/images. |
| **Scalability** | Architecture should support growth in concurrent users/images without redesign (PPT 4.3), even though the prototype itself targets modest concurrent load (e.g., tens of simultaneous users). |
| **Maintainability** | Modular separation between frontend, backend, and AI/ML service so each can be updated independently (see Section 44 Architecture). |
| **Accessibility** | Mobile-responsive UI; voice input and text-to-speech as accessibility aids; sufficient color contrast for risk-level indicators (not color alone). |
| **Reliability** | System should operate without crashing under normal use and give consistent results for similar/repeat inputs (PPT 4.3). |
| **Mobile Responsiveness** | Web UI must be usable on common mobile screen sizes; a dedicated native mobile app is Future Scope (F20). |

---

## 13. Complete User Journey

```
Registration / Login
        ↓
User Dashboard
        ↓
Start New Assessment
        ↓
Select Body Part (Skin / Eyes / Tongue / Lips / Nails / Hair [/ Face])
        ↓
Upload Image(s) / Multiple Images / Camera Capture
        ↓
Automated Image Quality Check
        ↓
 If quality is poor → Request a better image (loop back to upload)
        ↓
Enter Symptoms (structured questionnaire)
        ↓
Image Pre-processing (resize, denoise, normalize, ROI detection)
        ↓
Feature Extraction (color / texture / shape / statistical features)
        ↓
AI/ML Preliminary Classification
        ↓
Top-3 Predictions + Individual Model Confidence Scores
        ↓
Risk / Attention-Level Indicator (Low / Moderate / Needs medical evaluation)
        ↓
Personalized Food Recommendations (diet-preference filtered)
        ↓
Personalized Nutrition Plan
        ↓
Optional: Grad-CAM Visualization, Medical-Term Explanations, Doctor Referral Suggestions, Chatbot Q&A
        ↓
Health Report (view / download PDF, includes disclaimer)
        ↓
Save to Assessment History
        ↓
Progress Tracking Dashboard (trend across assessments)
        ↓
Optional: Submit Feedback
```

This workflow matches the conceptual flow supplied in the automation instructions and is consistent with the pipeline described in the PPT (Section 2.3 Proposed System: Image Acquisition → Pre-processing → Feature Extraction → Diagnostic Output) and the System Architecture diagram (Section 44).

---

## 14. User Stories

- As a **user**, I want to register and log in securely, so that my assessments and history are private to me.
- As a **user**, I want to select which body part I'm photographing, so that the system analyzes the right region.
- As a **user**, I want to upload an image of my nails so that the system can perform an AI-based preliminary assessment.
- As a **user**, I want the system to tell me if my photo is too blurry or dark, so that I can retake it before wasting an assessment attempt.
- As a **user**, I want to answer a short symptom questionnaire, so that the prediction reflects more than just my photo.
- As a **user**, I want to see the top 3 possible deficiency indicators with confidence scores, so that I understand the range of possibilities rather than a single false-certain answer.
- As a **user**, I want to see a clear risk level (Low / Moderate / Needs medical evaluation), so that I know how urgently to seek care.
- As a **user**, I want personalized food recommendations filtered to my diet type, so that the guidance is actually usable for me.
- As a **user**, I want a downloadable health report, so that I can share it with a doctor if needed.
- As a **user**, I want to see my past assessments and a progress trend, so that I can tell whether things are improving.
- As a **user**, I want to ask a chatbot questions about my result, so that I can understand medical terms without searching elsewhere.
- As a **user**, I want to use the app in my preferred language and by voice, so that it is accessible to me.
- As an **admin**, I want to see analytics on predictions and users, so that I can monitor system health and usage.
- As an **admin**, I want to see bias/diversity performance breakdowns, so that I can identify and address model fairness gaps.
- As an **admin**, I want to manage datasets and model versions, so that I can improve the system over time.
- As an **admin**, I want to review user feedback, so that I can prioritize fixes and improvements.

---

## 15. Supported Body-Part Analysis Requirements

Per the uploaded scope image and PPT (Scope 1.3 and Functional Requirements 4.2), the system supports the following body-part categories:

| Body Part | Example Indicators Referenced in Source Materials |
|---|---|
| **Skin** | Dermatitis, hyperpigmentation, wound-healing patterns (PPT 2.3 "Dermatological Signs") |
| **Eyes** | Conjunctival pallor, Bitot's spots, night-blindness-related signs (PPT 1.3 "Ocular Indicators") |
| **Tongue** | Referenced in scope image and app mockup (Fig 5.3.2); specific visual markers not detailed in source material — flagged as ambiguity (Section 55) |
| **Lips** | Referenced in scope image (Feature 2) and app mockup; specific visual markers not detailed in source material — flagged as ambiguity |
| **Nails** | Brittleness, spoon-shaped nails (koilonychia) (PPT 1.3 "Hair and Nail Analysis") |
| **Hair** | Texture changes (PPT 1.3 "Hair and Nail Analysis") |
| **Face** (conditional) | The automation brief permits face-related analysis "if mentioned in the uploaded reference materials." The PPT's functional-requirements section (4.2) and upload-page mockup (Fig 5.3.1 metadata: "Upload Image of Human ... Hand / Face / Eyes / Skin / Tongue / Hair") do reference face and hand; these are included as **supported-if-feasible** categories, distinct from the six core categories in the scope image. |

Each body part must have its own image-capture guidance (e.g., "hold nail hand flat under natural light") and its own model/feature-extraction path (FR-002).

---

## 16. Image Upload and Camera Requirements

- Support standard formats: JPG/JPEG, PNG (per PPT 4.2).
- Support single-image and multiple-image upload per assessment (F03).
- Support in-browser camera capture as an alternative to gallery upload (F21, single-frame capture only in prototype scope).
- Enforce a maximum file size and image count per assessment (implementation detail to be defined during technical design; not specified in source materials — see Ambiguities).
- Provide upload progress and error states (upload failure, unsupported format, oversized file).
- Route each image, tagged with its selected body part, into the correct preprocessing pipeline.

---

## 17. Symptom Assessment Requirements

- Present a structured, multi-select symptom questionnaire (not free text only), covering common indicators associated with the supported deficiency categories.
- Allow an explicit "no additional symptoms" option.
- Combine symptom vector with image-derived features prior to final classification (per PPT 1.2 Objectives: "Execute image analysis to predict deficiency ... using confidence scores").
- Persist symptoms with each assessment record for history, reporting, and chatbot context.
- The exact symptom taxonomy (full list of checkbox items) is not enumerated in the uploaded materials and must be defined during detailed design in consultation with the nutrition/medical reference literature — flagged as ambiguity.

---

## 18. Image Quality Checking Requirements

- Automatically evaluate each uploaded/captured image for: blur, insufficient lighting/darkness, low resolution, poor framing/positioning (per PPT 4.2 Image Preprocessing Module and scope image Feature 4).
- Reject unsuitable images with a specific, actionable message and prompt re-upload before allowing submission to the classification stage.
- Quality checking should run client-side and/or server-side before the (comparatively expensive) classification step, to save compute and give fast feedback.
- Implementation approach (e.g., blur-variance/Laplacian check, brightness histogram check) is a design-time decision; not specified in source materials.

---

## 19. AI/ML Requirements

- **Image Pre-processing:** resizing, normalization, grayscale conversion where applicable, noise reduction/denoising, color correction, ROI (region of interest) detection isolating the human-body region (PPT 4.2, System Architecture 3.1).
- **Feature Extraction:** color features, texture features, shape features, statistical features (PPT 4.2, Architecture 3.2).
- **Classification/Prediction:** CNN-based (or comparable) deep-learning/ML model trained on labeled human-body images, producing a probability distribution over defined deficiency categories plus a "normal/no clear indicator" class (PPT 4.2, Architecture 3.3).
- **Severity Estimation:** derives a Mild/Moderate/Severe-style risk banding from model output (Architecture 3.4), surfaced to the user as the Low/Moderate/Needs-medical-evaluation risk label (F13).
- **Offline Model Training Pipeline:** training dataset → data preprocessing & augmentation → feature/deep learning → model training (CNN or comparable) → trained model artifact (e.g., `.h5`/`.pb`), run offline/separately from the live inference path (PPT Architecture diagram).
- Model output must always be reported as **Model Confidence**, distinct from medical certainty (global constraint, Section 21).

---

## 20. Dataset Requirements

- A labeled image dataset covering each supported body part and each supported deficiency category (plus a "normal" class) is required to train the classification model.
- Public/open datasets should be evaluated for suitability first, per the free/open-source priority; however, **no specific suitable public dataset is confirmed to exist in the uploaded materials**, and none should be assumed or invented. Dataset sourcing, labeling quality, and clinical-ground-truth validity are treated as a major open risk (see Section 52).
- Dataset expansion (F22) should support ingesting additional labeled images over time, with clear provenance/source tracking (admin-managed).
- Any dataset used must be documented for: source, license terms, image count per class, demographic coverage (for bias analysis, F25), and collection/consent method if it includes real patient images.
- Synthetic/augmented data (rotation, flips, brightness jitter, crops) may be used to expand effective training-set size, consistent with the "Data Preprocessing & Augmentation" step shown in the PPT architecture diagram.

---

## 21. AI Feasibility Analysis

For every AI-related feature: what it does, dataset need, dataset realism, pretrained/transfer-learning option, prototype realism, key limitations, validation need, and classification.

| Feature | What It Does | Dataset Required? | Public Dataset Likely Available? | Transfer Learning Usable? | Realistic as College Prototype? | Major Limitations | Requires Medical Validation? | Classification |
|---|---|---|---|---|---|---|---|---|
| F01 Multi-Vitamin Detection | Classifies image+symptom input into deficiency categories | Yes — labeled multi-class image dataset | **Not confirmed.** No suitable public dataset is guaranteed to exist for skin/eye/nail/tongue/lip/hair deficiency labels at the needed scale; this must be explicitly treated as unresolved, not assumed solvable. | Yes — pretrained CNN backbones (e.g., MobileNet/ResNet/EfficientNet) can be fine-tuned to reduce data need | Yes, as a **prototype-scale demonstrator** with a small curated/augmented dataset | Small/unbalanced data, weak or self-labeled ground truth, easy overfitting, visual overlap between categories | Yes, before any real-world clinical claim | ADVANCED AI/ML FEATURE (prototype-scale realistic; clinical-grade not realistic) |
| F02 Multi-Body-Part Analysis | Routes different body parts to appropriate model paths | Same as above, per body part | Same caveat as F01, multiplied per body part (harder — more classes × more parts) | Yes, per-part fine-tuned heads or a shared backbone with part-conditioning | Yes for 2–3 body parts at prototype scale; all 6 is ambitious for a single student project timeline | Each additional body part multiplies dataset/labeling burden | Yes | ADVANCED AI/ML FEATURE |
| F04 Image Quality Checking | Rejects blurry/dark/poor images pre-analysis | No labeled dataset strictly required — can use classical CV heuristics (blur variance, brightness histogram) | N/A (heuristic, not ML-trained) | N/A | Yes, straightforward | Heuristics may misjudge edge cases (e.g., intentionally dark skin tone vs. underexposure) — must be tuned to avoid bias | No | CORE SOFTWARE FEATURE |
| F05 Confidence Score | Surfaces model's own probability output | Comes for free with any softmax/probabilistic classifier | N/A | N/A | Yes | Confidence is a model-internal statistic, not a guarantee of correctness — must never be labeled as accuracy | No (but must never be mislabeled as certainty) | CORE SOFTWARE FEATURE |
| F06 Top-3 Predictions | Surfaces top-3 ranked classes | Comes for free with the same classifier as F01 | Same as F01 | Same as F01 | Yes | Same underlying limitations as F01 | Same as F01 | Depends on F01 (ADVANCED AI/ML) |
| F10 AI Chatbot | Answers general nutrition/vitamin/symptom questions and explains the user's own result | No training dataset strictly required if built on a rule-based FAQ system or an existing general-purpose LLM API with careful prompting/guardrails | N/A / general-purpose model, not a custom trained one | Yes — can wrap an existing free/open LLM or rule-based intent system | Yes, as an FAQ-plus-context assistant | Must not be allowed to state diagnoses or contradict the disclaimer; must be scoped/guardrailed | Yes, for any medical-sounding claim it generates | PROTOTYPE FEATURE |
| F12 Doctor Referral | Suggests specialist categories, optionally location-filtered | No ML dataset required — can be a static/rule-based mapping table (deficiency category → specialist type) plus a maps/places lookup | N/A (rule-based) | N/A | Yes | Not a real booking/EHR system; referral quality depends on manually curated mapping | No (informational only) | PROTOTYPE FEATURE |
| F13 Severity/Risk Level | Buckets prediction confidence/category into a risk label | Reuses F01's model output; bucket thresholds are a design decision, not learned | Same as F01 | Same as F01 | Yes | Thresholds are heuristic unless separately validated; must be clearly labeled as a risk indicator, not a diagnosis | Yes, if thresholds are ever claimed to be clinically meaningful | CORE SOFTWARE FEATURE (logic) / depends on ADVANCED AI (underlying model) |
| F22 Dataset Expansion | Grows/curates the training dataset over time | This *is* the dataset-building activity | N/A | N/A | Realistic as an ongoing admin/curation workflow, not a one-time task | Time-intensive; label quality control is hard without medical expert review | Yes, for label correctness | PROTOTYPE FEATURE / ongoing process |
| F23 Model Improvement | Compares/upgrades model architectures | Reuses F22's dataset | Same as F01 | Yes — swapping backbones (MobileNet/EfficientNet/ResNet) is a standard transfer-learning exercise | Yes, as a comparative-benchmarking exercise | Improvement is bounded by dataset quality, not just architecture choice | Yes, before claiming real-world improvement | ADVANCED AI/ML FEATURE |
| F24 Model Explainability (Grad-CAM) | Highlights image regions influencing the prediction | No separate dataset — Grad-CAM is a post-hoc technique on the trained CNN | N/A | N/A (technique, not a model) | Yes, well-documented open-source technique (works cleanly on CNN architectures; some newer/non-CNN architectures need adapted techniques) | Grad-CAM shows *where* the model looked, not *why* it is medically correct — must never be presented as clinical proof of the finding; heat-maps can be visually persuasive even when the underlying prediction is wrong | Yes — explainability output is not itself a medical validation | ADVANCED AI/ML FEATURE |
| F25 Bias and Diversity Analysis | Evaluates model performance across skin tones/lighting/age | Reuses evaluation dataset; needs demographic metadata (skin tone, lighting condition, age) attached to images | **Not guaranteed** — demographic-labeled data is harder to source than plain labeled images; this is a known limitation, not assumed solved | N/A | Yes, at least a basic stratified-evaluation exercise if any demographic metadata exists in the dataset | Small dataset size makes subgroup analysis statistically weak; absence of diverse data is itself a bias risk that must be reported, not hidden | Yes, if bias conclusions are to be trusted | ADVANCED AI/ML FEATURE |
| F21 Real-Time Camera Analysis (continuous) | Live, frame-by-frame analysis | Same as F01, but real-time inference adds latency/performance constraints | Same as F01 | Same as F01 | **Single-frame capture: realistic. Continuous live-frame analysis: not realistic for a college prototype** given inference-speed and dataset constraints | Real-time constraints compound all F01 limitations with latency/compute cost | Yes | Single-capture: CORE SOFTWARE FEATURE. Continuous live analysis: FUTURE SCOPE |
| F29 Laboratory-Test Integration | Combines lab values with image/symptom data | Would need structured lab-value + outcome data, not addressed by any dataset described in source materials | Not addressed | Not addressed | No — explicitly out of prototype scope | Requires real clinical data partnerships and validation far beyond a college project | Yes, extensively | FUTURE SCOPE |

**Cross-cutting note:** Nowhere in this PRD does NutriVision AI assume the existence of a ready-made, clinically validated public dataset for multi-body-part vitamin-deficiency classification. Every AI feature above that depends on such a dataset is explicitly flagged as constrained by that unresolved requirement.

---

## 22. Top-3 Prediction and Confidence Requirements

- Model output layer produces a probability/confidence value per class; the top 3 non-zero-probability classes (or fewer, if the model is confident about fewer) are surfaced.
- Confidence values are always labeled **"Model Confidence"** in the UI and reports — never "Accuracy," "Certainty," or "Diagnosis Confidence."
- If the top prediction's confidence is below a defined minimum threshold (to be set during model validation), the UI should communicate low certainty explicitly (e.g., "Result inconclusive — consider retaking the image or consulting a professional") rather than presenting a falsely confident single answer.
- Confidence values must be sourced from the model's actual output at inference time — never hardcoded or fabricated for demo purposes in the production-facing flow.

---

## 23. Risk/Severity Indicator Requirements

- Three-tier label: **Low concern / Moderate concern / Needs medical evaluation** (per scope image Feature 13).
- Explicitly labeled in-UI as a **risk indicator, not a diagnosis**.
- Must use both color and text/icon (not color alone) for accessibility.
- Threshold logic mapping confidence/category to risk tier is a design-time decision to be documented and versioned alongside the model (traceable for future re-tuning).

---

## 24. Food Recommendation Requirements

- Recommendations are generated from a curated reference table mapping deficiency category → recommended foods (per scope image Feature 8).
- Filterable by diet preference: vegetarian, non-vegetarian, vegan, and regional/cultural preference (per PPT 1.2 Objectives).
- Recommendations must be general nutrition guidance, not prescribed treatment dosages or supplement dosing instructions.
- Reference table content should be sourced from credible public nutrition references during detailed design (not fabricated by the AI model itself).

---

## 25. Personalized Nutrition Plan Requirements

- Generates a basic nutrient-focused daily/weekly plan derived from the predicted category and user-selected preferences (per scope image Feature 9).
- Presented as general dietary guidance, explicitly not a clinical meal-therapy prescription.
- Downloadable/viewable alongside the health report.

---

## 26. AI Chatbot Requirements

- Answers general questions about vitamins, symptoms, nutrition, and can reference the user's latest assessment result for context (per scope image Feature 10).
- Must surface the medical disclaimer at first interaction in a session and must not produce diagnostic or treatment-dosage claims.
- Prototype classification: rule-based/FAQ system, optionally augmented by a general-purpose free/open LLM with strict system-prompt guardrails; not a custom-trained clinical model (see Section 21).

---

## 27. Medical-Term Explanation Requirements

- Any clinical/medical term appearing in a result screen or report (e.g., "conjunctival pallor," "koilonychia") has an accessible plain-language explanation (tooltip, glossary link, or inline expandable text) (per scope image Feature 11).
- Glossary content is maintained as structured reference data, not generated ad hoc by the classification model.

---

## 28. Health Report Requirements

- Downloadable report (PDF) containing: prediction (Top-3), Model Confidence per item, risk/severity level, submitted symptoms, food recommendations, nutrition plan summary, and the medical disclaimer (per scope image Feature 14).
- Report is regenerable from Assessment History.
- Report must NOT claim guaranteed diagnosis, medical certainty, or clinical accuracy beyond what has actually been validated.

---

## 29. Assessment History Requirements

- User can view a chronological list of past assessments (date, body part, predicted category, confidence, risk level) (per scope image Feature 15).
- Each history entry links to its full result view and report.

---

## 30. Progress Tracking Requirements

- User can view how their symptoms, predicted risk level, or nutritional habits trend across assessments over time (per scope image Feature 16).
- Minimum viable version: a simple line/bar chart of risk level or confidence per assessment date.

---

## 31. Multilingual Support Requirements

- UI supports multiple languages; PPT/scope materials reference English, Kannada, Hindi, Telugu, Tamil as example target languages (per scope image Feature 17).
- All user-facing static strings must be externalized (i18n-ready) from day one, even if only English + 1 additional language ship in the initial prototype.

---

## 32. Voice-Based Interaction Requirements

- Users can dictate symptoms via speech-to-text using the browser's native Web Speech API where supported (per scope image Feature 18).
- Feature degrades gracefully (hidden or disabled with a note) on unsupported browsers/devices.

---

## 33. Text-to-Speech Requirements

- System can read recommendations/results aloud using the browser's native SpeechSynthesis API (per scope image Feature 19), improving accessibility.
- Feature degrades gracefully on unsupported browsers/devices.

---

## 34. Doctor Referral Requirements

- **Classified as a Prototype Feature.** System suggests relevant specialist categories (e.g., dietitian, dermatologist, ophthalmologist, general physician) based on the predicted deficiency, optionally filtered by user-provided location (per scope image Feature 12).
- This is a curated directory/suggestion feature, not a live booking, insurance, or EHR integration.
- Must include a disclaimer that referral suggestions are informational, not a guaranteed-appropriate specialist match, and that users should use their own judgment/existing healthcare provider relationships.

---

## 35. Feedback System Requirements

- Users can submit a rating and/or comment on the usefulness of a given prediction/assessment (per scope image Feature 28).
- Feedback is timestamped, linked to the originating assessment, and surfaced in the Admin Feedback Management view for prioritizing future improvements.

---

## 36. Admin Dashboard Requirements

Per scope image Feature 27 and the automation brief's Required User Types section, the Admin role must support:

- User management (view/search/disable users)
- Assessment monitoring (system-wide assessment volume/activity)
- Prediction analytics (category distribution, average confidence, risk-level distribution)
- Dataset management (F22)
- Model management (F23 — versioning, active model selection)
- Model analytics (accuracy/metrics by version)
- Feedback management (F28)
- Bias/diversity analysis view (F25)

---

## 37. Dataset Management Requirements

- Admin can view, add, and annotate dataset sources (name, size, license, body part/class coverage) (F22).
- Admin can track which dataset version was used to train each model version (traceability between F22 and F23).

---

## 38. Model Improvement Requirements

- Admin can register new model versions/architectures (e.g., CNN baseline, MobileNet, EfficientNet, ResNet — architectures explicitly referenced in the PPT literature review) and record their evaluation metrics (F23).
- Admin can designate which model version is "active" for live inference.
- Model swaps must not require a code redeploy of the frontend/backend — model artifact should be loadable/configurable (architecture requirement, see Section 44).

---

## 39. Model Explainability Requirements

- Grad-CAM (or an equivalent class-activation visualization technique) generates a heat-map overlay on the submitted image showing the region(s) most influential to the prediction (per scope image Feature 24).
- **Limitations to be explicitly documented in-product and in this PRD:**
  - Grad-CAM shows correlation/attention, not causation or medical correctness.
  - A visually plausible heat-map does not validate that the underlying prediction is medically accurate.
  - Explainability output must never be presented to the user as proof of diagnosis.
  - Technique works most cleanly on standard CNN backbones; if a non-CNN architecture is later adopted, an adapted explainability technique would be required.

---

## 40. Bias and Diversity Analysis Requirements

- Model performance (confidence/accuracy on a held-out evaluation set) should be evaluated across available demographic/environmental dimensions: skin tone, lighting condition, age band, and image-quality band, where such metadata exists (per scope image Feature 25).
- Findings must be reported transparently in Admin analytics, including where the dataset lacks sufficient diversity to draw a conclusion, rather than omitting the analysis.
- This is explicitly a prototype-scale fairness *check*, not a certified fairness audit.

---

## 41. Laboratory-Test Integration

**Classification: FUTURE SCOPE.**

Per scope image Feature 29, the future vision is for users to enter lab test values (e.g., blood test results) so the system can combine them with symptoms and image data for a more informed indicator. This requires structured lab-result data models, credible reference ranges, and materially more clinical validation than the prototype provides, and is explicitly excluded from the current build (Section 9.4).

---

## 42. Security and Privacy Requirements

- Passwords stored using a strong one-way hash (e.g., BCrypt) — never plaintext (per recommended stack, Section 45).
- Authentication via token-based sessions (e.g., JWT) with role-based access control (User vs Admin).
- All network traffic over HTTPS/TLS.
- Uploaded images and personal data encrypted at rest where the hosting environment supports it; access restricted to the owning user and authorized admins.
- Users can view and request deletion of their own stored images/history.
- Admin actions on user data should be logged (audit trail) for accountability (ties to Cross-Cutting "Logging & Monitoring" in the source architecture diagram).

---

## 43. Database Requirements (Conceptual Entities & Relationships)

| Entity | Key Attributes | Relationships |
|---|---|---|
| **User** | user_id, name, email, password_hash, role, created_at | 1—N Assessment, 1—N Feedback |
| **Assessment** | assessment_id, user_id, body_part, created_at, risk_level | 1—N Image, 1—1 Prediction, 1—N Symptom, 1—1 HealthReport, 1—N FeedbackEntry |
| **Image** | image_id, assessment_id, file_path, body_part, quality_check_status | N—1 Assessment |
| **Symptom** | symptom_id, assessment_id, symptom_code | N—1 Assessment |
| **Prediction** | prediction_id, assessment_id, model_version_id, rank(1–3), category, confidence_score | N—1 Assessment, N—1 ModelVersion |
| **FoodRecommendation** (reference) | category, diet_type, food_item | referenced by category during report generation |
| **NutritionPlan** | plan_id, assessment_id, plan_json/table | N—1 Assessment |
| **HealthReport** | report_id, assessment_id, generated_at, pdf_path | 1—1 Assessment |
| **DoctorReferral** (reference) | category, specialist_type, region (optional) | referenced by category during result display |
| **ChatbotSession** | session_id, user_id, assessment_id (nullable), messages | N—1 User |
| **Feedback** | feedback_id, user_id, assessment_id, rating, comment, created_at | N—1 User, N—1 Assessment |
| **DatasetSource** | dataset_id, name, license, image_count, class_coverage | 1—N ModelVersion (training lineage) |
| **ModelVersion** | model_version_id, architecture, dataset_id, metrics_json, is_active, created_at | N—1 DatasetSource, 1—N Prediction |
| **Admin** | admin_id, name, email, password_hash, permissions | manages Users, DatasetSource, ModelVersion, Feedback |

---

## 44. System Architecture Requirements

Adapted from the PPT's System Architecture diagram (Section 5.2), re-expressed against the recommended free/open-source stack (Section 45):

1. **User Layer** — Web browser (desktop/mobile), with a future native mobile app placeholder.
2. **Input Layer** — Image capture (camera), image upload, image storage staging, metadata capture (age, gender/lifestyle where relevant, location for referrals).
3. **Image Processing & Analysis Layer** (AI/ML microservice):
   - 3.1 Image Pre-processing (resize, denoise, color correction, normalization, ROI detection)
   - 3.2 Feature Extraction (color/texture/shape/statistical features)
   - 3.3 Deficiency Classification (CNN model trained on labeled images)
   - 3.4 Severity Estimation (Mild/Moderate/Severe → mapped to Low/Moderate/Needs-medical-evaluation)
   - Offline Model Training Pipeline (Training Dataset → Preprocessing & Augmentation → Feature/Deep Learning → Model Training → Trained Model Artifact), run separately from live inference.
4. **Output Layer** — Deficiency result (category), severity/risk level, recommendations (diet/supplements/lifestyle guidance), PDF report download/share.
5. **Data & Infrastructure Layer** — Cloud/local storage, relational database (Users, Images, Results), application server(s), authentication & authorization service.
6. **Cross-Cutting Concerns** — Security, privacy (data protection), logging & monitoring, performance monitoring, backup & recovery.

**Service decomposition (recommended, per Section 45 stack):**
- **Frontend SPA** (React/Vite) ↔ **Backend API** (Spring Boot: auth, users, assessments, history, reports, admin) ↔ **AI/ML Inference Service** (Python/FastAPI: preprocessing, feature extraction, classification, Grad-CAM, quality check) ↔ **MySQL Database** (shared persistence, accessed primarily via the backend API).
- The AI/ML service is intentionally isolated from the main backend so model versions/architectures (F23) can be swapped without redeploying the web backend.

---

## 45. Recommended Free Technology Stack

All recommendations below are free and open-source, matching the "no mandatory paid subscription" constraint. Where the source PPT's own software list (Python, Flask, TensorFlow/Keras, OpenCV/PIL, NumPy, Pandas, HTML5/CSS3/JS) differs from the automation brief's preferred direction, the brief's preferred stack is used as the primary recommendation, since it separates concerns more cleanly for a multi-service architecture; the PPT's stack remains a valid, simpler, fully free alternative and is noted accordingly.

| Layer | Recommended (Free/OSS) | Why |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS + React Router + Axios + Recharts | All free/open-source; Vite gives fast local dev; TypeScript improves reliability for a multi-screen health-data app; Recharts covers the progress-tracking charts (F16) without a paid charting license. |
| Backend | Java + Spring Boot + Spring Security + Spring Data JPA + JWT + BCrypt | Free, mature, well-documented for student teams; Spring Security + JWT + BCrypt directly satisfies the Security/Privacy NFRs (Section 12, 42) without paid identity services. |
| Database | MySQL Community Edition | Free, widely taught, sufficient for the relational schema in Section 43; runs fully locally for development. |
| AI/ML Service | Python + FastAPI + TensorFlow/Keras + OpenCV + Pillow + NumPy + Pandas + Scikit-learn | Matches the PPT's own tool choices (TensorFlow/Keras, OpenCV/PIL, NumPy, Pandas) almost exactly, so existing project code/knowledge carries over; FastAPI is a lightweight free alternative to Flask that adds automatic request validation, useful given the health-data nature of the payloads. |
| Multilingual | i18next / react-i18next | Free, standard React i18n tooling; supports the multi-language requirement (F17) with externalized string files. |
| Voice Input | Browser Web Speech API | Free, built into modern browsers; no paid speech API subscription needed (F18). |
| Text-to-Speech | Browser SpeechSynthesis API | Free, built into modern browsers; no paid TTS subscription needed (F19). |
| Maps (for Doctor Referral location filter) | Leaflet + OpenStreetMap | Free, open-source mapping without a paid Google Maps API key requirement. |
| PDF Generation | An open-source/free PDF library appropriate to the backend language (e.g., a free Java PDF library on the Spring Boot side) | Keeps Health Report generation (F14) free of paid PDF-SDK licensing. |
| Image Storage | Local filesystem storage in development; free-tier-compatible object storage path documented for future cloud deployment | Keeps local development entirely free; avoids assuming a paid storage subscription. |
| Deployment | Local development first; Docker-ready containerization; free-tier cloud target evaluated only as a stretch goal | Matches the explicit instruction to prioritize local development and free deployment options (F30 is P2/stretch, not required for the core prototype). |

**Note on the PPT's own stack:** The source PPT documents an already-working prototype using Python + Flask + TensorFlow/Keras + OpenCV/PIL + NumPy/Pandas + HTML5/CSS3/JS, screenshotted as a "VitaminCare" web app. This is a fully valid, simpler, fully free alternative architecture (a single Flask app serving both UI and inference) and should be considered if the team prefers a smaller, single-service build over the multi-service React/Spring Boot/FastAPI architecture recommended above. See Section 55 Ambiguities for the naming/architecture discrepancy this raises.

---

## 46. UI/UX Requirements

- Clear, non-alarming visual language for risk levels (color + icon + text, not color alone).
- Every result screen and report displays the medical disclaimer prominently, not buried in fine print.
- "Model Confidence" is visually distinct from "Risk Level" so users don't conflate the two.
- Upload/capture flow gives immediate, specific feedback on image quality issues.
- Mobile-responsive layout throughout (per Section 12 NFRs).
- Accessible color contrast; voice/TTS controls clearly discoverable, not hidden.
- Consistent iconography for the six body-part categories to speed up repeat use.

---

## 47. Required Pages

| Page | Purpose |
|---|---|
| Landing / Login / Register | Entry point, authentication |
| User Dashboard | Overview, quick-start new assessment, recent history summary |
| New Assessment — Body Part Selection | F02 |
| New Assessment — Image Upload/Capture | F03, F04, F21 |
| New Assessment — Symptom Questionnaire | F07 |
| Assessment Result | F01, F05, F06, F13, F24 (Grad-CAM view), F11 (term explanations) |
| Food Recommendations | F08 |
| Nutrition Plan | F09 |
| Health Report (view/download) | F14 |
| Assessment History | F15 |
| Progress Tracking Dashboard | F16 |
| Chatbot | F10 |
| Doctor Referral Suggestions | F12 |
| Feedback Form | F28 |
| Profile / Settings (incl. language selection) | Profile management, F17 |
| Admin Login | Role-gated entry |
| Admin Dashboard (overview) | F27 |
| Admin — User Management | F27 |
| Admin — Assessment Monitoring & Prediction Analytics | F27 |
| Admin — Dataset Management | F22 |
| Admin — Model Management & Analytics | F23 |
| Admin — Bias/Diversity Analysis | F25 |
| Admin — Feedback Management | F28 |

---

## 48. Feature Classification

🟢 **CORE WORKING FEATURES**
F01 (as prototype-scale demo), F02, F03, F04, F05, F06 (as prototype-scale demo), F07, F08, F09, F13, F14, F15, F16, F26, F27, F28, F21 (single-capture only)

🟡 **PROTOTYPE FEATURES**
F10 (Chatbot), F12 (Doctor Referral), F17 (Multilingual — limited language set), F18 (Voice input), F19 (Text-to-speech), F22 (Dataset Expansion — ongoing curation)

🟠 **ADVANCED AI/ML FEATURES**
F01/F06 underlying classifier (clinical-grade), F23 (Model Improvement), F24 (Grad-CAM Explainability), F25 (Bias and Diversity Analysis)

🔵 **FUTURE SCOPE FEATURES**
F20 (Mobile Application), F21 continuous/live-frame analysis, F29 (Laboratory-Test Integration), F30 (Production Cloud Deployment at scale)

---

## 49. Acceptance Criteria

Global acceptance criteria applicable across all features (feature-specific criteria are listed in Section 11):

- Every result screen displays the medical disclaimer text.
- No screen or report ever states a deficiency as a confirmed diagnosis.
- All confidence values are labeled "Model Confidence."
- All security requirements in Section 42 are demonstrably implemented (not just documented) before the prototype is considered complete.
- Every P0 feature in Section 11 is functional end-to-end in a single connected user journey (Section 13) for at least one full demo path.

---

## 50. Testing Requirements

- **Unit testing** of backend services (auth, assessment CRUD, recommendation logic) and AI/ML service functions (preprocessing, quality check, inference wrapper).
- **Integration testing** of the full assessment pipeline: upload → quality check → symptom submission → inference → result → report generation.
- **Model evaluation testing**: accuracy/precision/recall on a held-out labeled test set, reported honestly (not fabricated), and re-run whenever a new model version is registered (F23).
- **Bias/fairness testing**: stratified evaluation per Section 40, run at minimum once per model version.
- **Usability testing**: verify a first-time user can complete the full journey (Section 13) without external help.
- **Security testing**: verify password hashing, access control on admin routes, and that one user cannot access another user's images/history/reports.
- **Cross-browser/device testing**: especially for voice input (F18) and text-to-speech (F19), which depend on browser API support.
- **Regression testing**: before each new model version goes "active" (F23), confirm the rest of the pipeline still functions with the new model artifact.

---

## 51. Development Risks

- **Dataset availability/labeling risk:** No suitable public dataset is confirmed for the full multi-body-part, multi-deficiency classification task (Section 20/21) — this is the single largest project risk.
- **Timeline risk:** Building 6 body-part models plus all Prototype/Advanced features within a college-project timeline is ambitious; feature prioritization (Section 48) should drive an incremental delivery plan.
- **Team skill/tooling risk:** The multi-service recommended architecture (Section 45) requires familiarity with React, Spring Boot, and FastAPI simultaneously; the simpler Flask-based architecture already prototyped in the PPT (Section 45 note) is a lower-risk fallback.
- **Bias risk:** Small, non-diverse training data can produce a model that performs unevenly across skin tones/lighting, which must be actively evaluated (F25), not assumed away.
- **Over-claiming risk:** Reusing the source PPT's outcome claims (e.g., "95% Accuracy") verbatim without re-validating them against the actual prototype's own evaluation would misrepresent system performance (Section 53).
- **Scope-creep risk:** 30 scope-image features plus all PPT-derived requirements is a large surface area; strict adherence to the CORE/PROTOTYPE/ADVANCED/FUTURE classification (Section 48) is required to keep the build achievable.

---

## 52. Technical Limitations

- Real-time (continuous, live-frame) camera analysis (F21 extended form) is computationally demanding and not realistic at prototype scale — single-frame capture is the realistic version.
- Browser-based voice/TTS features (F18, F19) depend on browser/device support and will not work uniformly everywhere.
- A student-scale model trained on limited data will have materially lower reliability than a clinically validated diagnostic model; this must be reflected in UI copy and reports, not smoothed over.
- Grad-CAM (F24) is only well-established for CNN-style architectures; adopting a non-CNN architecture later would require an adapted explainability method.
- The exact maximum image size/count per assessment and the exact symptom-taxonomy list are undefined in the source materials and must be resolved in technical design (Section 55).

---

## 53. Medical and AI Limitations

- NutriVision AI is **not** a medically certified diagnostic system, is **not** a replacement for a doctor, and is **not** a clinically validated diagnosis system. It is a college-level AI-based preliminary assessment / research-educational prototype.
- Every result screen, chatbot response, and generated report must include disclaimer language substantially similar to: *"Results provided by NutriVision AI are AI-based preliminary assessments or possible indicators only. They are not medically certified diagnoses. Users should consult qualified healthcare professionals for medical diagnosis and treatment."*
- The system must never claim guaranteed diagnosis, medical certainty, or clinical accuracy that has not actually been validated; it must never state or imply fake model accuracy or fake AI performance.
- **Regarding the source PPT's reported outcomes ("95% Accuracy," "2–3x Faster Detection," "60% Cost Reduction," Slide 23):** these figures originate from the uploaded academic reference deck describing an earlier version of the project and are **not independently verified within this PRD**. They must not be carried into NutriVision AI's own user-facing marketing or reports as guaranteed performance. Any performance claim made by the actual built system must come from that system's own documented evaluation (Section 50).
- Model Confidence is a statistical property of the model's own output distribution and must always be presented as distinct from medical certainty.

---

## 54. Assumptions

1. The primary reference materials (the 30-feature scope image and the `Hitha.pptx` deck) describe a single, consistent product, despite some naming/detail differences (see Section 55).
2. "NutriVision AI" (per the automation brief) is the official product name for this PRD; "VitaminCare" (seen in the PPT's UI mockups, Section 55) is treated as an earlier/alternate working name for the same underlying prototype.
3. The system is being built for a college/educational context with a local-first, free/open-source technology constraint, not a commercial production launch.
4. A labeled training dataset will need to be assembled/curated by the project team (or sourced and heavily supplemented), since no ready-made suitable public dataset is confirmed.
5. The six body parts in the scope image (skin, eyes, tongue, lips, nails, hair) are the primary supported set; face/hand analysis (referenced only in the PPT's mockup metadata) is treated as a conditional, lower-priority extension.

---

## 55. Ambiguities Found in the Uploaded Materials

The following inconsistencies or gaps between the two uploaded source materials (and within each) are flagged per the "explicitly mention as ambiguity" instruction, rather than silently resolved:

1. **Product naming discrepancy:** The automation brief names the project "NutriVision AI," while the uploaded PPT's own UI mockups (Fig 5.3.1, 5.3.2) show an application branded "VitaminCare." This PRD uses "NutriVision AI" as instructed but flags that the actual prototype screenshots use a different name.
2. **Body-part list discrepancy:** The scope image lists Skin, Eyes, Tongue, Lips, Nails, Hair (6 parts). The PPT's Section 1.3 "Scope" only explicitly discusses Ocular (eyes), Dermatological (skin), and Hair/Nail — it does not explicitly discuss tongue or lips as analysis categories, though the app mockup (Fig 5.3.1 metadata) does list "Hand / Face / Eyes / Skin / Tongue / Hair" (including hand and face, but not lips explicitly). The full 6-part list from the scope image is treated as authoritative per the "primary source of truth" instruction, with face/hand noted as a possible, lower-confidence 7th/8th category.
3. **Technique inconsistency:** The PPT's Objectives slide (1.2) names "Validated AI Prediction Using Wavelet Transform," but the System Architecture diagram (5.2) and the Functional Requirements (4.2) both describe a CNN-based classification pipeline with standard feature extraction, with no further mention of Wavelet Transform anywhere else in the deck. It is unclear whether Wavelet Transform is meant as a feature-extraction pre-step, an alternative technique, or a wording artifact. This PRD defaults to the CNN-based architecture (consistent with the architecture diagram and literature review) and flags Wavelet Transform as an open, unresolved technique reference.
4. **Unverified outcome claims:** The PPT's Slide 23 ("5.4 Outcomes") states 95% accuracy, 2–3x faster detection, and 60% cost reduction, without a described methodology, sample size, or validation protocol. These are treated in this PRD as unverified prior-project claims, not as NutriVision AI's own validated performance (Section 53).
5. **Technology stack discrepancy:** The PPT's own Software Requirements (4.5) lists Python + Flask + TensorFlow/Keras + OpenCV/PIL + NumPy/Pandas + HTML5/CSS3/JS (a simpler, likely single-service Flask app), while the automation brief's "preferred direction" specifies a React + Spring Boot + FastAPI + MySQL multi-service architecture. Both are fully free/open-source; this PRD recommends the brief's multi-service stack as primary (Section 45) but explicitly preserves the PPT's simpler stack as a valid, lower-complexity fallback.
6. **Undefined symptom taxonomy:** Neither source material enumerates the actual list of symptom checkboxes/questions to be presented to the user (F07); this must be defined during detailed design.
7. **Undefined upload limits:** Maximum image count/file size per assessment (F03) is not specified in either source.
8. **Undefined confidence/risk thresholds:** The exact numeric thresholds separating "Low concern / Moderate concern / Needs medical evaluation" (F13) are not specified in either source and must be defined and documented during model validation (Section 23).
9. **Face/hand analysis scope:** The automation brief conditionally includes face analysis "if mentioned in the uploaded reference materials." The PPT's upload-page mockup metadata mentions both "Hand" and "Face," but no other part of either source material discusses face- or hand-specific visual indicators. This is treated as a low-confidence, conditional extension rather than a core requirement.
10. **Multilingual language set:** The scope image lists multilingual support generically; the PPT's example languages (English, Kannada, Hindi, Telugu, Tamil) appear only in the automation brief's own workflow example text, not verified as sourced directly from either uploaded file's body content — treated as a reasonable regional default, to be confirmed with the project owner.

---

## 56. Future Scope

- Native mobile application (Android/iOS) (F20)
- Continuous, real-time live-camera-frame analysis (extended F21)
- Laboratory-test result integration (F29)
- Expanded, continuously retrained dataset pipeline with automated MLOps (extends F22/F23)
- Production-scale cloud deployment with autoscaling (extends F30)
- Telemedicine/live doctor-connection integration (extends F12)
- Population-level/aggregate health-pattern analytics (mentioned in PPT "Long-term Impact," Slide 23)
- Formal clinical validation study, should the project ever move beyond an educational prototype toward real-world use

---

## 57. Success Criteria

A successful NutriVision AI prototype delivery should demonstrate:

1. A complete, working end-to-end user journey (Section 13) for at least one body part, from registration through health report generation.
2. Correct, non-misleading presentation of Model Confidence and risk level on every result, with the medical disclaimer always visible.
3. A documented, real (not fabricated) model evaluation result for the trained classifier, including an honest accuracy/precision/recall figure and, where feasible, a basic bias/diversity breakdown (F25).
4. A functioning Admin Dashboard covering user, assessment, dataset, model, and feedback oversight.
5. All P0 features from Section 11 implemented and demonstrable.
6. Zero mandatory paid-service dependencies in the local development/demo path.
7. A clear, documented mapping (Section 58 Traceability Matrix) from every source-material feature to its implementation status.

---

## 58. Feature Traceability Matrix

| ID | Feature | Source Reference | Description | Priority | Difficulty | Classification | Implementation Phase | Status |
|---|---|---|---|---|---|---|---|---|
| F01 | Multi-Vitamin Deficiency Detection | Scope image #1; PPT 1.2, 4.2, 5.2 | Classify image+symptom input into deficiency categories (A, B-complex/B12, C, D, iron-related) or normal | P0 | High | ADVANCED AI | Phase 2 (Core AI) | PLANNED |
| F02 | Multi-Body-Part Analysis | Scope image #2; PPT 1.3, 4.2 | Support analysis across skin, eyes, tongue, lips, nails, hair | P0 | High | ADVANCED AI | Phase 2 (Core AI) | PLANNED |
| F03 | Multiple Image Upload | Scope image #3 | Upload several images across body areas per assessment | P1 | Low | CORE | Phase 1 (Core App) | PLANNED |
| F04 | AI-Based Image Quality Checking | Scope image #4; PPT 4.2 | Reject blurry/dark/low-res/poorly framed images pre-analysis | P0 | Medium | CORE | Phase 1 (Core App) | PLANNED |
| F05 | Confidence Score | Scope image #5 | Display Model Confidence per prediction | P0 | Low | CORE | Phase 2 (Core AI) | PLANNED |
| F06 | Top-3 Predictions | Scope image #6 | Show top 3 possible categories ranked with confidence | P0 | Medium | ADVANCED AI | Phase 2 (Core AI) | PLANNED |
| F07 | Symptom-Based Assessment | Scope image #7; PPT 1.2 | Structured symptom questionnaire combined with image features | P0 | Medium | CORE | Phase 1 (Core App) | PLANNED |
| F08 | Personalized Food Recommendations | Scope image #8 | Diet-preference-filtered food list per predicted category | P0 | Low | CORE | Phase 1 (Core App) | PLANNED |
| F09 | Personalized Nutrition Plan | Scope image #9 | Basic daily/weekly nutrient-focused plan | P1 | Medium | CORE | Phase 2 | PLANNED |
| F10 | AI Medical/Nutrition Chatbot | Scope image #10 | Q&A on vitamins/symptoms/nutrition/user's own result | P1 | Medium | PROTOTYPE | Phase 3 | PLANNED |
| F11 | Medical-Term Explanation | Scope image #11 | Plain-language explanation of clinical terms | P1 | Low | CORE | Phase 2 | PLANNED |
| F12 | Doctor Referral System | Scope image #12; PPT 1.2 | Location-aware specialist-category suggestions | P1 | Medium | PROTOTYPE | Phase 3 | PLANNED |
| F13 | Severity/Risk-Level Indication | Scope image #13 | Low/Moderate/Needs-medical-evaluation label, explicitly not a diagnosis | P0 | Low | CORE | Phase 2 | PLANNED |
| F14 | Health Report Generation | Scope image #14 | Downloadable PDF with prediction, confidence, symptoms, recommendations, disclaimer | P0 | Medium | CORE | Phase 2 | PLANNED |
| F15 | User (Assessment) History | Scope image #15 | List of past assessments | P1 | Low | CORE | Phase 2 | PLANNED |
| F16 | Progress Tracking | Scope image #16 | Trend chart of risk/confidence/nutrition across assessments | P1 | Medium | CORE | Phase 3 | PLANNED |
| F17 | Multilingual Support | Scope image #17 | Multiple UI languages (e.g., English, Kannada, Hindi, Telugu, Tamil) | P2 | Medium | PROTOTYPE | Phase 3 | PLANNED |
| F18 | Voice-Based Interaction | Scope image #18 | Speech-to-text symptom entry via browser API | P2 | Low | PROTOTYPE | Phase 3 | PLANNED |
| F19 | Text-to-Speech | Scope image #19 | Read results/recommendations aloud via browser API | P2 | Low | PROTOTYPE | Phase 3 | PLANNED |
| F20 | Mobile Application | Scope image #20 | Future native Android/iOS app | Future | High | FUTURE SCOPE | Not in current build | PLANNED |
| F21 | Real-Time Camera Analysis | Scope image #21 | In-browser camera capture (single-frame); continuous analysis deferred | P1 (capture) / Future (continuous) | Medium/High | CORE (capture) / FUTURE SCOPE (continuous) | Phase 1 (capture) | PLANNED |
| F22 | Dataset Expansion | Scope image #22; PPT architecture "Training Dataset" | Combine/curate additional labeled images over time | P2 | High | PROTOTYPE | Ongoing/Phase 4 | PLANNED |
| F23 | Model Improvement | Scope image #23; PPT literature review architectures | Compare/upgrade model architectures (CNN, MobileNet, EfficientNet, ResNet) | P2 | High | ADVANCED AI | Phase 4 | PLANNED |
| F24 | Model Explainability (Grad-CAM) | Scope image #24 | Heat-map overlay of influential image regions | P1 | Medium | ADVANCED AI | Phase 3 | PLANNED |
| F25 | Bias and Diversity Analysis | Scope image #25 | Stratified performance evaluation across skin tone/lighting/age | P1 | High | ADVANCED AI | Phase 4 | PLANNED |
| F26 | Secure User Data | Scope image #26 | Authentication, encryption, access control | P0 | Medium | CORE | Phase 1 | PLANNED |
| F27 | Admin Dashboard | Scope image #27 | Central admin view across all admin capabilities | P0 | High | CORE | Phase 2 | PLANNED |
| F28 | Feedback System | Scope image #28 | Rating/comment on prediction usefulness | P1 | Low | PROTOTYPE | Phase 2 | PLANNED |
| F29 | Laboratory-Test Integration | Scope image #29 (explicitly "Future Scope") | Combine lab test values with symptoms/images | Future | High | FUTURE SCOPE | Not in current build | PLANNED |
| F30 | Cloud Deployment | Scope image #30 | Deploy application to a cloud platform | P2 | Medium | PROTOTYPE / FUTURE (scale) | Phase 4 (stretch) | PLANNED |
| (supporting) | Image Pre-processing Module | PPT 4.2, Architecture 3.1 | Resize/denoise/normalize/ROI-detect | P0 | Medium | CORE | Phase 2 | PLANNED |
| (supporting) | Feature Extraction Module | PPT 4.2, Architecture 3.2 | Color/texture/shape/statistical feature extraction | P0 | High | ADVANCED AI | Phase 2 | PLANNED |
| (supporting) | Offline Model Training Pipeline | PPT Architecture (Model Training Pipeline box) | Dataset → preprocessing/augmentation → training → trained model artifact | P0 | High | ADVANCED AI | Phase 2 | PLANNED |

---

## Requirement Coverage Summary

- **All 30 features from the uploaded project scope image** are captured in Sections 10, 11, and 58, with individual requirement sections (15–41) for each named area.
- **All major requirement areas from the uploaded PPT** are captured: Introduction/Overview (Sections 3–4), Objectives (Section 6), Scope — ocular/dermatological/hair-nail (Sections 9, 15), Applications (Section 4/56), Problem Identification & Existing System (Section 4), Proposed System pipeline (Sections 13, 19, 44), Literature Review (referenced in Section 21/38 as basis for architecture choices, not reproduced verbatim), Functional Requirements 4.2 (Section 11), Non-Functional Requirements 4.3 (Section 12), Hardware Requirements 4.4 (folded into Section 45 deployment note), Software Requirements 4.5 (Section 45), System Architecture 5.2 (Section 44), Implementation mockups 5.3 (Sections 45, 55 ambiguity notes), Outcomes 5.4 (Section 53, treated as unverified prior claims, not adopted as fact).
- **Medical safety language** is embedded at the global level (Section 2, 53) and repeated at every relevant feature section (5, 6, 13, 14, 21, 26, 28, 34, 39).
- **Dataset realism** is addressed without inventing a fictitious suitable dataset (Sections 20, 21, 51).
- **Free/open-source technology priority** is addressed throughout Section 45, with a documented fallback option preserving the PPT's own simpler, fully free stack.
- **No feature was silently removed.** Where a feature (e.g., continuous real-time analysis, lab integration) is not realistic for the prototype, it is explicitly retained in this document and marked FUTURE SCOPE rather than omitted.

## Prototype / Future-Scope Feature List (Quick Reference)

**Prototype Features:** F10 (Chatbot), F12 (Doctor Referral), F17 (Multilingual), F18 (Voice Input), F19 (Text-to-Speech), F22 (Dataset Expansion), F30 (Cloud Deployment, local-first with cloud as stretch)

**Advanced AI/ML Features:** F01/F06 (core classifier), F02 (multi-part), F23 (Model Improvement), F24 (Grad-CAM), F25 (Bias/Diversity Analysis)

**Future Scope Features:** F20 (Mobile App), F21-continuous (live-frame analysis), F29 (Laboratory-Test Integration), plus telemedicine/EHR integration, automated MLOps retraining, and population-level analytics (Section 56)

---

*End of Document — PRD.md*
