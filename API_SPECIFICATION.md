# NutriVision AI – REST API Specification

**Project Name:** NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Version:** 1.0  
**Status:** Architectural Baseline  
**Base URL:** `http://localhost:8080/api`  
**AI Service Internal URL:** `http://localhost:8000/api/ai`  

---

## 1. Global API Standards

- **Payload Format:** JSON (`application/json`) for standard requests; `multipart/form-data` for file uploads.
- **Authentication:** HTTP Authorization Header: `Bearer <JWT_TOKEN>`.
- **Response Wrapper Standard:**
```json
{
  "success": true,
  "timestamp": "2026-09-03T07:30:00Z",
  "data": { ... },
  "message": "Operation completed successfully",
  "disclaimer": "Results provided by NutriVision AI are AI-based preliminary assessments or possible indicators only. They are not medically certified diagnoses. Users should consult qualified healthcare professionals for medical diagnosis and treatment."
}
```
- **Error Standard:**
```json
{
  "success": false,
  "timestamp": "2026-09-03T07:30:00Z",
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Image quality check failed: Image is too blurry",
    "details": ["Laplacian blur score 42.1 is below minimum threshold 100.0"]
  }
}
```

---

## 2. Authentication & User Management Endpoints

### 2.1 Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Jane Doe"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "userId": 101,
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "role": "ROLE_USER"
  },
  "message": "Registration successful"
}
```

### 2.2 Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresInMs": 86400000,
    "user": {
      "userId": 101,
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "ROLE_USER"
    }
  }
}
```

### 2.3 Get User Profile
- **Method:** `GET`
- **Endpoint:** `/api/users/profile`
- **Auth:** Required (`ROLE_USER` or `ROLE_ADMIN`)
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 101,
    "email": "user@example.com",
    "fullName": "Jane Doe",
    "age": 28,
    "gender": "FEMALE",
    "dietaryPreference": "VEGETARIAN",
    "preferredLanguage": "en",
    "city": "Bengaluru",
    "country": "India"
  }
}
```

### 2.4 Update User Profile
- **Method:** `PUT`
- **Endpoint:** `/api/users/profile`
- **Auth:** Required
- **Request Body:**
```json
{
  "fullName": "Jane Doe",
  "age": 29,
  "gender": "FEMALE",
  "dietaryPreference": "VEGAN",
  "preferredLanguage": "kn",
  "city": "Mysuru"
}
```

---

## 3. Assessment & Image Quality Endpoints

### 3.1 Initialize New Assessment
- **Method:** `POST`
- **Endpoint:** `/api/assessments`
- **Auth:** Required
- **Request Body:**
```json
{
  "targetBodyPart": "NAILS"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "assessmentId": 5001,
    "targetBodyPart": "NAILS",
    "status": "DRAFT",
    "createdAt": "2026-09-03T07:35:00Z"
  }
}
```

### 3.2 Upload Assessment Image (with Quality Gate)
- **Method:** `POST`
- **Endpoint:** `/api/assessments/{assessmentId}/images`
- **Auth:** Required
- **Payload:** `multipart/form-data` (`file`: image/jpeg or image/png)
- **Response (200 OK - Quality Passed):**
```json
{
  "success": true,
  "data": {
    "imageId": 1204,
    "assessmentId": 5001,
    "qualityStatus": "PASSED",
    "blurScore": 184.6,
    "brightnessScore": 132.0,
    "filePath": "/uploads/assessments/5001/nail_image_01.jpg"
  },
  "message": "Image quality verified and accepted"
}
```
- **Response (422 Unprocessable - Quality Failed):**
```json
{
  "success": false,
  "error": {
    "code": "IMAGE_QUALITY_REJECTED",
    "message": "Image rejected: Insufficient lighting detected",
    "details": ["Mean luminance is 24.5 (minimum required is 40.0). Please retake the photo in well-lit natural light."]
  }
}
```

### 3.3 Associate Symptoms
- **Method:** `POST`
- **Endpoint:** `/api/assessments/{assessmentId}/symptoms`
- **Auth:** Required
- **Request Body:**
```json
{
  "symptomCodes": ["BRITTLE_NAILS", "SPOON_SHAPED_NAILS", "FATIGUE", "PALE_SKIN"]
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "assessmentId": 5001,
    "symptomsCount": 4,
    "status": "SYMPTOMS_RECORDED"
  }
}
```

### 3.4 Execute Prediction & Inference
- **Method:** `POST`
- **Endpoint:** `/api/assessments/{assessmentId}/evaluate`
- **Auth:** Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "assessmentId": 5001,
    "status": "COMPLETED",
    "severityRiskLevel": "MODERATE_CONCERN",
    "predictions": [
      {
        "rank": 1,
        "deficiencyCategory": "IRON_DEFICIENCY",
        "modelConfidence": 0.824,
        "confidencePercentage": "82.4%"
      },
      {
        "rank": 2,
        "deficiencyCategory": "VITAMIN_B12",
        "modelConfidence": 0.118,
        "confidencePercentage": "11.8%"
      },
      {
        "rank": 3,
        "deficiencyCategory": "VITAMIN_C",
        "modelConfidence": 0.045,
        "confidencePercentage": "4.5%"
      }
    ],
    "gradcamImageUrl": "/uploads/assessments/5001/gradcam_overlay.jpg"
  },
  "disclaimer": "Results provided by NutriVision AI are AI-based preliminary assessments or possible indicators only. They are not medically certified diagnoses. Users should consult qualified healthcare professionals for medical diagnosis and treatment."
}
```

---

## 4. Recommendations, Nutrition & Report Endpoints

### 4.1 Get Food Recommendations
- **Method:** `GET`
- **Endpoint:** `/api/recommendations/{assessmentId}?dietPreference=VEGETARIAN`
- **Auth:** Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "assessmentId": 5001,
    "primaryDeficiency": "IRON_DEFICIENCY",
    "dietPreference": "VEGETARIAN",
    "recommendedFoods": [
      {
        "foodItemName": "Spinach & Dark Leafy Greens",
        "richNutrient": "Non-heme Iron, Folate",
        "servingSuggestion": "1-2 cups cooked daily, paired with Vitamin C (lemon juice) to enhance absorption",
        "regionalAvailability": "Widely available across India (Palak)"
      },
      {
        "foodItemName": "Lentils & Chickpeas (Dal & Chana)",
        "richNutrient": "Iron, Protein, Zinc",
        "servingSuggestion": "1 bowl cooked dal with meals",
        "regionalAvailability": "All regions"
      },
      {
        "foodItemName": "Jaggery (Gur) & Roasted Gram",
        "richNutrient": "Iron, Minerals",
        "servingSuggestion": "Small piece with roasted chana as snack",
        "regionalAvailability": "Common staple"
      }
    ]
  }
}
```

### 4.2 Get 7-Day Nutrition Plan
- **Method:** `GET`
- **Endpoint:** `/api/nutrition-plans/{assessmentId}`
- **Auth:** Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "planId": 801,
    "assessmentId": 5001,
    "primaryDeficiency": "IRON_DEFICIENCY",
    "dietPreference": "VEGETARIAN",
    "weeklyPlan": {
      "day1": {
        "breakfast": "Sprouted moong salad with lemon juice & pomegranate",
        "lunch": "Palak paneer with whole wheat roti and curd",
        "snack": "Roasted chana with small cube of jaggery",
        "dinner": "Mixed vegetable dalia with fresh coriander chutney"
      },
      "day2": { ... }
    }
  }
}
```

### 4.3 Download Health Report PDF
- **Method:** `GET`
- **Endpoint:** `/api/reports/{assessmentId}/download`
- **Auth:** Required
- **Response:** `application/pdf` binary stream (with `Content-Disposition: attachment; filename="NutriVision_Report_5001.pdf"`)

---

## 5. History & Progress Tracking Endpoints

### 5.1 Get User Assessment History
- **Method:** `GET`
- **Endpoint:** `/api/assessments/history?page=0&size=10`
- **Auth:** Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "assessmentId": 5001,
        "targetBodyPart": "NAILS",
        "createdAt": "2026-09-03T07:35:00Z",
        "status": "COMPLETED",
        "severityRiskLevel": "MODERATE_CONCERN",
        "topPrediction": "IRON_DEFICIENCY",
        "modelConfidence": 0.824
      }
    ],
    "totalPages": 1,
    "totalElements": 1
  }
}
```

### 5.2 Get Progress Trends
- **Method:** `GET`
- **Endpoint:** `/api/assessments/trends`
- **Auth:** Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trendPoints": [
      {
        "date": "2026-08-15",
        "bodyPart": "SKIN",
        "deficiency": "VITAMIN_C",
        "confidence": 0.74,
        "riskLevel": "MODERATE_CONCERN"
      },
      {
        "date": "2026-09-03",
        "bodyPart": "NAILS",
        "deficiency": "IRON_DEFICIENCY",
        "confidence": 0.824,
        "riskLevel": "MODERATE_CONCERN"
      }
    ]
  }
}
```

---

## 6. Chatbot, Doctor Referrals & Feedback Endpoints

### 6.1 Chatbot Interaction
- **Method:** `POST`
- **Endpoint:** `/api/chatbot/conversations/{conversationId}/messages`
- **Auth:** Required
- **Request Body:**
```json
{
  "messageText": "What are the common symptoms of Vitamin B12 deficiency?"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sender": "BOT",
    "messageText": "Common signs of Vitamin B12 deficiency include fatigue, tingling sensations in hands or feet, tongue soreness (glossitis), and pale or jaundiced skin. Please remember this is educational information and not a medical diagnosis.",
    "disclaimer": "Results and chatbot responses are for educational guidance only. Please consult a qualified doctor for clinical evaluation."
  }
}
```

### 6.2 Doctor Referral Suggestions
- **Method:** `GET`
- **Endpoint:** `/api/referrals?deficiency=IRON_DEFICIENCY&city=Bengaluru`
- **Auth:** Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "deficiencyCategory": "IRON_DEFICIENCY",
    "suggestedSpecialists": [
      {
        "specialistType": "Clinical Nutritionist / Dietitian",
        "description": "Specializes in dietary planning for iron optimization and nutrient absorption."
      },
      {
        "specialistType": "General Physician / Internist",
        "description": "Can perform certified laboratory blood tests (CBC, Serum Ferritin) to confirm diagnosis."
      }
    ]
  }
}
```

### 6.3 Submit Assessment Feedback
- **Method:** `POST`
- **Endpoint:** `/api/feedback`
- **Auth:** Required
- **Request Body:**
```json
{
  "assessmentId": 5001,
  "rating": 5,
  "comments": "Very clear and helpful dietary suggestions."
}
```

---

## 7. Administrative Endpoints (`ROLE_ADMIN`)

### 7.1 Admin System Overview
- **Method:** `GET`
- **Endpoint:** `/api/admin/dashboard`
- **Auth:** Admin Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1420,
    "totalAssessments": 3890,
    "activeModelVersion": "v1.0.0-mobilenetv2",
    "topPredictedCategories": {
      "IRON_DEFICIENCY": 1420,
      "VITAMIN_D": 980,
      "VITAMIN_B12": 820,
      "VITAMIN_A": 410,
      "VITAMIN_C": 260
    },
    "averageModelConfidence": 0.784
  }
}
```

### 7.2 Model Version Activation (F23)
- **Method:** `POST`
- **Endpoint:** `/api/admin/models/{modelVersionId}/activate`
- **Auth:** Admin Required
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Model version v1.2.0-resnet50 activated successfully for live inference."
}
```

### 7.3 Bias & Diversity Metrics (F25)
- **Method:** `GET`
- **Endpoint:** `/api/admin/bias-analysis`
- **Auth:** Admin Required
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "modelVersion": "v1.0.0-mobilenetv2",
    "stratifiedMetrics": [
      { "slice": "Skin Tone Types I-II", "accuracy": 0.86, "sampleCount": 320 },
      { "slice": "Skin Tone Types III-IV", "accuracy": 0.83, "sampleCount": 450 },
      { "slice": "Skin Tone Types V-VI", "accuracy": 0.81, "sampleCount": 280 },
      { "slice": "Low Light Conditions", "accuracy": 0.72, "sampleCount": 150 },
      { "slice": "Normal Lighting", "accuracy": 0.87, "sampleCount": 900 }
    ]
  }
}
```

---

## 8. AI Microservice Internal Endpoints (FastAPI)

### 8.1 Image Quality Check
- **Method:** `POST`
- **Endpoint:** `http://localhost:8000/api/ai/quality-check`
- **Payload:** `multipart/form-data` (`file`)
- **Response (200 OK):**
```json
{
  "passed": true,
  "blur_score": 184.6,
  "brightness_score": 132.0,
  "dimensions": { "width": 640, "height": 480 },
  "rejection_reason": null
}
```

### 8.2 Image Inference & Top-3 Prediction
- **Method:** `POST`
- **Endpoint:** `http://localhost:8000/api/ai/predict`
- **Payload:** `multipart/form-data` (`file`, `body_part`, `symptom_vector_json`)
- **Response (200 OK):**
```json
{
  "body_part": "NAILS",
  "predictions": [
    { "category": "IRON_DEFICIENCY", "confidence": 0.824, "rank": 1 },
    { "category": "VITAMIN_B12", "confidence": 0.118, "rank": 2 },
    { "category": "VITAMIN_C", "confidence": 0.045, "rank": 3 }
  ],
  "gradcam_heatmap_path": "uploads/assessments/5001/gradcam_heatmap.png"
}
```
