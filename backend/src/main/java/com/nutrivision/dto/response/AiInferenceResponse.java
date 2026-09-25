package com.nutrivision.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AiInferenceResponse {
    private java.util.Map<String, Object> contentEvaluation;
    public java.util.Map<String, Object> getContentEvaluation() { return contentEvaluation; }
    public void setContentEvaluation(java.util.Map<String, Object> value) { contentEvaluation = value; }
    private List<String> reportedSymptoms = new ArrayList<>();
    public List<String> getReportedSymptoms() { return reportedSymptoms; }
    public void setReportedSymptoms(List<String> value) { reportedSymptoms = value; }
    private String status;
    private Boolean modelAvailable = false;
    private String modelStatus;
    private String inferenceStatus;
    private String modelName;
    private String modelVersion;
    private String targetBodyPart;
    private ImageQualityResult qualityEvaluation;
    private List<PredictionItemDto> predictions = new ArrayList<>();
    private PredictionItemDto topPrediction;
    private String explainabilityStatus = "EXPLAINABILITY_NOT_AVAILABLE";
    private String gradcamPath;
    private String message;
    private String medicalDisclaimer = "Vitamin Deficiency provides AI-based preliminary screening indicators only. This is not a medical diagnosis. Always consult a qualified healthcare professional for clinical advice.";

    public AiInferenceResponse() {
    }

    public static AiInferenceResponse fallback(String message, String targetBodyPart) {
        AiInferenceResponse res = new AiInferenceResponse();
        res.setStatus("SERVICE_UNAVAILABLE");
        res.setModelAvailable(false);
        res.setModelStatus("MODEL_NOT_AVAILABLE");
        res.setInferenceStatus("MODEL_NOT_CONFIGURED");
        res.setTargetBodyPart(targetBodyPart);
        res.setMessage(message);
        return res;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getModelAvailable() {
        return modelAvailable;
    }

    public void setModelAvailable(Boolean modelAvailable) {
        this.modelAvailable = modelAvailable;
    }

    public String getModelStatus() {
        return modelStatus;
    }

    public void setModelStatus(String modelStatus) {
        this.modelStatus = modelStatus;
    }

    public String getInferenceStatus() {
        return inferenceStatus;
    }

    public void setInferenceStatus(String inferenceStatus) {
        this.inferenceStatus = inferenceStatus;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public String getTargetBodyPart() {
        return targetBodyPart;
    }

    public void setTargetBodyPart(String targetBodyPart) {
        this.targetBodyPart = targetBodyPart;
    }

    public ImageQualityResult getQualityEvaluation() {
        return qualityEvaluation;
    }

    public void setQualityEvaluation(ImageQualityResult qualityEvaluation) {
        this.qualityEvaluation = qualityEvaluation;
    }

    public List<PredictionItemDto> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<PredictionItemDto> predictions) {
        this.predictions = predictions;
    }

    public PredictionItemDto getTopPrediction() {
        return topPrediction;
    }

    public void setTopPrediction(PredictionItemDto topPrediction) {
        this.topPrediction = topPrediction;
    }

    public String getExplainabilityStatus() {
        return explainabilityStatus;
    }

    public void setExplainabilityStatus(String explainabilityStatus) {
        this.explainabilityStatus = explainabilityStatus;
    }

    public String getGradcamPath() {
        return gradcamPath;
    }

    public void setGradcamPath(String gradcamPath) {
        this.gradcamPath = gradcamPath;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMedicalDisclaimer() {
        return medicalDisclaimer;
    }

    public void setMedicalDisclaimer(String medicalDisclaimer) {
        this.medicalDisclaimer = medicalDisclaimer;
    }
}
