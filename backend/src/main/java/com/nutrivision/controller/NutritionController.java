package com.nutrivision.controller;

import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.dto.response.CategoryMetadataDto;
import com.nutrivision.dto.response.NutrientGuidanceDto;
import com.nutrivision.dto.response.NutritionRecommendationResponse;
import com.nutrivision.entity.DietType;
import com.nutrivision.entity.FoodRegion;
import com.nutrivision.service.NutritionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {

    private final NutritionService nutritionService;

    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }

    /**
     * Lists all supported deficiency screening categories and their primary nutrients.
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryMetadataDto>>> getCategories() {
        List<CategoryMetadataDto> categories = nutritionService.getSupportedCategories();
        return ResponseEntity.ok(ApiResponse.success(categories, "Supported nutrition categories retrieved."));
    }

    /**
     * Retrieves educational guidance for a deficiency category.
     */
    @GetMapping("/guidance/{category}")
    public ResponseEntity<ApiResponse<NutrientGuidanceDto>> getGuidance(
            @PathVariable("category") String category
    ) {
        NutrientGuidanceDto guidance = nutritionService.getGuidanceForCategory(category);
        return ResponseEntity.ok(ApiResponse.success(guidance, "Nutrient guidance retrieved."));
    }

    /**
     * Retrieves priority-ranked dietary recommendations filtered by diet type and region.
     */
    @GetMapping("/recommendations/{category}")
    public ResponseEntity<ApiResponse<NutritionRecommendationResponse>> getRecommendations(
            @PathVariable("category") String category,
            @RequestParam(value = "dietType", required = false) DietType dietType,
            @RequestParam(value = "region", required = false) FoodRegion region
    ) {
        NutritionRecommendationResponse res = nutritionService.getRecommendations(category, dietType, region);
        return ResponseEntity.ok(ApiResponse.success(res, "Food recommendations retrieved successfully."));
    }

    /**
     * Integrates recommendations directly with a completed user assessment.
     */
    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<ApiResponse<NutritionRecommendationResponse>> getRecommendationsForAssessment(
            @PathVariable("assessmentId") Long assessmentId,
            @RequestParam(value = "dietType", required = false) DietType dietType,
            @RequestParam(value = "region", required = false) FoodRegion region,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        NutritionRecommendationResponse res = nutritionService.getRecommendationsForAssessment(
                userDetails.getUsername(),
                assessmentId,
                dietType,
                region
        );
        return ResponseEntity.ok(ApiResponse.success(res, "Assessment-linked food recommendations retrieved."));
    }
}
