package com.krontech.backend.dto.request;

import com.krontech.backend.entity.ContentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record BlogPostTranslationRequest(

        @NotNull(message = "Dil ID boş olamaz")
        UUID languageId,

        @NotBlank(message = "Başlık boş olamaz")
        String title,

        String excerpt,
        String content,
        String seoTitle,
        String seoDescription,

        // GEO: Article schema — {"@type": "Article", "headline": "...", ...}
        String structuredData,

        ContentStatus status,
        LocalDateTime scheduledAt
) {}
