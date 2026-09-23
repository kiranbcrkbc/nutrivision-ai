# NutriVision AI — AI-Based Vitamin Deficiency Identification & Nutrition Recommendation System

[![System Status](https://img.shields.io/badge/Status-Fully%20Operational%20%7C%20Production%20Ready-emerald.svg)](DEVELOPMENT_ROADMAP.md)
[![License](https://img.shields.io/badge/License-MIT%20%2F%20Educational-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript%20%7C%20Tailwind-cyan.svg)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.2%20%7C%20Java%2017%20%7C%20Security-green.svg)](backend/)
[![AI Microservice](https://img.shields.io/badge/AI%20Microservice-FastAPI%20%7C%20OpenCV%20%7C%20ONNX-orange.svg)](ai-service/)
[![Database](https://img.shields.io/badge/Database-MySQL%208.0%20%7C%20Hibernate-blue.svg)](database/)

> **Classification:** Academic Educational Screening Prototype & Clinical Decision Support Demonstration  
> **Target Problem:** Micronutrient Malnutrition ("Hidden Hunger") & Non-Invasive Preliminary Screening

---

## 🌐 Live Production Deployments

* **Public GitHub Repository:** [https://github.com/kiranbcrkbc/nutrivision-ai](https://github.com/kiranbcrkbc/nutrivision-ai)
* **Live Website (Frontend UI):** [https://kiranbcrkbc-nutrivision-ai.onrender.com](https://kiranbcrkbc-nutrivision-ai.onrender.com)
* **Live Backend API Gateway:** [https://kiranbcrkbc-nutrivision-backend.onrender.com](https://kiranbcrkbc-nutrivision-backend.onrender.com)
* **Live AI Microservice (MobileNetV2 ONNX):** [https://kiranbcrkbc-nutrivision-ai-service.onrender.com](https://kiranbcrkbc-nutrivision-ai-service.onrender.com)
* **Cloud Database:** TiDB Cloud Serverless (MySQL 8.0 compatible, TLS secured)

---

## ⚠️ Mandatory Medical & Dataset Disclosure

> [!IMPORTANT]
> **PROMINENT EDUCATIONAL PROTOTYPE DISCLAIMER:**
>
> 1. **Not a Medical Diagnosis:** NutriVision AI is an **educational computer vision screening prototype** designed for academic research, engineering demonstrations, and non-invasive preliminary symptom exploration. It **MUST NEVER be used for clinical diagnosis, treatment decisions, or medical prescription**.
> 2. **Model Classification Probability:** All model confidence metrics represent **mathematical visual classification probabilities** across the prototype benchmark, NOT clinical certainty.
> 3. **Prototype Synthesized Dataset:** The deep learning model was trained and evaluated on a **programmatically synthesized prototype dataset** parameterizing textbook clinical morphological features. **It has NOT undergone multi-center clinical patient trials or hospital PACS validation.**
> 4. **Clinical Verification Required:** Suspected vitamin or mineral deficiencies must always be diagnosed through **standard clinical laboratory blood evaluations (CBC, Serum Ferritin, Serum B12, Serum Zinc, 25-OH Vitamin D)** performed by licensed medical professionals.

---

## 🌟 Key Features

* 🔬 **Multi-Body-Region Visual Screening:** Support for targeted physical examinations across **Nails**, **Eyes**, **Tongue**, **Lips**, **Skin**, and **Hair**.
* 🛡️ **OpenCV Image Quality Gate:** Automated pre-inference validation using Laplacian variance sharpness analysis ($\ge 100.0$) and luminance exposure checking ($40.0 - 220.0$) to reject blurry or poorly lit images before inference.
* 🧠 **MobileNetV2 Deep Learning (ONNX Runtime):** CPU-optimized ONNX model execution producing true mathematical Softmax probability distributions across 6 distinct deficiency pattern categories.
* 📊 **Top-3 Ranked Candidate Predictions:** Multi-class ranking with explicit *"Model Confidence: XX%"* badges and 3-tier severity stratification (*Low Concern*, *Moderate Concern*, *Needs Medical Evaluation*).
* 🥗 **Database-Driven Nutrition Engine:** Tailored dietary plans backed by MySQL database records with interactive dietary filters (*Vegetarian, Vegan, Non-Vegetarian, Regional South/North Indian*) and bio-synergy nutrient absorption tips.
* 🎓 **Interactive Demonstration Mode (`/demo`):** Pre-loaded with 5 prototype benchmark demonstration cases (Iron Koilonychia, Vitamin A Bitot's Spots, Vitamin B12 Glossitis, Vitamin C Petechiae, and Healthy Control Tissue).
* 📄 **Official Printable Health Report:** High-resolution printable PDF assessment report modal (`@media print` optimized) with telemetry and standard disclaimers.
* 🔒 **Enterprise-Grade Security:** BCrypt password hashing (cost factor 12), JJWT stateless authorization filter chain, and IDOR boundary ownership enforcement (`verifyOwnershipOrAdmin`).

---

## 🏛️ System Architecture

```
                                  [ User Browser ]
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
               [ React 18 Frontend ]            [ Public Static CDN ]
               (Port 5173 / Vercel)
                         │
                         ▼ (JWT Authenticated REST / Multipart Form)
            [ Spring Boot 3.2 Backend Gateway ]
            (Port 8080 / Render / Docker)
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ MySQL 8.0 Database ]         [ FastAPI AI Microservice ]
(Users, Assessments, Images,   (Port 8000 / ONNX Runtime)
 Nutrition Recommendations)               │
                                ┌─────────┴─────────┐
                                ▼                   ▼
                        [ OpenCV Quality ]  [ MobileNetV2 ONNX ]
                        (Laplacian Blur)    (Softmax Top-3)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite 5, TypeScript, Tailwind CSS, Lucide Icons | Responsive user interface, multi-step assessment wizard, and report generation |
| **Backend Gateway** | Spring Boot 3.2.3, Java 17, Spring Security 6, JJWT | RESTful API gateway, JWT authentication, user ownership authorization, and business logic |
| **AI Microservice** | FastAPI, Python 3.11/3.14, OpenCV (Headless), ONNX Runtime, NumPy, Pillow | Computer vision quality gate, image preprocessing, and MobileNetV2 deep learning inference |
| **Persistence** | MySQL 8.0, Hibernate / Spring Data JPA, HikariCP | Relational persistence for user accounts, assessment sessions, image metadata, and nutrition tables |
| **Deployment** | Docker, Docker Compose, Render Blueprint (`render.yaml`) | Multi-container and cloud deployment configurations |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
* **Java 17+** & **Maven 3.9+**
* **Node.js 18+** & **npm**
* **Python 3.10+**
* **MySQL 8.0+** running locally on port 3306

### 1. Database Initialization
Create database `nutrivision_db` in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS nutrivision_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
*(Spring Boot's `DataInitializer` and `NutritionDataSeeder` will automatically create the tables and seed all roles, users, and 33 nutrition records on first boot!)*

### 2. Start AI Microservice (FastAPI - Port 8000)
```bash
cd ai-service
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Health Check:* `http://127.0.0.1:8000/api/ai/health`

### 3. Start Backend Gateway (Spring Boot - Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*Health Check:* `http://127.0.0.1:8080/api/health`

### 4. Start Frontend UI (React - Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Open in browser:* `http://localhost:5173`

---

## 🧪 Automated Testing & Verification

Run the comprehensive 23-step end-to-end user journey test suite:
```bash
python scripts/e2e_user_journey_test.py
```

Run backend unit and integration tests:
```bash
cd backend
mvn test
```

---

## 🌐 Cloud Deployment Guide

### Option 1: 1-Click Render Blueprint (`render.yaml`)
1. Push this repository to **GitHub**.
2. Log into [Render.com](https://render.com).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Connect your GitHub repository. Render will automatically configure:
   * **`nutrivision-ai-frontend`** (Static Site)
   * **`nutrivision-backend`** (Web Service from `backend/Dockerfile`)
   * **`nutrivision-ai-service`** (Web Service from `ai-service/Dockerfile`)
5. Supply your external MySQL connection details (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`) from a free cloud MySQL provider (such as **Aiven MySQL**, **Railway**, or **TiDB Cloud**).

### Option 2: Docker Compose (Single Host)
```bash
docker-compose up --build -d
```

---

## 🔑 Environment Variables Reference

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Public URL of the Spring Boot backend API | `http://localhost:8080/api` |
| `VITE_AI_SERVICE_URL` | Direct AI microservice URL (optional fallback) | `http://localhost:8000/api/ai` |

### Backend (`backend/src/main/resources/application-prod.yml`)
| Variable | Description | Example |
|---|---|---|
| `PORT` / `SERVER_PORT` | HTTP port for backend server | `8080` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` |
| `SPRING_DATASOURCE_URL` | JDBC MySQL connection URL | `jdbc:mysql://<host>:3306/nutrivision_db` |
| `SPRING_DATASOURCE_USERNAME` | MySQL database username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL database password | `secret` |
| `AI_SERVICE_BASE_URL` | URL of the running FastAPI microservice | `http://127.0.0.1:8000/api/ai` |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins | `https://your-frontend.vercel.app` |

### AI Service (`ai-service/.env`)
| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port for FastAPI | `8000` |
| `HOST` | Binding address | `0.0.0.0` |
| `MODELS_DIR` | Directory containing trained ONNX weights | `./models/trained` |

---

## 📖 Technical Viva & Academic Guide
For detailed answers to 20 code-accurate viva examination questions covering deep learning architectures, OpenCV algorithms, Spring Security filters, and medical ethics, see [`VIVA_GUIDE.md`](VIVA_GUIDE.md).

---

## 📄 License
This project is licensed under the **MIT License** for academic and educational demonstration purposes.
