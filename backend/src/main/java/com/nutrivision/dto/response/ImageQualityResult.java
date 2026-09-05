package com.nutrivision.dto.response;

public class ImageQualityResult {
    private String qualityStatus;
    private Float blurScore;
    private Float brightnessScore;
    private String rejectionReason;

    public ImageQualityResult() {
    }

    public ImageQualityResult(String qualityStatus, Float blurScore, Float brightnessScore, String rejectionReason) {
        this.qualityStatus = qualityStatus;
        this.blurScore = blurScore;
        this.brightnessScore = brightnessScore;
        this.rejectionReason = rejectionReason;
    }

    public static ImageQualityResult pending(String message) {
        return new ImageQualityResult("PENDING", null, null, message);
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
}
