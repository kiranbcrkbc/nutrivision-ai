package com.nutrivision.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentDto {
    private AiInferenceResponse screeningResult;
    public AiInferenceResponse getScreeningResult() { return screeningResult; }
    public void setScreeningResult(AiInferenceResponse value) { screeningResult = value; }
    private Long assessmentId;
    private Long userId;
    private String userFullName;
    private String targetBodyPart;
    private String status;
    private String severityRiskLevel;
    private List<AssessmentImageDto> images;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public AssessmentDto() {
    }

    public AssessmentDto(Long assessmentId, Long userId, String userFullName, String targetBodyPart, String status, String severityRiskLevel, List<AssessmentImageDto> images, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.assessmentId = assessmentId;
        this.userId = userId;
        this.userFullName = userFullName;
        this.targetBodyPart = targetBodyPart;
        this.status = status;
        this.severityRiskLevel = severityRiskLevel;
        this.images = images;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
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

    public List<AssessmentImageDto> getImages() {
        return images;
    }

    public void setImages(List<AssessmentImageDto> images) {
        this.images = images;
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
