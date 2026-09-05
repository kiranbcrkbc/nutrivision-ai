# Phase 9 — Nutrition Recommendation Engine Implementation Report

**System:** NutriVision AI – AI-Based Vitamin Deficiency Identification and Nutrition Recommendation System  
**Phase:** Phase 9 — Database-Driven Nutrition & Food Recommendation Engine  
**Status:** **COMPLETED & VERIFIED**  
**Date:** September 3, 2026  

---

## 1. Architecture Implemented

The nutrition recommendation engine follows a clean, decoupled, database-driven service architecture that translates preliminary AI visual screening classifications into priority-ranked, culturally relevant, educational food suggestions:

```
[ AI Screening Result (Top Visual Pattern) ]
                    │
                    ▼
       [ Category & Nutrient Mapping ]
                    │
                    ▼
     [ Dietary & Regional Preference Filter ]
     (Vegetarian / Vegan / Non-Veg / Indian / South Indian)
                    │
                    ▼
   [ Spring Data JPA Food Repository Query ]
  (Sorted by Priority ASC, Food Name ASC)
                    │
                    ▼
 [ Composite Educational Nutrition Response ]
  • Biological Function & Importance
  • Absorption Synergy & Bioavailability Enhancers
  • Priority Ranked Dietary Food Recommendations
  • Educational Non-Diagnostic Safety Disclaimers
```

---

## 2. Database Changes & Entity Schema

Two new non-destructive JPA entities and supporting enums were added to the Spring Boot schema:

### Enums
- **`DietType`**: `VEGETARIAN`, `VEGAN`, `NON_VEGETARIAN`, `ANY`
- **`FoodRegion`**: `INDIAN`, `SOUTH_INDIAN`, `GENERAL`
- **`DeficiencyCategory`**: `IRON_DEFICIENCY`, `VITAMIN_A_DEFICIENCY`, `VITAMIN_B12_DEFICIENCY`, `VITAMIN_C_DEFICIENCY`, `ZINC_DEFICIENCY`, `HEALTHY_NORMAL`

### Tables
1. **`food_items`**
   - `food_id` (BIGINT PK AUTO_INCREMENT)
   - `category` (VARCHAR(50) NOT NULL)
   - `nutrient_name` (VARCHAR(100) NOT NULL)
   - `food_name` (VARCHAR(150) NOT NULL)
   - `local_name` (VARCHAR(150))
   - `diet_type` (VARCHAR(30) NOT NULL)
   - `region` (VARCHAR(30) NOT NULL)
   - `serving_suggestion` (VARCHAR(500))
   - `educational_description` (VARCHAR(1000))
   - `absorption_notes` (VARCHAR(500))
   - `safety_note` (VARCHAR(500))
   - `priority` (INT NOT NULL)

2. **`nutrient_guidance`**
   - `guidance_id` (BIGINT PK AUTO_INCREMENT)
   - `category` (VARCHAR(50) NOT NULL UNIQUE)
   - `nutrient_name` (VARCHAR(100) NOT NULL)
   - `educational_overview` (VARCHAR(1500) NOT NULL)
   - `biological_importance` (VARCHAR(1500) NOT NULL)
   - `synergy_absorption_notes` (VARCHAR(1000))
   - `safety_disclaimer` (VARCHAR(1000))

---

## 3. APIs Created

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/api/nutrition/categories` | `GET` | Public | Returns all 6 supported screening categories with nutrient metadata. |
| `/api/nutrition/guidance/{category}` | `GET` | Public | Retrieves biological function, overview, absorption synergy, and safety notes. |
| `/api/nutrition/recommendations/{category}` | `GET` | Public | Retrieves priority-ranked dietary food suggestions with optional `?dietType=` and `?region=` filters. |
| `/api/nutrition/assessment/{assessmentId}` | `GET` | Authenticated | Integrates recommendations directly with a user's completed AI assessment. |

---

## 4. Food Categories Supported

All 6 screening categories are supported with comprehensive nutrient profiles:

1. **`Healthy_Normal`** $\rightarrow$ *Balanced Multi-Nutrients & Micronutrient Synergy*
2. **`Iron_Deficiency`** $\rightarrow$ *Iron (Fe) & Erythropoietic Co-factors*
3. **`Vitamin_A_Deficiency`** $\rightarrow$ *Vitamin A (Beta-Carotene & Retinol)*
4. **`Vitamin_B12_Deficiency`** $\rightarrow$ *Vitamin B12 (Cobalamin)*
5. **`Vitamin_C_Deficiency`** $\rightarrow$ *Vitamin C (L-Ascorbic Acid)*
6. **`Zinc_Deficiency`** $\rightarrow$ *Zinc (Zn)*

---

## 5. Seeded Food Recommendations

**32 authentic food items** were seeded via `NutritionDataSeeder.java` prioritizing commonly available Indian, South Indian (Karnataka favorites), vegetarian, vegan, and non-vegetarian options:

- **Iron Deficiency:** Finger Millet / Ragi (Mudde/Dosa), Moringa / Drumstick Leaves (Nuggesoppu), Spinach (Palak), Black Sesame Seeds (Ellu/Til), Sprouted Kala Chana, Rajma, Eggs, Mutton Liver (Kaleji).
- **Vitamin A Deficiency:** Gajar / Carrots, Sweet Potato (Genasu / Shakarkand), Yellow Pumpkin (Kumbalakai), Pure Cow Ghee, Ripe Papaya, Egg Yolk.
- **Vitamin B12 Deficiency:** Fresh Curd / Yogurt (Mosaru / Dahi), Fresh Paneer, Fortified Plant Milk / Nutritional Yeast, Indian Mackerel (Bangude / Tarli), Boiled Whole Eggs.
- **Vitamin C Deficiency:** Indian Gooseberry (Amla / Bettada Nellikai), Pink Guava (Seebe Hannu), Fresh Lemon / Lime, Green Bell Pepper, Sprouted Green Moong Kosambari.
- **Zinc Deficiency:** Pumpkin Seeds (Pepitas), Sesame Seeds (Ellu), Cashew Nuts (Godambi), Sprouted Chickpeas & Toor Dal, Fresh Paneer, Whole Eggs.
- **Healthy Baseline:** Mixed Ancient Millets (Navane, Jowar, Ragi), Sprouted Pulse Kosambari, Probiotic Buttermilk (Majjige).

---

## 6. Dietary & Regional Filters Implemented

1. **Dietary Filters:**
   - **`ALL` / `ANY`:** Returns all culinary options.
   - **`VEGETARIAN`:** Returns vegetarian and vegan foods.
   - **`VEGAN`:** Excludes dairy, eggs, and meats (with special notifications for Vitamin B12 fortified sources).
   - **`NON_VEGETARIAN`:** Highlights bioavailable heme iron, preformed retinol, and natural cobalamin sources.
2. **Regional Culinary Filters:**
   - **`SOUTH_INDIAN`:** Focuses on Karnataka/South Indian staples (Ragi Mudde, Drumstick Leaves, Kosambari, Bangude fish, Majjige, Cashews).
   - **`INDIAN`:** Pan-Indian staples (Palak, Rajma, Gajar, Amla, Til chikki).
   - **`GENERAL`:** Global / universal foods (Fortified plant milks, eggs, capsicum).

---

## 7. AI Assessment Integration

- The **Assessment Details Page** (`AssessmentDetailPage.tsx`) automatically detects the top visual prediction from real MobileNetV2 inference and queries the backend nutrition engine.
- Renders an interactive, responsive dietary guidance section directly below the visual candidate breakdown with on-the-fly diet and region switching.
- Provides a direct link to the standalone **Nutritional Guidance Explorer** (`RecommendationsPage.tsx`).

---

## 8. Test Execution & Build Verification

### Backend Tests
- **Test File:** `backend/src/test/java/com/nutrivision/service/NutritionServiceTest.java`
- **Command:** `mvn test`
- **Result:** `[INFO] BUILD SUCCESS` (3/3 tests passed, 0 failures, 0 errors, 4.339s execution time).

### Frontend Build
- **Command:** `npm run build`
- **Result:** `✓ built in 16.86s` (TypeScript typecheck passed with 0 errors).

### Automated Nutrition Suite
- **Script:** `tests/test_phase9_nutrition.py`
- **Result:** `[ALL 6 NUTRITION CATEGORIES VERIFIED]`

---

## 9. Medical Safety & Ethical Language Enforcement

In compliance with non-diagnostic educational safety standards:
1. **No Prescription Treatment:** The system does not provide drug dosages, supplement prescriptions, or therapeutic cure claims.
2. **Non-Diagnostic Clarifications:** Every screen emphasizes that AI visual patterns represent preliminary surface screening and do not replace blood laboratory biomarkers (Serum Ferritin, Serum B12, CBC, etc.).
3. **Absorption Synergy Education:** Focuses on safe culinary pairing practices (e.g., adding lemon juice to plant-based iron dishes to enhance non-heme iron absorption).

---

## 10. Known Limitations

- **Dietary Generalization:** Nutrient bioavailability values can vary based on agricultural origin, storage duration, and cooking temperature.
- **Individual Biochemical Needs:** Pregnancy, chronic renal illness, and metabolic disorders require individualized medical nutrition therapy (MNT) by licensed clinical dietitians.
