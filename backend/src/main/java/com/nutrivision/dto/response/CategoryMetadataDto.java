package com.nutrivision.dto.response;

public class CategoryMetadataDto {

    private String code;
    private String displayName;
    private String primaryNutrient;
    private String description;

    public CategoryMetadataDto() {
    }

    public CategoryMetadataDto(String code, String displayName, String primaryNutrient, String description) {
        this.code = code;
        this.displayName = displayName;
        this.primaryNutrient = primaryNutrient;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPrimaryNutrient() {
        return primaryNutrient;
    }

    public void setPrimaryNutrient(String primaryNutrient) {
        this.primaryNutrient = primaryNutrient;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
