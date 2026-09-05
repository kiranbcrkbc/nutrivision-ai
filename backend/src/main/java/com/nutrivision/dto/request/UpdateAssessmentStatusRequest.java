package com.nutrivision.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateAssessmentStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "DRAFT|IN_PROGRESS|COMPLETED|CANCELLED",
        message = "Status must be one of: DRAFT, IN_PROGRESS, COMPLETED, CANCELLED"
    )
    private String status;

    private String severityRiskLevel;

    public UpdateAssessmentStatusRequest() {
    }

    public UpdateAssessmentStatusRequest(String status, String severityRiskLevel) {
        this.status = status;
        this.severityRiskLevel = severityRiskLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSeverityRiskLevel() {
        return severityRiskLevel;
    }

    public void setSeverityRiskLevel(String severityRiskLevel) {
        this.severityRiskLevel = severityRiskLevel;
    }
}
