package com.nutrivision.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

public class UserDto {
    private Long userId;
    private String email;
    private String fullName;
    private Boolean isActive;
    private Set<String> roles;
    private UserProfileDto profile;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public UserDto(Long userId, String email, String fullName, Boolean isActive, Set<String> roles, UserProfileDto profile, LocalDateTime createdAt) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.isActive = isActive;
        this.roles = roles;
        this.profile = profile;
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public UserProfileDto getProfile() {
        return profile;
    }

    public void setProfile(UserProfileDto profile) {
        this.profile = profile;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
