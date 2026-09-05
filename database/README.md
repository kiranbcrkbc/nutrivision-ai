# NutriVision AI – Database Directory

This directory contains MySQL database initialization, schema migration, and seed scripts.

## Contents:
- `schema.sql`: Full DDL script creating all tables, indexes, foreign key constraints, and relational cascades for MySQL 8.0+.
- `seed_symptoms.sql`: Reference taxonomy of clinical signs and symptoms across body parts (nails, eyes, tongue, lips, skin, hair).
- `seed_nutrition.sql`: Curated food recommendation matrix and doctor referral category mapping.

## How to Initialize Database Locally:
```bash
# Log into MySQL CLI
mysql -u root -p

# Execute Schema DDL
mysql -u root -p < database/schema.sql

# Seed Data
mysql -u root -p nutrivision_db < database/seed_symptoms.sql
mysql -u root -p nutrivision_db < database/seed_nutrition.sql
```
