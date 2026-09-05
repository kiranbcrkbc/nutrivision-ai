# NutriVision AI – Engineering Implementation Rules & Safety Standards

**Project Name:** NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Version:** 1.0  
**Scope:** Binding Engineering Guidelines for Full-Stack & AI Development  

---

## 1. The 14 Immutable Implementation Rules

### Rule 1: Build ONE Module at a Time
Development must proceed strictly through the sequence defined in [DEVELOPMENT_ROADMAP.md](../DEVELOPMENT_ROADMAP.md). Never begin implementing features belonging to later phases until the current phase is fully implemented, tested, and verified.

### Rule 2: Never Break Completed Modules
Refactoring or adding new features must preserve regression test suites for all previously completed modules. Continuous verification must be executed before concluding any phase.

### Rule 3: Test Every Module
Every module must have test coverage:
- Frontend components: Component and interaction tests
- Backend services: Unit and integration tests
- AI/ML pipelines: Tensor shapes, threshold assertions, and metric calculations

### Rule 4: Update FEATURE_TRACKER.md After Implementation
Never mark any feature `COMPLETED` in [FEATURE_TRACKER.md](../FEATURE_TRACKER.md) until all its functional acceptance criteria are met, tested, and verified against PRD specifications.

### Rule 5: Do NOT Fake AI Predictions
Inference must either be driven by a loaded machine learning model or transparently labeled during development test harnesses. Never hardcode fake results into the production user path while claiming it is real AI inference.

### Rule 6: Clearly Separate Mock/Demo Data from Real AI Model Output
When developing or testing components before the model weights are loaded, any mock/simulated fixtures must be explicitly segregated in `/test` fixtures or marked with `isMock: true` telemetry.

### Rule 7: Never Claim Medical Diagnosis
NutriVision AI is an educational prototype and preliminary screening tool. The application must never claim that a user definitively has a disease or deficiency. Output must always be described as "possible indicator" or "preliminary assessment".

### Rule 8: Never Invent Model Accuracy
Never state or display fabricated model accuracy figures (e.g., claiming 99% clinical accuracy). Only report genuine statistical metrics derived from actual, documented evaluation runs on held-out test datasets.

### Rule 9: Every Assessment Result Requires a Prominent Disclaimer
Every result screen, printed/downloaded PDF report, and initial chatbot interaction must display the verbatim medical disclaimer:
> *"Results provided by NutriVision AI are AI-based preliminary assessments or possible indicators only. They are not medically certified diagnoses. Users should consult qualified healthcare professionals for medical diagnosis and treatment."*

### Rule 10: Use "Model Confidence" Terminology
All prediction probability metrics must be labeled as **"Model Confidence"** (e.g., "Model Confidence: 82%"). Never use terms like "Accuracy", "Certainty", or "Diagnostic Certainty".

### Rule 11: Secure User Data
Protect user confidentiality at all times:
- Passwords must be hashed using BCrypt (cost factor $\ge 12$).
- Authorization must use stateless JWT tokens with role verification (`ROLE_USER`, `ROLE_ADMIN`).
- Uploaded medical images must be stored securely with tenant-isolated access controls.
- Never expose private patient data across accounts.

### Rule 12: Keep Frontend, Backend, and AI Service Decoupled
Maintain strict architectural boundaries:
- Frontend SPA (React/Vite/TS) communicates exclusively via REST APIs.
- Backend API (Spring Boot) owns authentication, persistence, business logic, and orchestrates calls to the AI Service.
- AI Service (Python/FastAPI) owns computer vision preprocessing, inference, and explainability without direct database mutations.

### Rule 13: Use Environment Variables for All Secrets
Never commit passwords, JWT secrets, database connection strings with credentials, or API keys into git. All configurable parameters must be read from environment variables or `.env` files with safe templates in `.env.example`.

### Rule 14: Prioritize Free and Open-Source Technologies
The entire system must run without requiring paid subscriptions, proprietary cloud licenses, or mandatory paid third-party APIs:
- Maps $\to$ Leaflet + OpenStreetMap
- Speech $\to$ Browser Web Speech & SpeechSynthesis APIs
- Database $\to$ MySQL Community Edition
- Frameworks $\to$ React, Spring Boot, FastAPI, TensorFlow/Keras, OpenCV

---

## 2. Safety and Ethical AI Checklist

Before any feature commit:
- [ ] Medical disclaimer is visible and unmodified.
- [ ] No diagnosis claim is made in UI copy or generated text.
- [ ] Probabilities are rendered as `Model Confidence`.
- [ ] Error messages provide constructive, non-alarmist feedback (e.g., "Image too dark").
- [ ] Security access controls verified for the endpoint.
