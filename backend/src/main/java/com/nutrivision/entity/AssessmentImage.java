package com.nutrivision.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_images")
public class AssessmentImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(name = "file_path", length = 500, nullable = false)
    private String filePath;

    @Column(name = "original_filename", length = 255, nullable = false)
    private String originalFilename;

    @Column(name = "file_size_bytes", nullable = false)
    private Integer fileSizeBytes;

    @Column(name = "mime_type", length = 50, nullable = false)
    private String mimeType;

    // Database copy survives ephemeral hosting restarts. Never included in DTOs.
    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

    public byte[] getImageData() { return imageData; }
    public void setImageData(byte[] value) { imageData = value; }

    @Enumerated(EnumType.STRING)
    @Column(name = "quality_status", length = 30, nullable = false)
    private QualityStatus qualityStatus = QualityStatus.PENDING;

    @Column(name = "blur_score")
    private Float blurScore;

    @Column(name = "brightness_score")
    private Float brightnessScore;

    @Column(name = "rejection_reason", length = 255)
    private String rejectionReason;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    public AssessmentImage() {
    }

    public AssessmentImage(Assessment assessment, String filePath, String originalFilename, Integer fileSizeBytes, String mimeType) {
        this.assessment = assessment;
        this.filePath = filePath;
        this.originalFilename = originalFilename;
        this.fileSizeBytes = fileSizeBytes;
        this.mimeType = mimeType;
        this.qualityStatus = QualityStatus.PENDING;
        this.uploadedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
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

    public QualityStatus getQualityStatus() {
        return qualityStatus;
    }

    public void setQualityStatus(QualityStatus qualityStatus) {
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
