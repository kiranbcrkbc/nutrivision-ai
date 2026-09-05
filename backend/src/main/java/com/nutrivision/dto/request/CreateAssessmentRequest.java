package com.nutrivision.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CreateAssessmentRequest {

    @NotBlank(message = "Target body part is required")
    @Pattern(
        regexp = "NAILS|EYES|TONGUE|LIPS|SKIN|HAIR|FACE",
        message = "Target body part must be one of: NAILS, EYES, TONGUE, LIPS, SKIN, HAIR, FACE"
    )
    private String targetBodyPart;

    public CreateAssessmentRequest() {
    }

    public CreateAssessmentRequest(String targetBodyPart) {
        this.targetBodyPart = targetBodyPart;
    }

    public String getTargetBodyPart() {
        return targetBodyPart;
    }

    public void setTargetBodyPart(String targetBodyPart) {
        this.targetBodyPart = targetBodyPart;
    }
}
