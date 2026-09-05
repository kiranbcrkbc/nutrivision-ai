-- ==============================================================================
-- NutriVision AI - Roles Seed Data
-- ==============================================================================

USE nutrivision_db;

INSERT IGNORE INTO roles (role_name, description) VALUES
('ROLE_USER', 'Standard registered patient/user with assessment and nutrition tracking access'),
('ROLE_ADMIN', 'System administrator with user management, model versioning, and dataset registry access');
