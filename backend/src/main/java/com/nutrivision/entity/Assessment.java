package com.nutrivision.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Long assessmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_body_part", length = 50, nullable = false)
    private TargetBodyPart targetBodyPart;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    private AssessmentStatus status = AssessmentStatus.DRAFT;

    @Column(name = "severity_risk_level", length = 50)
    private String severityRiskLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AssessmentImage> images = new ArrayList<>();

    public Assessment() {
    }

    public Assessment(User user, TargetBodyPart targetBodyPart) {
        this.user = user;
        this.targetBodyPart = targetBodyPart;
        this.status = AssessmentStatus.DRAFT;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TargetBodyPart getTargetBodyPart() {
        return targetBodyPart;
    }

    public void setTargetBodyPart(TargetBodyPart targetBodyPart) {
        this.targetBodyPart = targetBodyPart;
    }

    public AssessmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssessmentStatus status) {
        this.status = status;
        if (status == AssessmentStatus.COMPLETED && this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public String getSeverityRiskLevel() {
        return severityRiskLevel;
    }

    public void setSeverityRiskLevel(String severityRiskLevel) {
        this.severityRiskLevel = severityRiskLevel;
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

    public List<AssessmentImage> getImages() {
        return images;
    }

    public void setImages(List<AssessmentImage> images) {
        this.images = images;
    }

    public void addImage(AssessmentImage image) {
        this.images.add(image);
        image.setAssessment(this);
    }

    public void removeImage(AssessmentImage image) {
        this.images.remove(image);
        image.setAssessment(null);
    }
}
