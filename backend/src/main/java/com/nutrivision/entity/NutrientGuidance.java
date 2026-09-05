package com.nutrivision.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "nutrient_guidance")
public class NutrientGuidance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guidance_id")
    private Long guidanceId;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50, nullable = false, unique = true)
    private DeficiencyCategory category;

    @Column(name = "nutrient_name", length = 100, nullable = false)
    private String nutrientName;

    @Column(name = "educational_overview", length = 1500, nullable = false)
    private String educationalOverview;

    @Column(name = "biological_importance", length = 1500, nullable = false)
    private String biologicalImportance;

    @Column(name = "synergy_absorption_notes", length = 1000)
    private String synergyAbsorptionNotes;

    @Column(name = "safety_disclaimer", length = 1000)
    private String safetyDisclaimer;

    public NutrientGuidance() {
    }

    public NutrientGuidance(DeficiencyCategory category, String nutrientName, String educationalOverview,
                            String biologicalImportance, String synergyAbsorptionNotes, String safetyDisclaimer) {
        this.category = category;
        this.nutrientName = nutrientName;
        this.educationalOverview = educationalOverview;
        this.biologicalImportance = biologicalImportance;
        this.synergyAbsorptionNotes = synergyAbsorptionNotes;
        this.safetyDisclaimer = safetyDisclaimer;
    }

    public Long getGuidanceId() {
        return guidanceId;
    }

    public void setGuidanceId(Long guidanceId) {
        this.guidanceId = guidanceId;
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

    public String getEducationalOverview() {
        return educationalOverview;
    }

    public void setEducationalOverview(String educationalOverview) {
        this.educationalOverview = educationalOverview;
    }

    public String getBiologicalImportance() {
        return biologicalImportance;
    }

    public void setBiologicalImportance(String biologicalImportance) {
        this.biologicalImportance = biologicalImportance;
    }

    public String getSynergyAbsorptionNotes() {
        return synergyAbsorptionNotes;
    }

    public void setSynergyAbsorptionNotes(String synergyAbsorptionNotes) {
        this.synergyAbsorptionNotes = synergyAbsorptionNotes;
    }

    public String getSafetyDisclaimer() {
        return safetyDisclaimer;
    }

    public void setSafetyDisclaimer(String safetyDisclaimer) {
        this.safetyDisclaimer = safetyDisclaimer;
    }
}
