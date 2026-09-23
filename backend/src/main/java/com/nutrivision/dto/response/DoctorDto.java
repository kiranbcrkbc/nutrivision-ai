package com.nutrivision.dto.response;

import java.util.List;

public class DoctorDto {
    private String id;
    private String name;
    private String type; // Hospital, General Clinic, Nutritionist, Diagnostic Lab
    private String specialty;
    private String address;
    private String locality; // Koramangala, Indiranagar, Whitefield, etc.
    private String city;
    private String phone;
    private Double rating;
    private Integer reviewCount;
    private String openingHours;
    private Double latitude;
    private Double longitude;
    private String mapUrl;
    private List<String> services;

    public DoctorDto() {}

    public DoctorDto(String id, String name, String type, String specialty, String address,
                     String locality, String city, String phone, Double rating,
                     Integer reviewCount, String openingHours, Double latitude,
                     Double longitude, String mapUrl, List<String> services) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.specialty = specialty;
        this.address = address;
        this.locality = locality;
        this.city = city;
        this.phone = phone;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.openingHours = openingHours;
        this.latitude = latitude;
        this.longitude = longitude;
        this.mapUrl = mapUrl;
        this.services = services;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getMapUrl() { return mapUrl; }
    public void setMapUrl(String mapUrl) { this.mapUrl = mapUrl; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }
}
