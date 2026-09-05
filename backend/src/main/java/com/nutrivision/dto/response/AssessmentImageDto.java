package com.nutrivision.dto.response;

import java.time.LocalDateTime;

public class AssessmentImageDto {
    private Long imageId;
    private String originalFilename;
    private Integer fileSizeBytes;
    private String mimeType;
    private String qualityStatus;
    private Float blurScore;
    private Float brightnessScore;
    private String rejectionReason;
    private LocalDateTime uploadedAt;

    public AssessmentImageDto() {
    }

    public AssessmentImageDto(Long imageId, String originalFilename, Integer fileSizeBytes, String mimeType, String qualityStatus, Float blurScore, Float brightnessScore, String rejectionReason, LocalDateTime uploadedAt) {
        this.imageId = imageId;
        this.originalFilename = originalFilename;
        this.fileSizeBytes = fileSizeBytes;
        this.mimeType = mimeType;
        this.qualityStatus = qualityStatus;
        this.blurScore = blurScore;
        this.brightnessScore = brightnessScore;
        this.rejectionReason = rejectionReason;
        this.uploadedAt = uploadedAt;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public Integer getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Integer fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getQualityStatus() {
        return qualityStatus;
    }

    public void setQualityStatus(String qualityStatus) {
        this.qualityStatus = qualityStatus;
    }

    public Float getBlurScore() {
        return blurScore;
    }

    public void setBlurScore(Float blurScore) {
        this.blurScore = blurScore;
    }

    public Float getBrightnessScore() {
        return brightnessScore;
    }

    public void setBrightnessScore(Float brightnessScore) {
        this.brightnessScore = brightnessScore;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
