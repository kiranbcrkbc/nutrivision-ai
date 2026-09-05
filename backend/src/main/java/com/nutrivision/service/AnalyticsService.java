package com.nutrivision.service;

import com.nutrivision.dto.response.AnalyticsDashboardDto;
import com.nutrivision.dto.response.AssessmentSummaryDto;
import com.nutrivision.entity.Assessment;
import com.nutrivision.entity.AssessmentStatus;
import com.nutrivision.entity.QualityStatus;
import com.nutrivision.entity.User;
import com.nutrivision.mapper.AssessmentMapper;
import com.nutrivision.repository.AssessmentImageRepository;
import com.nutrivision.repository.AssessmentRepository;
import com.nutrivision.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentImageRepository assessmentImageRepository;
    private final UserRepository userRepository;
    private final AssessmentMapper assessmentMapper;

    public AnalyticsService(AssessmentRepository assessmentRepository,
                            AssessmentImageRepository assessmentImageRepository,
                            UserRepository userRepository,
                            AssessmentMapper assessmentMapper) {
        this.assessmentRepository = assessmentRepository;
        this.assessmentImageRepository = assessmentImageRepository;
        this.userRepository = userRepository;
        this.assessmentMapper = assessmentMapper;
    }

    @Transactional(readOnly = true)
    public AnalyticsDashboardDto getDashboardAnalytics(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        long totalAssessments = assessmentRepository.countByUser_UserId(user.getUserId());
        long completedAssessments = assessmentRepository.countByUser_UserIdAndStatus(user.getUserId(), AssessmentStatus.COMPLETED);
        long inProgressAssessments = assessmentRepository.countByUser_UserIdAndStatus(user.getUserId(), AssessmentStatus.IN_PROGRESS)
                + assessmentRepository.countByUser_UserIdAndStatus(user.getUserId(), AssessmentStatus.DRAFT);

        long totalImages = assessmentImageRepository.count();

        // Quality Status Breakdown from real database records
        Map<String, Long> qualityStatusCounts = new LinkedHashMap<>();
        for (QualityStatus status : QualityStatus.values()) {
            qualityStatusCounts.put(status.name(), assessmentImageRepository.countByQualityStatus(status));
        }

        // Body Part Distribution from user's assessments
        Map<String, Long> bodyPartDistribution = new LinkedHashMap<>();
        List<Object[]> bodyPartCounts = assessmentRepository.countGroupedByTargetBodyPartForUser(user.getUserId());
        for (Object[] row : bodyPartCounts) {
            if (row[0] != null) {
                bodyPartDistribution.put(row[0].toString(), (Long) row[1]);
            }
        }

        // Recent assessments
        List<Assessment> recent = assessmentRepository.findTop5ByUser_UserIdOrderByCreatedAtDesc(user.getUserId());
        List<AssessmentSummaryDto> recentDtos = recent.stream()
                .map(assessmentMapper::toSummaryDto)
                .collect(Collectors.toList());

        // Model Telemetry metadata
        AnalyticsDashboardDto.ModelTelemetryDto modelTelemetry = new AnalyticsDashboardDto.ModelTelemetryDto(
                "MobileNetV2-NutriVision-v1",
                "1.0.0",
                "PyTorch -> ONNX Runtime (CPU)",
                "FastAPI Microservice (Port 8000)",
                "OPERATIONAL",
                "MobileNetV2 with Inverted Residual Blocks & Linear Bottlenecks",
                "Synthesized prototype benchmark dataset (900 balanced multi-region samples). Non-clinical prototype."
        );

        return new AnalyticsDashboardDto(
                totalAssessments,
                completedAssessments,
                inProgressAssessments,
                totalImages,
                qualityStatusCounts,
                bodyPartDistribution,
                modelTelemetry,
                recentDtos
        );
    }
}
