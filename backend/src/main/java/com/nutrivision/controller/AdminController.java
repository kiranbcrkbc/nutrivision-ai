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

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("systemStatus", "OPERATIONAL");
        summary.put("activeModel", "v1.0.0-mobilenetv2");
        summary.put("adminAccessLevel", "FULL_CONTROL");

        return ResponseEntity.ok(ApiResponse.success(summary, "Admin summary retrieved successfully"));
    }
}
