package com.nutrivision.controller;

import com.nutrivision.dto.request.ChatMessageRequest;
import com.nutrivision.dto.response.ApiResponse;
import com.nutrivision.dto.response.ChatMessageResponse;
import com.nutrivision.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    /**
     * Context-aware conversational endpoint for NutriVision AI Assistant.
     */
    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @Valid @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userEmail = (userDetails != null) ? userDetails.getUsername() : "anonymous@nutrivision.ai";
        ChatMessageResponse response = chatbotService.processUserMessage(userEmail, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Response generated successfully"));
    }
}
