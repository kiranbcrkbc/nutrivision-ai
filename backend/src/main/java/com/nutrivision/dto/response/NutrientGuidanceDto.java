package com.nutrivision.dto.response;

import com.nutrivision.entity.NutrientGuidance;

public class NutrientGuidanceDto {

    private String category;
    private String nutrientName;
    private String educationalOverview;
    private String biologicalImportance;
    private String synergyAbsorptionNotes;
    private String safetyDisclaimer;

    public NutrientGuidanceDto() {
    }

    public static NutrientGuidanceDto fromEntity(NutrientGuidance entity) {
        if (entity == null) return null;
        NutrientGuidanceDto dto = new NutrientGuidanceDto();
        dto.setCategory(entity.getCategory().getCode());
        dto.setNutrientName(entity.getNutrientName());
        dto.setEducationalOverview(entity.getEducationalOverview());
        dto.setBiologicalImportance(entity.getBiologicalImportance());
        dto.setSynergyAbsorptionNotes(entity.getSynergyAbsorptionNotes());
        dto.setSafetyDisclaimer(entity.getSafetyDisclaimer());
        return dto;
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
