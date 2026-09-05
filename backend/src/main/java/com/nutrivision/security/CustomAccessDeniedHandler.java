package com.nutrivision.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrivision.dto.response.ApiError;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        ApiError error = new ApiError(
                "FORBIDDEN",
                "Access Denied: You do not possess the necessary administrative privileges for this resource.",
                List.of(accessDeniedException.getMessage())
        );

        objectMapper.writeValue(response.getOutputStream(), error);
    }
}
