package com.nutrivision.mapper;

import com.nutrivision.dto.response.AssessmentDto;
import com.nutrivision.dto.response.AssessmentImageDto;
import com.nutrivision.dto.response.AssessmentSummaryDto;
import com.nutrivision.entity.Assessment;
import com.nutrivision.entity.AssessmentImage;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AssessmentMapper {

    public AssessmentDto toDto(Assessment assessment) {
        if (assessment == null) return null;

        List<AssessmentImageDto> images = assessment.getImages() != null
                ? assessment.getImages().stream().map(this::toImageDto).collect(Collectors.toList())
                : Collections.emptyList();

        return new AssessmentDto(
                assessment.getAssessmentId(),
                assessment.getUser() != null ? assessment.getUser().getUserId() : null,
                assessment.getUser() != null ? assessment.getUser().getFullName() : null,
                assessment.getTargetBodyPart().name(),
                assessment.getStatus().name(),
                assessment.getSeverityRiskLevel(),
                images,
                assessment.getCreatedAt(),
                assessment.getCompletedAt()
        );
    }

    public AssessmentSummaryDto toSummaryDto(Assessment assessment) {
        if (assessment == null) return null;

        int count = assessment.getImages() != null ? assessment.getImages().size() : 0;

        return new AssessmentSummaryDto(
                assessment.getAssessmentId(),
                assessment.getTargetBodyPart().name(),
                assessment.getStatus().name(),
                assessment.getSeverityRiskLevel(),
                count,
                assessment.getCreatedAt(),
                assessment.getCompletedAt()
        );
    }

    public AssessmentImageDto toImageDto(AssessmentImage image) {
        if (image == null) return null;

        return new AssessmentImageDto(
                image.getImageId(),
                image.getOriginalFilename(),
                image.getFileSizeBytes(),
                image.getMimeType(),
                image.getQualityStatus().name(),
                image.getBlurScore(),
                image.getBrightnessScore(),
                image.getRejectionReason(),
                image.getUploadedAt()
        );
    }
}
