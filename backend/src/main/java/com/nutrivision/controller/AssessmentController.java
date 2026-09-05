package com.nutrivision.controller;

import com.nutrivision.dto.request.CreateAssessmentRequest;
import com.nutrivision.dto.request.UpdateAssessmentStatusRequest;
import com.nutrivision.dto.response.*;
import com.nutrivision.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AssessmentDto>> createAssessment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateAssessmentRequest request) {
        AssessmentDto dto = assessmentService.createAssessment(userDetails.getUsername(), request);
        return new ResponseEntity<>(
                ApiResponse.success(dto, "Assessment session initiated successfully"),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssessmentSummaryDto>>> getUserAssessments(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<AssessmentSummaryDto> list = assessmentService.getUserAssessments(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(list, "User assessments retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentDto>> getAssessmentById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        AssessmentDto dto = assessmentService.getAssessmentById(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(dto, "Assessment retrieved successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AssessmentDto>> updateAssessmentStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateAssessmentStatusRequest request) {
        AssessmentDto dto = assessmentService.updateAssessmentStatus(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.success(dto, "Assessment status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteAssessment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        assessmentService.deleteAssessment(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("assessmentId", id, "status", "DELETED"),
                "Assessment deleted successfully"
        ));
    }

    // =========================================================================
    // Image Management & Quality Analysis Endpoints
    // =========================================================================

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AssessmentImageDto>> uploadAssessmentImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id,
            @RequestParam("file") MultipartFile file) {
        AssessmentImageDto imageDto = assessmentService.uploadImage(userDetails.getUsername(), id, file);
        return new ResponseEntity<>(
                ApiResponse.success(imageDto, "Assessment photograph uploaded and evaluated successfully"),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/{id}/images/{imageId}/analyze-quality")
    public ResponseEntity<ApiResponse<AssessmentImageDto>> reAnalyzeImageQuality(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id,
            @PathVariable("imageId") Long imageId) {
        AssessmentImageDto imageDto = assessmentService.reAnalyzeImageQuality(userDetails.getUsername(), id, imageId);
        return ResponseEntity.ok(ApiResponse.success(imageDto, "Image quality re-evaluation completed"));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<ApiResponse<List<AssessmentImageDto>>> getAssessmentImages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        List<AssessmentImageDto> images = assessmentService.getAssessmentImages(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(images, "Assessment images retrieved successfully"));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteAssessmentImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id,
            @PathVariable("imageId") Long imageId) {
        assessmentService.deleteAssessmentImage(userDetails.getUsername(), id, imageId);
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("assessmentId", id, "imageId", imageId, "status", "DELETED"),
                "Assessment image deleted successfully"
        ));
    }

    @GetMapping("/{id}/images/{imageId}/view")
    public ResponseEntity<Resource> viewAssessmentImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id,
            @PathVariable("imageId") Long imageId) {
        AssessmentService.ImageResourceResult result = assessmentService.getAssessmentImageResource(userDetails.getUsername(), id, imageId);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(result.getContentType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "private, max-age=3600")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + result.getFilename() + "\"")
                .body(result.getResource());
    }

    // =========================================================================
    // AI Preliminary Screening & Inference Endpoints
    // =========================================================================

    @PostMapping("/{id}/screen")
    public ResponseEntity<ApiResponse<AiInferenceResponse>> screenAssessment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id) {
        AiInferenceResponse response = assessmentService.screenAssessment(userDetails.getUsername(), id, null);
        return ResponseEntity.ok(ApiResponse.success(response, "Preliminary AI screening evaluation completed"));
    }

    @PostMapping("/{id}/images/{imageId}/screen")
    public ResponseEntity<ApiResponse<AiInferenceResponse>> screenAssessmentImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("id") Long id,
            @PathVariable("imageId") Long imageId) {
        AiInferenceResponse response = assessmentService.screenAssessment(userDetails.getUsername(), id, imageId);
        return ResponseEntity.ok(ApiResponse.success(response, "Preliminary AI screening evaluation completed"));
    }
}

