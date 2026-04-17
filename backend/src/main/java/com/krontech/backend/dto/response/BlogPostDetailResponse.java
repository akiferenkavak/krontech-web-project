package com.krontech.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Blog detay için — tüm translation'lar + tag'ler
public record BlogPostDetailResponse(
        UUID id,
        String slug,
        String featuredImageUrl,
        String authorName,
        List<TagResponse> tags,
        List<BlogPostTranslationResponse> translations,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
