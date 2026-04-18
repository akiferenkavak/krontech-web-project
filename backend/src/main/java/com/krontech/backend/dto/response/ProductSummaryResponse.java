package com.krontech.backend.dto.response;

import java.util.UUID;

public record ProductSummaryResponse(
        UUID id,
        String slug,
        String category,
        boolean isActive,
        Integer sortOrder,
        UUID parentId,
        String featuredImageUrl,
        String title,
        String shortDescription
) {}