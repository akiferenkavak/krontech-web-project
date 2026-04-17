package com.krontech.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Blog listesi için — belirli bir dildeki özet bilgi
public record BlogPostSummaryResponse(
        UUID id,
        String slug,
        String title,
        String excerpt,
        String featuredImageUrl,
        String authorName,
        List<TagResponse> tags,
        LocalDateTime publishedAt
) {}
