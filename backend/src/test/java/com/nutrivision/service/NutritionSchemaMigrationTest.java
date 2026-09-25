package com.nutrivision.service;

import com.nutrivision.config.NutritionSchemaMigration;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class NutritionSchemaMigrationTest {
    @Test void appendsWithoutReorderingExistingCategories() {
        var jdbc = mock(JdbcTemplate.class);
        when(jdbc.execute(org.mockito.ArgumentMatchers.<ConnectionCallback<String>>any())).thenReturn("MySQL");
        when(jdbc.queryForObject(anyString(), eq(String.class), anyString()))
            .thenReturn("enum('ZINC_DEFICIENCY','IRON_DEFICIENCY')");
        new NutritionSchemaMigration(jdbc).run();
        verify(jdbc).execute("ALTER TABLE nutrient_guidance MODIFY COLUMN category enum('ZINC_DEFICIENCY','IRON_DEFICIENCY','VITAMIN_D_DEFICIENCY') NOT NULL");
        verify(jdbc).execute("ALTER TABLE food_items MODIFY COLUMN category enum('ZINC_DEFICIENCY','IRON_DEFICIENCY','VITAMIN_D_DEFICIENCY') NOT NULL");
    }

    @Test void alreadyMigratedSchemaIsUnchanged() {
        var jdbc = mock(JdbcTemplate.class);
        when(jdbc.execute(org.mockito.ArgumentMatchers.<ConnectionCallback<String>>any())).thenReturn("MySQL");
        when(jdbc.queryForObject(anyString(), eq(String.class), anyString())).thenReturn("enum('IRON_DEFICIENCY','VITAMIN_D_DEFICIENCY')");
        new NutritionSchemaMigration(jdbc).run();
        verify(jdbc, never()).execute(anyString());
    }

    @Test void unexpectedSchemaIsNotExecuted() {
        var jdbc = mock(JdbcTemplate.class);
        when(jdbc.execute(org.mockito.ArgumentMatchers.<ConnectionCallback<String>>any())).thenReturn("MySQL");
        when(jdbc.queryForObject(anyString(), eq(String.class), anyString())).thenReturn("enum('IRON_DEFICIENCY'); DROP TABLE users;");
        assertThrows(IllegalStateException.class, () -> new NutritionSchemaMigration(jdbc).run());
        verify(jdbc, never()).execute(anyString());
    }
}
