-- ==============================================================================
-- NutriVision AI - MySQL Database Schema DDL
-- Database: nutrivision_db
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS nutrivision_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nutrivision_db;

-- ------------------------------------------------------------------------------
-- 1. Security & User Management
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone VARCHAR(25) NULL,
    age INT NULL,
    gender VARCHAR(20) NULL,
    dietary_preference VARCHAR(50) NOT NULL DEFAULT 'ANY',
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL DEFAULT 'India',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 2. Datasets & Model Registry
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dataset_sources (
    dataset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    version_tag VARCHAR(50) NOT NULL,
    license_type VARCHAR(100) NOT NULL,
    total_images INT NOT NULL DEFAULT 0,
    body_parts_covered VARCHAR(255) NOT NULL,
    source_url TEXT NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS model_versions (
    model_version_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dataset_id BIGINT NOT NULL,
    version_tag VARCHAR(50) NOT NULL UNIQUE,
    architecture_type VARCHAR(100) NOT NULL,
    model_file_path VARCHAR(500) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    test_accuracy FLOAT NULL,
    test_loss FLOAT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_model_versions_dataset FOREIGN KEY (dataset_id) REFERENCES dataset_sources(dataset_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS model_evaluations (
    eval_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_version_id BIGINT NOT NULL,
    evaluation_slice VARCHAR(100) NOT NULL,
    slice_accuracy FLOAT NOT NULL,
    slice_precision FLOAT NOT NULL,
    slice_recall FLOAT NOT NULL,
    slice_f1 FLOAT NOT NULL,
    metrics_json JSON NULL,
    evaluated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_model_evals_model FOREIGN KEY (model_version_id) REFERENCES model_versions(model_version_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 3. Assessments & Image Quality
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS assessments (
    assessment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_body_part VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    severity_risk_level VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    INDEX idx_assessments_user (user_id),
    CONSTRAINT fk_assessments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assessment_images (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size_bytes INT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    quality_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    blur_score FLOAT NULL,
    brightness_score FLOAT NULL,
    rejection_reason VARCHAR(255) NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assessment_images_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS symptoms (
    symptom_id INT AUTO_INCREMENT PRIMARY KEY,
    symptom_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    related_body_part VARCHAR(50) NOT NULL,
    description TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assessment_symptoms (
    assessment_id BIGINT NOT NULL,
    symptom_id INT NOT NULL,
    PRIMARY KEY (assessment_id, symptom_id),
    CONSTRAINT fk_assess_symptoms_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    CONSTRAINT fk_assess_symptoms_symptom FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS predictions (
    prediction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL,
    model_version_id BIGINT NOT NULL,
    rank_order INT NOT NULL,
    deficiency_category VARCHAR(100) NOT NULL,
    model_confidence FLOAT NOT NULL,
    gradcam_image_path VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_predictions_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE,
    CONSTRAINT fk_predictions_model FOREIGN KEY (model_version_id) REFERENCES model_versions(model_version_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. Recommendations, Nutrition & Reports
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS food_recommendations (
    recommendation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    deficiency_category VARCHAR(100) NOT NULL,
    diet_type VARCHAR(50) NOT NULL,
    food_item_name VARCHAR(150) NOT NULL,
    rich_nutrient VARCHAR(150) NOT NULL,
    serving_suggestion TEXT NULL,
    regional_availability VARCHAR(100) NULL,
    INDEX idx_food_rec_deficiency (deficiency_category, diet_type)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS nutrition_plans (
    plan_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL UNIQUE,
    primary_deficiency VARCHAR(100) NOT NULL,
    diet_preference VARCHAR(50) NOT NULL,
    weekly_meal_plan_json JSON NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nutrition_plans_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS health_reports (
    report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT NOT NULL UNIQUE,
    report_code VARCHAR(64) NOT NULL UNIQUE,
    pdf_file_path VARCHAR(500) NOT NULL,
    medical_disclaimer_text TEXT NOT NULL,
    generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_health_reports_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS doctor_referrals (
    referral_id INT AUTO_INCREMENT PRIMARY KEY,
    deficiency_category VARCHAR(100) NOT NULL,
    specialist_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. Chatbot, Feedback & Admin Auditing
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS chatbot_conversations (
    conversation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    assessment_id BIGINT NULL,
    session_title VARCHAR(255) NOT NULL DEFAULT 'Nutrition Q&A',
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatbot_conv_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_chatbot_conv_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chatbot_messages (
    message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender VARCHAR(20) NOT NULL,
    message_text TEXT NOT NULL,
    sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatbot_msg_conv FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(conversation_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comments TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(assessment_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id BIGINT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_entity_id VARCHAR(100) NOT NULL,
    details_json JSON NULL,
    ip_address VARCHAR(50) NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_timestamp (timestamp),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;
