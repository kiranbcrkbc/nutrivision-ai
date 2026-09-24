package com.nutrivision.service;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class DoctorReferralServiceTest {
    DoctorReferralService service = new DoctorReferralService();
    @Test void noUnverifiedProviderDetailsArePublished() {
        assertTrue(service.getBengaluruDoctors(null, null, null, null).isEmpty());
        assertTrue(service.getBengaluruDoctors("Koramangala", "doctor", null, null).isEmpty());
    }
    @Test void offersBengaluruNeighbourhoods() {
        assertTrue(service.getAvailableLocalities().contains("Koramangala"));
        assertTrue(service.getAvailableLocalities().contains("Whitefield"));
    }
}
