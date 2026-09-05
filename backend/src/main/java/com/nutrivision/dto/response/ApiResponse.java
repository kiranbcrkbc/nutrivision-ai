package com.nutrivision.dto.response;

import java.time.Instant;

public class ApiResponse<T> {

    public static final String MEDICAL_DISCLAIMER =
        "Results provided by NutriVision AI are AI-based preliminary assessments or possible indicators only. " +
        "They are not medically certified diagnoses. Users should consult qualified healthcare professionals for medical diagnosis and treatment.";

    private boolean success;
    private String timestamp;
    private T data;
    private String message;
    private String disclaimer;

    public ApiResponse() {
        this.timestamp = Instant.now().toString();
        this.disclaimer = MEDICAL_DISCLAIMER;
    }

    public ApiResponse(boolean success, T data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.timestamp = Instant.now().toString();
        this.disclaimer = MEDICAL_DISCLAIMER;
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message);
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, "Operation completed successfully");
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    public void setDisclaimer(String disclaimer) {
        this.disclaimer = disclaimer;
    }
}
