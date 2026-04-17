package com.krontech.backend.dto.response;

import java.util.UUID;

public record LanguageResponse(
        UUID id,
        String code,
        String name,
        boolean isDefault
) {
}