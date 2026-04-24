package com.krontech.backend.dto.response;

// Token artık httpOnly cookie'de — response body'de taşınmıyor
public record AuthResponse(
        String email,
        String role
) {}
