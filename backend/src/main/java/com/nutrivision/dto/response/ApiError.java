package com.nutrivision.dto.response;

import java.time.Instant;
import java.util.List;

public class ApiError {

    private boolean success;
    private String timestamp;
    private String code;
    private String message;
    private List<String> details;

    public ApiError() {
        this.success = false;
        this.timestamp = Instant.now().toString();
    }

    public ApiError(String code, String message, List<String> details) {
        this.success = false;
        this.timestamp = Instant.now().toString();
        this.code = code;
        this.message = message;
        this.details = details;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}
