package com.nutrivision.dto.response;

import com.nutrivision.entity.DietType;
import com.nutrivision.entity.FoodItem;
import com.nutrivision.entity.FoodRegion;

public class FoodItemDto {

    private Long foodId;
    private String category;
    private String nutrientName;
    private String foodName;
    private String localName;
    private DietType dietType;
    private FoodRegion region;
    private String servingSuggestion;
    private String educationalDescription;
    private String absorptionNotes;
    private String safetyNote;
    private Integer priority;

    public FoodItemDto() {
    }

    public static FoodItemDto fromEntity(FoodItem entity) {
        if (entity == null) return null;
        FoodItemDto dto = new FoodItemDto();
        dto.setFoodId(entity.getFoodId());
        dto.setCategory(entity.getCategory().getCode());
        dto.setNutrientName(entity.getNutrientName());
        dto.setFoodName(entity.getFoodName());
        dto.setLocalName(entity.getLocalName());
        dto.setDietType(entity.getDietType());
        dto.setRegion(entity.getRegion());
        dto.setServingSuggestion(entity.getServingSuggestion());
        dto.setEducationalDescription(entity.getEducationalDescription());
        dto.setAbsorptionNotes(entity.getAbsorptionNotes());
        dto.setSafetyNote(entity.getSafetyNote());
        dto.setPriority(entity.getPriority());
        return dto;
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getNutrientName() {
        return nutrientName;
    }

    public void setNutrientName(String nutrientName) {
        this.nutrientName = nutrientName;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getLocalName() {
        return localName;
    }

    public void setLocalName(String localName) {
        this.localName = localName;
    }

    public DietType getDietType() {
        return dietType;
    }

    public void setDietType(DietType dietType) {
        this.dietType = dietType;
    }

    public FoodRegion getRegion() {
        return region;
    }

    public void setRegion(FoodRegion region) {
        this.region = region;
    }

    public String getServingSuggestion() {
        return servingSuggestion;
    }

    public void setServingSuggestion(String servingSuggestion) {
        this.servingSuggestion = servingSuggestion;
    }

    public String getEducationalDescription() {
        return educationalDescription;
    }

    public void setEducationalDescription(String educationalDescription) {
        this.educationalDescription = educationalDescription;
    }

    public String getAbsorptionNotes() {
        return absorptionNotes;
    }

    public void setAbsorptionNotes(String absorptionNotes) {
        this.absorptionNotes = absorptionNotes;
    }

    public String getSafetyNote() {
        return safetyNote;
    }

    public void setSafetyNote(String safetyNote) {
        this.safetyNote = safetyNote;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }
}
