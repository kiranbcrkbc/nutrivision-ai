package com.nutrivision.controller;

import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.service.AiInferenceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final DataSource dataSource;
    private final AiInferenceClient aiInferenceClient;

    public HealthController(@Autowired(required = false) DataSource dataSource,
                            AiInferenceClient aiInferenceClient) {
        this.dataSource = dataSource;
        this.aiInferenceClient = aiInferenceClient;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getServiceHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "NutriVision AI Backend API Gateway");
        status.put("status", "UP");
        status.put("version", "1.0.0");
        status.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(ApiResponse.success(status, "NutriVision API Service is healthy and operational"));
    }

    @GetMapping("/database")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDatabaseHealth() {
        Map<String, Object> dbStatus = new HashMap<>();

        if (dataSource == null) {
            dbStatus.put("database", "DOWN");
            dbStatus.put("message", "DataSource bean not configured");
            return ResponseEntity.ok(ApiResponse.success(dbStatus, "Database connection is not configured"));
        }

        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            dbStatus.put("database", isValid ? "UP" : "DOWN");
            dbStatus.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
            dbStatus.put("databaseVersion", connection.getMetaData().getDatabaseProductVersion());
            return ResponseEntity.ok(ApiResponse.success(dbStatus, "Database connection verified successfully"));
        } catch (Exception ex) {
            dbStatus.put("database", "DOWN");
            dbStatus.put("error", ex.getMessage());
            return ResponseEntity.ok(ApiResponse.success(dbStatus, "Database is unreachable or credentials invalid"));
        }
    }

    @GetMapping("/ai")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAiServiceHealth() {
        Map<String, Object> aiStatus = aiInferenceClient.checkAiHealth();
        return ResponseEntity.ok(ApiResponse.success(aiStatus, "AI microservice status retrieved successfully"));
    }
}

