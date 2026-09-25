package com.nutrivision.service;

import com.nutrivision.dto.response.ImageQualityResult;
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

@Service
public class ImageQualityClient {

    private static final Logger log = LoggerFactory.getLogger(ImageQualityClient.class);

    private final String aiServiceBaseUrl;
    private final RestTemplate restTemplate;

    public ImageQualityClient(
            @Value("${app.ai-service.url:http://localhost:8000}") String aiServiceBaseUrl,
            @Value("${app.ai-service.timeout-ms:15000}") int timeoutMs) {
        this.aiServiceBaseUrl = normalizeUrl(aiServiceBaseUrl);

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(timeoutMs);
        factory.setReadTimeout(timeoutMs);
        this.restTemplate = new RestTemplate(factory);

        log.info("Initialized ImageQualityClient with target: {} (timeout: {}ms)", this.aiServiceBaseUrl, timeoutMs);
    }

    private static String normalizeUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            return "http://localhost:8000";
        }
        String url = rawUrl.trim().replaceAll("/+$", "");
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            if (!url.contains("localhost") && !url.contains("127.0.0.1")) {
                url = "https://" + url;
            } else {
                url = "http://" + url;
            }
        }
        String host = url.replaceFirst("^https?://", "").split("/")[0].split(":")[0];
        if (!host.contains(".") && !host.equalsIgnoreCase("localhost") && !host.equalsIgnoreCase("127.0.0.1") && !url.contains(":8000")) {
            url = url.replaceFirst(host, host + ".onrender.com");
        }
        return url;
    }

    /**
     * Sends image bytes to the FastAPI image quality microservice.
     * If the service is unreachable or errors, gracefully returns a PENDING status result.
     */
    public ImageQualityResult analyzeImage(byte[] imageBytes, String filename) {
        return analyzeImage(imageBytes, filename, "");
    }

    public ImageQualityResult analyzeImage(byte[] imageBytes, String filename, String bodyPart) {
        String endpoint = this.aiServiceBaseUrl + "/analyze-image";

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
            body.add("target_body_part", bodyPart);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            log.debug("Dispatching image quality request to {}", endpoint);
            ResponseEntity<ImageQualityResult> response = restTemplate.postForEntity(
                    endpoint,
                    requestEntity,
                    ImageQualityResult.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                ImageQualityResult result = response.getBody();
                log.info("Image quality evaluated successfully: status={}, blur={}, brightness={}",
                        result.getQualityStatus(), result.getBlurScore(), result.getBrightnessScore());
                return result;
            } else {
                log.warn("Non-2xx response from image quality service: {}", response.getStatusCode());
                return ImageQualityResult.pending("Image quality analysis returned an unexpected response.");
            }

        } catch (ResourceAccessException e) {
            log.warn("Image quality microservice is unreachable at {}: {}", endpoint, e.getMessage());
            return ImageQualityResult.pending("Image uploaded successfully. Quality analysis is temporarily unavailable.");
        } catch (RestClientException e) {
            log.error("Error communicating with image quality microservice: {}", e.getMessage(), e);
            return ImageQualityResult.pending("Image uploaded successfully. Quality analysis is temporarily unavailable.");
        } catch (Exception e) {
            log.error("Unexpected error during image quality analysis: {}", e.getMessage(), e);
            return ImageQualityResult.pending("Image uploaded successfully. Quality analysis is temporarily unavailable.");
        }
    }
}
