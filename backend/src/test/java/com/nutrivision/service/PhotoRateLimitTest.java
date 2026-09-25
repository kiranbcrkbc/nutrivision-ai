package com.nutrivision.service;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import static org.junit.jupiter.api.Assertions.*;

class PhotoRateLimitTest {
    @Test void temporaryRefusalRecoversWithoutChangingPhotoOrTarget() throws Exception {
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        var count = new AtomicInteger();
        server.createContext("/analyze-image", exchange -> {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            assertTrue(body.contains("NAILS")); assertTrue(body.contains("same-photo"));
            int attempt = count.incrementAndGet();
            byte[] json = "{\"qualityStatus\":\"REJECTED\",\"rejectionReason\":\"unrelated content\"}".getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Retry-After", "0");
            exchange.sendResponseHeaders(attempt == 1 ? 429 : attempt == 2 ? 503 : 200, json.length);
            exchange.getResponseBody().write(json); exchange.close();
        });
        server.start();
        try {
            var result = new ImageQualityClient("http://127.0.0.1:" + server.getAddress().getPort(), 5000)
                    .analyzeImage("same-photo".getBytes(), "nails.jpg", "NAILS");
            assertEquals("REJECTED", result.getQualityStatus());
            assertEquals(3, count.get());
        } finally { server.stop(0); }
    }

    @Test void longRateLimitIsNotRetriedEarlyAndNeverPassesPhoto() throws Exception {
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        var count = new AtomicInteger();
        server.createContext("/analyze-image", exchange -> {
            exchange.getRequestBody().readAllBytes(); count.incrementAndGet();
            exchange.getResponseHeaders().set("Retry-After", "60");
            exchange.sendResponseHeaders(429, -1); exchange.close();
        });
        server.start();
        try {
            var result = new ImageQualityClient("http://127.0.0.1:" + server.getAddress().getPort(), 5000)
                    .analyzeImage("photo".getBytes(), "eye.jpg", "EYES");
            assertEquals("PENDING", result.getQualityStatus());
            assertTrue(result.getRejectionReason().contains("busy"));
            assertEquals(1, count.get());
        } finally { server.stop(0); }
    }

    @Test void malformedHeadersUseBackoffAndHugeHeadersDoNotOverflow() {
        var headers = new HttpHeaders(); headers.set("Retry-After", "invalid");
        assertEquals(2000, AiPhotoRequest.retryDelay(headers, 1));
        headers.set("Retry-After", "9223372036854775807");
        assertEquals(Long.MAX_VALUE, AiPhotoRequest.retryDelay(headers, 0));
    }
}
