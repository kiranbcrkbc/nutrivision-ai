package com.nutrivision.controller;

import com.nutrivision.dto.request.LoginRequest;
import com.nutrivision.dto.request.RegisterRequest;
import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.dto.response.AuthResponse;
import com.nutrivision.dto.response.UserDto;
import com.nutrivision.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "User registered successfully"),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthenticated user"), HttpStatus.UNAUTHORIZED);
        }

        UserDto userDto = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userDto, "User profile retrieved successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout() {
        // In stateless JWT architecture, the client removes the stored token.
        // This endpoint provides an explicit confirmation for client cleanup.
        Map<String, String> result = Map.of(
                "status", "LOGGED_OUT",
                "message", "Logout successful. Client token has been invalidated by removal."
        );
        return ResponseEntity.ok(ApiResponse.success(result, "Session terminated successfully"));
    }
}
