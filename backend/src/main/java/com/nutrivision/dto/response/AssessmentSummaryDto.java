package com.nutrivision.dto.response;

import java.time.LocalDateTime;

public class AssessmentSummaryDto {
    private Long assessmentId;
    private String targetBodyPart;
    private String status;
    private String severityRiskLevel;
    private Integer imageCount;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public AssessmentSummaryDto() {
    }

    public AssessmentSummaryDto(Long assessmentId, String targetBodyPart, String status, String severityRiskLevel, Integer imageCount, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.assessmentId = assessmentId;
        this.targetBodyPart = targetBodyPart;
        this.status = status;
        this.severityRiskLevel = severityRiskLevel;
        this.imageCount = imageCount;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public String getTargetBodyPart() {
        return targetBodyPart;
    }

    public void setTargetBodyPart(String targetBodyPart) {
        this.targetBodyPart = targetBodyPart;
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

    public Integer getImageCount() {
        return imageCount;
    }

    public void setImageCount(Integer imageCount) {
        this.imageCount = imageCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
