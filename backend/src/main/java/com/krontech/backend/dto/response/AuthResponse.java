package com.krontech.backend.dto.response;

public record AuthResponse(
        String token,
        String email,
        String role
) {}
