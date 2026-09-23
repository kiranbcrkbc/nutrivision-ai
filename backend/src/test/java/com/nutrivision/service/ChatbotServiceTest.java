package com.nutrivision.service;

import com.nutrivision.dto.request.ChatMessageRequest;
import com.nutrivision.dto.response.ChatMessageResponse;
import com.nutrivision.entity.Assessment;
import com.nutrivision.entity.TargetBodyPart;
import com.nutrivision.entity.User;
import com.nutrivision.repository.AssessmentRepository;
import com.nutrivision.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class ChatbotServiceTest {

    private AssessmentRepository assessmentRepository;
    private UserRepository userRepository;
    private ChatbotService chatbotService;

    @BeforeEach
    void setUp() {
        assessmentRepository = Mockito.mock(AssessmentRepository.class);
        userRepository = Mockito.mock(UserRepository.class);
        chatbotService = new ChatbotService(assessmentRepository, userRepository);
    }

    @Test
    @DisplayName("Should detect emergency queries and advise immediate emergency care")
    void testEmergencyDetection() {
        ChatMessageRequest req = new ChatMessageRequest("I have severe chest pain and cannot breathe", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertTrue(res.isEmergency());
        assertEquals("EMERGENCY", res.getIntentCategory());
        assertTrue(res.getReply().contains("112") || res.getReply().contains("108"));
    }

    @Test
    @DisplayName("Should answer Vitamin B12 queries with plain-English explanation")
    void testVitaminB12Explanation() {
        ChatMessageRequest req = new ChatMessageRequest("What is Vitamin B12 and what does it do?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("VITAMIN_B12_EXPLANATION", res.getIntentCategory());
        assertTrue(res.getReply().contains("Cobalamin"));
        assertTrue(res.getReply().contains("red blood cells"));
    }

    @Test
    @DisplayName("Should tailor Vitamin B12 food sources for vegetarians")
    void testVitaminB12Vegetarian() {
        ChatMessageRequest req = new ChatMessageRequest("What foods have B12 for vegetarians?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("VITAMIN_B12_VEG_SOURCES", res.getIntentCategory());
        assertTrue(res.getReply().toLowerCase().contains("dahi") || res.getReply().toLowerCase().contains("curd"));
    }

    @Test
    @DisplayName("Should explain Glossitis in everyday terms")
    void testGlossitisExplanation() {
        ChatMessageRequest req = new ChatMessageRequest("Why is my tongue sore and smooth?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("SYMPTOM_GLOSSITIS", res.getIntentCategory());
        assertTrue(res.getReply().contains("Glossitis"));
        assertTrue(res.getReply().contains("Inflammation of the tongue"));
    }

    @Test
    @DisplayName("Should explain spoon nails (Koilonychia) in everyday terms")
    void testKoilonychiaExplanation() {
        ChatMessageRequest req = new ChatMessageRequest("What does spoon-shaped concave nails mean?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("SYMPTOM_KOILONYCHIA", res.getIntentCategory());
        assertTrue(res.getReply().contains("Koilonychia"));
        assertTrue(res.getReply().contains("Iron"));
    }

    @Test
    @DisplayName("Should safely handle supplement questions without prescribing doses")
    void testSupplementSafety() {
        ChatMessageRequest req = new ChatMessageRequest("Can I take high dose vitamin pills and supplements?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("SUPPLEMENT_SAFETY", res.getIntentCategory());
        assertTrue(res.getReply().contains("does not recommend or prescribe specific supplement dosages"));
    }

    @Test
    @DisplayName("Should clarify that AI screening is not a clinical confirmation")
    void testConfirmationLimitation() {
        ChatMessageRequest req = new ChatMessageRequest("Can this app confirm my vitamin deficiency?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("DIAGNOSTIC_LIMITATION", res.getIntentCategory());
        assertTrue(res.getReply().startsWith("NO"));
        assertTrue(res.getReply().contains("laboratory blood tests"));
    }

    @Test
    @DisplayName("Should securely retrieve user's own assessment without IDOR")
    void testPreviousAssessmentRetrieval() {
        User user = new User("user@test.com", "hash", "Test User");
        user.setUserId(42L);

        Assessment mockAssessment = new Assessment(user, TargetBodyPart.TONGUE);
        mockAssessment.setAssessmentId(101L);
        mockAssessment.setCreatedAt(LocalDateTime.now());

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(assessmentRepository.findByUser_UserIdOrderByCreatedAtDesc(42L))
                .thenReturn(List.of(mockAssessment));

        ChatMessageRequest req = new ChatMessageRequest("What did my previous assessment show?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("PREVIOUS_ASSESSMENT_FOUND", res.getIntentCategory());
        assertTrue(res.getReply().contains("#101"));
        assertTrue(res.getReply().contains("TONGUE"));
    }

    @Test
    @DisplayName("Should provide Bengaluru healthcare options on doctor referral question")
    void testDoctorReferral() {
        ChatMessageRequest req = new ChatMessageRequest("Can you find a doctor near me in Bengaluru?", null);
        ChatMessageResponse res = chatbotService.processUserMessage("user@test.com", req);

        assertEquals("DOCTOR_REFERRAL", res.getIntentCategory());
        assertTrue(res.getReply().contains("Manipal Hospital") || res.getReply().contains("Bengaluru"));
    }
}
