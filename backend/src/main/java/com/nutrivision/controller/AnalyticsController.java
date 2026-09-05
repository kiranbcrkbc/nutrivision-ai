package com.nutrivision.controller;

import com.nutrivision.dto.response.AnalyticsDashboardDto;
import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AnalyticsDashboardDto>> getDashboardAnalytics(
            @AuthenticationPrincipal UserDetails userDetails) {
        AnalyticsDashboardDto dto = analyticsService.getDashboardAnalytics(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(dto, "Dashboard analytics retrieved successfully"));
    }
}
