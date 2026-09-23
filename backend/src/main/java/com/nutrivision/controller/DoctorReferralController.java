package com.nutrivision.controller;

import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.dto.response.DoctorDto;
import com.nutrivision.service.DoctorReferralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorReferralController {

    private final DoctorReferralService doctorReferralService;

    public DoctorReferralController(DoctorReferralService doctorReferralService) {
        this.doctorReferralService = doctorReferralService;
    }

    /**
     * Retrieves verified hospitals, clinics, and nutritionists in Bengaluru.
     */
    @GetMapping("/bengaluru")
    public ResponseEntity<ApiResponse<List<DoctorDto>>> getBengaluruHealthcare(
            @RequestParam(value = "locality", required = false) String locality,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "lat", required = false) Double lat,
            @RequestParam(value = "lon", required = false) Double lon
    ) {
        List<DoctorDto> doctors = doctorReferralService.getBengaluruDoctors(locality, type, lat, lon);
        return ResponseEntity.ok(ApiResponse.success(
                doctors,
                "Retrieved " + doctors.size() + " verified healthcare providers in Bengaluru"
        ));
    }

    /**
     * Returns popular Bengaluru localities for manual search filtering.
     */
    @GetMapping("/localities")
    public ResponseEntity<ApiResponse<List<String>>> getBengaluruLocalities() {
        List<String> localities = doctorReferralService.getAvailableLocalities();
        return ResponseEntity.ok(ApiResponse.success(localities, "Available Bengaluru localities retrieved"));
    }
}
