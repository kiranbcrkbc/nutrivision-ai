#!/usr/bin/env python3
"""
Phase 10 — Direct MySQL Database Audit Script.
Inspects tables, relationships, foreign keys, row counts, and orphan integrity in nutrivision_db.
"""

import sys
import mysql.connector

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def audit_database():
    print("=" * 80)
    print("NUTRIVISION AI — MYSQL DATABASE INTEGRITY & PERSISTENCE AUDIT")
    print("=" * 80)

    try:
        conn = mysql.connector.connect(
            host="127.0.0.1",
            port=3306,
            user="root",
            password="root",
            database="nutrivision_db"
        )
        cursor = conn.cursor(dictionary=True)
        print("✓ Connected to MySQL nutrivision_db successfully.")

        # 1. Inspect all tables
        cursor.execute("SHOW TABLES")
        tables = [list(row.values())[0] for row in cursor.fetchall()]
        print(f"\n[TABLES DISCOVERED ({len(tables)})]:")
        for t in tables:
            cursor.execute(f"SELECT COUNT(*) as cnt FROM {t}")
            cnt = cursor.fetchone()["cnt"]
            print(f"  • {t.ljust(25)} : {cnt} rows")

        # 2. Check for orphan records
        print("\n[ORPHAN RECORD INTEGRITY CHECKS]:")
        
        # Check assessment_images without valid assessment
        cursor.execute("""
            SELECT COUNT(*) as cnt FROM assessment_images ai 
            LEFT JOIN assessments a ON ai.assessment_id = a.assessment_id 
            WHERE a.assessment_id IS NULL
        """)
        orphan_images = cursor.fetchone()["cnt"]
        print(f"  • Orphan assessment_images: {orphan_images} (Expected: 0)")
        assert orphan_images == 0

        # Check assessments without valid user
        cursor.execute("""
            SELECT COUNT(*) as cnt FROM assessments a 
            LEFT JOIN users u ON a.user_id = u.user_id 
            WHERE u.user_id IS NULL
        """)
        orphan_assessments = cursor.fetchone()["cnt"]
        print(f"  • Orphan assessments: {orphan_assessments} (Expected: 0)")
        assert orphan_assessments == 0

        # Check user_profiles without valid user
        cursor.execute("""
            SELECT COUNT(*) as cnt FROM user_profiles up 
            LEFT JOIN users u ON up.user_id = u.user_id 
            WHERE u.user_id IS NULL
        """)
        orphan_profiles = cursor.fetchone()["cnt"]
        print(f"  • Orphan user_profiles: {orphan_profiles} (Expected: 0)")
        assert orphan_profiles == 0

        # 3. Verify Foreign Keys
        cursor.execute("""
            SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = 'nutrivision_db' AND REFERENCED_TABLE_NAME IS NOT NULL
        """)
        fks = cursor.fetchall()
        print(f"\n[FOREIGN KEY CONSTRAINTS ({len(fks)})]:")
        for fk in fks:
            print(f"  • {fk['TABLE_NAME']}.{fk['COLUMN_NAME']} -> {fk['REFERENCED_TABLE_NAME']}.{fk['REFERENCED_COLUMN_NAME']} ({fk['CONSTRAINT_NAME']})")

        # 4. Check Sample Nutrition Data
        cursor.execute("SELECT category, COUNT(*) as cnt FROM food_items GROUP BY category")
        food_dist = cursor.fetchall()
        print("\n[FOOD RECOMMENDATIONS DISTRIBUTION ACROSS CATEGORIES]:")
        for fd in food_dist:
            print(f"  • {fd['category'].ljust(25)} : {fd['cnt']} food items")

        cursor.close()
        conn.close()
        print("\n[DATABASE AUDIT VERDICT: 100% PERSISTENCE INTEGRITY VERIFIED - NO ORPHANS]")

    except Exception as e:
        print(f"✗ Database audit failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    audit_database()
