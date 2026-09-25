package com.nutrivision.service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.*;

/** Retries explicit temporary refusals only; never duplicates an upload or bypasses validation. */
final class AiPhotoRequest {
    private AiPhotoRequest() {}

    static <T> ResponseEntity<T> post(String url, HttpEntity<?> request, Class<T> type, int budgetMs) {
        long deadline = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(budgetMs);
        for (int attempt = 0; ; attempt++) {
            int remaining = (int) Math.max(1, TimeUnit.NANOSECONDS.toMillis(deadline - System.nanoTime()));
            var factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(Math.min(remaining, 10000));
            factory.setReadTimeout(remaining);
            try {
                return new RestTemplate(factory).postForEntity(url, request, type);
            } catch (HttpStatusCodeException error) {
                int status = error.getStatusCode().value();
                if (attempt >= 2 || (status != 429 && status != 502 && status != 503 && status != 504)) throw error;
                long delay = retryDelay(error.getResponseHeaders(), attempt);
                long left = TimeUnit.NANOSECONDS.toMillis(deadline - System.nanoTime());
                // Respect long Retry-After values by returning control instead of retrying early.
                if (delay > 10000 || delay + 250 >= left) throw error;
                try { Thread.sleep(delay); }
                catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                    throw new ResourceAccessException("Photo check interrupted", new java.io.IOException(interrupted));
                }
            }
        }
    }

    static long retryDelay(HttpHeaders headers, int attempt) {
        String value = headers == null ? null : headers.getFirst("Retry-After");
        if (value != null) {
            try { return Math.max(250, Math.multiplyExact(Long.parseLong(value.trim()), 1000)); }
            catch (ArithmeticException overflow) { return Long.MAX_VALUE; }
            catch (NumberFormatException ignored) {
                try { return Math.max(250, ZonedDateTime.parse(value, DateTimeFormatter.RFC_1123_DATE_TIME).toInstant().toEpochMilli() - System.currentTimeMillis()); }
                catch (RuntimeException invalid) { /* Use bounded backoff for malformed headers. */ }
            }
        }
        return 1000L << attempt;
    }
}
