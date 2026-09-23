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
        bengaluruDoctors.add(new DoctorDto(
                "blr-manipal-hal",
                "Manipal Hospital Old Airport Road",
                "Multispecialty Hospital & Clinical Nutrition",
                "General Medicine, Clinical Nutrition & Endocrinology",
                "98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017",
                "HAL / Indiranagar",
                "Bengaluru",
                "+91 80 2502 4444",
                4.7,
                18420,
                "Open 24/7 (OPD: 08:00 AM - 08:00 PM)",
                12.9592,
                77.6499,
                "https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Old+Airport+Road+Bengaluru",
                Arrays.asList("Comprehensive Blood Work", "CBC / Serum Ferritin", "Vitamin D & B12 Panel", "Dietetics & Nutrition Counseling")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-apollo-jayanagar",
                "Apollo Speciality Hospital Jayanagar",
                "Multispecialty Hospital & Wellness",
                "Internal Medicine, Clinical Nutrition & Preventive Care",
                "21/2, 14th Cross Rd, 3rd Block, Jayanagar, Bengaluru, Karnataka 560011",
                "Jayanagar",
                "Bengaluru",
                "+91 80 4612 4444",
                4.6,
                9230,
                "Open 24/7 (OPD: 08:30 AM - 07:30 PM)",
                12.9298,
                77.5838,
                "https://www.google.com/maps/search/?api=1&query=Apollo+Speciality+Hospital+Jayanagar+Bengaluru",
                Arrays.asList("Nutritional Deficiency Evaluation", "Endocrinology", "Complete Metabolic Panel", "Registered Dietitian Consultation")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-fortis-bannerghatta",
                "Fortis Hospital Bannerghatta Road",
                "Multispecialty Hospital",
                "General Medicine, Hematology & Clinical Nutrition",
                "154/9, Bannerghatta Main Rd, Opposite IIM-B, Bilekahalli, Bengaluru, Karnataka 560076",
                "Bannerghatta Road",
                "Bengaluru",
                "+91 80 6621 4444",
                4.5,
                14120,
                "Open 24/7 (OPD: 09:00 AM - 08:00 PM)",
                12.8953,
                77.5989,
                "https://www.google.com/maps/search/?api=1&query=Fortis+Hospital+Bannerghatta+Road+Bengaluru",
                Arrays.asList("Micro-nutrient Profiling", "Iron Deficiency Anemia Workup", "Nutritional Therapy", "In-house Clinical Laboratory")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-stjohns-koramangala",
                "St. John's Medical College Hospital",
                "Tertiary Care Hospital & Research",
                "General Medicine, Dermatology & Nutritional Sciences",
                "Sarjapur - Marathahalli Rd, John Nagar, Koramangala, Bengaluru, Karnataka 560034",
                "Koramangala",
                "Bengaluru",
                "+91 80 4946 6000",
                4.4,
                22500,
                "Open 24/7 (OPD: 08:00 AM - 04:00 PM)",
                12.9344,
                77.6192,
                "https://www.google.com/maps/search/?api=1&query=St.+John's+Medical+College+Hospital+Bengaluru",
                Arrays.asList("Affordable Diagnostics", "Clinical Biochemistry", "Dermatology for Skin & Nail Signs", "Specialist Nutritionist OPD")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-aster-hebbal",
                "Aster CMI Hospital Hebbal",
                "Super Speciality Hospital",
                "Internal Medicine, Gastroenterology & Clinical Nutrition",
                "No. 43/2, New Airport Rd, NH 44, Sahakar Nagar, Hebbal, Bengaluru, Karnataka 560092",
                "Hebbal",
                "Bengaluru",
                "+91 80 4344 4444",
                4.7,
                11950,
                "Open 24/7 (OPD: 08:30 AM - 08:00 PM)",
                13.0583,
                77.5925,
                "https://www.google.com/maps/search/?api=1&query=Aster+CMI+Hospital+Hebbal+Bengaluru",
                Arrays.asList("Digestive & Absorption Disorders", "Serum Vitamin Assays", "Pediatric & Adult Nutrition", "Dietary Planning")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-manipal-whitefield",
                "Manipal Hospital Whitefield",
                "Multispecialty Hospital",
                "General Medicine & Nutrition",
                "#143, 212-2015, EPIP Zone, ITPL Main Rd, Whitefield, Bengaluru, Karnataka 560066",
                "Whitefield",
                "Bengaluru",
                "+91 80 2502 4444",
                4.5,
                7840,
                "Open 24/7 (OPD: 08:30 AM - 08:00 PM)",
                12.9868,
                77.7289,
                "https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Whitefield+Bengaluru",
                Arrays.asList("Corporate Health Checkups", "Vitamin Deficiencies Screening", "Lifestyle Nutrition Counseling", "Emergency Care")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-qua-indiranagar",
                "Qua Nutrition Clinic Indiranagar",
                "Specialized Clinical & Sports Nutrition Clinic",
                "Clinical Dietetics & Nutritional Deficiency Management",
                "777/R, 100 Feet Rd, 1st Stage, Indiranagar, Bengaluru, Karnataka 560038",
                "Indiranagar",
                "Bengaluru",
                "+91 97434 30000",
                4.8,
                2450,
                "Mon-Sat: 09:00 AM - 07:00 PM",
                12.9734,
                77.6406,
                "https://www.google.com/maps/search/?api=1&query=Qua+Nutrition+Indiranagar+Bengaluru",
                Arrays.asList("Personalized 7-Day Meal Plans", "Micronutrient Balancing", "Vegetarian & Vegan Diets", "Bio-chemical Parameter Tracking")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-apollo-clinic-hsr",
                "Apollo Clinic HSR Layout",
                "Neighborhood Primary Care & Diagnostic Centre",
                "Family Physician & Diagnostic Health Checks",
                "1536, 19th Main Rd, 1st Sector, HSR Layout, Bengaluru, Karnataka 560102",
                "HSR Layout",
                "Bengaluru",
                "+91 80 4956 5000",
                4.4,
                3810,
                "Mon-Sun: 07:30 AM - 09:00 PM",
                12.9118,
                77.6465,
                "https://www.google.com/maps/search/?api=1&query=Apollo+Clinic+HSR+Layout+Bengaluru",
                Arrays.asList("Walk-in Consultations", "Same-Day Blood Test Results", "Vitamin Profile Tests", "Preventive Healthcare Packages")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-lalpath-koramangala",
                "Dr. Lal PathLabs Regional Diagnostic Centre",
                "Accredited Diagnostic Reference Laboratory",
                "Biochemistry & Nutritional Pathology",
                "48, 5th Cross, 6th Block, Koramangala, Bengaluru, Karnataka 560095",
                "Koramangala",
                "Bengaluru",
                "+91 80 3988 5050",
                4.5,
                4120,
                "Mon-Sun: 07:00 AM - 08:00 PM",
                12.9348,
                77.6231,
                "https://www.google.com/maps/search/?api=1&query=Dr+Lal+PathLabs+Koramangala+Bengaluru",
                Arrays.asList("Vitamin B12 Assay (ECLIA)", "25-OH Vitamin D Total", "Serum Ferritin / Iron Profile", "Zinc & Micronutrient Testing")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-columbia-malleshwaram",
                "Manipal Hospital Malleshwaram (formerly Columbia Asia)",
                "Multispecialty Healthcare Facility",
                "Internal Medicine & Clinical Nutrition",
                "26/4, Brigade Gateway, Beside Orion Mall, Malleshwaram, Bengaluru, Karnataka 560055",
                "Malleshwaram",
                "Bengaluru",
                "+91 80 6165 6262",
                4.6,
                8920,
                "Open 24/7 (OPD: 08:30 AM - 07:30 PM)",
                13.0125,
                77.5552,
                "https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Malleshwaram+Bengaluru",
                Arrays.asList("General Physician Review", "Dietary Correction Programs", "Nutritional Anemia Follow-up", "Preventive Health Check")
        ));

        bengaluruDoctors.add(new DoctorDto(
                "blr-narayana-eleccity",
                "Narayana Health City (Mazumdar Shaw Medical Centre)",
                "Super Speciality Medical Center",
                "General Medicine, Hematology & Clinical Nutrition",
                "258/A, Bommasandra Industrial Area, Anekal Taluk, Electronic City, Bengaluru, Karnataka 560099",
                "Electronic City",
                "Bengaluru",
                "+91 80 7122 2222",
                4.6,
                24100,
                "Open 24/7 (OPD: 08:00 AM - 06:00 PM)",
                12.8258,
                77.6917,
                "https://www.google.com/maps/search/?api=1&query=Narayana+Health+City+Bengaluru",
                Arrays.asList("Specialist Hematology", "In-depth Nutritional Deficiency Workup", "Multi-disciplinary Medical Teams", "Complete Diagnostic Wing")
        ));
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
