package com.nutrivision.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50, nullable = false)
    private DeficiencyCategory category;

    @Column(name = "nutrient_name", length = 100, nullable = false)
    private String nutrientName;

    @Column(name = "food_name", length = 150, nullable = false)
    private String foodName;

    @Column(name = "local_name", length = 150)
    private String localName;

    @Enumerated(EnumType.STRING)
    @Column(name = "diet_type", length = 30, nullable = false)
    private DietType dietType;

    @Enumerated(EnumType.STRING)
    @Column(name = "region", length = 30, nullable = false)
    private FoodRegion region;

    @Column(name = "serving_suggestion", length = 500)
    private String servingSuggestion;

    @Column(name = "educational_description", length = 1000)
    private String educationalDescription;

    @Column(name = "absorption_notes", length = 500)
    private String absorptionNotes;

    @Column(name = "safety_note", length = 500)
    private String safetyNote;

    @Column(name = "priority", nullable = false)
    private Integer priority = 1;

    public FoodItem() {
    }

    public FoodItem(DeficiencyCategory category, String nutrientName, String foodName, String localName,
                    DietType dietType, FoodRegion region, String servingSuggestion,
                    String educationalDescription, String absorptionNotes, String safetyNote, Integer priority) {
        this.category = category;
        this.nutrientName = nutrientName;
        this.foodName = foodName;
        this.localName = localName;
        this.dietType = dietType;
        this.region = region;
        this.servingSuggestion = servingSuggestion;
        this.educationalDescription = educationalDescription;
        this.absorptionNotes = absorptionNotes;
        this.safetyNote = safetyNote;
        this.priority = priority;
    }

    public Long getFoodId() {
        return foodId;
    }

    public void setFoodId(Long foodId) {
        this.foodId = foodId;
    }

    public DeficiencyCategory getCategory() {
        return category;
    }

    public void setCategory(DeficiencyCategory category) {
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
