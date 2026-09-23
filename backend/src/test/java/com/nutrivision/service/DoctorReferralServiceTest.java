package com.nutrivision.service;

import com.nutrivision.dto.response.DoctorDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DoctorReferralServiceTest {

    private final DoctorReferralService service = new DoctorReferralService();

    @Test
    @DisplayName("Should return full catalog of Bengaluru doctors and clinics")
    void testGetAllBengaluruDoctors() {
        List<DoctorDto> doctors = service.getBengaluruDoctors(null, null, null, null);
        assertNotNull(doctors);
        assertTrue(doctors.size() >= 10, "Expected at least 10 verified healthcare providers");

        // Verify structure of first result
        DoctorDto first = doctors.get(0);
        assertNotNull(first.getId());
        assertNotNull(first.getName());
        assertNotNull(first.getAddress());
        assertNotNull(first.getPhone());
        assertTrue(first.getPhone().startsWith("+91"));
        assertNotNull(first.getMapUrl());
        assertTrue(first.getMapUrl().contains("maps"));
    }

    @Test
    @DisplayName("Should filter doctors by Bengaluru locality")
    void testFilterByLocality() {
        List<DoctorDto> koramangalaDocs = service.getBengaluruDoctors("Koramangala", null, null, null);
        assertFalse(koramangalaDocs.isEmpty());
        for (DoctorDto d : koramangalaDocs) {
            assertTrue(d.getLocality().contains("Koramangala") || d.getAddress().contains("Koramangala"));
        }
    }

    @Test
    @DisplayName("Should provide popular Bengaluru localities")
    void testGetLocalities() {
        List<String> localities = service.getAvailableLocalities();
        assertNotNull(localities);
        assertTrue(localities.contains("Koramangala"));
        assertTrue(localities.contains("Indiranagar"));
        assertTrue(localities.contains("Whitefield"));
    }
}
