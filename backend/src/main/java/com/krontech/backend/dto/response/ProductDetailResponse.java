package com.krontech.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Detay endpoint'i için tam DTO — translation'ları içerir
public record ProductDetailResponse(
        UUID id,
        String slug,
        String category,
        boolean isActive,
        Integer sortOrder,
        UUID parentId,
        String featuredImageUrl,
        List<ProductTranslationResponse> translations,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
