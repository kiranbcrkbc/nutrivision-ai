package com.nutrivision.service;

import com.nutrivision.dto.request.CreateAssessmentRequest;
import com.nutrivision.dto.request.UpdateAssessmentStatusRequest;
import com.nutrivision.dto.response.AiInferenceResponse;
import com.nutrivision.dto.response.AssessmentDto;
import com.nutrivision.dto.response.AssessmentImageDto;
import com.nutrivision.dto.response.AssessmentSummaryDto;
import com.nutrivision.dto.response.ImageQualityResult;
import com.nutrivision.entity.*;
import com.nutrivision.mapper.AssessmentMapper;
import com.nutrivision.repository.AssessmentImageRepository;
import com.nutrivision.repository.AssessmentRepository;
import com.nutrivision.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentImageRepository assessmentImageRepository;
    private final UserRepository userRepository;
    private final AssessmentMapper assessmentMapper;
    private final FileStorageService fileStorageService;
    private final ImageQualityClient imageQualityClient;
    private final AiInferenceClient aiInferenceClient;

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentImageRepository assessmentImageRepository,
                             UserRepository userRepository,
                             AssessmentMapper assessmentMapper,
                             FileStorageService fileStorageService,
                             ImageQualityClient imageQualityClient,
                             AiInferenceClient aiInferenceClient) {
        this.assessmentRepository = assessmentRepository;
        this.assessmentImageRepository = assessmentImageRepository;
        this.userRepository = userRepository;
        this.assessmentMapper = assessmentMapper;
        this.fileStorageService = fileStorageService;
        this.imageQualityClient = imageQualityClient;
        this.aiInferenceClient = aiInferenceClient;
    }


    @Transactional
    public AssessmentDto createAssessment(String userEmail, CreateAssessmentRequest request) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        TargetBodyPart bodyPart;
        try {
            bodyPart = TargetBodyPart.valueOf(request.getTargetBodyPart().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid target body part: " + request.getTargetBodyPart());
        }

        Assessment assessment = new Assessment(user, bodyPart);
        assessment.setStatus(AssessmentStatus.DRAFT);

        Assessment saved = assessmentRepository.save(assessment);
        return assessmentMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AssessmentSummaryDto> getUserAssessments(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        List<Assessment> assessments = assessmentRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId());
        return assessments.stream()
                .map(assessmentMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentDto getAssessmentById(String userEmail, Long assessmentId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        return assessmentMapper.toDto(assessment);
    }

    @Transactional
    public AssessmentDto updateAssessmentStatus(String userEmail, Long assessmentId, UpdateAssessmentStatusRequest request) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        try {
            AssessmentStatus status = AssessmentStatus.valueOf(request.getStatus().toUpperCase().trim());
            if (status == AssessmentStatus.COMPLETED) {
                throw new IllegalArgumentException("Only a successful screening can complete an assessment.");
            }
            assessment.setStatus(status);
            assessment.setCompletedAt(null);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid assessment status: " + request.getStatus());
        }

        if (request.getSeverityRiskLevel() != null && !request.getSeverityRiskLevel().isBlank()) {
            throw new IllegalArgumentException("Risk levels cannot be assigned manually.");
        }

        Assessment saved = assessmentRepository.save(assessment);
        return assessmentMapper.toDto(saved);
    }

    @Transactional
    public void deleteAssessment(String userEmail, Long assessmentId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        // Delete associated physical files
        List<AssessmentImage> images = assessmentImageRepository.findByAssessment_AssessmentId(assessmentId);
        for (AssessmentImage image : images) {
            fileStorageService.deletePhysicalFile(image.getFilePath());
        }

        assessmentRepository.delete(assessment);
    }

    @Transactional
    public AssessmentImageDto uploadImage(String userEmail, Long assessmentId, MultipartFile file) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to read uploaded file bytes: " + e.getMessage(), e);
        }

        // Store file physically on disk
        FileStorageService.StoredFileInfo fileInfo = fileStorageService.storeAssessmentImage(assessmentId, file);

        // Evaluate image quality with OpenCV FastAPI Engine
        ImageQualityResult qualityResult = imageQualityClient.analyzeImage(fileBytes, fileInfo.getOriginalFilename());

        // Create AssessmentImage entity
        AssessmentImage image = new AssessmentImage(
                assessment,
                fileInfo.getRelativePath(),
                fileInfo.getOriginalFilename(),
                fileInfo.getFileSize(),
                fileInfo.getMimeType()
        );

        applyQualityResult(image, qualityResult);

        AssessmentImage savedImage = assessmentImageRepository.save(image);

        invalidateScreening(assessment);

        return assessmentMapper.toImageDto(savedImage);
    }

    @Transactional
    public AssessmentImageDto reAnalyzeImageQuality(String userEmail, Long assessmentId, Long imageId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        AssessmentImage image = assessmentImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found with ID: " + imageId));

        if (!image.getAssessment().getAssessmentId().equals(assessmentId)) {
            throw new IllegalArgumentException("Image #" + imageId + " does not belong to assessment #" + assessmentId);
        }

        Resource resource = fileStorageService.loadAsResource(image.getFilePath());
        try {
            byte[] bytes = resource.getInputStream().readAllBytes();
            ImageQualityResult qualityResult = imageQualityClient.analyzeImage(bytes, image.getOriginalFilename());

            applyQualityResult(image, qualityResult);

            AssessmentImage updated = assessmentImageRepository.save(image);
            return assessmentMapper.toImageDto(updated);

        } catch (IOException e) {
            throw new RuntimeException("Failed to read image for quality re-analysis: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<AssessmentImageDto> getAssessmentImages(String userEmail, Long assessmentId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        List<AssessmentImage> images = assessmentImageRepository.findByAssessment_AssessmentId(assessmentId);
        return images.stream()
                .map(assessmentMapper::toImageDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAssessmentImage(String userEmail, Long assessmentId, Long imageId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        AssessmentImage image = assessmentImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found with ID: " + imageId));

        if (!image.getAssessment().getAssessmentId().equals(assessmentId)) {
            throw new IllegalArgumentException("Image #" + imageId + " does not belong to assessment #" + assessmentId);
        }

        // Delete physical file
        fileStorageService.deletePhysicalFile(image.getFilePath());

        // Delete database record
        assessmentImageRepository.delete(image);
        invalidateScreening(assessment);
    }

    @Transactional(readOnly = true)
    public ImageResourceResult getAssessmentImageResource(String userEmail, Long assessmentId, Long imageId) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        AssessmentImage image = assessmentImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found with ID: " + imageId));

        if (!image.getAssessment().getAssessmentId().equals(assessmentId)) {
            throw new IllegalArgumentException("Image #" + imageId + " does not belong to assessment #" + assessmentId);
        }

        Resource resource = fileStorageService.loadAsResource(image.getFilePath());
        return new ImageResourceResult(resource, image.getMimeType(), image.getOriginalFilename());
    }

    private void invalidateScreening(Assessment assessment) {
        assessment.setScreeningResultJson(null);
        assessment.setSeverityRiskLevel(null);
        assessment.setCompletedAt(null);
        assessment.setStatus(AssessmentStatus.IN_PROGRESS);
        assessmentRepository.save(assessment);
    }

    private void applyQualityResult(AssessmentImage image, ImageQualityResult qualityResult) {
        if (qualityResult == null) {
            image.setQualityStatus(QualityStatus.PENDING);
            image.setRejectionReason("Quality analysis is temporarily unavailable.");
            return;
        }

        String status = qualityResult.getQualityStatus();
        if ("PASSED".equalsIgnoreCase(status)) {
            image.setQualityStatus(QualityStatus.PASSED);
            image.setBlurScore(qualityResult.getBlurScore());
            image.setBrightnessScore(qualityResult.getBrightnessScore());
            image.setRejectionReason(null);
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            image.setQualityStatus(QualityStatus.REJECTED);
            image.setBlurScore(qualityResult.getBlurScore());
            image.setBrightnessScore(qualityResult.getBrightnessScore());
            image.setRejectionReason(qualityResult.getRejectionReason());
        } else if ("WARNING".equalsIgnoreCase(status)) {
            image.setQualityStatus(QualityStatus.WARNING);
            image.setBlurScore(qualityResult.getBlurScore());
            image.setBrightnessScore(qualityResult.getBrightnessScore());
            image.setRejectionReason(qualityResult.getRejectionReason());
        } else {
            image.setQualityStatus(QualityStatus.PENDING);
            image.setBlurScore(null);
            image.setBrightnessScore(null);
            image.setRejectionReason(qualityResult.getRejectionReason());
        }
    }

    @Transactional
    public AiInferenceResponse screenAssessment(String userEmail, Long assessmentId, Long imageId) {
        return screenAssessment(userEmail, assessmentId, imageId, null);
    }

    @Transactional
    public AiInferenceResponse screenAssessment(String userEmail, Long assessmentId, Long imageId, List<String> symptoms) {

        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + assessmentId));

        verifyOwnershipOrAdmin(user, assessment);

        AssessmentImage image;
        if (imageId != null) {
            image = assessmentImageRepository.findById(imageId)
                    .orElseThrow(() -> new IllegalArgumentException("Image not found with ID: " + imageId));
            if (!image.getAssessment().getAssessmentId().equals(assessmentId)) {
                throw new IllegalArgumentException("Image #" + imageId + " does not belong to assessment #" + assessmentId);
            }
        } else {
            List<AssessmentImage> images = assessmentImageRepository.findByAssessment_AssessmentId(assessmentId);
            if (images.isEmpty()) {
                throw new IllegalArgumentException("No photographs uploaded for assessment #" + assessmentId);
            }
            image = images.get(images.size() - 1);
        }

        Resource resource = fileStorageService.loadAsResource(image.getFilePath());
        try {
            byte[] bytes = resource.getInputStream().readAllBytes();
            AiInferenceResponse result = aiInferenceClient.screenImage(
                    bytes,
                    image.getOriginalFilename(),
                    assessment.getTargetBodyPart().name()
            );
            if (symptoms != null) {
                result.setReportedSymptoms(symptoms.stream().filter(java.util.Objects::nonNull).map(String::trim).filter(s -> !s.isEmpty()).distinct().toList());
            } else if (assessment.getScreeningResultJson() != null) {
                AiInferenceResponse previous = new com.fasterxml.jackson.databind.ObjectMapper().readValue(assessment.getScreeningResultJson(), AiInferenceResponse.class);
                result.setReportedSymptoms(previous.getReportedSymptoms());
            }
            assessment.setScreeningResultJson(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(result));
            assessment.setSeverityRiskLevel(null);
            assessment.setStatus("SUCCESS".equals(result.getStatus()) ? AssessmentStatus.COMPLETED : AssessmentStatus.IN_PROGRESS);
            if (!"SUCCESS".equals(result.getStatus())) assessment.setCompletedAt(null);
            assessmentRepository.save(assessment);
            return result;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read photograph bytes for screening: " + e.getMessage(), e);
        }
    }

    private void verifyOwnershipOrAdmin(User user, Assessment assessment) {

        boolean isOwner = assessment.getUser().getUserId().equals(user.getUserId());
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getRoleName() == RoleName.ROLE_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Access Denied: You do not have permission to access assessment #" + assessment.getAssessmentId());
        }
    }

    public static class ImageResourceResult {
        private final Resource resource;
        private final String contentType;
        private final String filename;

        public ImageResourceResult(Resource resource, String contentType, String filename) {
            this.resource = resource;
            this.contentType = contentType;
            this.filename = filename;
        }

        public Resource getResource() {
            return resource;
        }

        public String getContentType() {
            return contentType;
        }

        public String getFilename() {
            return filename;
        }
    }
}
