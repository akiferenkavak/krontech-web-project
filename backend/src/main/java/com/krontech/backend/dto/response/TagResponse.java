package com.krontech.backend.dto.response;

import java.util.List;
import java.util.UUID;

public record TagResponse(
        UUID id,
        String slug,
        List<TagTranslationResponse> translations
) {}
