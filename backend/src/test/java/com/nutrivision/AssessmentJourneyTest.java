package com.nutrivision;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrivision.dto.response.*;
import com.nutrivision.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;
import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.util.Map;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:journey;MODE=MySQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa", "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
    "app.admin.bootstrap.enabled=false", "app.storage.upload-dir=./target/test-uploads"
})
@AutoConfigureMockMvc
class AssessmentJourneyTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @MockBean AiInferenceClient ai;
    @MockBean ImageQualityClient quality;

    String account(String email) throws Exception {
        String body = json.writeValueAsString(Map.of("fullName", "Test Account", "email", email,
                "password", "LocalTestOnly-123!", "confirmPassword", "LocalTestOnly-123!", "disclaimerAccepted", true));
        mvc.perform(post("/api/auth/register").contentType("application/json").content(body)).andExpect(status().isCreated());
        String response = mvc.perform(post("/api/auth/login").contentType("application/json").content(json.writeValueAsString(Map.of("email", email, "password", "LocalTestOnly-123!"))))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return "Bearer " + json.readTree(response).path("data").path("accessToken").asText();
    }

    @Test void registerLoginUploadPersistHistoryAndIsolation() throws Exception {
        String owner = account("journey-owner@example.com"), other = account("journey-other@example.com");
        String response = mvc.perform(post("/api/assessments").header("Authorization", owner).contentType("application/json").content("{\"targetBodyPart\":\"EYES\"}"))
            .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long id = json.readTree(response).path("data").path("assessmentId").asLong();
        assertTrue(id > 0);
        when(quality.analyzeImage(any(), any())).thenReturn(new ImageQualityResult("PASSED", 150f, 120f, null));
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(320,320,BufferedImage.TYPE_INT_RGB), "png", bytes);
        mvc.perform(multipart("/api/assessments/"+id+"/images").file(new MockMultipartFile("file", "test.png", "image/png", bytes.toByteArray())).header("Authorization", owner)).andExpect(status().isCreated());
        when(ai.screenImage(any(), any(), any())).thenReturn(AiInferenceResponse.fallback("No validated screening model", "EYES"));
        mvc.perform(post("/api/assessments/"+id+"/screen").header("Authorization", owner).contentType("application/json").content("{\"symptoms\":[\"Dry eyes\"]}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.data.predictions").isEmpty());
        mvc.perform(get("/api/assessments/"+id).header("Authorization", owner)).andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
            .andExpect(jsonPath("$.data.screeningResult.message").value("No validated screening model"))
            .andExpect(jsonPath("$.data.screeningResult.reportedSymptoms[0]").value("Dry eyes"));
        mvc.perform(get("/api/assessments").header("Authorization", owner)).andExpect(status().isOk()).andExpect(jsonPath("$.data.length()").value(1));
        mvc.perform(get("/api/assessments/"+id).header("Authorization", other)).andExpect(status().isForbidden());
        mvc.perform(get("/api/analytics/dashboard").header("Authorization", other)).andExpect(status().isOk()).andExpect(jsonPath("$.data.totalImagesUploaded").value(0));
        mvc.perform(get("/api/analytics/dashboard").header("Authorization", owner)).andExpect(status().isOk()).andExpect(jsonPath("$.data.totalImagesUploaded").value(1));
        mvc.perform(get("/api/assessments")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/summary").header("Authorization", owner)).andExpect(status().isForbidden());
        mvc.perform(patch("/api/assessments/"+id+"/status").header("Authorization", owner).contentType("application/json").content("{\"status\":\"COMPLETED\"}")).andExpect(status().isBadRequest());
    }
}
