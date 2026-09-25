package com.nutrivision.controller;

import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final com.nutrivision.repository.AssessmentRepository assessments;
    private final com.nutrivision.repository.AssessmentImageRepository images;

    public AdminController(UserRepository userRepository, com.nutrivision.repository.AssessmentRepository assessments,
                           com.nutrivision.repository.AssessmentImageRepository images) {
        this.userRepository = userRepository;
        this.assessments = assessments;
        this.images = images;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("totalAssessments", assessments.count());
        summary.put("totalImages", images.count());
        summary.put("systemStatus", "Database query completed");
        summary.put("activeModel", "Synthetic demonstration model; screening not validated");
        summary.put("adminAccessLevel", "FULL_CONTROL");

        return ResponseEntity.ok(ApiResponse.success(summary, "Admin summary retrieved successfully"));
    }
}
