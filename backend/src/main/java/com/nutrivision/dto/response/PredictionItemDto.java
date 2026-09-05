package com.nutrivision.dto.response;

public class PredictionItemDto {
    private Integer rank;
    private String categoryCode;
    private String deficiencyCategory;
    private Float modelConfidence;
    private String confidencePercentage;
    private String possiblePatternDescription;

    public PredictionItemDto() {
    }

    public PredictionItemDto(Integer rank, String categoryCode, String deficiencyCategory, Float modelConfidence, String confidencePercentage, String possiblePatternDescription) {
        this.rank = rank;
        this.categoryCode = categoryCode;
        this.deficiencyCategory = deficiencyCategory;
        this.modelConfidence = modelConfidence;
        this.confidencePercentage = confidencePercentage;
        this.possiblePatternDescription = possiblePatternDescription;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getDeficiencyCategory() {
        return deficiencyCategory;
    }

    public void setDeficiencyCategory(String deficiencyCategory) {
        this.deficiencyCategory = deficiencyCategory;
    }

    public Float getModelConfidence() {
        return modelConfidence;
    }

    public void setModelConfidence(Float modelConfidence) {
        this.modelConfidence = modelConfidence;
    }

    public String getConfidencePercentage() {
        return confidencePercentage;
    }

    public void setConfidencePercentage(String confidencePercentage) {
        this.confidencePercentage = confidencePercentage;
    }

    public String getPossiblePatternDescription() {
        return possiblePatternDescription;
    }

    public void setPossiblePatternDescription(String possiblePatternDescription) {
        this.possiblePatternDescription = possiblePatternDescription;
    }
}
