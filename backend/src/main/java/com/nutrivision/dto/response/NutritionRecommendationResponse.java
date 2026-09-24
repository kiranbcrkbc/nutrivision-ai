package com.nutrivision.dto.response;

import com.nutrivision.entity.DietType;
import com.nutrivision.entity.FoodRegion;

import java.util.ArrayList;
import java.util.List;

public class NutritionRecommendationResponse {

    private String screeningCategory;
    private String categoryDisplayName;
    private String primaryNutrient;
    private DietType appliedDietFilter;
    private FoodRegion appliedRegionFilter;
    private NutrientGuidanceDto guidance;
    private List<FoodItemDto> recommendedFoods = new ArrayList<>();
    private List<FoodItemDto> priorityFoods = new ArrayList<>();
    private List<FoodItemDto> vegetarianFoods = new ArrayList<>();
    private List<FoodItemDto> veganFoods = new ArrayList<>();
    private List<FoodItemDto> nonVegetarianFoods = new ArrayList<>();
    private List<FoodItemDto> regionalIndianFoods = new ArrayList<>();
    private String absorptionSynergySummary;
    private String educationalDisclaimer;

    public NutritionRecommendationResponse() {
        this.educationalDisclaimer = "Vitamin Deficiency dietary recommendations provide educational nutritional guidance based on nutrient categories associated with preliminary AI screening. This does not constitute a clinical prescription or medical diagnosis. Please consult a registered dietitian or physician for personalized medical nutrition therapy.";
    }

    public String getScreeningCategory() {
        return screeningCategory;
    }

    public void setScreeningCategory(String screeningCategory) {
        this.screeningCategory = screeningCategory;
    }

    public String getCategoryDisplayName() {
        return categoryDisplayName;
    }

    public void setCategoryDisplayName(String categoryDisplayName) {
        this.categoryDisplayName = categoryDisplayName;
    }

    public String getPrimaryNutrient() {
        return primaryNutrient;
    }

    public void setPrimaryNutrient(String primaryNutrient) {
        this.primaryNutrient = primaryNutrient;
    }

    public DietType getAppliedDietFilter() {
        return appliedDietFilter;
    }

    public void setAppliedDietFilter(DietType appliedDietFilter) {
        this.appliedDietFilter = appliedDietFilter;
    }

    public FoodRegion getAppliedRegionFilter() {
        return appliedRegionFilter;
    }

    public void setAppliedRegionFilter(FoodRegion appliedRegionFilter) {
        this.appliedRegionFilter = appliedRegionFilter;
    }

    public NutrientGuidanceDto getGuidance() {
        return guidance;
    }

    public void setGuidance(NutrientGuidanceDto guidance) {
        this.guidance = guidance;
    }

    public List<FoodItemDto> getRecommendedFoods() {
        return recommendedFoods;
    }

    public void setRecommendedFoods(List<FoodItemDto> recommendedFoods) {
        this.recommendedFoods = recommendedFoods;
    }

    public List<FoodItemDto> getPriorityFoods() {
        return priorityFoods;
    }

    public void setPriorityFoods(List<FoodItemDto> priorityFoods) {
        this.priorityFoods = priorityFoods;
    }

    public List<FoodItemDto> getVegetarianFoods() {
        return vegetarianFoods;
    }

    public void setVegetarianFoods(List<FoodItemDto> vegetarianFoods) {
        this.vegetarianFoods = vegetarianFoods;
    }

    public List<FoodItemDto> getVeganFoods() {
        return veganFoods;
    }

    public void setVeganFoods(List<FoodItemDto> veganFoods) {
        this.veganFoods = veganFoods;
    }

    public List<FoodItemDto> getNonVegetarianFoods() {
        return nonVegetarianFoods;
    }

    public void setNonVegetarianFoods(List<FoodItemDto> nonVegetarianFoods) {
        this.nonVegetarianFoods = nonVegetarianFoods;
    }

    public List<FoodItemDto> getRegionalIndianFoods() {
        return regionalIndianFoods;
    }

    public void setRegionalIndianFoods(List<FoodItemDto> regionalIndianFoods) {
        this.regionalIndianFoods = regionalIndianFoods;
    }

    public String getAbsorptionSynergySummary() {
        return absorptionSynergySummary;
    }

    public void setAbsorptionSynergySummary(String absorptionSynergySummary) {
        this.absorptionSynergySummary = absorptionSynergySummary;
    }

    public String getEducationalDisclaimer() {
        return educationalDisclaimer;
    }

    public void setEducationalDisclaimer(String educationalDisclaimer) {
        this.educationalDisclaimer = educationalDisclaimer;
    }
}
