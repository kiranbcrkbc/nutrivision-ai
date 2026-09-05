# NutriVision AI – System Architecture Document

**Version:** 1.0  
**Project Name:** NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Status:** Architectural Baseline / Approved Blueprint  
**Classification:** Educational Prototype & AI-Assisted Preliminary Assessment System  

---

## 1. Executive Architecture Overview

NutriVision AI is built on a modern, decoupled **three-tier micro-service architecture** designed to deliver high responsiveness, strict separation of concerns, and robust security.

```mermaid
graph TD
    subgraph Client_Layer ["Client Layer (Web / Browser)"]
        UI["React 18 + Vite + TypeScript SPA"]
        SpeechIn["Browser Web Speech API (STT)"]
        SpeechOut["Browser SpeechSynthesis API (TTS)"]
        Maps["Leaflet + OpenStreetMap"]
    end

    subgraph Gateway_Backend ["Application & Business Logic Layer"]
        API["Spring Boot 3.x REST API"]
        Sec["Spring Security + JWT Auth (BCrypt)"]
        JPA["Spring Data JPA Repository"]
        PDF["PDF Report Engine (OpenPDF/iText)"]
        Storage["Local Secure Image Storage / File System"]
    end

    subgraph AI_Inference ["AI/ML Microservice Layer"]
        FastAPI["Python 3.10+ FastAPI Service"]
        QC["Image Quality Engine (OpenCV / Laplacian / Brightness)"]
        PreProc["Preprocessing & ROI Normalization"]
        ModelCore["TensorFlow/Keras CNN Inference Engine"]
        GradCAM["Grad-CAM Explainability Engine"]
        ModelReg["Model Registry & Metrics Store"]
    end

    subgraph Data_Storage ["Persistence Layer"]
        MySQL[("MySQL 8.0 Community Edition Database")]
    end

    UI <-->|HTTPS / REST + JSON| API
    UI -.->|Speech / Maps APIs| SpeechIn
    UI -.->|Audio Output| SpeechOut
    UI -.->|Map Tiles| Maps

    API <-->|JPA / JDBC Connection Pool| MySQL
    API <-->|HTTP REST / Multipart Form Data| FastAPI
    API -->|Save / Retrieve Images| Storage

    FastAPI -->|Load Model Artifacts| ModelCore
    FastAPI -->|Generate Heatmaps| GradCAM
```

### Safety and Non-Diagnostic Architectural Boundary

> [!IMPORTANT]
> **Core Architectural Invariant:**
> 1. All prediction outputs leaving the AI Service and Spring Boot Backend are explicitly tagged as **`model_confidence`** and categorized as **preliminary indicators**, never medical diagnoses.
> 2. Every assessment response structure mandatorily includes the global **`medical_disclaimer`** payload.
> 3. Predictions never claim medical certainty; risk levels are designated as **Low concern**, **Moderate concern**, or **Needs medical evaluation**.

---

## 2. Component Architectures

### 2.1 Frontend Architecture (React + Vite + TypeScript)

The frontend is a Single Page Application (SPA) optimized for fast load times, modularity, and accessibility.

```mermaid
graph LR
    subgraph Frontend_App ["Frontend SPA Structure"]
        Router["React Router v6"]
        State["Zustand / React Context (Auth & Assessment State)"]
        I18n["react-i18next (Multilingual Engine)"]
        AxiosClient["Axios HTTP Client (JWT Interceptor)"]
        UIComponents["UI Component System (Tailwind CSS + Lucide)"]
        Charts["Recharts (Progress & Analytics)"]
    end

    Router --> UIComponents
    UIComponents --> State
    UIComponents --> I18n
    UIComponents --> Charts
    State --> AxiosClient
```

#### Key Frontend Modules:
- **Routing & Guards:** Role-based route gating (`PublicRoute`, `ProtectedRoute`, `AdminRoute`).
- **State Management:** Lightweight centralized state for authentication tokens, active assessment session, multi-step wizard state, and user preferences.
- **Multilingual Support (i18n):** `i18next` externalized translation bundles supporting English, Kannada, Hindi, Telugu, and Tamil.
- **Accessibility Layer:** Native browser speech-to-text integration (`webkitSpeechRecognition`/`SpeechRecognition`) and text-to-speech (`speechSynthesis`).
- **Data Visualization:** `Recharts` for historical risk trends, confidence distribution, and admin demographic analysis.
- **Mapping Module:** `Leaflet` with OpenStreetMap tile layer for doctor/nutritionist referral suggestions without paid API keys.

---

### 2.2 Backend Architecture (Spring Boot 3.x)

The Spring Boot backend acts as the central business orchestrator, data guardian, and secure gateway.

```mermaid
graph TD
    subgraph Spring_Boot_Core ["Spring Boot Application Architecture"]
        Controller["REST Controllers (@RestController)"]
        Filters["Security Filter Chain (JwtAuthenticationFilter)"]
        Service["Business Service Layer (@Service)"]
        AIServiceClient["AI Service Feign/WebClient"]
        Repository["Spring Data JPA Repositories"]
        SecurityConfig["Spring Security + BCryptPasswordEncoder"]
    end

    Controller --> Filters
    Filters --> SecurityConfig
    Controller --> Service
    Service --> AIServiceClient
    Service --> Repository
```

#### Core Backend Responsibilities:
1. **Security & Identity:** BCrypt password hashing (cost factor 12), stateless JWT token issue/validation, role-based authorization (`ROLE_USER`, `ROLE_ADMIN`).
2. **Assessment Orchestrator:** Manages multi-step assessment lifecycle: body part selection $\to$ image upload $\to$ symptom association $\to$ forwarding to AI service $\to$ persistence $\to$ recommendation aggregation.
3. **Recommendation Engine:** Rule-based recommendation matrix mapping deficiency classes to curated food datasets and 7-day nutrition plans, filtered by dietary preference (`VEGETARIAN`, `NON_VEGETARIAN`, `VEGAN`, `REGIONAL`).
4. **Report Generator:** Dynamic PDF assembly generating structured health summaries containing user data, symptoms, image thumbnails, predictions, recommendations, and prominent medical disclaimers.
5. **Admin & Auditing:** Comprehensive administrative endpoints for user management, system metrics, dataset tracking, model versioning, feedback triage, and audit logging.

---

### 2.3 AI/ML Microservice Architecture (Python + FastAPI)

The AI/ML service handles computer vision processing, image quality evaluation, deep learning inference, and explainability.

```mermaid
graph TD
    subgraph FastAPI_Pipeline ["AI/ML Service Pipeline"]
        Endpoint["FastAPI Endpoints (/predict, /quality-check, /gradcam)"]
        QCModule["Image Quality Checker (Blur, Brightness, Resolution)"]
        PreprocModule["Preprocessing (Resize, Normalize, Denoise, ROI)"]
        InferenceModule["Deep Learning Classifier (CNN / MobileNet / ResNet)"]
        FusionModule["Image + Symptom Feature Fusion"]
        ExplainModule["Grad-CAM Saliency Map Generator"]
        RegistryModule["Model Versioning & Multi-Body-Part Router"]
    end

    Endpoint --> QCModule
    QCModule -->|Passed| PreprocModule
    QCModule -->|Failed| Endpoint
    PreprocModule --> RegistryModule
    RegistryModule --> InferenceModule
    InferenceModule --> FusionModule
    InferenceModule --> ExplainModule
```

#### AI Service Features:
1. **Automated Quality Checking:** Pre-inference validation rejecting blurry (Laplacian variance $< \text{threshold}$), over/underexposed (histogram luminance checks), or undersized images with actionable feedback.
2. **Body Part Routing:** Dynamic routing based on selected target (`SKIN`, `EYES`, `TONGUE`, `LIPS`, `NAILS`, `HAIR`, `FACE`).
3. **Inference & Top-3 Prediction:** Softmax probability distribution extraction returning Top-3 candidate deficiencies with discrete `model_confidence` percentages.
4. **Explainability Engine (Grad-CAM):** Computes gradient-weighted class activation maps from the final convolutional layer, generating transparent heatmap overlays for user inspection.
5. **Model Registry:** Pluggable model loader allowing dynamic swapping of active model artifacts (`.h5`, `.keras`, `.onnx`) without restarting the backend.

---

## 3. Communication Protocols and Data Flow

### 3.1 Inter-Service Communication

| Channel | Protocol | Payload Type | Description |
|---|---|---|---|
| **Frontend $\leftrightarrow$ Backend** | HTTPS / REST | JSON / Multipart Form-Data | Client requests, authentication headers, image uploads, assessment results |
| **Backend $\leftrightarrow$ AI Service** | HTTP / REST (Internal) | Multipart Form-Data + JSON | Synchronous image forwarding, symptom vectors, inference results, Grad-CAM generation |
| **Backend $\leftrightarrow$ Database** | JDBC / TCP | SQL (HikariCP Connection Pool) | Relational persistence, transactional data access |

---

### 3.2 End-to-End Assessment Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (React UI)
    participant SB as Spring Boot Backend
    participant DB as MySQL Database
    participant AI as FastAPI AI Service
    participant FS as Local Storage

    User->>SB: POST /api/assessments (Start Session, Body Part)
    SB->>DB: Insert Assessment (Status: DRAFT)
    SB-->>User: Assessment Created (assessment_id)

    User->>SB: POST /api/assessments/{id}/images (Upload Image File)
    SB->>FS: Store temporary image
    SB->>AI: POST /api/ai/quality-check (Image File)
    AI-->>SB: Quality Result (Passed/Failed + Metrics)
    
    alt Quality Check Failed
        SB-->>User: 422 Unprocessable (Actionable feedback: "Image too dark, please retake")
    else Quality Check Passed
        SB->>DB: Insert AssessmentImage (Path, Quality: PASSED)
        SB-->>User: Image Accepted
    end

    User->>SB: POST /api/assessments/{id}/symptoms (Symptom Questionnaire Vector)
    SB->>DB: Insert AssessmentSymptoms

    User->>SB: POST /api/assessments/{id}/evaluate (Trigger Analysis)
    SB->>AI: POST /api/ai/predict (Image Path, Body Part, Symptoms)
    AI->>AI: Preprocess + Inference + Top-3 Softmax + Grad-CAM
    AI-->>SB: Predictions (Top-3, Confidence, Severity, Grad-CAM Path)
    
    SB->>DB: Persist Predictions & Risk Level
    SB->>SB: Aggregate Food Recommendations & 7-Day Plan
    SB->>DB: Update Assessment (Status: COMPLETED)
    SB-->>User: Full Assessment Result + Medical Disclaimer
```

---

## 4. Authentication and Authorization Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as React Client
    participant AuthCtrl as Auth Controller
    participant Sec as Spring Security
    participant DB as MySQL Database
    participant JWT as JWT Service

    Note over Client, JWT: Registration Flow
    Client->>AuthCtrl: POST /api/auth/register (Name, Email, Password)
    AuthCtrl->>Sec: Hash Password with BCrypt (Cost 12)
    AuthCtrl->>DB: Save User (Role: ROLE_USER)
    AuthCtrl-->>Client: 201 Created (Registration Successful)

    Note over Client, JWT: Login Flow
    Client->>AuthCtrl: POST /api/auth/login (Email, Password)
    AuthCtrl->>DB: Fetch User by Email
    AuthCtrl->>Sec: Verify Password Match (BCrypt)
    AuthCtrl->>JWT: Generate Access Token (Claims: userId, role, expiry)
    AuthCtrl-->>Client: 200 OK (JWT Token, User Profile)

    Note over Client, JWT: Authenticated Request
    Client->>AuthCtrl: GET /api/assessments/history (Header: Bearer <JWT>)
    AuthCtrl->>JWT: Validate Token Signature & Expiry
    AuthCtrl->>DB: Query User Assessment Records
    AuthCtrl-->>Client: 200 OK (Assessment History JSON)
```

---

## 5. Image Processing and Preprocessing Pipeline

```mermaid
flowchart TD
    RawImg[Raw Uploaded Image] --> DimCheck{Resolution >= 224x224?}
    DimCheck -- No --> RejectRes[Reject: Resolution too low]
    DimCheck -- Yes --> BlurCheck{Laplacian Variance >= 100?}
    BlurCheck -- No --> RejectBlur[Reject: Image blurry, hold device steady]
    BlurCheck -- Yes --> BrightCheck{Mean Luminance in 40..220?}
    BrightCheck -- No --> RejectLight[Reject: Lighting inadequate - too dark or overexposed]
    BrightCheck -- Yes --> Accepted[Quality Check Passed]

    Accepted --> Resize[Resize to Model Input: 224x224 / 299x299]
    Resize --> Denoise[Gaussian / Bilateral Denoising]
    Denoise --> Norm[Pixel Normalization: 0..1 or -1..1]
    Norm --> ROI[Region of Interest ROI Isolation]
    ROI --> DLInput[Tensor Ready for Deep Learning Model]
```

---

## 6. AI Inference, Prediction, and Explainability Pipeline

```mermaid
graph TD
    Tensor[Preprocessed Image Tensor] --> CNN[Trained CNN Backbone (e.g., MobileNetV2 / ResNet50)]
    SymptomVec[Structured Symptom Vector] --> DenseSym[Symptom Feature Layer]
    
    CNN --> FeatureVec[Visual Feature Vector]
    FeatureVec & DenseSym --> ConcatLayer[Feature Fusion Layer]
    ConcatLayer --> DenseHead[Classification Dense Head]
    DenseHead --> Softmax[Softmax Layer]
    
    Softmax --> ProbDist[Probability Distribution over Deficiency Classes]
    ProbDist --> Top3[Top-3 Ranked Predictions + Model Confidence %]
    
    CNN --> ConvLayer[Target Conv Layer Activations]
    ConvLayer & DenseHead --> GradCAMCompute[Grad-CAM Gradient Backprop]
    GradCAMCompute --> Heatmap[Saliency Heatmap Generation]
    Heatmap --> Overlay[Transparent Overlay on Source Image]
    
    Top3 --> SeverityLogic{Confidence & Class Mapping}
    SeverityLogic -->|Mild Indicators| RiskLow["Low Concern"]
    SeverityLogic -->|Moderate Indicators| RiskMod["Moderate Concern"]
    SeverityLogic -->|High/Multiple Indicators| RiskEval["Needs Medical Evaluation"]
```

---

## 7. Recommendation and Nutrition Planning Engine

```mermaid
graph TD
    PredictedClass[Top Predicted Deficiency Class] --> DietMatrix[(Curated Nutrition Matrix Reference)]
    UserPref[User Dietary Filter: Veg / Non-Veg / Vegan / Regional] --> FilterEngine[Dietary Filter Engine]
    DietMatrix --> FilterEngine
    
    FilterEngine --> FoodList[Curated Food Recommendation List]
    FilterEngine --> MacroMicro[Micro/Macro Nutrient Targets]
    
    MacroMicro --> PlanGen[7-Day Nutrition Plan Builder]
    PlanGen --> MealSchedule[Structured Breakfast / Lunch / Snack / Dinner Plan]
    
    FoodList & MealSchedule --> FinalResult[Enriched Assessment Result Payload]
```

---

## 8. Admin Architecture and Auditing

The Admin sub-system provides role-gated capabilities (`ROLE_ADMIN`):

```mermaid
graph TD
    AdminUser["Admin User (Admin Portal)"] --> AdminGateway["Spring Boot Admin API (@PreAuthorize('hasRole(ADMIN)'))"]
    
    AdminGateway --> UserMgmt["User Management (View, Search, Status, Roles)"]
    AdminGateway --> AssessAudit["Assessment Monitor & Aggregate Analytics"]
    AdminGateway --> DatasetMgmt["Dataset Registry & Lineage Tracking (F22)"]
    AdminGateway --> ModelMgmt["Model Versioning, Metrics & Active Swapping (F23)"]
    AdminGateway --> BiasAnalytics["Bias & Diversity Stratification Engine (F25)"]
    AdminGateway --> FeedbackTriage["User Feedback Triage & Rating Analysis (F28)"]
    AdminGateway --> AuditLogger["Admin Audit Trail (Log all configuration changes)"]

    AuditLogger --> DB[("MySQL Admin Audit Log")]
```

---

## 9. Security and Privacy Architecture

```mermaid
graph LR
    subgraph Security_Shield ["Security & Privacy Controls"]
        direction TB
        B1["BCrypt Password Hashing (Cost 12)"]
        B2["Stateless JWT Token Validation with Short Expiry"]
        B3["Role-Based Access Control (RBAC)"]
        B4["Strict Input Sanitization & Parameterized Queries (SQLi Prevention)"]
        B5["CORS Configuration (Whitelisted Origins Only)"]
        B6["File Upload Restrictions (MIME validation, size caps)"]
        B7["User Data Ownership (Strict tenant/user isolation)"]
        B8["Medical Privacy: Non-diagnostic Framing & Explicit Disclaimers"]
    end
```

---

## 10. Future Deployment Architecture (Containerized & Cloud-Ready)

```mermaid
graph TD
    subgraph Docker_Compose_Environment ["Docker Containerization Topology"]
        Nginx["Nginx Reverse Proxy / Static Web Server :80/:443"]
        FEContainer["Frontend SPA (React Build)"]
        BEContainer["Backend Service (Spring Boot JAR) :8080"]
        AIContainer["AI Service (FastAPI / Uvicorn) :8000"]
        DBContainer[("MySQL 8.0 Container :3306")]
        VolumeImages[("Persistent Volume: /uploads")]
        VolumeDB[("Persistent Volume: /mysql_data")]
    end

    Internet((Client Traffic)) --> Nginx
    Nginx -->|/ | FEContainer
    Nginx -->|/api/*| BEContainer
    BEContainer -->|/api/ai/*| AIContainer
    BEContainer --> DBContainer
    BEContainer --> VolumeImages
    AIContainer --> VolumeImages
    DBContainer --> VolumeDB
```

---

## 11. Architecture Quality Matrix

| Quality Attribute | Architectural Strategy | Verification Mechanism |
|---|---|---|
| **Modularity** | 3-tier decoupled services (React, Spring Boot, FastAPI) | Independent build and run cycles |
| **Safety & Compliance** | Mandatory disclaimers, Model Confidence terminology, non-diagnostic constraints | Automated API contract assertions |
| **Performance** | Asynchronous quality checks, lightweight CNN inference, indexed database queries | Single assessment $<5$ seconds |
| **Extensibility** | Pluggable model registry, externalized i18n dictionaries, modular recommendation rules | Zero-code active model swapping |
| **Security** | BCrypt, JWT, Spring Security RBAC, isolated file storage | Security penetration & auth regression tests |
| **Cost Efficiency** | 100% Free & Open Source Software (FOSS) stack | Zero paid API dependencies |
