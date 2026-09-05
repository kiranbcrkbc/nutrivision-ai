package com.nutrivision.controller;

import com.nutrivision.dto.request.UpdateProfileRequest;
import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.dto.response.UserDto;
import com.nutrivision.dto.response.UserProfileDto;
import com.nutrivision.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDto profile = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved successfully"));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                              @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updatedUser = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "Profile updated successfully"));
    }
}
