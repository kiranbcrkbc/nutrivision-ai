package com.nutrivision.dto.response;

import java.util.List;
import java.util.Map;

public class AnalyticsDashboardDto {

    private long totalAssessments;
    private long completedAssessments;
    private long inProgressAssessments;
    private long totalImagesUploaded;
    private Map<String, Long> qualityStatusCounts;
    private Map<String, Long> bodyPartDistribution;
    private ModelTelemetryDto modelTelemetry;
    private List<AssessmentSummaryDto> recentAssessments;

    public AnalyticsDashboardDto() {
    }

    public AnalyticsDashboardDto(long totalAssessments,
                                 long completedAssessments,
                                 long inProgressAssessments,
                                 long totalImagesUploaded,
                                 Map<String, Long> qualityStatusCounts,
                                 Map<String, Long> bodyPartDistribution,
                                 ModelTelemetryDto modelTelemetry,
                                 List<AssessmentSummaryDto> recentAssessments) {
        this.totalAssessments = totalAssessments;
        this.completedAssessments = completedAssessments;
        this.inProgressAssessments = inProgressAssessments;
        this.totalImagesUploaded = totalImagesUploaded;
        this.qualityStatusCounts = qualityStatusCounts;
        this.bodyPartDistribution = bodyPartDistribution;
        this.modelTelemetry = modelTelemetry;
        this.recentAssessments = recentAssessments;
    }

    public long getTotalAssessments() {
        return totalAssessments;
    }

    public void setTotalAssessments(long totalAssessments) {
        this.totalAssessments = totalAssessments;
    }

    public long getCompletedAssessments() {
        return completedAssessments;
    }

    public void setCompletedAssessments(long completedAssessments) {
        this.completedAssessments = completedAssessments;
    }

    public long getInProgressAssessments() {
        return inProgressAssessments;
    }

    public void setInProgressAssessments(long inProgressAssessments) {
        this.inProgressAssessments = inProgressAssessments;
    }

    public long getTotalImagesUploaded() {
        return totalImagesUploaded;
    }

    public void setTotalImagesUploaded(long totalImagesUploaded) {
        this.totalImagesUploaded = totalImagesUploaded;
    }

    public Map<String, Long> getQualityStatusCounts() {
        return qualityStatusCounts;
    }

    public void setQualityStatusCounts(Map<String, Long> qualityStatusCounts) {
        this.qualityStatusCounts = qualityStatusCounts;
    }

    public Map<String, Long> getBodyPartDistribution() {
        return bodyPartDistribution;
    }

    public void setBodyPartDistribution(Map<String, Long> bodyPartDistribution) {
        this.bodyPartDistribution = bodyPartDistribution;
    }

    public ModelTelemetryDto getModelTelemetry() {
        return modelTelemetry;
    }

    public void setModelTelemetry(ModelTelemetryDto modelTelemetry) {
        this.modelTelemetry = modelTelemetry;
    }

    public List<AssessmentSummaryDto> getRecentAssessments() {
        return recentAssessments;
    }

    public void setRecentAssessments(List<AssessmentSummaryDto> recentAssessments) {
        this.recentAssessments = recentAssessments;
    }

    public static class ModelTelemetryDto {
        private String modelName;
        private String modelVersion;
        private String framework;
        private String runtimeEnvironment;
        private String modelStatus;
        private String architecture;
        private String validationDatasetNote;

        public ModelTelemetryDto() {
        }

        public ModelTelemetryDto(String modelName, String modelVersion, String framework,
                                 String runtimeEnvironment, String modelStatus,
                                 String architecture, String validationDatasetNote) {
            this.modelName = modelName;
            this.modelVersion = modelVersion;
            this.framework = framework;
            this.runtimeEnvironment = runtimeEnvironment;
            this.modelStatus = modelStatus;
            this.architecture = architecture;
            this.validationDatasetNote = validationDatasetNote;
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

        public String getFramework() {
            return framework;
        }

        public void setFramework(String framework) {
            this.framework = framework;
        }

        public String getRuntimeEnvironment() {
            return runtimeEnvironment;
        }

        public void setRuntimeEnvironment(String runtimeEnvironment) {
            this.runtimeEnvironment = runtimeEnvironment;
        }

        public String getModelStatus() {
            return modelStatus;
        }

        public void setModelStatus(String modelStatus) {
            this.modelStatus = modelStatus;
        }

        public String getArchitecture() {
            return architecture;
        }

        public void setArchitecture(String architecture) {
            this.architecture = architecture;
        }

        public String getValidationDatasetNote() {
            return validationDatasetNote;
        }

        public void setValidationDatasetNote(String validationDatasetNote) {
            this.validationDatasetNote = validationDatasetNote;
        }
    }
}
