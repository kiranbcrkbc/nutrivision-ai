package com.nutrivision.service;

import com.nutrivision.controller.HealthController;
import org.junit.jupiter.api.Test;
import org.springframework.boot.availability.ApplicationAvailability;
import org.springframework.boot.availability.ReadinessState;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class ReadinessTest {
    @Test void deploymentIsNotHealthyUntilStartupMigrationsComplete() {
        var availability = mock(ApplicationAvailability.class);
        var controller = new HealthController(null, mock(AiInferenceClient.class), availability);
        when(availability.getReadinessState()).thenReturn(ReadinessState.REFUSING_TRAFFIC);
        assertEquals(503, controller.getServiceHealth().getStatusCode().value());
        when(availability.getReadinessState()).thenReturn(ReadinessState.ACCEPTING_TRAFFIC);
        assertEquals(200, controller.getServiceHealth().getStatusCode().value());
    }
}
