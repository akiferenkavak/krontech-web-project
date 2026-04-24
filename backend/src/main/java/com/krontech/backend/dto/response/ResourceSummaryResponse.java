package com.krontech.backend.dto.response;

import java.util.UUID;

public record ResourceSummaryResponse(
        UUID id,
        String slug,
        String type,
        boolean isActive,
        String title,
        String description,
        String fileUrl,
        String featuredImageUrl,
        String relatedProductSlug,
        String relatedProductTitle
) {}