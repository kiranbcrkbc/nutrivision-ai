package com.nutrivision.service;

import com.nutrivision.dto.response.CategoryMetadataDto;
import com.nutrivision.dto.response.NutrientGuidanceDto;
import com.nutrivision.dto.response.NutritionRecommendationResponse;
import com.nutrivision.entity.*;
import com.nutrivision.repository.AssessmentRepository;
import com.nutrivision.repository.FoodItemRepository;
import com.nutrivision.repository.NutrientGuidanceRepository;
import com.nutrivision.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class NutritionServiceTest {

    private FoodItemRepository foodItemRepository;
    private NutrientGuidanceRepository guidanceRepository;
    private AssessmentRepository assessmentRepository;
    private UserRepository userRepository;
    private AssessmentService assessmentService;
    private NutritionService nutritionService;

    private NutrientGuidance ironGuidance;
    private List<FoodItem> ironFoods;

    @BeforeEach
    void setUp() {
        foodItemRepository = Mockito.mock(FoodItemRepository.class);
        guidanceRepository = Mockito.mock(NutrientGuidanceRepository.class);
        assessmentRepository = Mockito.mock(AssessmentRepository.class);
        userRepository = Mockito.mock(UserRepository.class);
        assessmentService = Mockito.mock(AssessmentService.class);

        nutritionService = new NutritionService(
                foodItemRepository,
                guidanceRepository,
                assessmentRepository,
                userRepository,
                assessmentService
        );

        ironGuidance = new NutrientGuidance(
                DeficiencyCategory.IRON_DEFICIENCY,
                "Iron (Fe)",
                "Iron is essential for hemoglobin and oxygen transport.",
                "Prevents microcytic anemia.",
                "Pair with Vitamin C to triple absorption.",
                "Non-diagnostic nutritional guidance."
        );

        FoodItem ragi = new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Finger Millet / Ragi", "Ragi Mudde",
                DietType.VEGAN, FoodRegion.SOUTH_INDIAN, "1 cup cooked as Ragi Mudde",
                "High non-heme iron and calcium density.", "Pair with lemon/rasam.", "Gluten free.", 1
        );

        FoodItem spinach = new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Spinach / Palak", "Palak Dal",
                DietType.VEGAN, FoodRegion.INDIAN, "1.5 cups cooked with dal",
                "Rich non-heme iron and folate.", "Squeeze fresh lemon juice.", "Moderate for kidney stones.", 1
        );

        FoodItem eggs = new FoodItem(
                DeficiencyCategory.IRON_DEFICIENCY, "Iron (Fe)", "Eggs", "Anda",
                DietType.NON_VEGETARIAN, FoodRegion.GENERAL, "2 whole eggs",
                "Heme iron and complete protein.", "Healthy breakfast.", "Store refrigerated.", 2
        );

        ironFoods = Arrays.asList(ragi, spinach, eggs);
    }

    @Test
    @DisplayName("Should list all 6 supported screening categories")
    void testGetSupportedCategories() {
        List<CategoryMetadataDto> categories = nutritionService.getSupportedCategories();
        assertNotNull(categories);
        assertEquals(7, categories.size());
        assertTrue(categories.stream().anyMatch(c -> c.getCode().equals("Vitamin_D_Deficiency")));
        assertTrue(categories.stream().anyMatch(c -> c.getCode().equals("Iron_Deficiency")));
        assertTrue(categories.stream().anyMatch(c -> c.getCode().equals("Vitamin_B12_Deficiency")));
        assertTrue(categories.stream().anyMatch(c -> c.getCode().equals("Zinc_Deficiency")));
    }

    @Test
    @DisplayName("Should return nutrient guidance for Iron Deficiency")
    void testGetGuidanceForIronDeficiency() {
        when(guidanceRepository.findByCategory(DeficiencyCategory.IRON_DEFICIENCY))
                .thenReturn(Optional.of(ironGuidance));

        NutrientGuidanceDto result = nutritionService.getGuidanceForCategory("Iron_Deficiency");
        assertNotNull(result);
        assertEquals("Iron_Deficiency", result.getCategory());
        assertEquals("Iron (Fe)", result.getNutrientName());
        assertTrue(result.getSynergyAbsorptionNotes().contains("Vitamin C"));
    }

    @Test
    @DisplayName("Should return filtered recommendations with DietType and Region")
    void testGetRecommendationsWithFilters() {
        when(guidanceRepository.findByCategory(DeficiencyCategory.IRON_DEFICIENCY))
                .thenReturn(Optional.of(ironGuidance));
        when(foodItemRepository.findFilteredRecommendations(eq(DeficiencyCategory.IRON_DEFICIENCY), eq(DietType.VEGAN), eq(FoodRegion.SOUTH_INDIAN)))
                .thenReturn(Arrays.asList(ironFoods.get(0)));

        NutritionRecommendationResponse res = nutritionService.getRecommendations(
                "Iron_Deficiency",
                DietType.VEGAN,
                FoodRegion.SOUTH_INDIAN
        );

        assertNotNull(res);
        assertEquals("Iron_Deficiency", res.getScreeningCategory());
        assertEquals(1, res.getRecommendedFoods().size());
        assertEquals("Finger Millet / Ragi", res.getRecommendedFoods().get(0).getFoodName());
        assertEquals(DietType.VEGAN, res.getAppliedDietFilter());
        assertEquals(FoodRegion.SOUTH_INDIAN, res.getAppliedRegionFilter());
        assertNotNull(res.getEducationalDisclaimer());
    }
}
