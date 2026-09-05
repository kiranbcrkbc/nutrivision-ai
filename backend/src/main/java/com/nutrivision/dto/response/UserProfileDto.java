package com.nutrivision.dto.response;

public class UserProfileDto {
    private String phone;
    private Integer age;
    private String gender;
    private String dietaryPreference;
    private String preferredLanguage;
    private String city;
    private String country;

    public UserProfileDto() {
    }

    public UserProfileDto(String phone, Integer age, String gender, String dietaryPreference, String preferredLanguage, String city, String country) {
        this.phone = phone;
        this.age = age;
        this.gender = gender;
        this.dietaryPreference = dietaryPreference;
        this.preferredLanguage = preferredLanguage;
        this.city = city;
        this.country = country;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDietaryPreference() {
        return dietaryPreference;
    }

    public void setDietaryPreference(String dietaryPreference) {
        this.dietaryPreference = dietaryPreference;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
