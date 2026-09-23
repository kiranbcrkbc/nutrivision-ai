package com.nutrivision.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatMessageRequest {

    @NotBlank(message = "Message text cannot be blank")
    @Size(max = 2000, message = "Message text cannot exceed 2000 characters")
    private String message;

    private Long assessmentId;

    public ChatMessageRequest() {}

    public ChatMessageRequest(String message, Long assessmentId) {
        this.message = message;
        this.assessmentId = assessmentId;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }
}
