package com.nutrivision.service;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ImageQualityRecoveryTest {
    @Test
    void slowWakeupRequiresReadBudgetAndTimeoutNeverPassesPhoto() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/analyze-image", exchange -> {
            exchange.getRequestBody().readAllBytes();
            try { Thread.sleep(150); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            byte[] json = "{\"qualityStatus\":\"PASSED\"}".getBytes(StandardCharsets.UTF_8);
            try {
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, json.length);
                exchange.getResponseBody().write(json);
            } catch (java.io.IOException ignored) { /* timed-out caller has disconnected */ }
            finally { exchange.close(); }
        });
        server.start();
        try {
            String url = "http://127.0.0.1:" + server.getAddress().getPort();
            byte[] photo = "test-photo".getBytes(StandardCharsets.UTF_8);
            assertEquals("PENDING", new ImageQualityClient(url, 30).analyzeImage(photo, "eye.jpg", "EYES").getQualityStatus());
            assertEquals("PASSED", new ImageQualityClient(url, 2000).analyzeImage(photo, "eye.jpg", "EYES").getQualityStatus());
        } finally { server.stop(0); }
    }

    @Test
    void unavailableServiceThenRetryChecksTheSamePhotoAndBodyArea() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        AtomicInteger attempts = new AtomicInteger();
        server.createContext("/analyze-image", exchange -> {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            assertTrue(body.contains("NAILS"));
            assertTrue(body.contains("test-photo"));
            int code = attempts.incrementAndGet() == 1 ? 503 : 200;
            byte[] json = "{\"qualityStatus\":\"PASSED\"}".getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(code, json.length);
            exchange.getResponseBody().write(json);
            exchange.close();
        });
        server.start();
        try {
            ImageQualityClient client = new ImageQualityClient("http://127.0.0.1:" + server.getAddress().getPort(), 1000);
            byte[] photo = "test-photo".getBytes(StandardCharsets.UTF_8);
            assertEquals("PENDING", client.analyzeImage(photo, "nails.jpg", "NAILS").getQualityStatus());
            assertEquals("PASSED", client.analyzeImage(photo, "nails.jpg", "NAILS").getQualityStatus());
            assertEquals(2, attempts.get());
        } finally { server.stop(0); }
    }
}
