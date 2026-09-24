package com.nutrivision.service;

import com.nutrivision.dto.response.DoctorDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorReferralService {

    private static final Logger log = LoggerFactory.getLogger(DoctorReferralService.class);

    private final List<DoctorDto> bengaluruDoctors = new ArrayList<>();

    public DoctorReferralService() {
        initBengaluruCatalog();
    }

    private void initBengaluruCatalog() {
        // No verified provider feed configured. The UI uses live map search.
    }

    public List<DoctorDto> getBengaluruDoctors(String locality, String type, Double userLat, Double userLon) {
        return bengaluruDoctors.stream()
                .filter(d -> locality == null || locality.isBlank() || "ALL".equalsIgnoreCase(locality)
                        || d.getLocality().toLowerCase().contains(locality.toLowerCase())
                        || d.getAddress().toLowerCase().contains(locality.toLowerCase()))
                .filter(d -> type == null || type.isBlank() || "ALL".equalsIgnoreCase(type)
                        || d.getType().toLowerCase().contains(type.toLowerCase())
                        || d.getSpecialty().toLowerCase().contains(type.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<String> getAvailableLocalities() {
        return Arrays.asList(
                "All Bengaluru",
                "Koramangala",
                "Indiranagar",
                "Whitefield",
                "Jayanagar",
                "HSR Layout",
                "Malleshwaram",
                "Hebbal",
                "Bannerghatta Road",
                "Electronic City"
        );
    }
}
