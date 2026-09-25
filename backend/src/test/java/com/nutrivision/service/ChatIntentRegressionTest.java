package com.nutrivision.service;
import com.nutrivision.dto.request.ChatMessageRequest;
import com.nutrivision.repository.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
class ChatIntentRegressionTest {
    ChatbotService service = new ChatbotService(mock(AssessmentRepository.class), mock(UserRepository.class));
    @ParameterizedTest
    @CsvSource({
        "What foods contain vitamin A?, VITAMIN_A_INFO",
        "What does vitamin B12 deficiency mean?, VITAMIN_B12_EXPLANATION",
        "What should I eat if I have low iron?, IRON_FOODS",
        "Can this result confirm that I have a deficiency?, DIAGNOSTIC_LIMITATION",
        "What is vitamin D?, VITAMIN_D_INFO",
        "How can I improve my vitamin D naturally?, VITAMIN_D_FOODS",
        "What symptoms can vitamin D deficiency cause?, VITAMIN_D_SYMPTOMS",
        "Can children use this system?, CHILD_SAFETY",
        "I uploaded an image. What does the result mean?, IMAGE_RESULT_LIMITS",
        "Who won the football match?, GENERAL_ASSISTANCE",
        "Can an image confirm vitamin D deficiency?, DIAGNOSTIC_LIMITATION"
    })
    void routesQuestionsToRelevantAnswers(String question, String intent) {
        var result = service.processUserMessage("test@example.com", new ChatMessageRequest(question, null));
        assertEquals(intent, result.getIntentCategory());
        assertFalse(result.getReply().isBlank());
    }
}
