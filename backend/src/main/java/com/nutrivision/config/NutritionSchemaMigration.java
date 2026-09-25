package com.nutrivision.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** TiDB permits appending ENUM values, but not reordering existing values. */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class NutritionSchemaMigration implements CommandLineRunner {
    private final JdbcTemplate jdbc;

    public NutritionSchemaMigration(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Override
    public void run(String... args) {
        String product = jdbc.execute((ConnectionCallback<String>) connection -> connection.getMetaData().getDatabaseProductName());
        if (product == null || !(product.toLowerCase().contains("mysql") || product.toLowerCase().contains("tidb"))) return;
        for (String table : new String[]{"nutrient_guidance", "food_items"}) {
            String type = jdbc.queryForObject(
                "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = 'category'",
                String.class, table);
            if (type == null || !type.startsWith("enum(") || type.contains("'VITAMIN_D_DEFICIENCY'")) continue;
            // Schema metadata is not executable input: permit only this simple enum grammar.
            if (!type.matches("enum\\('[A-Z0-9_]+'(,'[A-Z0-9_]+')*\\)")) {
                throw new IllegalStateException("Unexpected nutrition category schema; migration requires review.");
            }
            String extended = type.substring(0, type.length() - 1) + ",'VITAMIN_D_DEFICIENCY')";
            jdbc.execute("ALTER TABLE " + table + " MODIFY COLUMN category " + extended + " NOT NULL");
        }
    }
}
