package com.nutrivision.service;
import com.nutrivision.dto.request.UpdateAssessmentStatusRequest;
import com.nutrivision.dto.response.AiInferenceResponse;
import com.nutrivision.entity.*;
import com.nutrivision.mapper.AssessmentMapper;
import com.nutrivision.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class AssessmentSafetyTest {
    AssessmentRepository assessments = mock(AssessmentRepository.class);
    AssessmentImageRepository images = mock(AssessmentImageRepository.class);
    UserRepository users = mock(UserRepository.class);
    FileStorageService storage = mock(FileStorageService.class);
    AiInferenceClient ai = mock(AiInferenceClient.class);
    AssessmentMapper mapper = new AssessmentMapper();
    AssessmentService service = new AssessmentService(assessments, images, users, mapper, storage, mock(ImageQualityClient.class), ai);
    User owner; Assessment record; AssessmentImage image;
    @BeforeEach void setup() {
        owner = new User(); owner.setUserId(1L); owner.setRoles(java.util.Set.of());
        record = new Assessment(owner, TargetBodyPart.EYES); record.setAssessmentId(10L);
        image = new AssessmentImage(); image.setAssessment(record); image.setFilePath("10/photo.png"); image.setOriginalFilename("photo.png");
        when(users.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));
        when(assessments.findById(10L)).thenReturn(Optional.of(record));
        when(images.findByAssessment_AssessmentId(10L)).thenReturn(List.of(image));
        when(storage.loadAsResource("10/photo.png")).thenReturn(new ByteArrayResource(new byte[]{1,2,3}));
        when(assessments.save(any())).thenAnswer(i -> i.getArgument(0));
    }
    @Test void unavailableResultPersistsWithoutFakeCompletionOrRisk() {
        record.setSeverityRiskLevel("MODERATE_CONCERN"); record.setStatus(AssessmentStatus.COMPLETED);
        AiInferenceResponse outcome = AiInferenceResponse.fallback("No prediction made", "EYES");
        when(ai.screenImage(any(), any(), any())).thenReturn(outcome);
        assertSame(outcome, service.screenAssessment("owner@example.com", 10L, null));
        verify(assessments).save(record);
        assertEquals(AssessmentStatus.IN_PROGRESS, record.getStatus());
        assertNull(record.getSeverityRiskLevel()); assertNull(record.getCompletedAt());
        assertNotNull(record.getScreeningResultJson());
        assertEquals(outcome.getStatus(), mapper.toDto(record).getScreeningResult().getStatus());
    }
    @Test void callersCannotInventCompletionOrRisk() {
        assertThrows(IllegalArgumentException.class, () -> service.updateAssessmentStatus("owner@example.com", 10L, new UpdateAssessmentStatusRequest("COMPLETED", null)));
        assertThrows(IllegalArgumentException.class, () -> service.updateAssessmentStatus("owner@example.com", 10L, new UpdateAssessmentStatusRequest("IN_PROGRESS", "LOW")));
    }
    @Test void anotherUsersAssessmentCannotBeScreened() {
        User other = new User(); other.setUserId(2L); other.setRoles(java.util.Set.of());
        when(users.findByEmail("other@example.com")).thenReturn(Optional.of(other));
        assertThrows(AccessDeniedException.class, () -> service.screenAssessment("other@example.com", 10L, null));
        verifyNoInteractions(ai);
    }
}
