package com.nutrivision.service;

import com.nutrivision.dto.response.AiInferenceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiInferenceClient {

    private static final Logger log = LoggerFactory.getLogger(AiInferenceClient.class);

    private final String aiServiceBaseUrl;
    private final RestTemplate restTemplate;

    public AiInferenceClient(
            @Value("${app.ai-service.url:http://localhost:8000}") String aiServiceBaseUrl,
            @Value("${app.ai-service.timeout-ms:15000}") int timeoutMs) {
        this.aiServiceBaseUrl = aiServiceBaseUrl.replaceAll("/+$", "");

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeoutMs);
        factory.setReadTimeout(timeoutMs);
        this.restTemplate = new RestTemplate(factory);

        log.info("Initialized AiInferenceClient pointing to: {} (timeout: {}ms)", this.aiServiceBaseUrl, timeoutMs);
    }

    /**
     * Sends image bytes and target body part to the FastAPI AI inference microservice.
     */
    public AiInferenceResponse screenImage(byte[] imageBytes, String filename, String targetBodyPart) {
        String base = this.aiServiceBaseUrl;
        if (base.endsWith("/api/ai")) {
            base = base.substring(0, base.length() - "/api/ai".length());
        }
        String endpoint = base + "/api/ai/inference/analyze";


        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            ByteArrayResource fileResource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return (filename != null && !filename.isBlank()) ? filename : "upload.jpg";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);
            if (targetBodyPart != null && !targetBodyPart.isBlank()) {
                body.add("target_body_part", targetBodyPart.toUpperCase().trim());
            }

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            log.debug("Dispatching screening inference request to endpoint {}", endpoint);
            ResponseEntity<AiInferenceResponse> response = restTemplate.postForEntity(
                    endpoint,
                    requestEntity,
                    AiInferenceResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                AiInferenceResponse result = response.getBody();
                log.info("AI screening completed: status={}, modelAvailable={}, inferenceStatus={}",
                        result.getStatus(), result.getModelAvailable(), result.getInferenceStatus());
                return result;
            } else {
                log.warn("Non-2xx response from AI inference service: {}", response.getStatusCode());
                return AiInferenceResponse.fallback("AI screening service returned an unexpected response.", targetBodyPart);
            }

        } catch (ResourceAccessException e) {
            log.warn("AI inference microservice is unreachable at {}: {}", endpoint, e.getMessage());
            return AiInferenceResponse.fallback("AI inference microservice is unreachable. Quality check was completed.", targetBodyPart);
        } catch (RestClientException e) {
            log.error("Error communicating with AI inference service: {}", e.getMessage(), e);
            return AiInferenceResponse.fallback("Error during AI inference communication: " + e.getMessage(), targetBodyPart);
        } catch (Exception e) {
            log.error("Unexpected error during AI screening: {}", e.getMessage(), e);
            return AiInferenceResponse.fallback("Unexpected error during preliminary screening.", targetBodyPart);
        }
    }

    /**
     * Probes the AI microservice health endpoint.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> checkAiHealth() {
        String base = this.aiServiceBaseUrl;
        if (base.endsWith("/api/ai")) {
            base = base.substring(0, base.length() - "/api/ai".length());
        }
        String endpoint = base + "/api/ai/health";
        try {
            ResponseEntity<Map> resp = restTemplate.getForEntity(endpoint, Map.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                return (Map<String, Object>) resp.getBody();
            }
        } catch (Exception e) {
            log.debug("Could not reach detailed /api/ai/health, falling back to /health: {}", e.getMessage());
            try {
                ResponseEntity<Map> fallbackResp = restTemplate.getForEntity(base + "/health", Map.class);
                if (fallbackResp.getStatusCode().is2xxSuccessful() && fallbackResp.getBody() != null) {
                    return (Map<String, Object>) fallbackResp.getBody();
                }
            } catch (Exception ex) {
                log.warn("AI service unreachable at {}: {}", base, ex.getMessage());
            }
        }


        Map<String, Object> downStatus = new HashMap<>();
        downStatus.put("status", "DOWN");
        downStatus.put("service", "NutriVision AI Service");
        downStatus.put("modelAvailable", false);
        downStatus.put("inferenceModel", "MODEL_NOT_AVAILABLE");
        downStatus.put("message", "AI microservice is currently unreachable.");
        return downStatus;
    }
}
