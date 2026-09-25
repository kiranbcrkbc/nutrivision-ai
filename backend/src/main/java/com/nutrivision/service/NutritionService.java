package com.nutrivision.service;

import com.nutrivision.dto.response.*;
import com.nutrivision.entity.*;
import com.nutrivision.repository.AssessmentRepository;
import com.nutrivision.repository.FoodItemRepository;
import com.nutrivision.repository.NutrientGuidanceRepository;
import com.nutrivision.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NutritionService {

    private static final Logger log = LoggerFactory.getLogger(NutritionService.class);

    private final FoodItemRepository foodItemRepository;
    private final NutrientGuidanceRepository guidanceRepository;
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final AssessmentService assessmentService;

    public NutritionService(
            FoodItemRepository foodItemRepository,
            NutrientGuidanceRepository guidanceRepository,
            AssessmentRepository assessmentRepository,
            UserRepository userRepository,
            AssessmentService assessmentService
    ) {
        this.foodItemRepository = foodItemRepository;
        this.guidanceRepository = guidanceRepository;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
        this.assessmentService = assessmentService;
    }

    /**
     * Lists all supported screening categories with clinical and nutrient metadata.
     */
    @Transactional(readOnly = true)
    public List<CategoryMetadataDto> getSupportedCategories() {
        return Arrays.asList(
                new CategoryMetadataDto("Vitamin_D_Deficiency", "Vitamin D (education only)", "Vitamin D", "Cannot be determined from photos; ask a clinician whether testing is appropriate."),
                new CategoryMetadataDto(
                        DeficiencyCategory.IRON_DEFICIENCY.getCode(),
                        "Iron Deficiency",
                        "Iron (Fe)",
                        "Microcytic anemia indicators, koilonychia spoon nails, conjunctival pallor, and atrophic glossitis."
                ),
                new CategoryMetadataDto(
                        DeficiencyCategory.VITAMIN_A_DEFICIENCY.getCode(),
                        "Vitamin A Deficiency",
                        "Vitamin A (Carotenoids & Retinol)",
                        "Follicular hyperkeratosis (phrynoderma), ocular xerosis, and Bitot's foamy plaques."
                ),
                new CategoryMetadataDto(
                        DeficiencyCategory.VITAMIN_B12_DEFICIENCY.getCode(),
                        "Vitamin B12 Deficiency",
                        "Vitamin B12 (Cobalamin)",
                        "Atrophic glossitis (beefy red depapillated tongue), angular cheilitis, and hyperpigmentation."
                ),
                new CategoryMetadataDto(
                        DeficiencyCategory.VITAMIN_C_DEFICIENCY.getCode(),
                        "Vitamin C Deficiency",
                        "Vitamin C (L-Ascorbic Acid)",
                        "Perifollicular petechiae, corkscrew hairs, and subungual splinter hemorrhages."
                ),
                new CategoryMetadataDto(
                        DeficiencyCategory.ZINC_DEFICIENCY.getCode(),
                        "Zinc Deficiency",
                        "Zinc (Zn)",
                        "Punctate/transverse leukonychia, acrodermatitis scaling, and diffuse hair thinning."
                ),
                new CategoryMetadataDto(
                        DeficiencyCategory.HEALTHY_NORMAL.getCode(),
                        "Healthy Baseline",
                        "Balanced Multi-Nutrients",
                        "Well-vascularized, healthy morphological baseline across all anatomical regions."
                )
        );
    }

    /**
     * Retrieves educational guidance for a given category.
     */
    @Transactional(readOnly = true)
    public NutrientGuidanceDto getGuidanceForCategory(String categoryStr) {
        DeficiencyCategory category = DeficiencyCategory.fromString(categoryStr);
        return guidanceRepository.findByCategory(category)
                .map(NutrientGuidanceDto::fromEntity)
                .orElseGet(() -> {
                    NutrientGuidanceDto fallback = new NutrientGuidanceDto();
                    fallback.setCategory(category.getCode());
                    fallback.setNutrientName(category.getDisplayName());
                    fallback.setEducationalOverview("General balanced nutrition guidelines.");
                    fallback.setBiologicalImportance("Essential for overall physiological wellness.");
                    fallback.setSafetyDisclaimer("Consult a registered dietitian or medical professional.");
                    return fallback;
                });
    }

    /**
     * Builds priority-ranked, dietary-filtered food recommendations for a category.
     */
    @Transactional(readOnly = true)
    public NutritionRecommendationResponse getRecommendations(
            String categoryStr,
            DietType dietType,
            FoodRegion region
    ) {
        DeficiencyCategory category = DeficiencyCategory.fromString(categoryStr);
        log.debug("Fetching nutrition recommendations for category: {}, dietType: {}, region: {}", category, dietType, region);

        NutrientGuidanceDto guidanceDto = getGuidanceForCategory(category.getCode());

        // Handle DietType.ANY as null for the query
        DietType filterDiet = (dietType == null || dietType == DietType.ANY) ? null : dietType;
        List<FoodItem> items = foodItemRepository.findFilteredRecommendations(category, filterDiet, region);

        // Map to DTOs
        List<FoodItemDto> foodDtos = items.stream()
                .map(FoodItemDto::fromEntity)
                .collect(Collectors.toList());

        NutritionRecommendationResponse response = new NutritionRecommendationResponse();
        response.setScreeningCategory(category.getCode());
        response.setCategoryDisplayName(category.getDisplayName());
        response.setPrimaryNutrient(guidanceDto.getNutrientName());
        response.setAppliedDietFilter(dietType != null ? dietType : DietType.ANY);
        response.setAppliedRegionFilter(region != null ? region : FoodRegion.GENERAL);
        response.setGuidance(guidanceDto);
        response.setRecommendedFoods(foodDtos);

        // Subcategory grouping
        response.setPriorityFoods(foodDtos.stream().filter(f -> f.getPriority() == 1).collect(Collectors.toList()));
        response.setVegetarianFoods(foodDtos.stream().filter(f -> f.getDietType() == DietType.VEGETARIAN || f.getDietType() == DietType.VEGAN).collect(Collectors.toList()));
        response.setVeganFoods(foodDtos.stream().filter(f -> f.getDietType() == DietType.VEGAN).collect(Collectors.toList()));
        response.setNonVegetarianFoods(foodDtos.stream().filter(f -> f.getDietType() == DietType.NON_VEGETARIAN).collect(Collectors.toList()));
        response.setRegionalIndianFoods(foodDtos.stream().filter(f -> f.getRegion() == FoodRegion.INDIAN || f.getRegion() == FoodRegion.SOUTH_INDIAN).collect(Collectors.toList()));

        response.setAbsorptionSynergySummary(guidanceDto.getSynergyAbsorptionNotes());
        return response;
    }

    /**
     * Integrates recommendations directly with a user's completed AI assessment.
     */
    @Transactional(readOnly = true)
    public NutritionRecommendationResponse getRecommendationsForAssessment(
            String userEmail,
            Long assessmentId,
            DietType dietType,
            FoodRegion region
    ) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found #" + assessmentId));

        boolean isOwner = assessment.getUser().getUserId().equals(user.getUserId());
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getRoleName() == RoleName.ROLE_ADMIN);
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Access Denied: You cannot access recommendations for assessment #" + assessmentId);
        }

        // Reading recommendations must not rerun inference or invent a category.
        AiInferenceResponse screening = null;
        if (assessment.getScreeningResultJson() != null) {
            try {
                screening = new com.fasterxml.jackson.databind.ObjectMapper().readValue(assessment.getScreeningResultJson(), AiInferenceResponse.class);
            } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                throw new IllegalStateException("Saved screening result could not be read.");
            }
        }
        if (screening == null || !"SUCCESS".equals(screening.getStatus()) || screening.getTopPrediction() == null) {
            throw new IllegalStateException("No reliable screening result is available. Explore general food guidance instead.");
        }
        String category;
        if (screening != null && screening.getTopPrediction() != null) {
            category = screening.getTopPrediction().getCategoryCode() != null
                    ? screening.getTopPrediction().getCategoryCode()
                    : screening.getTopPrediction().getDeficiencyCategory();
        } else {
            throw new IllegalStateException("No prediction available.");
        }


        // Use user's saved dietary preference if not explicitly provided
        DietType effectiveDiet = dietType;
        if (effectiveDiet == null && user.getUserProfile() != null) {
            try {
                effectiveDiet = DietType.valueOf(user.getUserProfile().getDietaryPreference().toUpperCase().trim());
            } catch (Exception e) {
                effectiveDiet = DietType.ANY;
            }
        }

        return getRecommendations(category, effectiveDiet, region);
    }
}
