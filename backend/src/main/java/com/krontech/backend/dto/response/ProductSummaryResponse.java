package com.krontech.backend.dto.response;

import java.util.UUID;

// Liste endpoint'leri için hafif DTO — translation içermez
public record ProductSummaryResponse(
        UUID id,
        String slug,
        String category,
        boolean isActive,
        Integer sortOrder,
        UUID parentId,
        String featuredImageUrl
) {}
